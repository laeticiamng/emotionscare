
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppRouter from './AppRouter';
import './App.css';
import AuthTransition from '@/components/auth/AuthTransition';
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <AuthTransition>
            <AppRouter />
          </AuthTransition>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

export default App;
