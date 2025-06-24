
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children || <Outlet />}
      <Toaster position="top-right" />
    </div>
  );
};

export default Shell;
