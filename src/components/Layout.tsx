
import React from 'react';
import { Outlet } from 'react-router-dom';
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
  
  // Si non authentifié, afficher uniquement les enfants (pages login/register)
  if (!isAuthenticated) {
    return <div className="animate-fade-in">{children || <Outlet />}</div>;
  }
  
  // Déterminer les classes de fond en fonction du thème
  const getBgClasses = () => {
    if (theme === 'dark') return 'bg-dark-gradient';
    if (theme === 'pastel') return 'bg-pastel-gradient';
    return 'bg-light-gradient';
  };
  
  return (
    <div className={`flex flex-col min-h-screen ${getBgClasses()}`}>
      <GlobalNav />
      <SessionTimeoutAlert />
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* La sidebar n'apparaît que sur desktop */}
        {!isMobile && <Sidebar />}
        <div className={`flex-1 overflow-auto bg-background transition-all ${isMobile ? 'w-full' : 'w-full pl-16'}`}>
          <main className={`animate-fade-in ${isMobile ? 'w-full px-2 py-3' : 'premium-layout px-6 py-8 md:px-8 lg:px-12 xl:px-16'}`}>
            {children || <Outlet />}
          </main>
          <SecurityFooter />
        </div>
      </div>
    </div>
  );
};

export default Layout;
