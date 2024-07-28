export type KeycloakAuthResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_expires_in?: number;
  token_type: "Bearer";
  "not-before-policy": number;
  session_state: string;
  scope: string;
};
