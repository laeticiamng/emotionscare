import React from 'react';
import { AuthProvider } from './AuthContext';
import { ErrorProvider } from './ErrorContext';
import { CacheProvider } from './CacheContext';
import { MusicProvider } from './MusicContext';
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from './theme';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BrandingProvider } from './BrandingContext';
import { Toaster } from '@/components/ui/toaster';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Composant central qui wrap tous les providers de l'application
 * Ordre d'importance : ErrorProvider en premier, puis les autres
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorProvider>
      <CacheProvider>
        <ThemeProvider>
          <BrandingProvider>
            <AuthProvider>
              <SidebarProvider>
                <NotificationProvider>
                  <MusicProvider>
                    {children}
                    <Toaster />
                  </MusicProvider>
                </NotificationProvider>
              </SidebarProvider>
            </AuthProvider>
          </BrandingProvider>
        </ThemeProvider>
      </CacheProvider>
    </ErrorProvider>
  );
};

export default AppProviders;