import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      
      <main 
        className={cn(
          "container mx-auto px-4 py-6",
          isHomePage && "px-0" // Full width for home page
        )}
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
}