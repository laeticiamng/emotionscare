import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nyveeService } from '../nyveeService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
  },
}));

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

describe('nyveeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSession', () => {
    it('crée une nouvelle session avec la config fournie', async () => {
      const session = await nyveeService.createSession({
        intensity: 'calm',
        targetCycles: 6,
        moodBefore: 50,
      });

      expect(session).toBeDefined();
      expect(session.intensity).toBe('calm');
      expect(session.targetCycles).toBe(6);
      expect(session.moodBefore).toBe(50);
      expect(session.completed).toBe(false);
      expect(session.cyclesCompleted).toBe(0);
    });

    it('génère un UUID valide', async () => {
      const session = await nyveeService.createSession({
        intensity: 'moderate',
        targetCycles: 6,
      });

      expect(session.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe('determineBadge', () => {
    it('retourne "calm" pour 90%+ completion avec intensité calme', () => {
      const badge = nyveeService.determineBadge('calm', 6, 6);
      expect(badge).toBe('calm');
    });

    it('retourne "partial" pour 70-89% completion', () => {
      const badge = nyveeService.determineBadge('moderate', 5, 6);
      expect(badge).toBe('partial');
    });

    it('retourne "tense" pour <70% completion', () => {
      const badge = nyveeService.determineBadge('intense', 3, 6);
      expect(badge).toBe('tense');
    });
  });

  describe('shouldUnlockCocoon', () => {
    it('peut débloquer un cocoon pour badge calm', () => {
      // Test probabiliste - on vérifie juste que ça retourne un boolean
      const result = nyveeService.shouldUnlockCocoon('calm');
      expect(typeof result).toBe('boolean');
    });

    it('ne débloque jamais pour badge partial', () => {
      const result = nyveeService.shouldUnlockCocoon('partial');
      expect(result).toBe(false);
    });

    it('ne débloque jamais pour badge tense', () => {
      const result = nyveeService.shouldUnlockCocoon('tense');
      expect(result).toBe(false);
    });
  });

  describe('completeSession', () => {
    it('complète une session avec badge et mood', async () => {
      const session = await nyveeService.completeSession({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        cyclesCompleted: 6,
        badgeEarned: 'calm',
        moodAfter: 70,
      });

      expect(session).toBeDefined();
      expect(session.completed).toBe(true);
      expect(session.badgeEarned).toBe('calm');
      expect(session.cyclesCompleted).toBe(6);
    });

    it('peut inclure un cocoon débloqué', async () => {
      const session = await nyveeService.completeSession({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        cyclesCompleted: 6,
        badgeEarned: 'calm',
        cocoonUnlocked: 'cosmos',
      });

      expect(session.cocoonUnlocked).toBe('cosmos');
    });
  });

  describe('getStats', () => {
    it('retourne des stats par défaut', async () => {
      const stats = await nyveeService.getStats();

      expect(stats).toBeDefined();
      expect(stats.totalSessions).toBe(0);
      expect(stats.cocoonsUnlocked).toContain('crystal');
      expect(stats.badgesEarned).toEqual({
        calm: 0,
        partial: 0,
        tense: 0,
      });
    });
  });
});
