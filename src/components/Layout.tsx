
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GlobalNav from './GlobalNav';
import SecurityFooter from './SecurityFooter';
import SessionTimeoutAlert from './SessionTimeoutAlert';
import Sidebar from './ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  // Si non authentifié, afficher uniquement les enfants (pages login/register)
  if (!isAuthenticated) {
    console.log("Layout - Not authenticated, rendering without navigation");
    return <>{children || <Outlet />}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <GlobalNav />
      <SessionTimeoutAlert />
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* La sidebar n'apparaît que sur desktop */}
        {!isMobile && <Sidebar />}
        <div className={`flex-1 overflow-auto bg-background ${isMobile ? 'w-full' : 'w-full pl-16'}`}>
          <main className={`${isMobile ? 'w-full px-1 py-2' : 'premium-layout px-4 py-6 md:px-8 lg:px-12 xl:px-16'}`}>
            {children || <Outlet />}
          </main>
          <SecurityFooter />
        </div>
      </div>
    </div>
  );
};

export default Layout;
