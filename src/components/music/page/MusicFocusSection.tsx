/**
 * MusicFocusSection - Sections Focus avec lazy loading
 */

import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const AutoMixPlayer = lazy(() => import('@/components/music/AutoMixPlayer').then(m => ({ default: m.AutoMixPlayer })));
const FocusFlowPlayer = lazy(() => import('@/components/music/FocusFlowPlayer').then(m => ({ default: m.FocusFlowPlayer })));
const CollaborativeSessionLobby = lazy(() => import('@/components/focus/CollaborativeSessionLobby').then(m => ({ default: m.CollaborativeSessionLobby })));
const FocusAnalyticsDashboard = lazy(() => import('@/components/analytics/FocusAnalyticsDashboard').then(m => ({ default: m.FocusAnalyticsDashboard })));
const PushNotificationSetup = lazy(() => import('@/components/notifications/PushNotificationSetup').then(m => ({ default: m.PushNotificationSetup })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

export const MusicFocusSection: React.FC = () => {
  return (
    <>
      {/* AutoMix Section */}
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <AutoMixPlayer />
        </Suspense>
      </div>

      {/* Focus Flow Section */}
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <FocusFlowPlayer />
        </Suspense>
      </div>

      {/* Collaborative Focus Section */}
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <CollaborativeSessionLobby />
        </Suspense>
      </div>

      {/* Focus Analytics Dashboard */}
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <FocusAnalyticsDashboard />
        </Suspense>
      </div>

      {/* Push Notifications */}
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <PushNotificationSetup />
        </Suspense>
      </div>
    </>
  );
};

export default MusicFocusSection;
