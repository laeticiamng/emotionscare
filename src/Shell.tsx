
import React, { useState } from 'react';
import UnifiedHeader from '@/components/unified/UnifiedHeader';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';

interface ShellProps {
  children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <UnifiedHeader onMenuToggle={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <UnifiedSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-auto bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Shell;
