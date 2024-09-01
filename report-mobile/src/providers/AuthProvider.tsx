import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Href, useRouter } from "expo-router";
import { AuraSecureStore } from "@/lib/secure-store";
import { KeycloakClient } from "@/lib/keycloak/keycloak-client";
import { keycloakClientConfig } from "@/configs/keycloakClientConfig";
import { KeycloakAuthManager } from "@/lib/keycloak/keycloak-auth-manager";
import { ISession } from "@/types/keycloak/session";
import { AuthEventPublisher } from "@/types/keycloak/auth-event-publisher";
import {
  KeycloakClientLogoutError,
  KeycloakClientSignUpError,
  KeycloakTokenRefreshError,
  KeycloakUserLoginFailedError,
} from "@/types/keycloak/errors";

export const keycloakAuthManager = KeycloakAuthManager.getInstance(
  AuraSecureStore.getInstance(),
  new KeycloakClient(keycloakClientConfig),
  AuthEventPublisher.getInstance()
);

type AuthData = {
  session: ISession | null;
  loading: Boolean;
  loginUser: (username: string, password: string) => Promise<void>;
  signupUser: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logoutUser: () => void;
  refreshUserSession: () => void;
  loadUserSessionFromSecureStorageToMemory: () => Promise<void>;
};

// initial context
const AuthContext = createContext<AuthData>({
  session: null,
  loading: false,
  loginUser: async () => {},
  signupUser: async () => {},
  logoutUser: async () => {},
  refreshUserSession: async () => {},
  loadUserSessionFromSecureStorageToMemory: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [session, setSession] = useState<ISession | null>(
    keycloakAuthManager.session
  );
  const [loading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    keycloakAuthManager.onEvent((event) => {
      if (event === "SIGNED_OUT") {
        console.debug("signing out");
        router.replace("/(auth)/home");
      }
      if (event === "SIGNED_IN") {
        console.debug("Signed in and redirecting to /(authenticated)");
        setSession((prev) => {
          console.debug(`previous session: \n ${JSON.stringify(prev)}`);
          console.debug(
            `new session: \n ${JSON.stringify(keycloakAuthManager.session)}`
          );
          return keycloakAuthManager.session;
        });
        router.replace("/(authenticated)/(tabs)/home");
      }

      if (event === "SESSION_REFRESHED") {
        console.debug("Session has been refreshed");
      }

      if (event === "SIGNED_UP") {
        console.debug("user has just signed up");
      }
    });
  }, []);

  async function loginUser(email: string, password: string) {
    try {
      setLoading(true);
      await keycloakAuthManager.loginUser(email, password);
    } catch (error) {
      if (error instanceof KeycloakUserLoginFailedError) {
        console.error(
          `Login failed for username: ${email} password: ${password}`
        );
      }
    } finally {
      setLoading(false);
    }
    setSession(keycloakAuthManager.session);
  }

  async function logoutUser() {
    try {
      setLoading(true);
      await keycloakAuthManager.logoutUserSession();
    } catch (error) {
      if (error instanceof KeycloakClientLogoutError) {
        console.error(`Logout failed`);
      }
    } finally {
      setLoading(false);
    }
    setSession(keycloakAuthManager.session);
  }

  async function signupUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    try {
      setLoading(true);
      await keycloakAuthManager.signupUser(
        email,
        password,
        firstName,
        lastName,
        true
      );
    } catch (error) {
      if (error instanceof KeycloakClientSignUpError) {
        console.error(
          `Login failed for username: ${email} password: ${password}`
        );
      }
    } finally {
      setLoading(false);
    }
    setSession(keycloakAuthManager.session);
  }

  async function refreshUserSession() {
    try {
      setLoading(true);
      await keycloakAuthManager.refreshSession();
    } catch (error) {
      if (error instanceof KeycloakTokenRefreshError) {
        console.error(`Failed to refresh user session`);
      }
    } finally {
      setLoading(false);
    }
    setSession(keycloakAuthManager.session);
  }

  async function loadUserSessionFromSecureStorageToMemory() {
    await keycloakAuthManager.loadUserSessionFromStorageAndLogin();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        loginUser,
        logoutUser,
        signupUser,
        refreshUserSession,
        loadUserSessionFromSecureStorageToMemory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// custom hook to provide our auth context
export const useAuth = () => useContext(AuthContext);
