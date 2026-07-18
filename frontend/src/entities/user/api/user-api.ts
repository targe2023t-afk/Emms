import { httpClient } from '@/shared/api/http-client';
import type { User, UserPreferences } from '@/entities/user/model';
import type { ApiResponse } from '@/shared/types/api';

export const userApi = {
  getCurrentUser: () =>
    httpClient.get<ApiResponse<User>>('/auth/me'),

  updatePreferences: (preferences: UserPreferences) =>
    httpClient.put<ApiResponse<User>>('/users/preferences', preferences),

  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName'>>) =>
    httpClient.patch<ApiResponse<User>>('/users/profile', data),
};
