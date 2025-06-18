
import React from 'react';
import { Outlet } from 'react-router-dom';
import ResponsiveShell from '@/components/layout/ResponsiveShell';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { InstantGlowWidget } from '@/components/glow';

/**
 * Shell principal avec layout responsive complet
 * Point 7: Layout & Navigation Core - Shell application responsive
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

  if (!isAuthenticated) {
    return (
      <EnhancedErrorBoundary>
        <SkipToContent />
        <main id="main-content" className="min-h-screen">
          <Outlet />
        </main>
        <InstantGlowWidget />
      </EnhancedErrorBoundary>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <SkipToContent />
      <ResponsiveShell>
        <Outlet />
      </ResponsiveShell>
      <InstantGlowWidget />
    </EnhancedErrorBoundary>
  );
};

export default Shell;
