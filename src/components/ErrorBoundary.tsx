
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          borderRadius: '8px',
          border: '1px solid #EF4444', 
          backgroundColor: '#FEF2F2',
          color: '#B91C1C'
        }}>
          <h1 style={{ margin: '0 0 16px 0' }}>Une erreur est survenue</h1>
          <p>L'application a rencontré une erreur inattendue.</p>
          
          <details style={{ 
            marginTop: '16px', 
            padding: '12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}>
            <summary style={{ 
              fontWeight: 'bold', 
              cursor: 'pointer',
              marginBottom: '8px'
            }}>
              Détails techniques
            </summary>
            <p style={{ fontFamily: 'monospace', margin: '8px 0' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <pre style={{ 
              padding: '12px',
              overflow: 'auto',
              backgroundColor: '#F3F4F6',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
