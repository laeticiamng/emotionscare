
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppRouter from './AppRouter';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          <div className="min-h-screen w-full">
            <AppRouter />
            <Toaster position="top-right" />
          </div>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
