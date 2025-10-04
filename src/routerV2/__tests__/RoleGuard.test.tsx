// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoleGuard } from '../guards';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/contexts/UserModeContext', () => ({
  useUserMode: vi.fn(),
}));

vi.mock('@/components/ui/loading-animation', () => ({
  default: ({ text }: { text?: string }) => <div data-testid="loading">{text}</div>,
}));

vi.mock('@/lib/routes', () => ({
  routes: {
    auth: {
      login: () => '/auth/login',
    },
    special: {
      forbidden: () => '/403',
    },
  },
}));

import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

describe('RoleGuard', () => {
  const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
  const mockUseUserMode = useUserMode as ReturnType<typeof vi.fn>;
  const TestContent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading States', () => {
    it('should show loading when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: true,
        user: null,
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should show loading when user mode is loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: true,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should show loading when both are loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: true,
        user: null,
      });
      mockUseUserMode.mockReturnValue({
        userMode: null,
        isLoading: true,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });

  describe('Authentication Check', () => {
    it('should redirect to login when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      mockUseUserMode.mockReturnValue({
        userMode: null,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('No Role Requirements', () => {
    it('should render children when no role is required', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'consumer' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard>
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should render children when allowedRoles is empty array', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'employee' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2b_user',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard allowedRoles={[]}>
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Required Role Check', () => {
    it('should render children when user has required role', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'consumer' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect when user does not have required role', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'consumer' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="manager">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should normalize b2c role to consumer', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'b2c' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should normalize b2b_user role to employee', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'b2b_user' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2b_user',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="employee">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should normalize b2b_admin role to manager', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'b2b_admin' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2b_admin',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="manager">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Allowed Roles Check', () => {
    it('should render children when user role is in allowedRoles', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'consumer' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard allowedRoles={['consumer', 'employee']}>
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect when user role is not in allowedRoles', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'consumer' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard allowedRoles={['employee', 'manager']}>
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should handle single role in allowedRoles', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'manager' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2b_admin',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard allowedRoles={['manager']}>
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Role Source Priority', () => {
    it('should use user.role when available', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'manager' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c', // Different from user.role
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="manager">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should use user_metadata.role when user.role is not available', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', user_metadata: { role: 'employee' } },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="employee">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should fallback to userMode when user roles are not available', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null userMode', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: null },
      });
      mockUseUserMode.mockReturnValue({
        userMode: null,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      // Should normalize to consumer by default
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle undefined role', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: undefined,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      // Should normalize to consumer by default
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should normalize org_admin to manager', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'org_admin' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2b_admin',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="manager">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should normalize owner to manager', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'owner' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: 'b2b_admin',
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="manager">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should normalize unknown role to consumer', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '123', role: 'unknown_role' },
      });
      mockUseUserMode.mockReturnValue({
        userMode: null,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <RoleGuard requiredRole="consumer">
            <TestContent />
          </RoleGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });
});
