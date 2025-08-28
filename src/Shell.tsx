
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import HealthCheckBadge from '@/components/HealthCheckBadge';

interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Global Health Badge */}
      <div className="fixed top-4 right-4 z-50">
        <HealthCheckBadge />
      </div>
      
      {children || <Outlet />}
      <Toaster position="top-right" />
    </div>
  );
};

export default Shell;
