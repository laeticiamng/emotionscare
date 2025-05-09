
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className={`container mx-auto ${isMobile ? 'py-4' : 'py-6'}`}>
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
