
import React from 'react';
import { Outlet } from 'react-router-dom';
import B2BUserNavBar from '@/components/navigation/B2BUserNavBar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0">
        <B2BUserNavBar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 lg:px-6 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex-1">
            {user && (
              <div>
                <h1 className="text-xl font-semibold">
                  Bienvenue, {user.name}
                </h1>
                {user.job_title && (
                  <p className="text-sm text-muted-foreground">{user.job_title} - {user.department}</p>
                )}
              </div>
            )}
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default B2BUserLayout;
