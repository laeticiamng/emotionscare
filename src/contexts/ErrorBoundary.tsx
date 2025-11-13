// @ts-nocheck
import React from 'react';
import { captureException } from '@/lib/ai-monitoring';

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

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const GlobalErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetError}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Réessayer
          </button>
          <button
            type="button"
            onClick={handleReload}
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Recharger
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logErrorBreadcrumb(error);

    Sentry.captureException(error, {
      tags: {
        origin: 'app-error-boundary',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  resetError = () => {
    Sentry.addBreadcrumb({
      category: 'error-boundary',
      level: 'info',
      message: 'user:reset',
    });
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return <GlobalErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
