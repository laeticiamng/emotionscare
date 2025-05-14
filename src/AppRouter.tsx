
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar/SidebarContext';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { LayoutProvider } from '@/contexts/LayoutContext';

const AppRouter: React.FC = () => {
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
