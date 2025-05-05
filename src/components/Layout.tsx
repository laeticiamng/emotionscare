
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GlobalNav from './GlobalNav';
import SecurityFooter from './SecurityFooter';
import SessionTimeoutAlert from './SessionTimeoutAlert';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  console.log("Layout - isAuthenticated:", isAuthenticated);
  
  // If not authenticated, only render the children (login/register pages)
  if (!isAuthenticated) {
    console.log("Layout - Not authenticated, rendering without navigation");
    return <>{children || <Outlet />}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalNav />
      <SessionTimeoutAlert />
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
