/**
 * Tests for useMusicGeneration hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMusicGeneration } from '../useMusicGeneration';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

vi.mock('@/lib/logger');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useMusicGeneration', () => {
  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dispatch = vi.fn();
    vi.clearAllMocks();
  });

  it('should return generation functions', () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    expect(result.current.generateMusicForEmotion).toBeDefined();
    expect(result.current.checkGenerationStatus).toBeDefined();
    expect(result.current.getEmotionMusicDescription).toBeDefined();
  });

  it('should get emotion descriptions', () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const description = result.current.getEmotionMusicDescription('calm');
    expect(description).toContain('douce');
    expect(description).toContain('apaisante');
  });

  it('should fallback to calm description for unknown emotions', () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const description = result.current.getEmotionMusicDescription('unknown');
    expect(description).toBeTruthy();
  });

  it('should dispatch GENERATING actions when starting generation', async () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { taskId: 'test-task-id' },
      error: null,
    });

    act(() => {
      result.current.generateMusicForEmotion('calm', 'Test prompt');
    });

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_GENERATING',
      payload: true,
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_GENERATION_ERROR',
      payload: null,
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_GENERATION_PROGRESS',
      payload: 0,
    });
  });

  it('should handle generation errors', async () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: null,
      error: new Error('API Error'),
    });

    await act(async () => {
      const track = await result.current.generateMusicForEmotion('calm');
      expect(track).toBeNull();
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_GENERATION_ERROR',
      payload: expect.any(String),
    });
  });

  it('should use default prompt when none provided', async () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const { supabase } = await import('@/integrations/supabase/client');
    const invokeSpy = vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { taskId: 'test-task-id' },
      error: null,
    });

    act(() => {
      result.current.generateMusicForEmotion('joy');
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(invokeSpy).toHaveBeenCalledWith(
      'suno-music-generation',
      expect.objectContaining({
        body: expect.objectContaining({
          prompt: expect.stringContaining('joy'),
        }),
      })
    );
  });

  it('should check generation status', async () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: {
        status: 'completed',
        audioUrl: 'https://example.com/track.mp3',
        title: 'Generated Track',
        duration: 120,
      },
      error: null,
    });

    await act(async () => {
      const track = await result.current.checkGenerationStatus('test-task-id');

      expect(track).toEqual(
        expect.objectContaining({
          id: 'test-task-id',
          title: 'Generated Track',
          artist: 'Suno AI',
          audioUrl: 'https://example.com/track.mp3',
          isGenerated: true,
        })
      );
    });
  });

  it('should return null for incomplete generation', async () => {
    const { result } = renderHook(() => useMusicGeneration(dispatch));

    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: {
        status: 'processing',
      },
      error: null,
    });

    await act(async () => {
      const track = await result.current.checkGenerationStatus('test-task-id');
      expect(track).toBeNull();
    });
  });

  it('should cleanup on unmount during generation', async () => {
    const { result, unmount } = renderHook(() => useMusicGeneration(dispatch));

    const { supabase } = await import('@/integrations/supabase/client');
    vi.mocked(supabase.functions.invoke).mockResolvedValue({
      data: { taskId: 'test-task-id' },
      error: null,
    });

    act(() => {
      result.current.generateMusicForEmotion('calm');
    });

    unmount();

    // Should have called SET_GENERATING false in finally block
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_GENERATING',
      payload: false,
    });
  });
});
