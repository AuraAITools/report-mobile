export interface IUser {
  roles: IRoles;
  scopes: IScopes;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export type IRoles = string[];
export type IScopes = string[];
