import { TokenResponse } from "expo-auth-session";
import { AccessToken, AccessTokenUtils } from "@/types/auth/AccessToken";
import { AuraSecureStore } from "@/lib/secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ID_TOKEN_KEY = "id_token";

export type ProcessedTokenResult = {
  tokenResponse: TokenResponse;
  accessToken: AccessToken;
  roles: string[];
  groups: string[];
  tenantIds: string[];
};

/**
 * Decodes the access token JWT, extracts roles, groups, and tenant IDs from
 * the payload, persists all tokens to secure storage, and returns the
 * decoded data.
 */
export async function processTokenResponse(
  tokenResponse: TokenResponse,
): Promise<ProcessedTokenResult> {
  const rawAccessToken = tokenResponse.accessToken;
  const accessToken = AccessTokenUtils.decodeJWT(rawAccessToken);

  const roles = AccessTokenUtils.getResourceRoles(
    accessToken,
    "aura-application-client",
  );
  const groups = AccessTokenUtils.getGroups(accessToken);
  const tenantIds = accessToken.ext_attrs?.tenant_ids ?? [];

  // Persist tokens to secure storage
  const store = AuraSecureStore.getInstance();

  await Promise.all([
    store.save(ACCESS_TOKEN_KEY, rawAccessToken),
    tokenResponse.refreshToken
      ? store.save(REFRESH_TOKEN_KEY, tokenResponse.refreshToken)
      : Promise.resolve(),
    tokenResponse.idToken
      ? store.save(ID_TOKEN_KEY, tokenResponse.idToken)
      : Promise.resolve(),
  ]);

  if (__DEV__) {
    console.log(
      "Tokens saved — roles:",
      roles,
      "groups:",
      groups,
      "tenantIds count:",
      tenantIds.length,
    );
  }

  return { tokenResponse, accessToken, roles, groups, tenantIds };
}
