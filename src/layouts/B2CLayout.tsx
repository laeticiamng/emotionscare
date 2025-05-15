
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ModeToggle } from '@/components/ui/mode-toggle';
import B2CNavBar from '@/components/navigation/B2CNavBar';

const B2CLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className={`${isMobile ? 'hidden md:block md:w-64' : 'w-64'} flex-shrink-0`}>
        <B2CNavBar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 lg:px-6 bg-background/50 backdrop-blur-sm">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              EmotionsCare
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default B2CLayout;
