
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AuthProvider>
        <UserModeProvider>
          <MoodProvider>
            {children}
            <Toaster position="top-right" />
          </MoodProvider>
        </UserModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
