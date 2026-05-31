import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "expo-router";
import { AppState, AppStateStatus, ActivityIndicator } from "react-native";
import { keycloakClientConfig } from "@/configs/keycloakClientConfig";
import {
  AuthSessionResult,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
  DiscoveryDocument,
  TokenResponse,
  fetchUserInfoAsync,
  refreshAsync,
  revokeAsync,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { UserInfo } from "@/types/auth/UserInfo";
import AuthData from "@/types/auth/AuthData";
import { processTokenResponse } from "@/lib/auth/auth-utils";
import { BiometricService } from "@/lib/auth/biometric-service";
import { determineLockLevel } from "@/lib/auth/lock-policy";
import { AuraSecureStore } from "@/lib/secure-store";
import { AccessTokenUtils } from "@/types/auth/AccessToken";
import { setTokenRefresher } from "@/lib/api-client";

const AuthContext = createContext<AuthData>({
  userInfo: undefined,
  loginUser: async () => {},
  logoutUser: async () => {},
  refreshUserSession: async () => {},
  unlockWithBiometrics: async () => false,
  roles: [],
  tenant_ids: [],
  isAuthenticated: false,
  isLocked: false,
  isRestoringSession: true,
  tokenResponse: undefined,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [tokenResponse, setTokenResponse] = useState<TokenResponse | undefined>();
  const [roles, setRoles] = useState<string[]>([]);
  const [tenant_ids, setTenantIds] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef<number>(0);

  const discovery = useAutoDiscovery(keycloakClientConfig.issuerUrl);

  const redirectUri = makeRedirectUri({
    scheme: "com.aura.report",
    path: "auth/callback",
  });

  const [request, frontChannelResponse, promptLoginAsync] = useAuthRequest(
    {
      clientId: keycloakClientConfig.clientId,
      redirectUri,
      scopes: ["openid", "email", "profile", "offline_access"],
      usePKCE: true,
    },
    discovery
  );

  // Warm up web browser for auth
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Wire up the token refresher for the API client interceptor
  useEffect(() => {
    setTokenRefresher(async () => {
      if (!discovery) return null;
      const stored = await AuraSecureStore.getInstance().getValueFor("refresh_token");
      if (!stored) return null;

      try {
        const tokenResp = await refreshAsync(
          { refreshToken: stored, clientId: keycloakClientConfig.clientId },
          discovery
        );

        const session = await processTokenResponse(tokenResp);
        setTokenResponse(session.tokenResponse);
        setRoles(session.roles);
        setTenantIds(session.tenantIds);
        setRefreshToken(session.tokenResponse.refreshToken);
        setIsAuthenticated(true);

        return session.tokenResponse.accessToken;
      } catch {
        setIsAuthenticated(false);
        return null;
      }
    });
  }, [discovery]);

  // Restore session from secure store on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const store = AuraSecureStore.getInstance();
        const storedAccessToken = await store.getValueFor("access_token");
        const storedRefreshToken = await store.getValueFor("refresh_token");

        if (!storedAccessToken || !storedRefreshToken) {
          setIsRestoringSession(false);
          return;
        }

        // Check if biometric unlock is required
        const biometricService = BiometricService.getInstance();
        const biometricEnabled = await biometricService.isBiometricEnabled();

        if (biometricEnabled) {
          const success = await biometricService.authenticate();
          if (!success) {
            setIsLocked(true);
            setIsRestoringSession(false);
            return;
          }
        }

        const decoded = AccessTokenUtils.decodeJWT(storedAccessToken);

        if (!AccessTokenUtils.isExpired(decoded)) {
          // Token still valid — restore session
          setRoles(decoded.resource_access["aura-application-client"].roles);
          setTenantIds(decoded.ext_attrs.tenant_ids);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);

          if (discovery) {
            const tokenResp = new TokenResponse({
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
              tokenType: "bearer",
              expiresIn: AccessTokenUtils.getTimeUntilExpiration(decoded),
            });
            setTokenResponse(tokenResp);
            fetchUserInfo(tokenResp, discovery);
          }
        } else if (discovery) {
          // Access token expired — try silent refresh
          const tokenResp = await refreshAsync(
            { refreshToken: storedRefreshToken, clientId: keycloakClientConfig.clientId },
            discovery
          );

          const session = await processTokenResponse(tokenResp);
          setTokenResponse(session.tokenResponse);
          setRoles(session.roles);
          setTenantIds(session.tenantIds);
          setRefreshToken(session.tokenResponse.refreshToken);
          setIsAuthenticated(true);
        }
      } catch {
        // Refresh token expired or invalid — user must re-login
        if (__DEV__) {
          console.warn("Session restoration failed, requiring fresh login");
        }
        await AuraSecureStore.getInstance().deleteItemFor("access_token");
        await AuraSecureStore.getInstance().deleteItemFor("refresh_token");
        await AuraSecureStore.getInstance().deleteItemFor("id_token");
      } finally {
        setIsRestoringSession(false);
      }
    }

    restoreSession();
  }, [discovery]);

  // Handle front-channel code exchange
  useEffect(() => {
    async function executeCodeExchangeAsync() {
      if (!frontChannelResponse || !discovery) return;

      try {
        const tokenResp = await frontChannelCodeExchange(
          frontChannelResponse,
          discovery,
          request?.codeVerifier
        );

        if (!tokenResp) return;

        const session = await processTokenResponse(tokenResp);
        setTokenResponse(session.tokenResponse);
        setRoles(session.roles);
        setTenantIds(session.tenantIds);
        setRefreshToken(session.tokenResponse.refreshToken);
        setIsAuthenticated(true);

        router.replace("/(authenticated)");
      } catch (error) {
        console.error("Code exchange failed:", error);
      }
    }

    executeCodeExchangeAsync();
  }, [frontChannelResponse]);

  // Fetch user info when token changes
  useEffect(() => {
    if (!discovery || !tokenResponse) return;
    fetchUserInfo(tokenResponse, discovery);
  }, [tokenResponse, discovery]);

  // Monitor app state for biometric lock
  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [isAuthenticated]);

  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        backgroundTimestamp.current = Date.now();
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isAuthenticated
      ) {
        const elapsed = Date.now() - backgroundTimestamp.current;
        const lockLevel = determineLockLevel(elapsed);
        const biometricService = BiometricService.getInstance();
        const biometricEnabled = await biometricService.isBiometricEnabled();

        switch (lockLevel) {
          case "none":
            break;
          case "soft":
          case "hard":
            if (biometricEnabled) {
              setIsLocked(true);
              const success = await biometricService.authenticate();
              setIsLocked(!success);
            }
            break;
          case "refresh":
            if (biometricEnabled) {
              setIsLocked(true);
              const success = await biometricService.authenticate();
              if (success) {
                setIsLocked(false);
                await refreshUserSession();
              }
            }
            break;
          case "reauth":
            await logoutUser();
            break;
        }
      }

      appState.current = nextAppState;
    },
    [isAuthenticated]
  );

  async function fetchUserInfo(
    tokenResult: TokenResponse,
    disc: DiscoveryDocument
  ) {
    try {
      const info = await fetchUserInfoAsync(tokenResult, disc);
      if (info) {
        setUserInfo(info as UserInfo);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  }

  async function frontChannelCodeExchange(
    authResponse: AuthSessionResult,
    disc: DiscoveryDocument,
    codeVerifier: string | undefined
  ) {
    if (authResponse.type === "success") {
      return await exchangeCodeAsync(
        {
          code: authResponse.params.code,
          redirectUri,
          clientId: keycloakClientConfig.clientId,
          extraParams: {
            code_verifier: codeVerifier || "",
          },
        },
        disc
      );
    }

    if (__DEV__) {
      console.warn("Front-channel code exchange failed:", authResponse.type);
    }
    return null;
  }

  async function loginUser() {
    promptLoginAsync();
  }

  async function logoutUser() {
    const store = AuraSecureStore.getInstance();
    const idToken = await store.getValueFor("id_token");

    try {
      // 1. Revoke refresh token
      if (refreshToken && discovery) {
        await revokeAsync(
          { token: refreshToken, clientId: keycloakClientConfig.clientId },
          discovery
        ).catch(() => {
          // Best-effort revocation
        });
      }

      // 2. RP-Initiated Logout with Keycloak
      if (discovery?.endSessionEndpoint && idToken) {
        const logoutUrl =
          `${discovery.endSessionEndpoint}?` +
          `id_token_hint=${encodeURIComponent(idToken)}&` +
          `post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;

        await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUri);
      }
    } catch (error) {
      console.warn("Logout encountered an error, clearing local state anyway");
    } finally {
      // 3. Always clear local state
      setIsAuthenticated(false);
      setIsLocked(false);
      setRoles([]);
      setTenantIds([]);
      setUserInfo(undefined);
      setRefreshToken(undefined);
      setTokenResponse(undefined);
      await store.deleteItemFor("access_token");
      await store.deleteItemFor("refresh_token");
      await store.deleteItemFor("id_token");
      router.replace("/(auth)/home");
    }
  }

  async function refreshUserSession() {
    if (!discovery) {
      if (__DEV__) console.debug("Refresh failed: discovery not available");
      return;
    }

    try {
      const storedRefresh =
        refreshToken ||
        (await AuraSecureStore.getInstance().getValueFor("refresh_token"));

      if (!storedRefresh) {
        setIsAuthenticated(false);
        return;
      }

      const tokenResp = await refreshAsync(
        { refreshToken: storedRefresh, clientId: keycloakClientConfig.clientId },
        discovery
      );

      const session = await processTokenResponse(tokenResp);
      setTokenResponse(session.tokenResponse);
      setRoles(session.roles);
      setTenantIds(session.tenantIds);
      setRefreshToken(session.tokenResponse.refreshToken);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Session refresh failed:", err);
      setIsAuthenticated(false);
    }
  }

  async function unlockWithBiometrics(): Promise<boolean> {
    const biometricService = BiometricService.getInstance();
    const success = await biometricService.authenticate("Unlock Aura Report");
    if (success) {
      setIsLocked(false);
      await refreshUserSession();
    }
    return success;
  }

  if (!discovery || isRestoringSession) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loginUser,
        logoutUser,
        refreshUserSession,
        unlockWithBiometrics,
        isAuthenticated,
        isLocked,
        isRestoringSession,
        roles,
        tenant_ids,
        tokenResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
