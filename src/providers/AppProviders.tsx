import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/music/index';
import { OptimizationProvider } from '@/providers/OptimizationProvider';
import { ExtensionsProvider } from '@/providers/ExtensionsProvider';
import { OrchestrationProvider } from '@/contexts/OrchestrationContext';
import { LayoutProviderProps } from '@/types/layout';

/**
 * Aggregates all global providers used by the application.
 * This helps keeping App.tsx concise and documents the provider order.
 */
const AppProviders: React.FC<LayoutProviderProps> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <UserPreferencesProvider>
        <UserModeProvider>
          <MusicProvider>
            <OptimizationProvider>
              <ExtensionsProvider>
                <OrchestrationProvider>
                  {children}
                </OrchestrationProvider>
              </ExtensionsProvider>
            </OptimizationProvider>
          </MusicProvider>
        </UserModeProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default AppProviders;
