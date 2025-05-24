
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { globalErrorService } from '@/lib/errorBoundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    // Reporter l'erreur au service global
    globalErrorService.reportError(error, 'React Error Boundary');
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Une erreur inattendue s'est produite
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300">
                L'application a rencontré un problème. Vous pouvez essayer de recharger la page 
                ou revenir à l'accueil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} variant="outline" size="sm" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button onClick={this.handleGoHome} size="sm" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Button>
                <Button onClick={this.handleReload} variant="ghost" size="sm" className="w-full">
                  Recharger la page
                </Button>
              </div>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4">
                  <summary className="text-sm font-medium cursor-pointer mb-2 text-red-700 dark:text-red-300">
                    Détails de l'erreur (développement)
                  </summary>
                  <pre className="text-xs bg-red-100 dark:bg-red-900/50 p-4 rounded overflow-auto max-h-32">
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

export default GlobalErrorBoundary;
