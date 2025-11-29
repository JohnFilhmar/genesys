import { ITeacher } from "./models";
import { DecodedToken } from "./utils";

export interface AuthState {
  user: ITeacher | null;
  isAuthenticated: boolean;
  decodedToken: DecodedToken | null;
  setUser: (user: ITeacher | null) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  checkAuthentication: () => void;
  logout: () => void;
}