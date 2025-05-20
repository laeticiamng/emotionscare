
import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { UserModeProvider } from '@/contexts/UserModeContext';
import { MusicProvider } from '@/contexts/music/index';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { OptimizationProvider } from '@/providers/OptimizationProvider';
import { ExtensionsProvider } from '@/providers/ExtensionsProvider';
import { OrchestrationProvider } from '@/contexts/OrchestrationContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { SupportProvider } from '@/providers/SupportProvider';
import { CoachContextProvider } from '@/contexts/coach';
import {
  sendMessageHandler,
  analyzeEmotionHandler,
  getRecommendationsHandler
} from '@/services/coach/defaultCoachHandlers';
import { DEFAULT_ONBOARDING_STEPS } from '@/data/onboardingSteps';
import { LayoutProviderProps } from '@/types/layout';
import { Toaster } from '@/components/ui/toaster';

/**
 * Aggregates all global providers used by the application.
 * This helps keeping App.tsx concise and documents the provider order.
 */
const AppProviders: React.FC<LayoutProviderProps> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <UserPreferencesProvider>
        <UserModeProvider>
          <LayoutProvider>
            <MusicProvider>
              <OptimizationProvider>
                <ExtensionsProvider>
                  <OrchestrationProvider>
                    <OnboardingProvider steps={DEFAULT_ONBOARDING_STEPS}>
                      <SupportProvider>
                        <CoachContextProvider
                          handlers={{
                            sendMessageHandler,
                            analyzeEmotionHandler,
                            getRecommendationsHandler
                          }}
                        >
                          {children}
                          <Toaster />
                        </CoachContextProvider>
                      </SupportProvider>
                    </OnboardingProvider>
                  </OrchestrationProvider>
                </ExtensionsProvider>
              </OptimizationProvider>
            </MusicProvider>
          </LayoutProvider>
        </UserModeProvider>
      </UserPreferencesProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default AppProviders;
