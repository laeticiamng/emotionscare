
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  level?: 'critical' | 'warning';
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-2xl font-bold text-destructive">
              Une erreur s'est produite
            </h2>
            <p className="text-muted-foreground">
              L'application a rencontré un problème inattendu.
            </p>
            {this.props.showDetails && this.state.error && (
              <details className="text-sm text-left bg-muted p-4 rounded">
                <summary>Détails de l'erreur</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button onClick={() => window.location.reload()}>
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
