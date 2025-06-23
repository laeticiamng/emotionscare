
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import InstantGlowWidget from '@/components/glow/InstantGlowWidget';

/**
 * Shell principal avec layout responsive et gestion d'erreurs robuste
 * Garantit qu'aucune page ne sera jamais complètement blanche
 */
const Shell: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: modeLoading } = useUserMode();

  // Affichage du loader pendant les vérifications d'authentification
  if (authLoading || modeLoading) {
    return (
      <div data-testid="page-root" className="flex h-screen items-center justify-center bg-background">
        <LoadingAnimation text="Initialisation..." />
      </div>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <SkipToContent />
      <div className="min-h-screen bg-background text-foreground">
        <main id="main-content" className="min-h-screen">
          <EnhancedErrorBoundary>
            <div data-testid="page-root">
              <Outlet />
            </div>
          </EnhancedErrorBoundary>
        </main>
      </div>
      <InstantGlowWidget />
    </EnhancedErrorBoundary>
  );
};

export default Shell;
