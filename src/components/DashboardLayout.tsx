
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/ui/sidebar';
import Shell from '@/Shell';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  console.log("DashboardLayout rendering, isMobile:", isMobile);

  return (
    <Shell>
      <div className="flex min-h-screen">
        {/* Sidebar - Corrigé pour être toujours visible sauf en mobile */}
        <div className={`${isMobile ? 'hidden' : 'w-16 md:w-64 fixed top-16 bottom-0 z-40'}`}>
          <Sidebar />
        </div>
        
        {/* Main content - Ajusté pour le bon espacement avec la sidebar */}
        <div className={`flex-1 transition-all ${isMobile ? 'ml-0 p-4' : 'ml-16 md:ml-64 p-4'} bg-background`}>
          {children || (mounted && <Outlet />)}
        </div>
      </div>
    </Shell>
  );
};

export default DashboardLayout;
