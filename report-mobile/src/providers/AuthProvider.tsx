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
import {  ISession } from "@/types/keycloak/session";
import { AuthEventPublisher } from "@/types/keycloak/auth-event-publisher";
import { useNavigation } from "@react-navigation/native";
import { KeycloakUserLoginFailedError } from "@/types/keycloak/errors";

export const keycloakAuthManager = KeycloakAuthManager.getInstance(
  AuraSecureStore.getInstance(),
  new KeycloakClient(keycloakClientConfig),
  AuthEventPublisher.getInstance()
);

type AuthData = {
  session: ISession | null;
  loading: Boolean;
};

// initial context
const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});



export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter()

  const [session, setSession] = useState<ISession | null>(keycloakAuthManager.session);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    keycloakAuthManager.onEvent((event)=> {
      if (event === "SIGNED_OUT") {
        console.log("im signed out")
      }
      if (event === "SIGNED_IN") {
        console.debug("Signed in and redirecting to /(authenticated)")
        setSession(prev => keycloakAuthManager.session)
        router.replace("/(authenticated)" as Href<string>)
      }

      if (event === "SESSION_REFRESHED") {
        console.debug("Session has been refreshed")
      }

      if (event === "SIGNED_UP") {
        console.debug("user has just signed up")
      }


    })

    async function loginUser(email: string, password: string) {
      try {
        await keycloakAuthManager.loginUser(email,password);        
      } catch (error) {
        if (error instanceof KeycloakUserLoginFailedError) {
          console.error(`Login failed for username: ${email} password: ${password}`)
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook to provide our auth context
export const useAuth = () => useContext(AuthContext);
