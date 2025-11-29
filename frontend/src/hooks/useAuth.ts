/**
 * Authentication hooks using React Query
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { setToken, removeToken } from '@/utils/token';
import { QUERY_KEYS } from '@/types';
import type {
  ITeacherRegistration,
  ITeacherLogin,
  ITeacherUpdate,
  IChangePassword,
} from '@/types';

/**
 * Hook to get current authenticated user
 */
export const useAuth = () => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: async () => {
      const response = await authApi.getMe();
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ITeacherRegistration) => authApi.register(data),
    onSuccess: (response) => {
      // Store the token
      setToken(response.token);
      
      // Set user data in cache
      queryClient.setQueryData(QUERY_KEYS.auth.me, response.data);
    },
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ITeacherLogin) => authApi.login(data),
    onSuccess: (response) => {
      // Store the token
      setToken(response.token);
      
      // Set user data in cache
      queryClient.setQueryData(QUERY_KEYS.auth.me, response.data);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      authApi.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Remove token
      removeToken();
      
      // Clear all queries
      queryClient.clear();
    },
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ITeacherUpdate) => authApi.updateProfile(data),
    onSuccess: (response) => {
      // Update user data in cache
      queryClient.setQueryData(QUERY_KEYS.auth.me, response.data.teacher);
      
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.profile });
    },
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: IChangePassword) => authApi.changePassword(data),
  });
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useAuth();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};
