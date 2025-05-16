
import React, { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { LayoutProvider } from '@/contexts/LayoutContext';

const AppRouter: React.FC = () => {
  console.log('📋 AppRouter: Initialisation du routeur');

  useEffect(() => {
    console.log('📋 AppRouter: Composant monté');
    return () => console.log('📋 AppRouter: Composant démonté');
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutProvider>
          <SidebarProvider>
            <MusicProvider>
              <RouterProvider router={router} />
            </MusicProvider>
          </SidebarProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppRouter;
