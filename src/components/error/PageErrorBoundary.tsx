import React, { ErrorInfo } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorView from './ErrorView';
import { useError } from '@/contexts';
import { useUserMode } from '@/contexts/UserModeContext';
import { addErrorBreadcrumb, applyErrorTags } from '@/lib/errors/sentry';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  route?: string;
  feature?: string;
  resetKeys?: unknown[];
  onReset?: () => void;
}

export function PageErrorBoundary({ children, route, feature, resetKeys, onReset }: PageErrorBoundaryProps) {
  const { notify } = useError();
  const { userMode } = useUserMode();

  const handleError = React.useCallback(
    (error: Error, info: ErrorInfo) => {
      const componentStack = info.componentStack ?? '';
      addErrorBreadcrumb('error.boundary.page', { 
        route, 
        feature, 
        componentStack 
      });
      applyErrorTags({ route, feature_flag: feature, user_mode: userMode ?? 'unknown', boundary: 'page' });
      notify(error, {
        route,
        feature,
        userMode,
        boundary: 'page',
        componentStack,
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
