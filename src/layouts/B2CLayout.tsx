
import React from 'react';
import { Outlet } from 'react-router-dom';
import B2CNavBar from '@/components/navigation/B2CNavBar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuth } from '@/contexts/AuthContext';

const B2CLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0">
        <B2CNavBar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 lg:px-6">
          <div className="flex-1">
            {user && (
              <h1 className="text-xl font-semibold">
                Bienvenue, {user.name}
              </h1>
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

export default B2CLayout;
