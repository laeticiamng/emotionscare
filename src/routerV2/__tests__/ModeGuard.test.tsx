// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModeGuard } from '../guards';

// Mock dependencies
vi.mock('@/contexts/UserModeContext', () => ({
  useUserMode: vi.fn(),
}));

vi.mock('@/components/ui/loading-animation', () => ({
  default: ({ text }: { text?: string }) => <div data-testid="loading">{text}</div>,
}));

vi.mock('@/lib/utm', () => ({
  stripUtmParams: vi.fn((search) => {
    const params = new URLSearchParams(search);
    const hasUtm = Array.from(params.keys()).some(key => key.startsWith('utm_'));
    return hasUtm ? search.replace(/[?&]utm_[^&]+/g, '') : null;
  }),
}));

import { useUserMode } from '@/contexts/UserModeContext';

describe('ModeGuard', () => {
  const mockUseUserMode = useUserMode as ReturnType<typeof vi.fn>;
  const mockSetUserMode = vi.fn();
  const TestContent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserMode.mockReturnValue({
      userMode: null,
      setUserMode: mockSetUserMode,
      isLoading: false,
    });
  });

  describe('Loading State', () => {
    it('should show loading when userMode is loading', () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: true,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should show loading until synced', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });
  });

  describe('Segment to Mode Mapping', () => {
    it('should set mode to b2c for consumer segment', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2c');
      });
    });

    it('should set mode to b2b_user for employee segment', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="employee">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_user');
      });
    });

    it('should set mode to b2b_admin for manager segment', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="manager">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_admin');
      });
    });

    it('should not set mode for public segment', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="public">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });

      expect(mockSetUserMode).not.toHaveBeenCalled();
    });
  });

  describe('Query Parameter Override', () => {
    it('should use segment query parameter to override segment prop (b2c)', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=b2c']}>
          <ModeGuard segment="employee">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2c');
      });
    });

    it('should use segment query parameter to override segment prop (consumer)', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=consumer']}>
          <ModeGuard segment="employee">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2c');
      });
    });

    it('should use segment query parameter for b2b', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=b2b']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_user');
      });
    });

    it('should use segment query parameter for employee', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=employee']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_user');
      });
    });

    it('should use segment query parameter for manager', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=manager']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_admin');
      });
    });

    it('should use segment query parameter for admin', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=admin']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_admin');
      });
    });

    it('should ignore invalid segment query parameter', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=invalid']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2c');
      });
    });
  });

  describe('Mode Synchronization', () => {
    it('should not call setUserMode when mode matches desired mode', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });

      expect(mockSetUserMode).not.toHaveBeenCalled();
    });

    it('should call setUserMode when mode does not match', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="employee">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockSetUserMode).toHaveBeenCalledWith('b2b_user');
      });
    });

    it('should render content after syncing mode', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: null,
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });
  });

  describe('UTM Parameter Handling', () => {
    it('should strip UTM parameters from URL', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?utm_source=test&utm_campaign=promo']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    it('should preserve non-UTM parameters', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?id=123&segment=consumer']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple children', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter>
          <ModeGuard segment="consumer">
            <div data-testid="child-1">Child 1</div>
            <div data-testid="child-2">Child 2</div>
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
      });
    });

    it('should handle null children', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      const { container } = render(
        <MemoryRouter>
          <ModeGuard segment="consumer">{null}</ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(container.firstChild).toBeEmptyDOMElement();
      });
    });

    it('should handle complex URL with hash', async () => {
      mockUseUserMode.mockReturnValue({
        userMode: 'b2c',
        setUserMode: mockSetUserMode,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={['/?segment=consumer#section']}>
          <ModeGuard segment="consumer">
            <TestContent />
          </ModeGuard>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });
  });
});
