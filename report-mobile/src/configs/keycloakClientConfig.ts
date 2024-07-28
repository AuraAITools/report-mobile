import { KeycloakClientConfig } from "@/lib/keycloak/keycloak-client";
import {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
} from "@env";

export const keycloakClientConfig: KeycloakClientConfig = {
  keycloakUrl: new URL(KEYCLOAK_URL),
  clientId: KEYCLOAK_CLIENT_ID,
  clientSecret: KEYCLOAK_CLIENT_SECRET,
  realm: KEYCLOAK_REALM || "master"
};
