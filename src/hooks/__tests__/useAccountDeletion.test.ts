/**
 * Tests pour useAccountDeletion (RGPD - suppression de compte)
 * Couvre : softDelete, undelete, getDaysUntilPurge, canRestore, formatPurgeDate
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock du store
const mockSoftDelete = vi.fn();
const mockUndelete = vi.fn();
const mockSetError = vi.fn();
const mockReset = vi.fn();

let storeState = {
  status: 'active' as const,
  purgeAt: undefined as string | undefined,
  loading: false,
  error: null as string | null,
  softDelete: mockSoftDelete,
  undelete: mockUndelete,
  setError: mockSetError,
  reset: mockReset,
};

vi.mock('@/store/account.store', () => ({
  useAccountStore: () => storeState,
}));

import { useAccountDeletion } from '@/hooks/useAccountDeletion';

describe('useAccountDeletion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeState = {
      status: 'active',
      purgeAt: undefined,
      loading: false,
      error: null,
      softDelete: mockSoftDelete,
      undelete: mockUndelete,
      setError: mockSetError,
      reset: mockReset,
    };
  });

  it('retourne le statut initial actif', () => {
    const { result } = renderHook(() => useAccountDeletion());
    expect(result.current.status).toBe('active');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('getDaysUntilPurge retourne null si pas de purgeAt', () => {
    const { result } = renderHook(() => useAccountDeletion());
    expect(result.current.getDaysUntilPurge()).toBeNull();
  });

  it('getDaysUntilPurge calcule les jours correctement', () => {
    const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    storeState.purgeAt = futureDate.toISOString();

    const { result } = renderHook(() => useAccountDeletion());
    const days = result.current.getDaysUntilPurge();
    expect(days).toBeGreaterThanOrEqual(14);
    expect(days).toBeLessThanOrEqual(16);
  });

  it('getDaysUntilPurge retourne 0 pour date passée', () => {
    storeState.purgeAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { result } = renderHook(() => useAccountDeletion());
    expect(result.current.getDaysUntilPurge()).toBe(0);
  });

  it('canRestore retourne false si pas de purgeAt', () => {
    const { result } = renderHook(() => useAccountDeletion());
    expect(result.current.canRestore()).toBe(false);
  });

  it('canRestore retourne true si date dans le futur', () => {
    storeState.purgeAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();

    const { result } = renderHook(() => useAccountDeletion());
    expect(result.current.canRestore()).toBe(true);
  });

  it('formatPurgeDate retourne null si pas de purgeAt', () => {
    const { result } = renderHook(() => useAccountDeletion());
    expect(result.current.formatPurgeDate()).toBeNull();
  });

  it('formatPurgeDate retourne une date formatée', () => {
    storeState.purgeAt = '2026-03-15T10:00:00Z';

    const { result } = renderHook(() => useAccountDeletion());
    const formatted = result.current.formatPurgeDate();
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });

  it('softDelete appelle store.softDelete', async () => {
    mockSoftDelete.mockResolvedValue(true);

    const { result } = renderHook(() => useAccountDeletion());
    await act(async () => {
      await result.current.softDelete('Test reason');
    });

    expect(mockSoftDelete).toHaveBeenCalledWith('Test reason');
  });

  it('softDelete bloque si hors ligne', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    const { result } = renderHook(() => useAccountDeletion());
    await act(async () => {
      await result.current.softDelete();
    });

    expect(mockSetError).toHaveBeenCalledWith(expect.stringContaining('Hors ligne'));
    expect(mockSoftDelete).not.toHaveBeenCalled();

    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });

  it('undelete appelle store.undelete', async () => {
    mockUndelete.mockResolvedValue(true);

    const { result } = renderHook(() => useAccountDeletion());
    await act(async () => {
      await result.current.undelete();
    });

    expect(mockUndelete).toHaveBeenCalled();
  });
});
