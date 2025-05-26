
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OptimizedErrorBoundary from '../ErrorBoundary/OptimizedErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('OptimizedErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <OptimizedErrorBoundary>
        <ThrowError shouldThrow={false} />
      </OptimizedErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <OptimizedErrorBoundary>
        <ThrowError shouldThrow={true} />
      </OptimizedErrorBoundary>
    );

    expect(screen.getByText("Oops! Quelque chose s'est mal passé")).toBeInTheDocument();
    expect(screen.getByText('Réessayer')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fallback = <div>Custom error message</div>;

    render(
      <OptimizedErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </OptimizedErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
