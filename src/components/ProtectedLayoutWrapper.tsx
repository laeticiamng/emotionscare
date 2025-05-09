
import React, { ReactNode } from 'react';
import ProtectedLayout from './ProtectedLayout';

interface ProtectedLayoutWrapperProps {
  children: ReactNode;
}

const ProtectedLayoutWrapper = ({ children }: ProtectedLayoutWrapperProps) => {
  return (
    <div className="protected-layout-container">
      {children}
    </div>
  );
};

export default ProtectedLayoutWrapper;
