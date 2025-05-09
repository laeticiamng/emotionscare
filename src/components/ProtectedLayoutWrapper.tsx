
import React from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';

interface ProtectedLayoutWrapperProps {
  children: React.ReactNode;
}

const ProtectedLayoutWrapper: React.FC<ProtectedLayoutWrapperProps> = ({ children }) => {
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default ProtectedLayoutWrapper;
