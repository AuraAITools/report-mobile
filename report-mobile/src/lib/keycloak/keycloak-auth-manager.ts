import {
  KeycloakClientLogoutError,
  KeycloakTokenRefreshError,
} from "@/types/keycloak/errors";
import { ISecureStore } from "../secure-store";
import { IAuthClient, UserSignUpInfo } from "./keycloak-client";
interface IAuthManager {
  loginUser(username: string, password: string): Promise<void>;
  logoutUserSession(): Promise<void>;
  refreshSession(): Promise<void>;
  signupUser(userSignUpInfo: UserSignUpInfo): Promise<void>;
}

/**
 * KeycloakAuthManager manages authentication by using SecureStorage and
 * the Authorisation client
 */
export class KeycloakAuthManager implements IAuthManager {
  private static _instance: KeycloakAuthManager;
  private secureStorage: ISecureStore;
  private authClient: IAuthClient;
  protected static REFRESH_TOKEN_SECURE_STORAGE_KEY = "refresh_token";
  protected static ACCESS_TOKEN_SECURE_STORAGE_KEY = "access_token";

  private constructor(secureStorage: ISecureStore, authClient: IAuthClient) {
    this.secureStorage = secureStorage;
    this.authClient = authClient;
  }

  public static getInstance(secureStorage: ISecureStore, authClient: IAuthClient) {
    if (!KeycloakAuthManager._instance){
      this._instance = new KeycloakAuthManager(secureStorage,authClient);
    }
    return KeycloakAuthManager._instance;
  }
  /**
   * logs in user and starts user session
   *
   * @param username
   * @param password
   * @returns {Promise<void>}
   * @throws {KeycloakUserLoginFailedError}
   */
  async loginUser(username: string, password: string): Promise<void> {
    let response = await this.authClient.loginUser(username, password);
    this.secureStorage.save(
      KeycloakAuthManager.ACCESS_TOKEN_SECURE_STORAGE_KEY,
      response.access_token
    );
    this.secureStorage.save(
      KeycloakAuthManager.REFRESH_TOKEN_SECURE_STORAGE_KEY,
      response.refresh_token!
    );
  }

  /**
   * logs out of current user session
   *
   * @returns {Promise<void>}
   * @throws {KeycloakClientLogoutError}
   */
  async logoutUserSession(): Promise<void> {
    const refreshToken = await this.secureStorage.getValueFor(
      KeycloakAuthManager.REFRESH_TOKEN_SECURE_STORAGE_KEY
    );

    if (!refreshToken) {
      throw new KeycloakClientLogoutError(`failed to retrieve refresh_token`);
    }

    await this.authClient.logoutUser(refreshToken);
    this.secureStorage.deleteItemFor(
      KeycloakAuthManager.ACCESS_TOKEN_SECURE_STORAGE_KEY
    );
    this.secureStorage.deleteItemFor(
      KeycloakAuthManager.REFRESH_TOKEN_SECURE_STORAGE_KEY
    );
  }

  /**
   * refreshes current user session
   *
   * @returns {Promise<void>}
   * @throws {KeycloakTokenRefreshError}
   */
  async refreshSession(): Promise<void> {
    const refreshToken = await this.secureStorage.getValueFor(
      KeycloakAuthManager.ACCESS_TOKEN_SECURE_STORAGE_KEY
    );
    if (!refreshToken) {
      throw new KeycloakTokenRefreshError(`failed to retrieve refresh_token`);
    }
    const res = await this.authClient.refreshUserToken(refreshToken);
    this.secureStorage.save(KeycloakAuthManager.ACCESS_TOKEN_SECURE_STORAGE_KEY, res.access_token)
    this.secureStorage.save(KeycloakAuthManager.REFRESH_TOKEN_SECURE_STORAGE_KEY, res.refresh_token!)
  }

  /**
   * signs up user and logs in user
   *
   * @returns {Promise<void>}
   * @throws {KeycloakClientSignUpError, KeycloakUserLoginFailedError}
   */
  async signupUser(userSignUpInfo: UserSignUpInfo): Promise<void> {
    await this.authClient.signupUser(userSignUpInfo);
    return this.loginUser(
      userSignUpInfo.email,
      userSignUpInfo.credentials[0].value
    );
  }
}