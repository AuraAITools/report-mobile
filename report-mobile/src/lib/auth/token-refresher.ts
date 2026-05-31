export type TokenRefresherFn = () => Promise<string | null>;

let refreshTokenFn: TokenRefresherFn | null = null;

export function setTokenRefresher(fn: TokenRefresherFn) {
  refreshTokenFn = fn;
}

export function getTokenRefresher(): TokenRefresherFn | null {
  return refreshTokenFn;
}
