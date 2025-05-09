
import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';

interface ProtectedLayoutWrapperProps {
  children: React.ReactNode;
}

const ProtectedLayoutWrapper: React.FC<ProtectedLayoutWrapperProps> = ({ children }) => {
  return <div className="flex flex-col min-h-screen">
    {children}
  </div>;
};

export default ProtectedLayoutWrapper;
