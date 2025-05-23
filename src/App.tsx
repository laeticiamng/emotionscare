
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { Toaster } from 'sonner';
import AppRouter from '@/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserModeProvider>
          <AppRouter />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
        </UserModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
