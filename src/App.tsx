
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { MusicProvider } from '@/contexts/MusicContext';
import AppRoutes from '@/router/AppRoutes';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          <LayoutProvider>
            <MusicProvider>
              <AppRoutes />
              <Toaster />
            </MusicProvider>
          </LayoutProvider>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
