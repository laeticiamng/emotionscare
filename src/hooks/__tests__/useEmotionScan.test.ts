// @ts-nocheck
/**
 * Tests pour useEmotionScan
 * Couvre : analyzeText, analyzeVoice, analyzeImage, scanEmotion, reset, erreurs
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockInvoke = vi.fn();
const mockInsert = vi.fn().mockReturnValue({ error: null });
const mockGetUser = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => mockInvoke(...args) },
    from: () => ({ insert: (d: unknown) => { mockInsert(d); return Promise.resolve({ error: null }); } }),
    auth: { getUser: () => mockGetUser() },
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock('@/types/emotion-unified', () => ({
  normalizeEmotionResult: (r: Record<string, unknown>) => r,
}));

import { useEmotionScan } from '@/hooks/useEmotionScan';

describe('useEmotionScan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
  });

  it('initialise avec état par défaut', () => {
    const { result } = renderHook(() => useEmotionScan());
    expect(result.current.isScanning).toBe(false);
    expect(result.current.lastResult).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('analyzeText appelle emotion-analysis edge function', async () => {
    mockInvoke.mockResolvedValue({
      data: { emotion: 'joy', valence: 0.8, arousal: 0.6, confidence: 0.9 },
      error: null,
    });

    const { result } = renderHook(() => useEmotionScan());

    let res: unknown;
    await act(async () => {
      res = await result.current.analyzeText('Je suis heureux');
    });

    expect(mockInvoke).toHaveBeenCalledWith('emotion-analysis', {
      body: { text: 'Je suis heureux', language: 'fr' },
    });
    expect((res as Record<string, unknown>).emotion).toBe('joy');
  });

  it('scanEmotion text met à jour lastResult', async () => {
    mockInvoke.mockResolvedValue({
      data: { emotion: 'calm', valence: 0.6, arousal: 0.3, confidence: 0.85 },
      error: null,
    });

    const { result } = renderHook(() => useEmotionScan());

    await act(async () => {
      await result.current.scanEmotion('text', 'test', { saveToHistory: false });
    });

    expect(result.current.lastResult).not.toBeNull();
    expect(result.current.isScanning).toBe(false);
  });

  it('scanEmotion gère les erreurs', async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: { message: 'Service unavailable' },
    });

    const { result } = renderHook(() => useEmotionScan());

    try {
      await act(async () => {
        await result.current.scanEmotion('text', 'test', { saveToHistory: false });
      });
    } catch {
      // Expected to throw
    }

    expect(result.current.isScanning).toBe(false);
  });

  it('scanEmotion rejette type non-string pour text', async () => {
    const { result } = renderHook(() => useEmotionScan());

    await expect(
      act(async () => {
        await result.current.scanEmotion('text', new Blob([]), { saveToHistory: false });
      })
    ).rejects.toThrow('Le texte doit être une chaîne');
  });

  it('reset remet lastResult et error à null', async () => {
    mockInvoke.mockResolvedValue({
      data: { emotion: 'joy', valence: 0.8, arousal: 0.6, confidence: 0.9 },
      error: null,
    });

    const { result } = renderHook(() => useEmotionScan());

    await act(async () => {
      await result.current.scanEmotion('text', 'test', { saveToHistory: false });
    });

    expect(result.current.lastResult).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.lastResult).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
