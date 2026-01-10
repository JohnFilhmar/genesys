/**
 * Authentication guard HOC for protecting pages/components
 */

'use client';

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/utils/token';

/**
 * HOC to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const { data: user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const token = mounted ? getToken() : null; // Only read token after mount

    useEffect(() => {
      // Only run this logic if we are mounted to avoid premature redirects
      if (mounted && !isLoading && (!user || !token)) {
        router.push('/login');
      }
    }, [user, isLoading, token, router, mounted]);

    // PREVENT HYDRATION MISMATCH:
    // If not mounted, render nothing (or a generic loading skeleton that matches server)
    if (!mounted) {
       return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!user || !token) {
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * HOC to redirect authenticated users away from auth pages
 * Use on login/register pages
 */
export function withGuest<P extends object>(Component: ComponentType<P>) {
  return function GuestRoute(props: P) {
    const router = useRouter();
    const { data: user, isLoading, isError } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    // CRITICAL FIX: Only read token on the client side
    const token = mounted ? getToken() : null;

    useEffect(() => {
      if (mounted && !isLoading && !isError && user && token) {
        router.push('/dashboard');
      }
    }, [user, isLoading, isError, token, router, mounted]);

    // CRITICAL FIX: Ensure this condition is false on the first render (Server side)
    // so it matches the Server's output (which is the Component).
    // We only show loading if we are mounted AND have a token.
    if (mounted && isLoading && token) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    // If user is authenticated with valid token, don't render the login form
    if (mounted && !isError && user && token) {
      return null;
    }

    return <Component {...props} />;
  };
}