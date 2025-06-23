
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

/**
 * Shell principal avec layout responsive et gestion d'erreurs robuste
 * Garantit qu'aucune page ne sera jamais complètement blanche
 */
const Shell: React.FC = () => {
  console.log('Shell component is rendering'); // Debug log
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: modeLoading } = useUserMode();

  console.log('Shell state:', { isAuthenticated, authLoading, modeLoading }); // Debug log

  // Affichage du loader pendant les vérifications d'authentification
  if (authLoading || modeLoading) {
    console.log('Shell: showing loading state'); // Debug log
    return (
      <div data-testid="page-root" className="flex h-screen items-center justify-center bg-background">
        <LoadingAnimation text="Initialisation..." />
      </div>
    );
  }

  console.log('Shell: rendering main content'); // Debug log

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
    </EnhancedErrorBoundary>
  );
};

export default Shell;
