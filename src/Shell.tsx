
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import UnifiedHeader from '@/components/unified/UnifiedHeader';
import UnifiedSidebar from '@/components/unified/UnifiedSidebar';
import { Toaster } from '@/components/ui/sonner';

interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="emotions-care-theme">
      <AuthProvider>
        <UserModeProvider>
          <div className="min-h-screen bg-background">
            <UnifiedHeader onMenuToggle={toggleSidebar} />
            
            <div className="flex">
              <UnifiedSidebar 
                isOpen={sidebarOpen} 
                onToggle={toggleSidebar} 
              />
              
              <main className="flex-1 md:ml-64">
                {children || <Outlet />}
              </main>
            </div>
            
            <Toaster position="bottom-right" />
          </div>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Shell;
