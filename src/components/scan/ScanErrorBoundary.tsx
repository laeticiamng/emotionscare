import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary spécifique pour les composants de scan émotionnel
 *
 * Capture les erreurs React et affiche un fallback UI approprié
 * avec possibilité de retry.
 *
 * @example
 * ```tsx
 * <ScanErrorBoundary onError={(error) => logger.error(error)}>
 *   <EmotionScanner />
 * </ScanErrorBoundary>
 * ```
 */
export class ScanErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur
    console.error('[ScanErrorBoundary] Error caught:', error, errorInfo);

    // Appeler le callback si fourni
    this.props.onError?.(error, errorInfo);

    // Sauvegarder les infos d'erreur
    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Si un fallback custom est fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback par défaut
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold mb-2">
              Erreur lors du scan émotionnel
            </AlertTitle>
            <AlertDescription className="space-y-4">
              <p className="text-sm">
                Une erreur s'est produite lors de l'analyse de vos émotions.
                Cela peut être dû à un problème temporaire.
              </p>

              {this.state.error && (
                <details className="text-xs bg-destructive/10 p-3 rounded">
                  <summary className="cursor-pointer font-medium mb-2">
                    Détails techniques
                  </summary>
                  <pre className="overflow-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Réessayer
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Recharger la page
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook pour utiliser l'ErrorBoundary de manière fonctionnelle
 *
 * @example
 * ```tsx
 * function MyScanComponent() {
 *   const { resetError } = useScanErrorHandler();
 *   // ...
 * }
 * ```
 */
export function useScanErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error('[ScanErrorHandler]', error);
  }, []);

  return {
    error,
    resetError,
    handleError,
    hasError: error !== null,
  };
}
