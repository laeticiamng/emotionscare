import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error Boundary critique spécialement conçu pour capturer les erreurs "Cannot read properties of undefined"
 */
export class CriticalErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, context = 'Unknown Component' } = this.props;
    
    // Log détaillé de l'erreur
    console.group(`🚨 Critical Error in ${context}`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    console.groupEnd();

    // Détecter spécifiquement les erreurs "reading add"
    const isReadingAddError = error.message.includes("Cannot read properties of undefined (reading 'add')");
    const isClassListError = error.message.includes('classList');
    const isCollectionError = error.message.includes('add');

    if (isReadingAddError || isClassListError || isCollectionError) {
      console.error('🎯 DETECTED: "Cannot read properties of undefined (reading \'add\')" error');
      console.error('Context:', context);
      console.error('Component Stack:', errorInfo.componentStack);
      
      // En développement, essayer de donner plus d'informations
      if (process.env.NODE_ENV === 'development') {
        console.warn('💡 Suggestions de debug:');
        console.warn('1. Vérifier que tous les Sets/Maps sont initialisés');
        console.warn('2. Utiliser les helpers safe-helpers.ts');
        console.warn('3. Vérifier que les éléments DOM existent avant d\'utiliser classList');
        console.warn('4. Valider les props avec Zod avant utilisation');
      }
    }

    // Mettre à jour l'état avec les informations d'erreur
    this.setState({
      errorInfo
    });

    // Appeler le callback d'erreur personnalisé
    if (onError) {
      onError(error, errorInfo);
    }

    // Reporter l'erreur à un service de monitoring si disponible
    this.reportError(error, errorInfo, context);
  }

  private reportError(error: Error, errorInfo: ErrorInfo, context?: string) {
    try {
      if (Sentry.getCurrentHub().getClient()) {
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack
            }
          },
          tags: {
            errorBoundary: context || 'CriticalErrorBoundary',
            feature: 'error-boundary',
            errorType: error.message.includes("reading 'add'") ? 'reading_add' : 'unknown'
          },
          extra: {
            errorInfo,
            retryCount: this.retryCount
          }
        });
      }

      // Log local pour développement
      const errorReport = {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        errorInfo,
        context,
        timestamp: new Date().toISOString(),
        retryCount: this.retryCount,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      localStorage.setItem(
        `error_${this.state.errorId}`,
        JSON.stringify(errorReport)
      );

    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private handleReset = () => {
    this.retryCount += 1;
    
    if (this.retryCount > this.maxRetries) {
      console.warn(`Max retries (${this.maxRetries}) reached, redirecting to home`);
      window.location.href = '/';
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;
      const { error } = this.state;

      // Si un composant de fallback personnalisé est fourni
      if (FallbackComponent && error) {
        return <FallbackComponent error={error} resetError={this.handleReset} />;
      }

      // Interface d'erreur par défaut optimisée pour les erreurs critiques
      const isReadingAddError = error?.message.includes("Cannot read properties of undefined (reading 'add')");

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-card rounded-lg border shadow-lg p-6 text-center space-y-4">
            <div className="flex justify-center">
              {isReadingAddError ? (
                <Bug className="h-16 w-16 text-destructive" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-destructive" />
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-card-foreground">
                {isReadingAddError ? 'Erreur de composant détectée' : 'Une erreur inattendue s\'est produite'}
              </h1>
              
              {isReadingAddError && (
                <div className="p-3 bg-destructive/10 rounded-md text-sm text-left">
                  <p className="font-medium text-destructive">Erreur "Cannot read properties of undefined"</p>
                  <p className="text-muted-foreground mt-1">
                    Un composant a tenté d'utiliser une méthode sur un objet non initialisé.
                    Cette erreur a été capturée pour éviter un crash total.
                  </p>
                </div>
              )}
              
              {process.env.NODE_ENV === 'development' && error && (
                <details className="text-left text-xs bg-muted p-3 rounded mt-4">
                  <summary className="cursor-pointer font-medium">Détails techniques (dev)</summary>
                  <pre className="mt-2 overflow-auto">
                    <code>{error.message}</code>
                  </pre>
                  {error.stack && (
                    <pre className="mt-2 overflow-auto text-xs">
                      <code>{error.stack}</code>
                    </pre>
                  )}
                </details>
              )}
            </div>
            
            <div className="space-y-3">
              {this.retryCount < this.maxRetries && (
                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réessayer ({this.maxRetries - this.retryCount} tentatives restantes)
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Recharger la page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors"
              >
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </button>
            </div>
            
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground">
                ID d'erreur: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CriticalErrorBoundary;