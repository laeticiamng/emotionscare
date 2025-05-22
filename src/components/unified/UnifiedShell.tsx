
import React, { useState } from 'react';
import UnifiedHeader from './UnifiedHeader';
import UnifiedSidebar from './UnifiedSidebar';

interface UnifiedShellProps {
  children: React.ReactNode;
}

const UnifiedShell: React.FC<UnifiedShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader onMenuClick={toggleSidebar} />
      <div className="pt-16 flex">
        <UnifiedSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <main className="flex-1 ml-0 md:ml-64 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UnifiedShell;
