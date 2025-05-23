
import React from 'react';
import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import AuthTransition from './components/auth/AuthTransition';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          <AuthTransition>
            <AppRouter />
            <Toaster position="top-right" />
          </AuthTransition>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
