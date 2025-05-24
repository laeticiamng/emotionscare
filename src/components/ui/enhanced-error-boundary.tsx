
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface Props {
  children: ReactNode;
  level?: 'page' | 'component' | 'critical';
  showDetails?: boolean;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { level = 'component', showDetails = false } = this.props;

      return (
        <div className="p-6 m-4">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200">
                {level === 'critical' ? 'Erreur critique' : 'Une erreur est survenue'}
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300">
                {level === 'critical' 
                  ? 'L\'application a rencontré une erreur critique.'
                  : 'Cette section a rencontré un problème.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} variant="outline" size="sm">
                  Réessayer
                </Button>
                {level === 'critical' && (
                  <Button onClick={this.handleReload} size="sm">
                    Recharger la page
                  </Button>
                )}
              </div>
              
              {showDetails && this.state.error && (
                <details className="mt-4">
                  <summary className="text-sm font-medium cursor-pointer mb-2">
                    Détails de l'erreur
                  </summary>
                  <pre className="text-xs bg-red-100 dark:bg-red-900/50 p-4 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        <br />
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
