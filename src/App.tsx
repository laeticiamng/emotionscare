import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <ThemeProvider>
      <UserModeProvider>
        <AppRouter />
      </UserModeProvider>
    </ThemeProvider>
  );
}

export default App;
