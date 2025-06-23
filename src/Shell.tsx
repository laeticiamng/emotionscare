
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { InstantGlowWidget } from '@/components/glow';

/**
 * Shell principal avec layout responsive complet
 */
const Shell: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: modeLoading } = useUserMode();

  if (authLoading || modeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement..." />
      </div>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <SkipToContent />
      <div className="min-h-screen">
        <main id="main-content">
          <Outlet />
        </main>
      </div>
      <InstantGlowWidget />
    </EnhancedErrorBoundary>
  );
};

export default Shell;
