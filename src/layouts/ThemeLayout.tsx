
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ThemeLayoutProps {
  children: React.ReactNode;
}

const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default ThemeLayout;
