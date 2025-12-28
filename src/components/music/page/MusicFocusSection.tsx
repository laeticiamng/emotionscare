/**
 * MusicFocusSection - Sections Focus avec lazy loading et ErrorBoundary
 */

import React, { Suspense, lazy } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from 'react-error-boundary';

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

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentName: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary, componentName }) => (
  <Card className="border-destructive/50">
    <CardContent className="py-6 text-center">
      <AlertCircle className="h-8 w-8 mx-auto mb-3 text-destructive" />
      <p className="font-medium mb-1">Erreur de chargement: {componentName}</p>
      <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Réessayer
      </Button>
    </CardContent>
  </Card>
);

export const MusicFocusSection: React.FC = () => {
  return (
    <>
      {/* AutoMix Section */}
      <div className="max-w-4xl mx-auto">
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} componentName="AutoMix" />
        )}>
          <Suspense fallback={<LoadingFallback />}>
            <AutoMixPlayer />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Focus Flow Section */}
      <div className="max-w-4xl mx-auto">
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} componentName="Focus Flow" />
        )}>
          <Suspense fallback={<LoadingFallback />}>
            <FocusFlowPlayer />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Collaborative Focus Section */}
      <div className="max-w-6xl mx-auto">
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} componentName="Session Collaborative" />
        )}>
          <Suspense fallback={<LoadingFallback />}>
            <CollaborativeSessionLobby />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Focus Analytics Dashboard */}
      <div className="max-w-6xl mx-auto">
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} componentName="Analytics" />
        )}>
          <Suspense fallback={<LoadingFallback />}>
            <FocusAnalyticsDashboard />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Push Notifications */}
      <div className="max-w-4xl mx-auto">
        <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} componentName="Notifications" />
        )}>
          <Suspense fallback={<LoadingFallback />}>
            <PushNotificationSetup />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default MusicFocusSection;
