
import React from 'react';
import UnifiedHeader from './UnifiedHeader';
import UnifiedSidebar from './UnifiedSidebar';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader onMenuToggle={toggleSidebar} />
      
      <div className="flex flex-1">
        <UnifiedSidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        <main className="flex-1 md:pl-64 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UnifiedLayout;
