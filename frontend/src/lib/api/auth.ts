/**
 * Authentication API service
 */

import apiClient from './client';
import {
  AuthResponse,
  ProfileResponse,
  ApiResponse,
  ITeacherRegistration,
  ITeacherLogin,
  ITeacherUpdate,
  IChangePassword,
} from '@/types';

/**
 * Register a new teacher account
 */
export const register = async (data: ITeacherRegistration): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * Login with email and password
 */
export const login = async (data: ITeacherLogin): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (): Promise<ProfileResponse> => {
  const response = await apiClient.get<ProfileResponse>('/auth/me');
  return Promise.resolve(response.data);
};

/**
 * Update current user profile
 */
export const updateProfile = async (data: ITeacherUpdate): Promise<ProfileResponse> => {
  const response = await apiClient.put<ProfileResponse>('/auth/profile', data);
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (data: IChangePassword): Promise<ApiResponse> => {
  const response = await apiClient.put<ApiResponse>('/auth/change-password', data);
  return response.data;
};

/**
 * Logout (client-side only - clear token)
 */
export const logout = (): void => {
  // Token removal is handled by the client
  // No API call needed as JWT is stateless
};
