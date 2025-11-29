'use client';

import { QueryClientProvider } from '@/lib/react-query';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider>
      {children}
    </QueryClientProvider>
  );
}
