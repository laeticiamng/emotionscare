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
          className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background via-background to-muted px-6 py-24 text-center"
        >
          <div className="flex w-full max-w-xl flex-col items-center gap-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle aria-hidden className="h-10 w-10 text-destructive" />
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-destructive/70">
                EmotionsCare
              </p>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                Un petit nuage s'est invité
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                Notre équipe est déjà prévenue et travaille à rétablir l'harmonie. Essayez de recharger la page pour reprendre votre parcours.
              </p>
            </div>

            <Button size="lg" onClick={this.handleReload} className="w-full sm:w-auto">
              Recharger l'expérience
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
