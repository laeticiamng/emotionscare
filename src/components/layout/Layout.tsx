
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { Toaster } from 'sonner';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
