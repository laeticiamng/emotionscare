
import React from 'react';
import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          <AppRouter />
          <Toaster position="top-right" />
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
