
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }
    
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, log to external service like Sentry
    console.error('Production error logged:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId
    });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    // Copy to clipboard for user to report
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    alert('Rapport d\'erreur copié dans le presse-papiers');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Oops! Une erreur s'est produite</CardTitle>
              <CardDescription>
                Quelque chose ne s'est pas passé comme prévu. Nous nous excusons pour ce désagrément.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                <strong>ID d'erreur:</strong> {this.state.errorId}
              </div>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="text-xs bg-destructive/5 p-3 rounded border">
                  <summary className="cursor-pointer font-medium mb-2">
                    Détails techniques
                  </summary>
                  <pre className="whitespace-pre-wrap break-all">
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={this.handleReportError}
                className="w-full"
              >
                <Bug className="w-4 h-4 mr-2" />
                Signaler l'erreur
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
