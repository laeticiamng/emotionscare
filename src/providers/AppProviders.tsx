
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { UserModeProvider } from '@/contexts/UserModeContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserModeProvider>
          {children}
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
