import { IUser } from "./user";
import { decodeAccessToken, decodeRefreshToken } from "./tokens";
import { DecodeTokenError } from "./errors";

export interface ISession {
  access_token: string;
  refresh_token: string;
  user: IUser;
}


export function convertTokensToSession(accessToken: string, refreshToken: string): ISession {
  const userAccessToken = decodeAccessToken(accessToken);
  console.debug(`user at: ${JSON.stringify(userAccessToken)}`)
  const userRefreshToken = decodeRefreshToken(refreshToken);
  console.debug(`refresh at: ${JSON.stringify(refreshToken)}`)

  console.debug("converting token to session ...")
  if (!userAccessToken) {
    throw new DecodeTokenError(`Unable to decode user access token`);
  }

  if (!userRefreshToken) {
    throw new DecodeTokenError(`Unable to decode user refresh token`);
  }
  // this is undefined for some reason
  const user: IUser = {
    roles: [
      ...userAccessToken.realm_access.roles,
      ...userAccessToken.resource_access.account.roles,
    ],
    scopes:
      userAccessToken.scope.length > 0
        ? splitScopes(userAccessToken.scope)
        : [],
    email: userAccessToken.email,
    email_verified: userAccessToken.email_verified,
    name: userAccessToken.name,
    preferred_username: userAccessToken.preferred_username,
    given_name: userAccessToken.given_name,
    family_name: userAccessToken.family_name,
  };

  const session = {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: user,
  };

  return session;
}

function splitScopes(rawScopes: string): string[] {
  return rawScopes.split(" ");
}
