
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SimpleAuthProvider } from '@/contexts/SimpleAuth';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <SimpleAuthProvider>
        <UserModeProvider>
          <MoodProvider>
            <NotificationProvider>
              {children}
              <Toaster position="top-right" />
            </NotificationProvider>
          </MoodProvider>
        </UserModeProvider>
      </SimpleAuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
