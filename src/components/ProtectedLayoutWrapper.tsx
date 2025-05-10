
import React, { ReactNode } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SessionTimeoutAlert from './SessionTimeoutAlert';
import SupportDrawer from './support/SupportDrawer';

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
          <SessionTimeoutAlert />
          {children}
          <div className="fixed bottom-4 right-4 z-50">
            <SupportDrawer />
          </div>
        </div>
      </SegmentProvider>
    </QueryClientProvider>
  );
};

export default ProtectedLayoutWrapper;
