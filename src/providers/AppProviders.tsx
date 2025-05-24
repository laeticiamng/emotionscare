
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <BrowserRouter>
        <AuthProvider>
          <UserModeProvider>
            <OnboardingProvider>
              {children}
              <Toaster />
            </OnboardingProvider>
          </UserModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default AppProviders;
