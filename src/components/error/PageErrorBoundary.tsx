'use client';

import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorView from './ErrorView';
import { useError } from '@/contexts';
import { useUserMode } from '@/contexts/UserModeContext';
import { addErrorBreadcrumb, applyErrorTags } from '@/lib/errors/sentry';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  route?: string;
  feature?: string;
  resetKeys?: React.DependencyList;
  onReset?: () => void;
}

export function PageErrorBoundary({ children, route, feature, resetKeys, onReset }: PageErrorBoundaryProps) {
  const { notify } = useError();
  const { userMode } = useUserMode();

  const handleError = React.useCallback(
    (error: Error, info: { componentStack: string }) => {
      addErrorBreadcrumb('error.boundary.page', { route, feature, componentStack: info.componentStack });
      applyErrorTags({ route, feature_flag: feature, user_mode: userMode ?? 'unknown', boundary: 'page' });
      notify(error, {
        route,
        feature,
        userMode,
        boundary: 'page',
        componentStack: info.componentStack,
      });
    },
    [notify, route, feature, userMode],
  );

  const handleReset = React.useCallback(() => {
    applyErrorTags({ route, feature_flag: feature, user_mode: userMode ?? 'unknown', boundary: 'page:reset' });
    onReset?.();
  }, [route, feature, userMode, onReset]);

  const renderFallback = React.useCallback(
    ({ resetErrorBoundary }: FallbackProps) => (
      <ErrorView type="500" onRetry={resetErrorBoundary} />
    ),
    [],
  );

  return (
    <ErrorBoundary
      onError={handleError}
      onReset={handleReset}
      fallbackRender={renderFallback}
      resetKeys={resetKeys}
    >
      {children}
    </ErrorBoundary>
  );
}
