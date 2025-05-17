
import React, { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/music/MusicProvider';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { Toaster } from '@/components/ui/sonner';

// We don't need AuthProvider here since it's already in main.tsx
const AppRouter: React.FC = () => {
  console.log('📋 AppRouter: Initialisation du routeur');

  useEffect(() => {
    console.log('📋 AppRouter: Composant monté');
    return () => console.log('📋 AppRouter: Composant démonté');
  }, []);

  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <UserModeProvider>
          <LayoutProvider>
            <SidebarProvider>
              <MusicProvider>
                <RouterProvider router={router} />
                <Toaster />
              </MusicProvider>
            </SidebarProvider>
          </LayoutProvider>
        </UserModeProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default AppRouter;
