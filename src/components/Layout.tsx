
import React from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-xl font-bold">EmotionsCare</h1>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto py-6">
          {children || <Outlet />}
        </div>
      </main>
      
      <footer className="bg-muted py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EmotionsCare - Powered by ResiMax
        </div>
      </footer>
    </div>
  );
};

export default Layout;
