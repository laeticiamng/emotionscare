import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMeditationMachine } from '../useMeditationMachine';
import { meditationService } from '../meditationService';

vi.mock('../meditationService');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('useMeditationMachine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('démarre dans l\'état idle', () => {
    const { result } = renderHook(() => useMeditationMachine());

    expect(result.current.state).toBe('idle');
    expect(result.current.session).toBeNull();
    expect(result.current.config).toBeNull();
  });

  it('définit la configuration correctement', () => {
    const { result } = renderHook(() => useMeditationMachine());
    const config = {
      technique: 'mindfulness' as const,
      duration: 10,
      withGuidance: true,
      withMusic: true,
      volume: 50,
    };

    act(() => {
      result.current.setConfig(config);
    });

    expect(result.current.config).toEqual(config);
  });

  it('démarre une session avec succès', async () => {
    const mockSession = {
      id: 'test-id',
      userId: 'user-id',
      technique: 'mindfulness' as const,
      duration: 600,
      completedDuration: 0,
      moodBefore: 50,
      moodAfter: null,
      moodDelta: null,
      withGuidance: true,
      withMusic: true,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    vi.mocked(meditationService.createSession).mockResolvedValue(mockSession);

    const { result } = renderHook(() => useMeditationMachine());

    act(() => {
      result.current.setConfig({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });
    });

    await act(async () => {
      await result.current.startSession(50);
    });

    await waitFor(() => {
      expect(result.current.state).toBe('active');
      expect(result.current.session).toEqual(mockSession);
    });
  });

  it('met en pause et reprend une session', async () => {
    const mockSession = {
      id: 'test-id',
      userId: 'user-id',
      technique: 'mindfulness' as const,
      duration: 600,
      completedDuration: 0,
      moodBefore: 50,
      moodAfter: null,
      moodDelta: null,
      withGuidance: true,
      withMusic: true,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    vi.mocked(meditationService.createSession).mockResolvedValue(mockSession);

    const { result } = renderHook(() => useMeditationMachine());

    act(() => {
      result.current.setConfig({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });
    });

    await act(async () => {
      await result.current.startSession(50);
    });

    act(() => {
      result.current.pauseSession();
    });

    expect(result.current.state).toBe('paused');

    act(() => {
      result.current.resumeSession();
    });

    expect(result.current.state).toBe('active');
  });

  it('complète une session avec succès', async () => {
    const mockSession = {
      id: 'test-id',
      userId: 'user-id',
      technique: 'mindfulness' as const,
      duration: 600,
      completedDuration: 0,
      moodBefore: 50,
      moodAfter: null,
      moodDelta: null,
      withGuidance: true,
      withMusic: true,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    const completedSession = {
      ...mockSession,
      completedDuration: 580,
      moodAfter: 70,
      moodDelta: 20,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    vi.mocked(meditationService.createSession).mockResolvedValue(mockSession);
    vi.mocked(meditationService.completeSession).mockResolvedValue(completedSession);

    const { result } = renderHook(() => useMeditationMachine());

    act(() => {
      result.current.setConfig({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });
    });

    await act(async () => {
      await result.current.startSession(50);
    });

    await act(async () => {
      await result.current.completeSession(70);
    });

    await waitFor(() => {
      expect(result.current.state).toBe('success');
      expect(result.current.session?.completed).toBe(true);
    });
  });

  it('annule une session', async () => {
    const mockSession = {
      id: 'test-id',
      userId: 'user-id',
      technique: 'mindfulness' as const,
      duration: 600,
      completedDuration: 0,
      moodBefore: 50,
      moodAfter: null,
      moodDelta: null,
      withGuidance: true,
      withMusic: true,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    vi.mocked(meditationService.createSession).mockResolvedValue(mockSession);

    const { result } = renderHook(() => useMeditationMachine());

    act(() => {
      result.current.setConfig({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });
    });

    await act(async () => {
      await result.current.startSession(50);
    });

    act(() => {
      result.current.cancelSession();
    });

    expect(result.current.state).toBe('idle');
    expect(result.current.session).toBeNull();
  });

  it('gère les erreurs lors du démarrage', async () => {
    const mockError = new Error('Failed to start');
    vi.mocked(meditationService.createSession).mockRejectedValue(mockError);

    const onError = vi.fn();
    const { result } = renderHook(() => useMeditationMachine({ onError }));

    act(() => {
      result.current.setConfig({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });
    });

    await act(async () => {
      try {
        await result.current.startSession(50);
      } catch (e) {
        // Expected error
      }
    });

    await waitFor(() => {
      expect(result.current.state).toBe('error');
      expect(result.current.error).toEqual(mockError);
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('reset remet tout à zéro', async () => {
    const mockSession = {
      id: 'test-id',
      userId: 'user-id',
      technique: 'mindfulness' as const,
      duration: 600,
      completedDuration: 0,
      moodBefore: 50,
      moodAfter: null,
      moodDelta: null,
      withGuidance: true,
      withMusic: true,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    vi.mocked(meditationService.createSession).mockResolvedValue(mockSession);

    const { result } = renderHook(() => useMeditationMachine());

    act(() => {
      result.current.setConfig({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
      });
    });

    await act(async () => {
      await result.current.startSession(50);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toBe('idle');
    expect(result.current.session).toBeNull();
    expect(result.current.config).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
