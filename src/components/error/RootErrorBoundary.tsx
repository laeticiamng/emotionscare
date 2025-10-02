'use client';

import React from 'react';
import * as Sentry from '@sentry/react';
import ErrorView from './ErrorView';

interface RootErrorBoundaryState {
  hasError: boolean;
}

interface RootErrorBoundaryProps {
  children: React.ReactNode;
}

export default class RootErrorBoundary extends React.Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RootErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (Sentry.getCurrentHub().getClient()) {
      Sentry.captureException(error, {
        tags: { boundary: 'root' },
        extra: { componentStack: info.componentStack },
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorView type="500" onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
