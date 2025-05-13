
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Sidebar from '@/components/ui/sidebar/Sidebar';
import { ModeToggle } from '@/components/theme/ModeToggle';
import EmotionalCheckIn from '@/components/dashboard/EmotionalCheckIn';

const B2CLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="ml-2">Chargement en cours...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-14 items-center border-b px-4 lg:px-6">
            <div className="flex-1">
              <h1 className="text-xl font-semibold">B2C Portal</h1>
            </div>
            <ModeToggle />
          </header>
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
        <EmotionalCheckIn />
      </div>
    </ThemeProvider>
  );
};

export default B2CLayout;
