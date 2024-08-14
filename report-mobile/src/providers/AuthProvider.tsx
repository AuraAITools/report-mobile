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
        router.replace("/(authenticated)" as Href<string>)
      }
    })
    // async function loadSessionFromStorage() {
    //   await keycloakAuthManager.loadUserSessionFromStorageAndLogin()
    //   setSession(prev => {
    //     console.debug(`in memory session changed: ${JSON.stringify(keycloakAuthManager.session)}`)
    //     return keycloakAuthManager.session;
    //   })
    // }
    // loadSessionFromStorage();
    // async function loginUser() {
    //   await keycloakAuthManager.loginUser("kevinliusingapore@gmail.com", "password");
    // }
    // loginUser();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook to provide our auth context
export const useAuth = () => useContext(AuthContext);
