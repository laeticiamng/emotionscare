
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';

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
