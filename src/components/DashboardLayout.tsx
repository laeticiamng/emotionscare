
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { setUserMode } = useUserMode();
  
  // Set user mode based on URL path
  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setUserMode('b2b-admin');
    } else if (location.pathname.includes('/business')) {
      setUserMode('b2b-collaborator');
    } else {
      setUserMode('b2c');
    }
    console.log('Setting user mode based on path:', location.pathname);
  }, [location.pathname, setUserMode]);

  return (
    <Shell>
      <div className="flex min-h-screen">
        {!isMobile && (
          <div className="w-16 md:w-64">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </Shell>
  );
};

export default DashboardLayout;
