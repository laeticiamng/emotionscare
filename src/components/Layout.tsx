
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
  const isHomePage = location.pathname === '/';
  
  // If on auth page or not authenticated and not on home page, display only the children (pages login/register)
  if (isAuthPage || (!isAuthenticated && !isHomePage)) {
    return (
      <div className="animate-fade-in min-h-screen">
        {children || <Outlet />}
      </div>
    );
  }
  
  // Determine background classes based on theme - Using warmer gradients
  const getBgClasses = () => {
    if (theme === 'dark') return 'bg-gradient-to-br from-[#22252F] to-[#2D3440]'; // Slightly warmer dark
    if (theme === 'pastel') return 'bg-gradient-to-br from-blue-50 to-indigo-100/60'; // More vibrant pastel
    return 'bg-gradient-to-br from-white to-gray-50/80'; // Warmer light mode
  };
  
  return (
    <div className={`flex flex-col min-h-screen ${getBgClasses()}`}>
      {/* GlobalNav includes all top navigation in a single component */}
      <GlobalNav isAuthenticated={isAuthenticated} />
      
      {isAuthenticated && <SessionTimeoutAlert />}
      
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar only appears on desktop for authenticated users */}
        {!isMobile && isAuthenticated && <Sidebar />}
        
        <div className={`flex-1 overflow-auto transition-all ${
          isMobile ? 'w-full' : 
          isAuthenticated ? 'w-full pl-16 pr-0' : 
          'w-full'
        }`}>
          <main className={`animate-fade-in ${
            isMobile ? 'w-full px-4 py-6' : // More padding on mobile
            isHomePage && !isAuthenticated ? 'w-full p-0' : 
            'w-full max-w-[1400px] mx-auto py-8 px-8 md:px-10 lg:px-12' // More spacious layout
          }`}>
            {children || <Outlet />}
          </main>
          <SecurityFooter />
        </div>
      </div>
    </div>
  );
};

export default Layout;
