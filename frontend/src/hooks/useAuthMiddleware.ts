/**
 * useAuth Hook
 * Provides easy access to authentication state and methods
 */

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    decodedToken,
    setUser, 
    setToken,
    clearUser, 
    logout: logoutStore,
    checkAuthentication 
  } = useAuthStore();

  /**
   * Logout user and redirect to login page
   */
  const logout = useCallback(() => {
    logoutStore();
    router.push('/login');
  }, [logoutStore, router]);

  /**
   * Login with token
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = useCallback((token: string, userData?: any) => {
    setToken(token);
    if (userData) {
      setUser(userData);
    }
    checkAuthentication();
  }, [setToken, setUser, checkAuthentication]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    return decodedToken?.role === role;
  }, [decodedToken]);

  /**
   * Get user ID from decoded token
   */
  const getUserId = useCallback((): string | null => {
    return decodedToken?.userId || decodedToken?.sub || null;
  }, [decodedToken]);

  /**
   * Get user email from decoded token
   */
  const getUserEmail = useCallback((): string | null => {
    return decodedToken?.email || user?.email || null;
  }, [decodedToken, user]);

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  const isTokenExpiringSoon = useCallback((): boolean => {
    if (!decodedToken?.exp) return false;
    
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return expirationTime - currentTime < fiveMinutes;
  }, [decodedToken]);

  return {
    // State
    user,
    isAuthenticated,
    decodedToken,
    
    // Methods
    login,
    logout,
    setUser,
    clearUser,
    checkAuthentication,
    
    // Utilities
    hasRole,
    getUserId,
    getUserEmail,
    isTokenExpiringSoon,
    
    // Computed properties
    isTeacher: hasRole('teacher'),
    isStudent: hasRole('student'),
    isAdmin: hasRole('admin'),
  };
}
