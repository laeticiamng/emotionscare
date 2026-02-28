/**
 * Tests pour useNotifications
 * Couvre : notify, success, error, warning, info
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

import { useNotifications } from '@/hooks/use-notifications';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('expose les méthodes notify, success, error, warning, info', () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.notify).toBeDefined();
    expect(result.current.success).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.warning).toBeDefined();
    expect(result.current.info).toBeDefined();
  });

  it('notify appelle toast avec le bon variant', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.notify({ title: 'Test', description: 'Hello' });
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test',
        description: 'Hello',
        variant: 'default',
      })
    );
  });

  it('error utilise le variant destructive', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.error({ title: 'Erreur', description: 'Oops' });
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'destructive',
      })
    );
  });

  it('success utilise le variant default', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.success({ title: 'OK' });
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'default',
      })
    );
  });

  it('respecte la durée personnalisée', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.notify({ title: 'Test', duration: 10000 });
    });

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 10000,
      })
    );
  });
});
