import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApiErrorHandler } from '../useApiErrorHandler';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/hooks/use-toast');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useApiErrorHandler', () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it('should handle 401 errors', async () => {
    const { result } = renderHook(() => useApiErrorHandler());

    await act(async () => {
      await result.current.handleError({ status: 401 }, 'auth');
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Session expirée',
        variant: 'destructive',
      })
    );
  });

  it('should handle 403 errors', async () => {
    const { result } = renderHook(() => useApiErrorHandler());

    await act(async () => {
      await result.current.handleError({ status: 403 }, 'permission');
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Accès refusé',
      })
    );
  });

  it('should handle 429 rate limit errors', async () => {
    const { result } = renderHook(() => useApiErrorHandler());

    await act(async () => {
      await result.current.handleError({ status: 429 }, 'rate-limit');
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Trop de requêtes',
      })
    );
  });

  it('should handle 500 server errors', async () => {
    const { result } = renderHook(() => useApiErrorHandler());

    await act(async () => {
      await result.current.handleError({ status: 500 }, 'server');
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Erreur serveur',
      })
    );
  });

  it('should silently log analytics errors', async () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    const { result } = renderHook(() => useApiErrorHandler());

    await act(async () => {
      await result.current.handleError({ status: 404 }, 'analytics');
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });
});
