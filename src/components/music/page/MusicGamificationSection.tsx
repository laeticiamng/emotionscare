/**
 * MusicGamificationSection - Section gamification avec lazy loading
 */

import React, { Suspense, lazy } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

const MusicGamificationPanel = lazy(() => import('@/components/gamification/MusicGamificationPanel'));
const QuestsPanel = lazy(() => import('@/components/gamification/QuestsPanel').then(m => ({ default: m.QuestsPanel })));
const LeaderboardPanel = lazy(() => import('@/components/gamification/LeaderboardPanel').then(m => ({ default: m.LeaderboardPanel })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

const ErrorFallback = ({ error: _error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
    <p className="text-sm text-muted-foreground mb-3">Erreur de chargement</p>
    <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
      Réessayer
    </Button>
  </div>
);

export const MusicGamificationSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <MusicGamificationPanel />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <QuestsPanel />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <LeaderboardPanel />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default MusicGamificationSection;
