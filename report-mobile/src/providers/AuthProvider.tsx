import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "expo-router";
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
import { ActivityIndicator } from "react-native";

type UserDetails = {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

type AuthData = {
  userDetails: UserDetails | undefined;
  loginUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUserSession: () => Promise<void>;
  isAuthenticated: boolean;
};

// initial context
const AuthContext = createContext<AuthData>({
  userDetails: undefined,
  loginUser: async () => {},
  logoutUser: async () => {},
  refreshUserSession: async () => {},
  isAuthenticated: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [authSession, setAuthSession] = useState<TokenResponse | undefined>();
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>();
  const [refreshToken, setRefreshToken] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const discovery = useAutoDiscovery(keycloakClientConfig.issuerUrl);

  const redirectUri = makeRedirectUri({
    scheme: "aura-report",
    path: "auth/callback",
  });

  const [request, frontChannelResponse, promptLoginAsync] = useAuthRequest(
    {
      clientId: keycloakClientConfig.clientId,
      redirectUri: redirectUri,
      scopes: ["openid", "email", "profile", "offline_access"],
      usePKCE: true,
    },
    discovery
  );

  // optimises opening of web browser
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // on front channel response change, do a frontchannel code exchange for idt and at
  useEffect(() => {
    executeCodeExchangeAsync();
    async function executeCodeExchangeAsync() {
      if (!frontChannelResponse) {
        console.debug(`initial auth result null`);
      } else {
        try {
          let session = await frontChannelCodeExchange(
            frontChannelResponse,
            discovery!,
            request?.codeVerifier
          );
          setAuthSession(session);
          setRefreshToken(session.refreshToken);
          setIsAuthenticated(true);
          router.replace(`/(authenticated)/(tabs)/home`);
        } catch (error) {
          console.debug(error);
        }
      }
    }
  }, [frontChannelResponse]);

  // on authSession or discovery changes, refetch user info from user_info endpoint
  useEffect(() => {
    if (!discovery || !authSession) {
      console.debug(`no discovery document`);
    } else {
      console.debug(`fetching user info`);
      fetchUserInfo(authSession, discovery);
    }
  }, [authSession, discovery]);

  async function fetchUserInfo(
    tokenResult: TokenResponse,
    discovery: DiscoveryDocument
  ) {
    const userDetails = await fetchUserInfoAsync(tokenResult, discovery).catch(
      (err) => {
        console.error(err);
      }
    );

    if (userDetails) {
      setUserDetails(userDetails as UserDetails);
    }
    console.debug(
      `User Details: ${JSON.stringify(userDetails as UserDetails)}`
    );
  }

  /**
   * exchanges frontchannel code for access token and idtoken
   * @param authResponse
   * @param discovery
   * @param codeVerifier
   * @returns
   */
  async function frontChannelCodeExchange(
    authResponse: AuthSessionResult,
    discovery: DiscoveryDocument,
    codeVerifier: string | undefined
  ) {
    if (authResponse.type === "success") {
      return await exchangeCodeAsync(
        {
          code: authResponse.params.code,
          redirectUri: redirectUri,
          clientId: keycloakClientConfig.clientId,
          clientSecret: keycloakClientConfig.clientSecret,
          extraParams: {
            code_verifier: codeVerifier || "",
          },
        },
        discovery
      );
    } else {
      throw new Error(`frontchannel failed to execute`);
    }
  }

  /**
   * prompts user to login via a embedded web browser
   */
  async function loginUser() {
    promptLoginAsync();
  }

  /**
   * logout user by revoking refresh token
   */
  async function logoutUser() {
    console.debug(`logging out user ${refreshToken}`);
    try {
      await revokeAsync(
        {
          token: refreshToken!,
          clientId: keycloakClientConfig.clientId,
          clientSecret: keycloakClientConfig.clientSecret,
        },
        discovery!
      );
      setIsAuthenticated(false);
      router.replace("/(auth)/home");
    } catch (error) {
      console.error(`logout failed with  ${error}`);
    }
  }

  async function refreshUserSession() {
    if (!discovery) {
      console.debug(`refresh failed as discovery is not fetched yet`);
    } else {
      console.debug(`refreshing user session: ${refreshToken}`);
      const session = await refreshAsync(
        {
          refreshToken: refreshToken,
          clientId: keycloakClientConfig.clientId,
          clientSecret: keycloakClientConfig.clientSecret,
        },
        discovery
      ).catch((err) => {
        console.error(err);
        setIsAuthenticated(false);
      });

      if (session) {
        console.debug("updating session");
        setAuthSession(session);
        setRefreshToken(session.refreshToken);
        setIsAuthenticated(true);
      }
    }
  }

  if (!discovery) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        loginUser,
        logoutUser,
        refreshUserSession,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
