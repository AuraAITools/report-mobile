import { TokenResponse } from "expo-auth-session";
import { UserInfo } from "./UserInfo";

type AuthData = {
  userInfo: UserInfo | undefined;
  loginUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUserSession: () => Promise<void>;
  unlockWithBiometrics: () => Promise<boolean>;
  roles: string[];
  groups: string[];
  tenant_ids: string[];
  tokenResponse: TokenResponse | undefined;
  isAuthenticated: boolean;
  isLocked: boolean;
  isRestoringSession: boolean;
};

export default AuthData;
