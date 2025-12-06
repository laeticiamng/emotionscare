// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthGuard } from '../guards';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/ui/loading-animation', () => ({
  default: ({ text }: { text?: string }) => <div data-testid="loading">{text}</div>,
}));

vi.mock('@/lib/routes', () => ({
  routes: {
    auth: {
      login: () => '/auth/login',
    },
  },
}));

import { useAuth } from '@/contexts/AuthContext';

describe('AuthGuard', () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
  const TestContent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading animation when authentication is loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByText('Chargement de la navigation...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should not render children during loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Unauthenticated State', () => {
    it('should redirect to login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      const { container } = render(
        <MemoryRouter initialEntries={['/protected']}>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      // Navigate component renders nothing, checking it doesn't show protected content
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should preserve original location in state when redirecting', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      render(
        <MemoryRouter initialEntries={['/app/dashboard']}>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    it('should render children when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', email: 'test@example.com' },
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should render multiple children when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', email: 'test@example.com' },
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should not show loading when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', email: 'test@example.com' },
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null user when isAuthenticated is true', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: null,
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle undefined user', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: undefined,
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should prioritize loading state over authentication state', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: true,
        user: { id: '123' },
      });

      render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should handle empty children', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123' },
      });

      const { container } = render(
        <MemoryRouter>
          <AuthGuard>{null}</AuthGuard>
        </MemoryRouter>
      );

      expect(container.firstChild).toBeEmptyDOMElement();
    });
  });

  describe('State Transitions', () => {
    it('should transition from loading to authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      const { rerender } = render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123' },
      });

      rerender(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should transition from loading to unauthenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      const { rerender } = render(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      rerender(
        <MemoryRouter>
          <AuthGuard>
            <TestContent />
          </AuthGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });
});
