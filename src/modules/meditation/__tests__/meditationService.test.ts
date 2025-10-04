import { describe, it, expect, vi, beforeEach } from 'vitest';
import { meditationService } from '../meditationService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
      }),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'session-1',
              user_id: 'user-123',
              technique: 'mindfulness',
              duration: 600,
              completed_duration: 0,
              mood_before: 50,
              mood_after: null,
              mood_delta: null,
              with_guidance: true,
              with_music: true,
              completed: false,
              created_at: new Date().toISOString(),
              completed_at: null,
            },
            error: null,
          }),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 'session-1',
                user_id: 'user-123',
                technique: 'mindfulness',
                duration: 600,
                completed_duration: 580,
                mood_before: 50,
                mood_after: 70,
                mood_delta: 20,
                with_guidance: true,
                with_music: true,
                completed: true,
                created_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
              },
              error: null,
            }),
          })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          })),
        })),
      })),
    })),
  },
}));

vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
}));

describe('meditationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSession', () => {
    it('crée une nouvelle session avec la config fournie', async () => {
      const session = await meditationService.createSession({
        technique: 'mindfulness',
        duration: 10,
        withGuidance: true,
        withMusic: true,
        volume: 50,
        moodBefore: 50,
      });

      expect(session).toBeDefined();
      expect(session.technique).toBe('mindfulness');
      expect(session.duration).toBe(600);
      expect(session.moodBefore).toBe(50);
      expect(session.completed).toBe(false);
    });
  });

  describe('completeSession', () => {
    it('complète une session et calcule le mood delta', async () => {
      const session = await meditationService.completeSession({
        sessionId: 'session-1',
        completedDuration: 580,
        moodAfter: 70,
      });

      expect(session).toBeDefined();
      expect(session.completed).toBe(true);
      expect(session.completedDuration).toBe(580);
      expect(session.moodAfter).toBe(70);
      expect(session.moodDelta).toBe(20);
    });
  });

  describe('getStats', () => {
    it('retourne des stats vides pour un nouvel utilisateur', async () => {
      const stats = await meditationService.getStats();

      expect(stats.totalSessions).toBe(0);
      expect(stats.totalDuration).toBe(0);
      expect(stats.averageDuration).toBe(0);
      expect(stats.favoriteTechnique).toBeNull();
    });
  });
});
