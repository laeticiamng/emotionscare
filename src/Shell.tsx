
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { InstantGlowWidget } from '@/components/glow';

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
        {/* Widget Instant Glow pour les utilisateurs non connectés */}
        <InstantGlowWidget />
      </EnhancedErrorBoundary>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <SkipToContent />
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main id="main-content" className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
        {/* Widget Instant Glow flottant */}
        <InstantGlowWidget />
      </div>
    </EnhancedErrorBoundary>
  );
};

export default Shell;
