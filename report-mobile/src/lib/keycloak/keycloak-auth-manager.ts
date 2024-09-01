import { KeycloakClientLogoutError, KeycloakClientSignUpError } from "@/types/keycloak/errors";
import { ISecureStore } from "../secure-store";
import { IAuthClient, UserSignUpInfo } from "./keycloak-client";
import {
  AuthEventHandler,
  AuthEventPublisher,
} from "@/types/keycloak/auth-event-publisher";
import { convertTokensToSession, ISession } from "@/types/keycloak/session";
import { decodeRefreshToken } from "@/types/keycloak/tokens";

interface IAuthManager {
  loginUser(username: string, password: string): Promise<void>;
  logoutUserSession(): Promise<void>;
  refreshSession(): Promise<boolean>;
  signupUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    autologin: boolean
  ): Promise<void>;
}

/**
 * KeycloakAuthManager manages authentication by using SecureStorage,
 * Authorisation client and the AuthEventPublisher
 */
export class KeycloakAuthManager implements IAuthManager {
  private static _instance: KeycloakAuthManager;
  private secureStorage: ISecureStore;
  private authClient: IAuthClient;
  private authEventPublisher: AuthEventPublisher;
  public session: UserSession;

  private constructor(
    secureStorage: ISecureStore,
    authClient: IAuthClient,
    authEventPublisher: AuthEventPublisher
  ) {
    this.secureStorage = secureStorage;
    this.authClient = authClient;
    this.authEventPublisher = authEventPublisher;
    // load initial user session from secure store
    this.session = null;
  }

  /**
   * Singleton KeycloakAuthManager
   * @param secureStorage
   * @param authClient
   * @param authEventPublisher
   * @returns
   */
  public static getInstance(
    secureStorage: ISecureStore,
    authClient: IAuthClient,
    authEventPublisher: AuthEventPublisher
  ) {
    if (!this._instance) {
      this._instance = new this(secureStorage, authClient, authEventPublisher);
      console.debug("creating new singleton auth manager");
    }
    return this._instance;
  }

  /**
   * registers an auth event handler
   *
   * @param callback
   */
  public onEvent(callback: AuthEventHandler) {
    this.authEventPublisher.subscribe(callback);
  }

  /**
   * loads UserSession in storage into memory
   * if no session, cleanly clears secure storage for any session information
   * if session is available, updates session memory
   *
   */
  public async loadUserSessionFromStorageAndLogin() {
    let accessToken = await this.secureStorage.getValueFor("access_token");
    let refreshToken = await this.secureStorage.getValueFor("refresh_token");

    console.debug(`loaded access token from storage:  ${accessToken}`);
    console.debug(`loaded refresh token from storage:  ${refreshToken}`);

    if (!accessToken || !refreshToken) {
      this._clearInMemorySession();
      this._removeSessionFromStorage();
      this.authEventPublisher.publishEvent("SIGNED_OUT");
      return;
    }

    // loads session to memory
    this.session = convertTokensToSession(accessToken, refreshToken);
    console.debug(
      `AuthManager: loaded stored session to memory: \n ${JSON.stringify(
        this.session
      )}`
    );

    // attempts to refresh user session
    let refreshed = await this.refreshSession();
    if (refreshed) {
      this.authEventPublisher.publishEvent("SIGNED_IN");
    }
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
    // login error is thrown here if login fails
    let response;
    try {
      response = await this.authClient.loginUser(username, password);
    } catch (error) {
      console.error(error);
      return;
    }

    try {
      this.session = convertTokensToSession(
        response.access_token,
        response.refresh_token
      );
      console.log(`session ${JSON.stringify(this.session)}`);
    } catch (error) {
      console.error("Failed to convert tokens to session:", error);
      return;
    }
    // update in-memory user session

    this.authEventPublisher.publishEvent("SIGNED_IN");

    // store session in secure storage
    await this._storeUserSessionInStorage(this.session);
  }

  /**
   * logs out of current user session
   *
   * @returns {Promise<void>}
   * @throws {KeycloakClientLogoutError}
   */
  async logoutUserSession(): Promise<void> {
    const refreshToken = await this.secureStorage.getValueFor("refresh_token");

    if (!refreshToken) {
      throw new KeycloakClientLogoutError(`failed to retrieve refresh_token`);
    }

    await this.authClient.logoutUser(refreshToken);
    this._clearInMemorySession();
    await this._removeSessionFromStorage();
  }

  /**
   * refreshes current user session
   * if token has expired, signs out
   *
   * @returns {Promise<void>}
   * @throws {KeycloakTokenRefreshError}
   */
  async refreshSession(): Promise<boolean> {
    // user was already signed out
    if (!this.session) {
      return false;
    }

    let refreshToken = decodeRefreshToken(this.session.refresh_token);

    // could not decode refresh_token
    if (!refreshToken) {
      return false;
    }

    // user's refresh token has expired
    if (refreshToken.exp <= Math.floor(Date.now() / 1000)) {
      console.debug(
        `refresh token already expired at ${new Date(0).setUTCSeconds(
          refreshToken.exp
        )}`
      );
      this._clearInMemorySession();
      await this._removeSessionFromStorage();
      this.authEventPublisher.publishEvent("SIGNED_OUT");
      return false;
    }

    const response = await this.authClient.refreshUserToken(
      this.session.refresh_token
    );

    // update user session
    this.session = convertTokensToSession(
      response.access_token,
      response.refresh_token
    );
    this.authEventPublisher.publishEvent("SESSION_REFRESHED");
    this._storeUserSessionInStorage(this.session);
    return true;
  }

  /**
   * signs up user and logs in user
   *
   * @returns {Promise<void>}
   * @throws {KeycloakClientSignUpError, KeycloakUserLoginFailedError}
   */
  async signupUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    autologin: boolean
  ): Promise<void> {
    await this.authClient.signupUser({
      email,
      firstName,
      lastName,
      enabled: true,
      credentials: [
        {
          temporary: false,
          type: "password",
          value: password,
        },
      ],
    });
    this.authEventPublisher.publishEvent("SIGNED_UP");

    // when autologin is enabled, continue to login after successful signup
    if (autologin) {
      let response = await this.authClient.loginUser(email, password);
      this.authEventPublisher.publishEvent("SIGNED_IN");
      this.session = convertTokensToSession(
        response.access_token,
        response.refresh_token
      );
      this._storeUserSessionInStorage(this.session);
    }
  }

  private _clearInMemorySession() {
    this.session = null;
  }

  private async _removeSessionFromStorage() {
    await this.secureStorage.deleteItemFor("user");
    await this.secureStorage.deleteItemFor("access_token");
    await this.secureStorage.deleteItemFor("refresh_token");
  }

  /**
   * stores userSession in storage. This allows loading of UserSession after
   * app has been closed
   *
   * @param userSession
   */
  private async _storeUserSessionInStorage(userSession: UserSession) {
    // persist user session to storage
    let task1 = this.secureStorage.save(
      "access_token",
      userSession!.access_token
    );
    let task2 = this.secureStorage.save(
      "refresh_token",
      userSession!.refresh_token
    );
    let task3 = this.secureStorage.save(
      "user",
      JSON.stringify(userSession!.user)
    );
    await Promise.allSettled([task1, task2, task3]);
    console.debug("stored user session in secure storage successfully");
  }
}

type UserSession = ISession | null;
