/**
 * RootProvider Optimisé
 *
 * AVANT: 15 niveaux de providers
 * APRÈS: 8 niveaux de providers
 *
 * Changements:
 * - ErrorProvider fusionné avec RootErrorBoundary
 * - MoodProvider → Zustand store (déjà existe)
 * - MusicProvider → Zustand store (déjà existe)
 * - UnifiedProvider → Supprimé (vide)
 * - TooltipProvider → Décentralisé (composant local)
 * - NotificationProvider → Simplifié
 * - UserModeProvider → Fusionné avec AuthProvider
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/sonner';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import RootErrorBoundary from '@/components/error/RootErrorBoundary';
import { ConsentProvider } from '@/features/clinical-optin/ConsentProvider';
import { I18nProvider } from '@/lib/i18n/i18n';
import { ThemeProvider } from '@/providers/theme';
import { PolicyAcceptanceModal } from '@/components/gdpr/PolicyAcceptanceModal';
import AccessibilitySkipLinks from '@/components/AccessibilitySkipLinks';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false, // Performance optimization
      },
    },
  });

interface RootProviderProps {
  children: React.ReactNode;
}

/**
 * Architecture Optimisée des Providers
 *
 * Niveau 1: HelmetProvider (React Helmet Async)
 * Niveau 2: RootErrorBoundary (Error catching global)
 * Niveau 3: QueryClientProvider (React Query)
 * Niveau 4: AuthProvider (Auth + UserMode fusionnés)
 * Niveau 5: I18nProvider (Internationalisation)
 * Niveau 6: ConsentProvider (RGPD/Clinical)
 * Niveau 7: AccessibilityProvider (a11y settings)
 * Niveau 8: ThemeProvider (Dark/Light mode)
 *
 * SUPPRIMÉS:
 * - ErrorProvider (fusionné dans RootErrorBoundary)
 * - MoodProvider (→ useMoodStore Zustand)
 * - MusicProvider (→ useMusicStore Zustand)
 * - UnifiedProvider (vide, inutile)
 * - TooltipProvider (→ local au composant)
 * - NotificationProvider (→ Toaster suffit)
 * - UserModeProvider (→ fusionné dans AuthProvider)
 */
export function RootProviderOptimized({ children }: RootProviderProps) {
  const [queryClient] = React.useState(createQueryClient);

  return (
    <HelmetProvider>
      <RootErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <I18nProvider>
              <ConsentProvider>
                <AccessibilityProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    storageKey="emotionscare-theme"
                    themes={['light', 'dark', 'system']}
                  >
                    <AccessibilitySkipLinks />
                    {children}
                    <Toaster />
                    <PolicyAcceptanceModal />
                  </ThemeProvider>
                </AccessibilityProvider>
              </ConsentProvider>
            </I18nProvider>
          </AuthProvider>
        </QueryClientProvider>
      </RootErrorBoundary>
    </HelmetProvider>
  );
}

export default RootProviderOptimized;

/**
 * MIGRATION GUIDE
 *
 * 1. Components utilisant MoodProvider:
 *    AVANT: const { mood } = useMood();
 *    APRÈS:  const mood = useMoodStore(state => state.mood);
 *
 * 2. Components utilisant MusicProvider:
 *    AVANT: const { currentTrack } = useMusic();
 *    APRÈS:  const currentTrack = useMusicStore(state => state.currentTrack);
 *
 * 3. Components utilisant UserModeProvider:
 *    AVANT: const { mode } = useUserMode();
 *    APRÈS:  const { mode } = useAuth(); // mode intégré dans auth
 *
 * 4. TooltipProvider:
 *    Ajouter <TooltipProvider> localement dans les composants qui en ont besoin
 *    (au lieu de global)
 *
 * 5. ErrorProvider:
 *    Les erreurs sont maintenant catchées automatiquement par RootErrorBoundary
 *    Utiliser directement: throw new Error('message')
 */
