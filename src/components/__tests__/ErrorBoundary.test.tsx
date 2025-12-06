// @ts-nocheck

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UniversalErrorBoundary } from '../ErrorBoundary/UniversalErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('UniversalErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <UniversalErrorBoundary>
        <ThrowError shouldThrow={false} />
      </UniversalErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <UniversalErrorBoundary>
        <ThrowError shouldThrow={true} />
      </UniversalErrorBoundary>
    );

    expect(screen.getByText("Oops! Quelque chose s'est mal passé")).toBeInTheDocument();
    expect(screen.getByText('Réessayer')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fallback = <div>Custom error message</div>;

    render(
      <UniversalErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </UniversalErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
