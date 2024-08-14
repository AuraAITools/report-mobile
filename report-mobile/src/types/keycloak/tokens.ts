import base64 from "react-native-base64";

export type BaseJwtToken = {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string | string[];
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  scope: string;
};

export type AccessTokenExtension = {
  acr: string;
  allowed_origins: string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type UserAccessToken = BaseJwtToken & AccessTokenExtension;

export type RefreshToken = BaseJwtToken;

/**
 * decodes a raw user access jwt token
 *
 * @param token
 * @returns {UserAccessToken | null}
 */
export function decodeAccessToken(token: string): UserAccessToken | null {
  try {
    const decoded = base64urldecode(token.split(".")[1]);
    return JSON.parse(decoded) as UserAccessToken;
  } catch (error) {
    console.error(`failed to decode Access JWT:`, error);
    return null;
  }
}

/**
 * decodes a raw user access jwt token
 *
 * @param token
 * @returns {RefreshToken | null}
 */
export function decodeRefreshToken(token: string): RefreshToken | null {
  try {
    const decoded = base64urldecode(token.split(".")[1]);
    console.log(`refreshtoken decoded: ${decoded}`);
    return JSON.parse(decoded) as RefreshToken;
  } catch (error) {
    console.error(`failed to decode Refresh JWT:${error}`);
    return null;
  }
}

function base64urldecode(token: string) {
  return base64.decode(
    token
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(token.length + ((4 - (token.length % 4)) % 4), "=")
  );
}
