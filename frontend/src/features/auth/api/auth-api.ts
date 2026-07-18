import { httpClient } from '@/shared/api/http-client';
import type { ApiResponse } from '@/shared/types/api';
import type { User } from '@/entities/user/model';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  login: (credentials: LoginRequest) =>
    httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials),

  logout: () =>
    httpClient.post<ApiResponse<void>>('/auth/logout'),

  refresh: (data: RefreshTokenRequest) =>
    httpClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', data),

  me: () =>
    httpClient.get<ApiResponse<User>>('/auth/me'),
};
