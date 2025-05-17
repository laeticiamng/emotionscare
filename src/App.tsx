
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/hooks/useAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import AppRoutes from '@/router/AppRoutes';
import { AudioProvider } from '@/contexts/AudioContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          <LayoutProvider>
            <AudioProvider>
              <Router>
                <AppRoutes />
              </Router>
              <Toaster />
            </AudioProvider>
          </LayoutProvider>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
