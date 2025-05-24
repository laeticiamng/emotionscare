
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'critical';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, level = 'component' } = this.props;
    
    // Log error details
    console.error(`[${level.toUpperCase()}] Error Boundary caught an error:`, {
      error,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to monitoring service (Sentry, etc.)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        },
        tags: {
          errorBoundary: level,
          errorId: this.state.errorId
        }
      });
    }
  }

  handleRetry = (): void => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleReportError = (): void => {
    const { error, errorInfo, errorId } = this.state;
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Copy to clipboard for user to share
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Rapport d\'erreur copié dans le presse-papiers');
      })
      .catch(() => {
        alert('Impossible de copier le rapport d\'erreur');
      });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, errorId, retryCount } = this.state;
    const { children, fallback, showDetails = false, level = 'component' } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      const canRetry = retryCount < this.maxRetries;
      const isPageLevel = level === 'page';
      const isCritical = level === 'critical';

      return (
        <div className={`error-boundary ${level} p-4 ${isPageLevel ? 'min-h-screen flex items-center justify-center' : ''}`}>
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-8 w-8 ${isCritical ? 'text-destructive' : 'text-orange-500'}`} />
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Oops! Une erreur est survenue
                    <Badge variant={isCritical ? 'destructive' : 'secondary'}>
                      {level}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {isCritical 
                      ? 'Une erreur critique empêche le fonctionnement de l\'application'
                      : 'Un problème est survenu dans cette section'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>ID d'erreur: <code className="bg-muted px-1 rounded">{errorId}</code></p>
                <p>Tentatives: {retryCount}/{this.maxRetries}</p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="font-medium text-sm text-destructive">
                    {error.message}
                  </p>
                </div>
              )}

              {showDetails && error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Détails techniques
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                    {errorInfo && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs font-medium mb-1">Component Stack:</p>
                        <pre className="text-xs overflow-auto whitespace-pre-wrap">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {canRetry && (
                  <Button onClick={this.handleRetry} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Réessayer
                  </Button>
                )}
                
                {isPageLevel && (
                  <Button variant="outline" onClick={this.handleGoHome}>
                    <Home className="h-4 w-4 mr-2" />
                    Accueil
                  </Button>
                )}
                
                <Button variant="outline" onClick={this.handleReload}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recharger
                </Button>
                
                <Button variant="ghost" size="sm" onClick={this.handleReportError}>
                  <Bug className="h-4 w-4 mr-2" />
                  Signaler
                </Button>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                <p>
                  Si le problème persiste, veuillez contacter notre support avec l'ID d'erreur.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

export default EnhancedErrorBoundary;
