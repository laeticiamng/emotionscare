
import React, { ReactNode } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProtectedLayoutWrapperProps {
  children: ReactNode;
}

// Create a client
const queryClient = new QueryClient();

const ProtectedLayoutWrapper = ({ children }: ProtectedLayoutWrapperProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SegmentProvider>
        <div className="protected-layout-container">
          {children}
        </div>
      </SegmentProvider>
    </QueryClientProvider>
  );
};

export default ProtectedLayoutWrapper;
