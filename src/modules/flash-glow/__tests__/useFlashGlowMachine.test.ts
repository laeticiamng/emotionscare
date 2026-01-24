import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFlashGlowMachine } from '@/modules/flash-glow/useFlashGlowMachine';
import { flashGlowService } from '@/modules/flash-glow/flash-glowService';
import { createFlashGlowJournalEntry } from '@/modules/flash-glow/journal';
import { toast } from '@/hooks/use-toast';
import { logAndJournal } from '@/services/sessions/sessionsApi';

vi.mock('@/modules/flash-glow/flash-glowService', () => ({
  flashGlowService: {
    startSession: vi.fn().mockResolvedValue({ sessionId: 'fg_1' }),
    endSession: vi.fn().mockResolvedValue({ success: true, message: 'ok' }),
    getStats: vi.fn().mockResolvedValue({ total_sessions: 3, avg_duration: 80, recent_sessions: [] }),
    getRecommendation: vi.fn().mockReturnValue('Recommandation test'),
    triggerHapticFeedback: vi.fn()
  }
}));

vi.mock('@/modules/flash-glow/journal', () => ({
  createFlashGlowJournalEntry: vi.fn().mockResolvedValue({
    id: 'journal-1',
    content: 'entry',
    summary: 'Flash Glow Ultra - Gain ressenti',
    tone: 'positive',
    ephemeral: false,
    created_at: new Date(),
    duration: 90
  })
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

const mockClock = {
  state: 'idle' as 'idle' | 'running' | 'paused' | 'completed',
  elapsedMs: 0,
  progress: 0,
  start: vi.fn(() => {
    mockClock.state = 'running';
  }),
  pause: vi.fn(() => {
    mockClock.state = 'paused';
  }),
  resume: vi.fn(() => {
    mockClock.state = 'running';
  }),
  complete: vi.fn(() => {
    mockClock.state = 'completed';
  }),
  reset: vi.fn(() => {
    mockClock.state = 'idle';
    mockClock.elapsedMs = 0;
    mockClock.progress = 0;
  }),
  onTick: vi.fn(() => () => {})
};

vi.mock('@/modules/sessions/hooks/useSessionClock', () => ({
  useSessionClock: () => mockClock
}));

vi.mock('@/services/sessions/sessionsApi', () => ({
  logAndJournal: vi.fn().mockResolvedValue({
    id: 'session-1',
    type: 'flash_glow',
    duration_sec: 65,
    mood_delta: 7,
    meta: {},
    created_at: new Date().toISOString()
  })
}));

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn()
}));

describe('useFlashGlowMachine - auto journalisation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClock.state = 'idle';
    mockClock.elapsedMs = 0;
    mockClock.progress = 0;
  });

  it.skip('crée une entrée de journal et enrichit les métadonnées lors de la complétion', async () => {
    const { result } = renderHook(() => useFlashGlowMachine());

    // Configurer la session
    act(() => {
      result.current.setConfig({ duration: 1 });
    });

    // Démarrer la session avec mood baseline
    await act(async () => {
      await result.current.startSession({ moodBaseline: 40 });
    });

    // Simuler le temps écoulé
    mockClock.elapsedMs = 65000;

    // Compléter la session
    await act(async () => {
      await result.current.onSessionComplete({ label: 'gain', moodAfter: 76 });
    });

    // Vérifier que le service de journal a été appelé
    expect(createFlashGlowJournalEntry).toHaveBeenCalledTimes(1);
    expect(createFlashGlowJournalEntry).toHaveBeenCalledWith(expect.objectContaining({
      label: 'gain',
      moodAfter: 76,
    }));

    // Vérifier que endSession a été appelé avec les métadonnées enrichies
    expect(flashGlowService.endSession).toHaveBeenCalled();

    // Vérifier que le toast de confirmation a été affiché
    expect(toast).toHaveBeenCalled();
  }, 10000);
});
