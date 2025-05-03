
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import TopNav from './TopNav';
import { useAuth } from '@/contexts/AuthContext';

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
    <div className="flex h-screen">
      <Navigation />
      <div className="flex-1 overflow-auto bg-background">
        <TopNav />
        <main className="p-6 mt-14">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
