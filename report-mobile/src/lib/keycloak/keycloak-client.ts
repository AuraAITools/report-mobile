import axios from "axios";
import { KeycloakAuthResponse } from "@/types/keycloak/KeycloakAuthResponse";
import { KeycloakClientFetchClientAccessTokenError, KeycloakClientLogoutError, KeycloakClientSignUpError, KeycloakTokenRefreshError, KeycloakUserLoginFailedError } from "@/types/keycloak/errors";

export type KeycloakClientConfig = {
  clientId: string;
  clientSecret: string;
  keycloakUrl: URL;
  realm: string;
};

export enum GrantTypes {
  PASSWORD = "password",
  CLIENT_CREDENTIALS = "client_credentials",
  REFRESH_TOKEN = "refresh_token",
}

export interface IAuthClient {
  loginUser(username: string, password: string): Promise<KeycloakAuthResponse>;
  logoutUser(refreshToken: string): Promise<void>;
  signupUser(userSignUpInfo: UserSignUpInfo): Promise<void>;
  refreshUserToken(
    refreshToken: string
  ): Promise<KeycloakAuthResponse>;
}

/**
 * Keycloak auth client
 */
export class KeycloakClient implements IAuthClient {
  protected clientId: string;
  protected clientSecret: string;
  protected keycloakUrl: URL;
  protected realm: string;
  protected tokenEndpoint: URL;
  protected logoutEndpoint: URL;
  protected userManagementEndpoint: URL;

  constructor(config: KeycloakClientConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.keycloakUrl = config.keycloakUrl;
    this.realm = config.realm;
    this.tokenEndpoint = new URL(
      `/realms/${config.realm}/protocol/openid-connect/token`,
      config.keycloakUrl
    );
    this.logoutEndpoint = new URL(
      `/realms/${config.realm}/protocol/openid-connect/logout`,
      config.keycloakUrl
    );
    this.userManagementEndpoint = new URL(
      `/admin/realms/${config.realm}/users`,
      config.keycloakUrl
    );
  }

  /**
   * logs in a user
   *
   * @param username username of user
   * @param password password of user\
   * @returns {Promise<KeycloakAuthResponse>}
   * @throws {UserLoginFailedError}
   */
  async loginUser(
    username: string,
    password: string
  ): Promise<KeycloakAuthResponse> {
    console.log("logging in user ...");
    return this._loginUser(username, password);
  }

  /**
   * refreshes user token
   *
   * @param refreshToken user refresh token
   * @returns {Promise<KeycloakAuthResponse>}
   * @throws {KeycloakTokenRefreshError}
   */
  async refreshUserToken(refreshToken: string): Promise<KeycloakAuthResponse> {
    console.log(`refreshing token for user ...`);
    return this._refreshUserToken(refreshToken);
  }

  /**
   * logs out a user
   *
   * @param refreshToken user refresh token
   * @returns {Promise<void>}
   * @throws {KeycloakClientLogoutError}
   */
  async logoutUser(refreshToken: string): Promise<void> {
    console.log(`logging out user ...`);
    return this._logoutUser(refreshToken);
  }

  /**
   * signs up a user
   *
   * @param {UserSignUpInfo} userSignUpInfo data needed for sign up
   * @returns {Promise<void>}
   * @throws {KeycloakClientSignUpError}
   */
  async signupUser(userSignUpInfo: UserSignUpInfo): Promise<void> {
    console.log(`signing up user ...`);
    let accessToken: string;
    try {
      accessToken = await this._fetchClientAccessToken();
    } catch (error) {
      throw new KeycloakClientSignUpError(
        `KeycloakClient failed to Sign up User`
      );
    }

    return this._createUserWithClient(accessToken, userSignUpInfo);
  }

