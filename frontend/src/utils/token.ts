/**
 * Token management utilities for authentication
 */

import { DecodedToken, UserFromToken } from "@/types/utils";

const TOKEN_KEY = 'genesys_auth_token';
const REFRESH_TOKEN_KEY = 'genesys_refresh_token';

/**
 * Store authentication token in localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Store refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Decode JWT token to get payload (without verification)
 * Note: This is for client-side only, server should verify
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration date
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

/**
 * Store token in cookie (for server-side access in middleware)
 */
export const setTokenCookie = (token: string): void => {
  if (typeof document !== 'undefined') {
    const expirationDate = getTokenExpiration(token);
    const expires = expirationDate ? expirationDate.toUTCString() : '';
    document.cookie = `token=${token}; path=/; ${expires ? `expires=${expires};` : ''} SameSite=Lax; Secure`;
  }
};

/**
 * Remove token from cookie
 */
export const removeTokenCookie = (): void => {
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
  }
};

/**
 * Get user data from token
 */
export const getUserFromToken = (token: string): UserFromToken | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.userId || decoded.sub || '',
    email: decoded.email || '',
    role: decoded.role || 'teacher',
    name: decoded.name,
  };
};
