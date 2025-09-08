
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * PROVIDERS SIMPLIFIÉS - Sans erreurs d'import
 * Version stable sans providers manquants
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
        {children}
        <Toaster 
          position="top-right" 
          className="toaster group"
          closeButton
          richColors
          toastOptions={{
            classNames: {
              toast: "group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
            duration: 5000,
          }}
        />
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
