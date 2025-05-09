
import React, { ReactNode } from 'react';
import ProtectedLayout from './ProtectedLayout';

interface ProtectedLayoutWrapperProps {
  children: ReactNode;
}

const ProtectedLayoutWrapper: React.FC<ProtectedLayoutWrapperProps> = ({ children }) => {
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  );
};

export default ProtectedLayoutWrapper;
