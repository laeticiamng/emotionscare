
import React, { ReactNode } from 'react';
import ProtectedLayout from './ProtectedLayout';
import { SegmentProvider } from '@/contexts/SegmentContext';

interface ProtectedLayoutWrapperProps {
  children: ReactNode;
}

const ProtectedLayoutWrapper = ({ children }: ProtectedLayoutWrapperProps) => {
  return (
    <SegmentProvider>
      <div className="protected-layout-container">
        {children}
      </div>
    </SegmentProvider>
  );
};

export default ProtectedLayoutWrapper;
