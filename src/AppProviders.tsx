
import React from 'react';
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { PerformanceProvider } from '@/components/performance/PerformanceProvider';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * PROVIDERS UNIFIÉS - Architecture Premium
 * Single provider tree optimisé pour les performances
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <UnifiedProvider>
        <PerformanceProvider>
          {children}
          <Toaster 
            position="top-right" 
            className="toaster group"
            toastOptions={{
              classNames: {
                toast: "group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-premium",
                description: "group-[.toast]:text-muted-foreground",
                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
              },
            }}
          />
        </PerformanceProvider>
      </UnifiedProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
