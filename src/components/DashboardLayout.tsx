
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { sidebarOpen, toggleSidebar } = useLayout();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block">
        {/* Sidebar will be rendered separately using the SidebarProvider */}
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex-1"></div>
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
