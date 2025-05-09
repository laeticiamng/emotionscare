
import React, { ReactNode } from 'react';
import ProtectedLayout from './ProtectedLayout';

interface ProtectedLayoutWrapperProps {
  children: ReactNode;
}

const ProtectedLayoutWrapper = ({ children }: ProtectedLayoutWrapperProps) => {
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  );
};

export default ProtectedLayoutWrapper;
