/**
 * React Query configuration and provider setup
 */

'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

// Default query client options
const defaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 0,
  },
};

/**
 * Create a new query client instance
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions,
  });
};

/**
 * Query Client Provider wrapper component
 */
interface QueryClientProviderProps {
  children: ReactNode;
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  // Create query client instance (stable across renders)
  const [queryClient] = useState(() => createQueryClient());

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </TanStackQueryClientProvider>
  );
}
