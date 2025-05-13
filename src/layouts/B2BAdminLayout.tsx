
import React from 'react';
import { Outlet } from 'react-router-dom';
import B2BAdminNavBar from '@/components/navigation/B2BAdminNavBar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminLayout: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="w-64 flex-shrink-0">
        <B2BAdminNavBar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b px-6 bg-white dark:bg-slate-800 shadow-sm">
          <div className="flex-1">
            {user && (
              <div>
                <h1 className="text-2xl font-semibold">
                  Administration
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.name} - Administrateur
                </p>
              </div>
            )}
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default B2BAdminLayout;
