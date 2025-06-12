
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { Toaster } from '@/components/ui/toaster';
import { router } from './router';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <UserModeProvider>
          <div className="min-h-screen bg-background">
            <RouterProvider router={router} />
            <Toaster />
          </div>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
