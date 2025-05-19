
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppRouter from './AppRouter';
import './App.css';
import AuthTransition from '@/components/auth/AuthTransition';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { MusicProvider } from '@/contexts/music';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <MusicProvider>
            <AuthProvider>
              <AuthTransition>
                <AppRouter />
              </AuthTransition>
            </AuthProvider>
          </MusicProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;
