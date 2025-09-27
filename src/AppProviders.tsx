import React from 'react';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
};

export default AppProviders;