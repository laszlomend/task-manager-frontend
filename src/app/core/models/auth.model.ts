export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface RegisterResponse {
  user: User;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface Me extends User {
  googleConnected: boolean;
}

export interface MeResponse {
  user: Me;
}
