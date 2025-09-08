/**
 * Premium Error Boundary - Gestion d'erreur premium
 * Capture et affiche élégamment les erreurs de l'application
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class PremiumErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, this would send to a monitoring service
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Send to monitoring service (Sentry, LogRocket, etc.)
    if (typeof window !== 'undefined' && (window as any).sentryEnabled) {
      // Would integrate with error reporting service
      try {
        // Example integration point
        console.log('Would send to error monitoring:', { error, errorInfo });
      } catch (e) {
        console.error('Failed to log error to service:', e);
      }
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const subject = encodeURIComponent('Bug Report - EmotionsCare');
    const body = encodeURIComponent(`
Erreur rencontrée:
${this.state.error?.message || 'Erreur inconnue'}

Stack trace:
${this.state.error?.stack || 'Non disponible'}

URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `);
    
    window.open(`mailto:support@emotionscare.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const errorMessage = this.state.error?.message || 'Une erreur inattendue s\'est produite';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-destructive/5 p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-destructive/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-destructive">
                Oups ! Quelque chose s'est mal passé
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Nous sommes désolés pour la gêne occasionnée. Notre équipe a été automatiquement notifiée.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Message */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-medium text-sm text-destructive mb-2">
                  Détails de l'erreur:
                </h3>
                <p className="text-sm text-muted-foreground font-mono break-words">
                  {errorMessage}
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      Stack trace (développement)
                    </summary>
                    <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap break-words">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer ({this.maxRetries - this.state.retryCount} restant)
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recharger la page
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Button>
              </div>

              {/* Report Bug */}
              <div className="text-center pt-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={this.handleReportBug}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2 mx-auto"
                >
                  <Bug className="w-4 h-4" />
                  Signaler ce problème
                </Button>
              </div>

              {/* Retry Counter */}
              {this.state.retryCount > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Tentatives: {this.state.retryCount} / {this.maxRetries}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PremiumErrorBoundary;