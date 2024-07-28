import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import { useRouter } from "expo-router";
import { AuraSecureStore } from "@/lib/secure-store";
import { KeycloakClient } from "@/lib/keycloak/keycloak-client";
import { keycloakClientConfig } from "@/configs/keycloakClientConfig";
import { KeycloakAuthManager } from "@/lib/keycloak/keycloak-auth-manager";

export type Session = {};

export const keycloakAuthManager = KeycloakAuthManager.getInstance(
  AuraSecureStore.getInstance(),
  new KeycloakClient(keycloakClientConfig)
);

type AuthData = {
  session: Session | null;
  loading: Boolean;
};

// initial context
const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

AppState.addEventListener("change", (state) => {
  console.log(`event: ${state} fired`);

  if (state === "active") {
    // TODO: add refresh
  }
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const router = useRouter();

  useEffect(() => {

  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook to provide our auth context
export const useAuth = () => useContext(AuthContext);
