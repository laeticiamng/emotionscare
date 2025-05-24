
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';
import { Toaster } from '@/components/ui/toaster';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
