import React, { Component, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';
import { logger } from '@/lib/logger';
import { Sentry } from '@/lib/errors/sentry-compat';
import { analytics } from '@/lib/analytics';

interface Props {
  children: ReactNode;
  /** Nom du composant pour le tracking */
  componentName?: string;
  /** Callback personnalisé en cas d'erreur */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Générer un ID unique pour l'erreur
    const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Log error to monitoring service
    logger.error('Global Error Boundary caught an error', { error, errorInfo, errorId });

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Appeler le callback personnalisé si fourni
    this.props.onError?.(error, errorInfo);

    // Track l'erreur dans analytics
    analytics.track('error_boundary_triggered', {
      error_name: error.name,
      error_message: error.message,
      error_id: errorId,
      component_name: this.props.componentName || 'GlobalErrorBoundary',
      page_path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });

    // Envoyer à Sentry
    Sentry.withScope((scope) => {
      scope.setTag('error_boundary', this.props.componentName || 'GlobalErrorBoundary');
      scope.setTag('error_id', errorId);
      scope.setExtra('componentStack', errorInfo.componentStack);
      scope.setLevel('error');
      Sentry.captureException(error);
    });
  }

  handleReset = () => {
    // Track la tentative de récupération
    analytics.track('custom_event', {
      event_category: 'error_recovery',
      event_name: 'error_boundary_reset',
      error_id: this.state.errorId,
      component_name: this.props.componentName || 'GlobalErrorBoundary',
    });

    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;