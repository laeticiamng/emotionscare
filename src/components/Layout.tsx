
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GlobalNav from './GlobalNav';
import SecurityFooter from './SecurityFooter';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  // If not authenticated, only render the children (login/register pages)
  if (!isAuthenticated) {
    return <>{children || <Outlet />}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalNav />
      <div className="flex-1 overflow-auto bg-background pt-16">
        <main className="container mx-auto p-6">
          {children || <Outlet />}
        </main>
        <SecurityFooter />
      </div>
    </div>
  );
};

export default Layout;
