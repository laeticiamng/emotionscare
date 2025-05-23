
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { Toaster } from 'sonner';
import AppRouter from './AppRouter';
import ProtectedLayout from './components/ProtectedLayout';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserModeProvider>
            <ProtectedLayout>
              <AppRouter />
            </ProtectedLayout>
            <Toaster position="top-right" richColors closeButton />
          </UserModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
