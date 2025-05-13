
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import EmotionalCheckIn from '@/components/dashboard/EmotionalCheckIn';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

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
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 lg:px-6">
          <div className="flex-1"></div>
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
      
      {/* Emotional check-in component */}
      <EmotionalCheckIn />
    </div>
  );
};

export default DashboardLayout;
