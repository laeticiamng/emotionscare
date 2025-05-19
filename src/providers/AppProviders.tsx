
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { UserModeProvider } from '@/contexts/UserModeProvider';
import { MusicProvider } from '@/contexts/music/index';
import { OptimizationProvider } from '@/providers/OptimizationProvider';
import { ExtensionsProvider } from '@/providers/ExtensionsProvider';
import { OrchestrationProvider } from '@/contexts/OrchestrationContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SupportProvider } from '@/providers/SupportProvider';
import { DEFAULT_ONBOARDING_STEPS } from '@/data/onboardingSteps';
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
                  <OnboardingProvider steps={DEFAULT_ONBOARDING_STEPS}>
                    <SupportProvider>
                      {children}
                    </SupportProvider>
                  </OnboardingProvider>
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
