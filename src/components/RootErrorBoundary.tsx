
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface RootErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface RootErrorBoundaryProps {
  children: React.ReactNode;
}

export class RootErrorBoundary extends React.Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  constructor(props: RootErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    console.error('🚨 Root Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Root Error Details:', error, errorInfo);
    
    // En production, envoyer à un service de monitoring
    if (import.meta.env.PROD) {
      console.log('📊 Would send to monitoring service:', { error, errorInfo });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div data-testid="page-root" className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-xl">Une erreur s'est produite</CardTitle>
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
                    {this.state.error.message}
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
                  onClick={this.handleReload} 
                  className="flex-1"
                >
                  Recharger la page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
