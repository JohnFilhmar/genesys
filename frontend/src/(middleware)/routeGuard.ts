/**
 * Route protection utilities for Next.js App Router
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired } from '@/utils/token';

/**
 * Hook to check authentication and redirect if needed
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
};

/**
 * Hook to redirect authenticated users
 */
export const useRedirectIfAuth = (redirectTo = '/dashboard') => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (token && !isTokenExpired(token)) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
};

/**
 * Check if user can access a route
 */
export const canAccessRoute = (requireAuth: boolean): boolean => {
  const token = getToken();

  if (requireAuth) {
    return !!(token && !isTokenExpired(token));
  }

  return true;
};
