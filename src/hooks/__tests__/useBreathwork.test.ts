/**
 * Tests unitaires pour useBreathwork
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreathwork } from '../useBreathwork';

// Mock du store Zustand
const mockState = {
  pattern: '4-6-8' as const,
  duration: 180,
  running: false,
  paused: false,
  finished: false,
  elapsed: 0,
  phase: 'inhale' as const,
  phaseProgress: 0,
  cycleCount: 0,
  startedAt: null as number | null,
  events: [],
  hapticEnabled: false,
  badgeEarned: null,
  setPattern: vi.fn(),
  setDuration: vi.fn(),
  setRunning: vi.fn(),
  setPaused: vi.fn(),
  setFinished: vi.fn(),
  setElapsed: vi.fn(),
  setPhase: vi.fn(),
  setPhaseProgress: vi.fn(),
  setCycleCount: vi.fn(),
  setStartedAt: vi.fn(),
  addEvent: vi.fn(),
  setBadgeEarned: vi.fn(),
};

vi.mock('@/store/breath.store', () => ({
  useBreathStore: () => mockState,
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { success: true }, error: null }),
    },
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useBreathwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Reset state
    mockState.running = false;
    mockState.paused = false;
    mockState.finished = false;
    mockState.elapsed = 0;
    mockState.cycleCount = 0;
    mockState.phase = 'inhale';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initialisation', () => {
    it('retourne l\'état initial correct', () => {
      const { result } = renderHook(() => useBreathwork());

      expect(result.current.state.running).toBe(false);
      expect(result.current.state.paused).toBe(false);
      expect(result.current.state.finished).toBe(false);
      expect(result.current.state.pattern).toBe('4-6-8');
    });

    it('expose les fonctions de contrôle', () => {
      const { result } = renderHook(() => useBreathwork());

      expect(typeof result.current.start).toBe('function');
      expect(typeof result.current.pause).toBe('function');
      expect(typeof result.current.resume).toBe('function');
      expect(typeof result.current.finish).toBe('function');
      expect(typeof result.current.submit).toBe('function');
    });
  });

  describe('Démarrage de session', () => {
    it('démarre une session correctement', () => {
      const { result } = renderHook(() => useBreathwork());

      act(() => {
        result.current.start();
      });

      expect(mockState.setRunning).toHaveBeenCalledWith(true);
      expect(mockState.setPaused).toHaveBeenCalledWith(false);
      expect(mockState.setFinished).toHaveBeenCalledWith(false);
      expect(mockState.setElapsed).toHaveBeenCalledWith(0);
      expect(mockState.setCycleCount).toHaveBeenCalledWith(0);
    });

    it('ajoute un événement de démarrage', () => {
      const { result } = renderHook(() => useBreathwork());

      act(() => {
        result.current.start();
      });

      expect(mockState.addEvent).toHaveBeenCalledWith({ t: 0, type: 'start' });
    });

    it('ne démarre pas si déjà en cours', () => {
      mockState.running = true;
      const { result } = renderHook(() => useBreathwork());

      act(() => {
        result.current.start();
      });

      // setRunning ne devrait pas être appelé si déjà running
      expect(mockState.setRunning).not.toHaveBeenCalled();
    });
  });

  describe('Pause et reprise', () => {
    it('met en pause correctement', () => {
      const { result } = renderHook(() => useBreathwork());

      act(() => {
        result.current.pause();
      });

      expect(mockState.setPaused).toHaveBeenCalledWith(true);
      expect(mockState.addEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'pause' })
      );
    });

    it('reprend correctement', () => {
      mockState.paused = true;
      const { result } = renderHook(() => useBreathwork());

      act(() => {
        result.current.resume();
      });

      expect(mockState.setPaused).toHaveBeenCalledWith(false);
      expect(mockState.addEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'resume' })
      );
    });
  });

  describe('Fin de session', () => {
    it('termine correctement', () => {
      const { result } = renderHook(() => useBreathwork());

      act(() => {
        result.current.finish();
      });

      expect(mockState.setRunning).toHaveBeenCalledWith(false);
      expect(mockState.setFinished).toHaveBeenCalledWith(true);
      expect(mockState.addEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'finish' })
      );
    });
  });

  describe('Patterns de respiration', () => {
    it('supporte le pattern 4-6-8', () => {
      mockState.pattern = '4-6-8';
      const { result } = renderHook(() => useBreathwork());

      expect(result.current.state.pattern).toBe('4-6-8');
    });

    it('expose setPattern et setDuration', () => {
      const { result } = renderHook(() => useBreathwork());

      expect(result.current.setPattern).toBe(mockState.setPattern);
      expect(result.current.setDuration).toBe(mockState.setDuration);
    });
  });
});
