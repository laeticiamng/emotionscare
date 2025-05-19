
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppRouter from './AppRouter';
import './App.css';
import AuthTransition from '@/components/auth/AuthTransition';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthTransition>
          <AppRouter />
        </AuthTransition>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
