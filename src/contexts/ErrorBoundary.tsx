import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const logErrorBreadcrumb = (error: Error) => {
  Sentry.addBreadcrumb({
    category: 'error-boundary',
    level: 'error',
    message: 'error:boundary',
    data: {
      name: error.name,
      message: error.message,
    },
  });
};

const handleReload = () => {
  Sentry.addBreadcrumb({
    category: 'error-boundary',
    level: 'info',
    message: 'user:reload',
  });

  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

const GlobalErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  React.useEffect(() => {
    if (error) {
      Sentry.addBreadcrumb({
        category: 'error-boundary',
        level: 'info',
        message: 'error:boundary:fallback-shown',
        data: {
          name: error.name,
        },
      });
    }
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center"
    >
      <div className="max-w-md space-y-4 rounded-xl border bg-card p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-foreground">
          Oups, quelque chose s&apos;est mal passé
        </h1>
        <p className="text-sm text-muted-foreground">
          Une erreur inattendue est survenue. Notre équipe a été notifiée — vous pouvez tenter de recharger
          la page pour continuer votre expérience.
        </p>
        <button
          type="button"
          onClick={handleReload}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Recharger
        </button>
      </div>
    </div>
  );
};

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const handleError = React.useCallback((error: Error, info: { componentStack: string }) => {
    logErrorBreadcrumb(error);

    Sentry.captureException(error, {
      tags: {
        origin: 'app-error-boundary',
      },
      extra: {
        componentStack: info.componentStack,
      },
    });
  }, []);

  const handleReset = React.useCallback(() => {
    Sentry.addBreadcrumb({
      category: 'error-boundary',
      level: 'info',
      message: 'user:reset',
    });
  }, []);

  return (
    <ReactErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}
