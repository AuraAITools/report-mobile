export type KeycloakClientConfig = {
  clientId: string;
  clientSecret: string;
  host: string;
  issuerUrl: string;
  userInfoEndpoint: string;
  realm: string;
};

export const keycloakClientConfig: KeycloakClientConfig = {
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
  clientSecret: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET!,
  host: process.env.EXPO_PUBLIC_KEYCLOAK_HOST!,
  issuerUrl: `${process.env.EXPO_PUBLIC_KEYCLOAK_HOST}/realms/${process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "master"}`,
  userInfoEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_HOST}/protocol/openid-connect/userinfo`,
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "master"
};