
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedHeader from '@/components/unified/UnifiedHeader';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';

const Shell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader onMenuClick={toggleSidebar} />
      
      <div className="flex">
        <UnifiedSidebar 
          open={sidebarOpen} 
          onClose={closeSidebar}
        />
        
        <main className="flex-1 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Shell;
