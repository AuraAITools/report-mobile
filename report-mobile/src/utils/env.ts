import z from "zod";

const envSchema = z.object({
  reportApiUrl: z.string().url().describe("The base URL for the Report MS API"),
  clientId: z.string(),
  host: z.string().url().describe("The OpenID host URL"),
  issuerUrl: z.string().url().describe("The OpenID issuer URL"),
  userInfoEndpoint: z.string().url().describe("The OpenID user info endpoint"),
  realm: z.string(),
});
type EnvType = z.infer<typeof envSchema>;
export const env: EnvType = envSchema.parse({
  reportApiUrl: process.env.EXPO_PUBLIC_REPORT_MS_API_URL,
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
  host: process.env.EXPO_PUBLIC_KEYCLOAK_HOST,
  issuerUrl: `${process.env.EXPO_PUBLIC_KEYCLOAK_HOST}/realms/${
    process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "master"
  }`,
  userInfoEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_HOST}/protocol/openid-connect/userinfo`,
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || "master",
});
