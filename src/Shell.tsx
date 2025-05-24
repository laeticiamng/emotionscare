
import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedHeader from '@/components/unified/UnifiedHeader';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';
import { useState } from 'react';

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
      <UnifiedHeader onMenuToggle={toggleSidebar} />
      
      <div className="flex">
        <UnifiedSidebar open={sidebarOpen} onClose={closeSidebar} />
        
        <main className="flex-1 pt-16 md:pl-64">
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shell;
