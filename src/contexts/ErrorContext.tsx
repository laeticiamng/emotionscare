import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// Types d'erreurs
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError {
  id: string;
  message: string;
  code?: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
  recovered?: boolean;
}

export interface ErrorContextType {
  errors: AppError[];
  addError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
  criticalErrors: AppError[];
}

// Context
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Provider
export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [errors, setErrors] = React.useState<AppError[]>([]);

  const addError = React.useCallback((errorData: Omit<AppError, 'id' | 'timestamp'>) => {
    const error: AppError = {
      ...errorData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setErrors(prev => [error, ...prev.slice(0, 99)]); // Garder max 100 erreurs

    // Afficher les erreurs importantes via toast
    if (error.severity === 'high' || error.severity === 'critical') {
      toast({
        title: "Erreur système",
        description: error.message,
        variant: "destructive",
      });
    }

    // Logger l'erreur
    console.error('App Error:', error);

    // Envoyer à un service de monitoring en production
    if (import.meta.env.PROD) {
      // Sentry, LogRocket, etc.
      // sendErrorToService(error);
    }
  }, []);

  const removeError = React.useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;
  const criticalErrors = errors.filter(error => error.severity === 'critical');

  // Handler d'erreurs globales
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addError({
        message: event.message,
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        stack: event.error?.stack,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        severity: 'high',
        context: {
          reason: event.reason,
        },
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [addError]);

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors,
    criticalErrors,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Hook
export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};

// HOC pour capturer les erreurs de composants
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} ref={ref} />
      </ErrorBoundary>
    );
  });
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: React.ComponentType<{ error: Error; resetError: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback;
      if (Fallback) {
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-4">
              Une erreur est survenue
            </h2>
            <p className="text-red-700 mb-4">
              {this.state.error.message}
            </p>
            <button
              onClick={this.resetError}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}