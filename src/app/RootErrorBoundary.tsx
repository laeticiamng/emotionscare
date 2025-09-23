import React from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RootErrorBoundaryProps {
  readonly children: React.ReactNode;
}

interface RootErrorBoundaryState {
  readonly hasError: boolean;
}

export default class RootErrorBoundary extends React.Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  state: RootErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RootErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const client = Sentry.getCurrentHub().getClient();

    if (client) {
      Sentry.captureException(error, {
        tags: { boundary: 'root-app' },
        extra: { componentStack: info.componentStack },
      });
    } else {
      console.error('[RootErrorBoundary] Unhandled error', error, info);
    }
  }

  private handleReload = () => {
    const client = Sentry.getCurrentHub().getClient();

    if (client) {
      Sentry.addBreadcrumb({
        category: 'ui.action',
        level: 'info',
        message: 'root-error-boundary.reload',
      });

      void Sentry.flush(2000).finally(() => {
        window.location.reload();
      });

      return;
    }

    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          aria-live="assertive"
          className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center"
        >
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle aria-hidden className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Oups ! Une erreur est survenue
              </h1>
              <p className="text-sm text-muted-foreground">
                Quelque chose s'est mal passé. Vous pouvez tenter de recharger la page pour continuer.
              </p>
            </div>
            <Button onClick={this.handleReload} size="lg">
              Recharger
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
