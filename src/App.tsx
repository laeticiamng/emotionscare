
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRouter from './AppRouter';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedLayout from '@/components/ProtectedLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="emotions-care-theme">
      <Router>
        <AuthProvider>
          <UserModeProvider>
            <ProtectedLayout>
              <AppRouter />
            </ProtectedLayout>
            <Toaster position="top-right" />
          </UserModeProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
