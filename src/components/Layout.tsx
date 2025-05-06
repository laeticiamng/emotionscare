
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GlobalNav from './GlobalNav';
import SecurityFooter from './SecurityFooter';
import SessionTimeoutAlert from './SessionTimeoutAlert';
import Sidebar from './ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/contexts/ThemeContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const location = useLocation();
  
  // Don't render layout for login/admin-login pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/admin-login';
  
  // If on auth page or not authenticated, display only the children (pages login/register)
  if (isAuthPage || !isAuthenticated) {
    return <div className="animate-fade-in">{children || <Outlet />}</div>;
  }
  
  // Déterminer les classes de fond en fonction du thème
  const getBgClasses = () => {
    if (theme === 'dark') return 'bg-gradient-to-br from-[#1F2430] to-[#2A303D]';
    if (theme === 'pastel') return 'bg-gradient-to-br from-blue-50 to-blue-100/70';
    return 'bg-gradient-to-br from-white to-gray-100';
  };
  
  return (
    <div className={`flex flex-col min-h-screen ${getBgClasses()}`}>
      <GlobalNav />
      <SessionTimeoutAlert />
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* La sidebar n'apparaît que sur desktop */}
        {!isMobile && <Sidebar />}
        <div className={`flex-1 overflow-auto bg-background/80 backdrop-blur-sm transition-all ${isMobile ? 'w-full' : 'w-full pl-16'}`}>
          <main className={`animate-fade-in ${isMobile ? 'w-full px-3 py-4' : 'premium-container py-8 md:px-8 lg:px-12'}`}>
            {children || <Outlet />}
          </main>
          <SecurityFooter />
        </div>
      </div>
    </div>
  );
};

export default Layout;
