/**
 * HomePageErrorBoundary - Error boundary spécifique pour la page d'accueil
 * Fournit un fallback gracieux en cas d'erreur
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class HomePageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log l'erreur
    logger.error('[HomePageErrorBoundary] Erreur capturée', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    }, 'ERROR_BOUNDARY');

    this.setState({
      error,
      errorInfo,
    });

    // Envoyer à un service de monitoring (Sentry, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-destructive/20">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Oups ! Une erreur est survenue</CardTitle>
                <CardDescription className="text-base mt-2">
                  Ne vous inquiétez pas, nos équipes ont été notifiées et travaillent déjà sur une solution.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Détails de l'erreur (en développement uniquement) */}
              {import.meta.env.MODE === 'development' && this.state.error && (
                <details className="text-sm bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Détails techniques (dev mode)
                  </summary>
                  <div className="space-y-2 mt-2">
                    <p className="font-mono text-xs break-all text-destructive">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="font-mono text-xs overflow-auto max-h-40 text-muted-foreground">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  size="lg"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Recharger la page
                </Button>
              </div>

              {/* Message d'aide */}
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                <p>Si le problème persiste, contactez-nous à</p>
                <a
                  href="mailto:contact@emotionscare.com"
                  className="text-primary hover:underline font-medium"
                >
                  contact@emotionscare.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HomePageErrorBoundary;
