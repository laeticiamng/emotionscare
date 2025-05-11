
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/ui/sidebar';
import Shell from '@/Shell';

const DashboardLayout: React.FC = () => {
  const isMobile = useIsMobile();
  
  console.log("DashboardLayout rendering, isMobile:", isMobile);

  return (
    <Shell>
      <div className="flex min-h-screen">
        {!isMobile && (
          <div className="w-16 md:w-64">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 p-4 bg-background">
          <Outlet />
        </div>
      </div>
    </Shell>
  );
};

export default DashboardLayout;
