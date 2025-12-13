/**
 * APP LAYOUT PREMIUM - EMOTIONSCARE
 * Layout principal avec sidebar Shadcn intégré
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, ArrowLeft, User } from 'lucide-react';

export function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/app/home' || location.pathname === '/';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Navigation */}
          <header className="sticky top-0 z-40 h-14 flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            
            {/* Logo / Platform Name */}
            <Link 
              to="/" 
              className="font-bold text-lg text-primary hover:text-primary/80 transition-colors"
              aria-label="EmotionsCare - Accueil"
            >
              EmotionsCare
            </Link>
            
            <div className="flex-1" />
            
            {/* Navigation Buttons */}
            <nav className="flex items-center gap-2">
              {!isHome && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="gap-2"
                >
                  <Link to="/app/home">
                    <Home className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Accueil</span>
                  </Link>
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
              >
                <Link to="/settings/profile" aria-label="Mon profil">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline ml-2">Profil</span>
                </Link>
              </Button>
            </nav>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6 bg-background text-foreground" role="main" id="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;