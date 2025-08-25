
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MoodProvider } from '@/contexts/MoodContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  console.log('🔧 AppProviders: Début du rendu des providers');
  
  try {
    return (
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <UserModeProvider>
            <MoodProvider>
              <NotificationProvider>
                {children}
                <Toaster position="top-right" />
              </NotificationProvider>
            </MoodProvider>
          </UserModeProvider>
        </AuthProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('❌ Erreur dans AppProviders:', error);
    // Fallback simple en cas d'erreur
    return <div style={{color: 'red', padding: '20px'}}>Erreur de chargement: {error?.message}</div>;
  }
};

export default AppProviders;
