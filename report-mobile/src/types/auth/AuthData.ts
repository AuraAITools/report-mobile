import UserDetails from "./UserDetails";

type AuthData = {
  userDetails: UserDetails | undefined;
  loginUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUserSession: () => Promise<void>;
  isAuthenticated: boolean;
};

export default AuthData;
