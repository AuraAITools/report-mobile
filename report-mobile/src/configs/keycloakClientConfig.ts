import { KeycloakClientConfig } from "@/lib/keycloak/keycloak-client";

export const keycloakClientConfig: KeycloakClientConfig = {
  keycloakUrl: new URL(process.env.EXPO_PUBLIC_KEYCLOAK_URL!),
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
  clientSecret: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET!,
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "master"
};
