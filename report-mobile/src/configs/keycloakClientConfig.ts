import { env } from "@/utils/env";

export type KeycloakClientConfig = {
  clientId: string;
  host: string;
  issuerUrl: string;
  userInfoEndpoint: string;
  realm: string;
};

export const keycloakClientConfig: KeycloakClientConfig = {
  clientId: env.clientId,
  host: env.host,
  issuerUrl: env.issuerUrl,
  userInfoEndpoint: env.userInfoEndpoint,
  realm: env.realm,
};
