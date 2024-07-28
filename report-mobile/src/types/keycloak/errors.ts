export class KeycloakTokenRefreshError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class KeycloakUserLoginFailedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class KeycloakClientFetchClientAccessTokenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class KeycloakClientSignUpError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class KeycloakClientLogoutError extends Error {
  constructor(message: string) {
    super(message);
  }
}
