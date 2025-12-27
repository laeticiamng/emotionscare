/**
 * MusicGamificationSection - Section gamification avec lazy loading
 */

import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const MusicGamificationPanel = lazy(() => import('@/components/gamification/MusicGamificationPanel'));
const QuestsPanel = lazy(() => import('@/components/gamification/QuestsPanel').then(m => ({ default: m.QuestsPanel })));
const LeaderboardPanel = lazy(() => import('@/components/gamification/LeaderboardPanel').then(m => ({ default: m.LeaderboardPanel })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

export const MusicGamificationSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <Suspense fallback={<LoadingFallback />}>
        <MusicGamificationPanel />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <QuestsPanel />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback />}>
        <LeaderboardPanel />
      </Suspense>
    </div>
  );
};

export default MusicGamificationSection;
