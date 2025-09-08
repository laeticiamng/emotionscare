/**
 * Unified Layout - Layout Premium Unifié
 * Remplace tous les layouts existants avec architecture optimisée
 */

import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AccessibilityEnhancer } from '@/components/ui/AccessibilityEnhancer';
import { PremiumNavigation } from './PremiumNavigation';
import { PremiumSidebar } from './PremiumSidebar';
import { PremiumFooter } from './PremiumFooter';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

interface UnifiedLayoutProps {
  className?: string;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine layout type based on route
  const isPublicRoute = ['/', '/b2c', '/entreprise', '/login', '/signup', '/help'].includes(location.pathname);
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
  const isAppRoute = location.pathname.startsWith('/app');
  const isSettingsRoute = location.pathname.startsWith('/settings');

  // Auto-navigate authenticated users from auth pages
  useEffect(() => {
    if (isAuthenticated && isAuthRoute) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, isAuthRoute, navigate]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Open command palette
      }
      
      // Escape to close sidebar on mobile
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-background text-foreground",
      "transition-colors duration-300",
      isDarkMode && "dark",
      className
    )}>
      <Helmet>
        <html lang="fr" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={isDarkMode ? "#0f172a" : "#ffffff"} />
      </Helmet>

      {/* Skip Links for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Aller au contenu principal
      </a>

      {/* Progress Indicator */}
      <ScrollProgress />

      {/* Navigation Header */}
      {!isAuthRoute && (
        <PremiumNavigation 
          isPublic={isPublicRoute}
          onMenuClick={() => setSidebarOpen(true)}
          className="sticky top-0 z-40"
        />
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Sidebar for App Routes */}
        {(isAppRoute || isSettingsRoute) && (
          <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Fermer le menu"
              />
            )}
            
            {/* Sidebar */}
            <PremiumSidebar 
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              className="z-50"
            />
          </>
        )}

        {/* Main Content Area */}
        <main 
          id="main-content"
          className={cn(
            "flex-1 flex flex-col min-w-0",
            (isAppRoute || isSettingsRoute) && "md:ml-64" // Account for sidebar width
          )}
          role="main"
          tabIndex={-1}
        >
          {/* Page Content */}
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>

          {/* Footer for Public Pages */}
          {isPublicRoute && !isAuthRoute && (
            <PremiumFooter className="mt-auto" />
          )}
        </main>
      </div>

      {/* Global Components */}
      <Toaster />
      <AccessibilityEnhancer />
    </div>
  );
};

export default UnifiedLayout;