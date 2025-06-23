
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UniversalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface UniversalErrorBoundaryProps {
  children: React.ReactNode;
}

export class UniversalErrorBoundary extends React.Component<
  UniversalErrorBoundaryProps,
  UniversalErrorBoundaryState
> {
  constructor(props: UniversalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): UniversalErrorBoundaryState {
    console.error('🚨 Universal Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error Details:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log pour le monitoring en production
    if (import.meta.env.PROD) {
      console.log('📊 Would send to monitoring service:', { error, errorInfo });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleResetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-xl">Erreur Application</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                L'application a rencontré une erreur inattendue.
              </p>
              
              {this.state.error && import.meta.env.DEV && (
                <details className="text-xs text-left bg-muted p-3 rounded mt-4">
                  <summary className="cursor-pointer font-medium">
                    Détails techniques (dev uniquement)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.name}: {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button 
                  onClick={this.handleResetError} 
                  variant="outline" 
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button 
                  onClick={this.handleGoHome} 
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </Button>
              </div>
              
              <Button 
                onClick={this.handleReload} 
                variant="secondary"
                className="w-full"
              >
                Recharger l'application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour reset d'erreur programmatique
export const useErrorBoundary = () => {
  const [, setError] = React.useState();
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};
