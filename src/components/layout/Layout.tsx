import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TopNav } from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10" data-testid="page-root">
      <TopNav />
      
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'bg-background border border-border',
          duration: 4000,
        }}
      />
    </div>
  );
};

export default Layout;
