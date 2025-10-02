
import React, { Component, ErrorInfo, ReactNode, startTransition } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class UniversalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Error caught by ErrorBoundary', { error, errorInfo }, 'UI');
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  private handleReset = (): void => {
    startTransition(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
      // Recharger la page de manière sécurisée
      window.location.reload();
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>Oops! Quelque chose s'est mal passé</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Une erreur inattendue s'est produite. Nous nous excusons pour la gêne.
              </p>
              
              {this.state.error && (
                <details className="text-xs text-left bg-muted p-3 rounded">
                  <summary className="cursor-pointer font-medium">
                    Détails techniques
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        {'\n\nComponent Stack:'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}
              
              <Button 
                onClick={this.handleReset} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
