
import React, { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/music';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LayoutProvider } from '@/contexts/LayoutContext';

const AppRouter: React.FC = () => {
  console.log('📋 AppRouter: Initialisation du routeur');

  useEffect(() => {
    console.log('📋 AppRouter: Composant monté');
    return () => console.log('📋 AppRouter: Composant démonté');
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutProvider>
          <SidebarProvider>
            <MusicProvider>
              <RouterProvider router={router} />
            </MusicProvider>
          </SidebarProvider>
        </LayoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppRouter;
