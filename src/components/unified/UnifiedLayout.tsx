
import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedShell from './UnifiedShell';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedLayoutProps {
  children?: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <UnifiedShell>
      <div className="container px-4 py-6 mx-auto">
        {children || <Outlet />}
      </div>
    </UnifiedShell>
  );
};

export default UnifiedLayout;
