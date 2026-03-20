import React from 'react';
import { ThemeProvider } from '@/providers/theme';

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
