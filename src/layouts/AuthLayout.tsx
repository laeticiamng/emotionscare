
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      
      <main className="flex-1 flex flex-col">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default AuthLayout;
