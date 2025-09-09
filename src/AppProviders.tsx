
import React from 'react';
import { UnifiedProvider } from '@/core/UnifiedStateManager';
import { AuthProvider } from '@/contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { EmotionsCareMusicProvider } from '@/contexts/EmotionsCareMusicContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { NotificationProvider } from '@/components/ui/notification-system';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * PROVIDERS UNIFIÉS - Architecture Premium
 * Single provider tree optimisé pour les performances et l'accessibilité
 * Note: BrowserRouter supprimé car RouterProvider gère déjà le routing
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <AccessibilityProvider>
        <ThemeProvider defaultTheme="light" storageKey="emotions-care-theme">
          <NotificationProvider>
            <AuthProvider>
              <MoodProvider>
                <UnifiedProvider>
                  <EmotionsCareMusicProvider>
                    {children}
                    <Toaster 
                      position="top-right" 
                      className="toaster group"
                      closeButton
                      toastOptions={{
                        classNames: {
                          toast: "group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-premium",
                          description: "group-[.toast]:text-muted-foreground",
                          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                        },
                      }}
                    />
                  </EmotionsCareMusicProvider>
                </UnifiedProvider>
              </MoodProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </HelmetProvider>
  );
};

export default AppProviders;
