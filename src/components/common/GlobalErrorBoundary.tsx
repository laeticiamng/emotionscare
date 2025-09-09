import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to monitoring service
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      // Example: Sentry, LogRocket, etc.
      // errorReportingService.captureException(error, {
      //   extra: errorInfo,
      //   tags: { component: 'GlobalErrorBoundary' }
      // });
    }
  };

  const handleReset = () => {
    // Clear any error state
    window.location.reload();
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={handleReset}
      resetKeys={[window.location.pathname]}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;