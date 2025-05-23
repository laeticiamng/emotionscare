
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import AuthTransition from './components/auth/AuthTransition';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