  /**
   * fetches access token of the client
   *
   * @returns {Promise<string>} client access token
   * @throws {KeycloakClientFetchClientAccessTokenError}
   */
  async _fetchClientAccessToken(): Promise<string> {
    const data = {
      grant_type: GrantTypes.CLIENT_CREDENTIALS,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const authResponse = await axios.post<KeycloakAuthResponse>(
        this.tokenEndpoint.toString(),
        data,
        { headers: headers }
      );

      return authResponse.data.access_token;
    } catch (e) {
      console.error(
        `_fetchClientAccessToken: failed to fetch client access token`
      );
      throw new KeycloakClientFetchClientAccessTokenError(
        `unable to fetch client access token`
      );
    }
  }

  /**
   * private method that creates a user with user's credentials and client credentials
   *
   * @param clientAccessToken access token of client
   * @param userSignUpInfo sign up info required for user
   * @throws {KeycloakClientSignUpError}
   * @returns {Promise<void>}
   */
  async _createUserWithClient(
    clientAccessToken: string,
    userSignUpInfo: UserSignUpInfo
  ): Promise<void> {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientAccessToken}`,
      },
    };

    let response;
    try {
      response = await axios.post(
        this.userManagementEndpoint.toString(),
        userSignUpInfo,
        options
      );
    } catch (error) {
      console.error(
        `_createUserWithClient: axios failed to createUserWithClient`
      );
      throw new KeycloakClientSignUpError(
        `KeycloakClient failed to sign up user`
      );
    }

    if (response.status !== 201) {
      throw new KeycloakClientSignUpError(
        `KeycloakClient failed to sign up user`
      );
    }
  }

  /**
   * private method for logging in a user
   *
   * @param email email of user
   * @param password password of user
   * @returns {Promise<KeycloakAuthResponse>}
   * @throws {KeycloakUserLoginFailedError}
   */
  async _loginUser(
    email: string,
    password: string
  ): Promise<KeycloakAuthResponse> {
    const data = {
      grant_type: GrantTypes.PASSWORD,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: email,
      password: password,
    };

    // const options = {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // };

    let response;
    try {
      response = await axios.post<KeycloakAuthResponse>(
        this.tokenEndpoint.toString(),
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }
      );
    } catch (error) {
      console.error(`_loginUser: axios failed to log in user`);
      throw new KeycloakUserLoginFailedError(`Failed to login user`);
    }

    if (response.status !== 200) {
      throw new KeycloakUserLoginFailedError(`Failed to login user`);
    }
    return response.data;
  }

  /**
   * private method that logs out a user
   *
   * @param refreshToken user refresh token
   * @returns {Promise<void>}
   * @throws {KeycloakClientLogoutError}
   */
  async _logoutUser(refreshToken: string): Promise<void> {
    const data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    let response;
    try {
      response = await axios.post(this.logoutEndpoint.toString(), data, {
        headers: headers,
      });
    } catch (error) {
      console.error(
        `_logoutUserFromSessionStorage: axios failed to log out user`
      );
      throw new KeycloakClientLogoutError(
        `KeycloakClient failed to logout user`
      );
    }

    if (response.status !== 204) {
      throw new KeycloakClientLogoutError(
        `KeycloakClient failed to logout user`
      );
    }
  }

  /**
   * private method to refreshes user token
   *
   * @param refreshToken user refresh token
   * @returns {Promise<KeycloakAuthResponse>}
   * @throws {KeycloakTokenRefreshError}
   */
  async _refreshUserToken(refreshToken: string): Promise<KeycloakAuthResponse> {
    const data = {
      grant_type: GrantTypes.REFRESH_TOKEN,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const authResponse = await axios.post<KeycloakAuthResponse>(
        this.tokenEndpoint.toString(),
        data,
        { headers: headers }
      );

      return authResponse.data;
    } catch (error) {
      console.error(
        `_refreshTokenFromSecureStorage: axios failed to fetch refresh token`
      );
      throw new KeycloakTokenRefreshError(`Token refresh failed`);
    }
  }
}

export interface UserSignUpCredential {
  type: string;
  value: string;
  temporary: boolean;
}

export interface UserSignUpInfo {
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  credentials: [UserSignUpCredential];
}