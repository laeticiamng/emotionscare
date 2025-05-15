
import React, { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar/SidebarContext';
import { router } from './router';
import { RouterProvider } from 'react-router-dom';
import { LayoutProvider } from '@/contexts/LayoutContext';

const AppRouter: React.FC = () => {
  // Ajouter des logs de débogage pour identifier les problèmes de montage
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
              <div className="debug-box" style={{ padding: '10px', background: '#f0f0f0', margin: '10px', display: 'none' }}>
                <h3>Test de rendu</h3>
                <p>Si vous voyez ce message, le routeur est correctement initialisé.</p>
              </div>
              <RouterProvider router={router} />
            </MusicProvider>
          </SidebarProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppRouter;
