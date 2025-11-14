/**
 * Tests pour l'edge function emotional-api
 *
 * @version 1.0.0
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

describe('Edge Function: emotional-api', () => {
  let supabase: SupabaseClient;
  let authToken: string;
  let userId: string;
  const functionUrl = `${process.env.SUPABASE_URL}/functions/v1/emotional-api`;

  beforeAll(async () => {
    supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // Créer un utilisateur de test
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: 'test@emotionscare.com',
      password: 'test-password-123',
    });

    if (error || !user) {
      throw new Error('Failed to authenticate test user');
    }

    userId = user.id;

    // Récupérer le token
    const { data: { session } } = await supabase.auth.getSession();
    authToken = session?.access_token || '';
  });

  afterAll(async () => {
    // Cleanup
    await supabase.auth.signOut();
  });

  describe('GET /stats', () => {
    it('devrait récupérer les statistiques de l\'utilisateur', async () => {
      const response = await fetch(`${functionUrl}/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.stats).toBeDefined();
      expect(data.stats.user_id).toBe(userId);
      expect(data.stats.level).toBeGreaterThanOrEqual(1);
    });

    it('devrait initialiser les stats si elles n\'existent pas', async () => {
      // Supprimer les stats
      await supabase
        .from('emotional_stats')
        .delete()
        .eq('user_id', userId);

      const response = await fetch(`${functionUrl}/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.stats).toBeDefined();
      expect(data.stats.total_scans).toBe(0);
      expect(data.stats.level).toBe(1);
    });
  });

  describe('GET /achievements', () => {
    it('devrait récupérer les achievements de l\'utilisateur', async () => {
      const response = await fetch(`${functionUrl}/achievements`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.achievements).toBeDefined();
      expect(Array.isArray(data.achievements)).toBe(true);
    });

    it('devrait retourner un tableau vide si aucun achievement', async () => {
      // Supprimer les achievements
      await supabase
        .from('emotional_achievements')
        .delete()
        .eq('user_id', userId);

      const response = await fetch(`${functionUrl}/achievements`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.achievements).toEqual([]);
    });
  });

  describe('POST /check-achievements', () => {
    it('devrait vérifier et débloquer les achievements', async () => {
      // Créer un scan émotionnel pour déclencher l'achievement
      await supabase
        .from('emotion_scans')
        .insert({
          user_id: userId,
          mood: 'joy',
          confidence: 0.9,
          scan_type: 'text',
        });

      const response = await fetch(`${functionUrl}/check-achievements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.message).toBe('Achievements checked');
      expect(data.achievements).toBeDefined();
    });

    it('devrait débloquer "first_scan" après le premier scan', async () => {
      // Reset
      await supabase
        .from('emotional_achievements')
        .delete()
        .eq('user_id', userId);

      // Créer un scan
      await supabase
        .from('emotion_scans')
        .insert({
          user_id: userId,
          mood: 'happiness',
          confidence: 0.85,
          scan_type: 'text',
        });

      // Check achievements
      const response = await fetch(`${functionUrl}/check-achievements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      const firstScan = data.achievements.find((a: any) => a.achievement_id === 'first_scan');

      expect(firstScan).toBeDefined();
      expect(firstScan.achievement_title).toBe('Premier Pas');
      expect(firstScan.xp_reward).toBe(100);
    });
  });

  describe('GET /dashboard', () => {
    it('devrait récupérer le dashboard complet', async () => {
      const response = await fetch(`${functionUrl}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.dashboard).toBeDefined();
    });
  });

  describe('GET /patterns', () => {
    it('devrait récupérer les patterns actifs', async () => {
      const response = await fetch(`${functionUrl}/patterns`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.patterns).toBeDefined();
      expect(Array.isArray(data.patterns)).toBe(true);
    });
  });

  describe('GET /insights', () => {
    it('devrait récupérer les insights', async () => {
      const response = await fetch(`${functionUrl}/insights`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.insights).toBeDefined();
      expect(Array.isArray(data.insights)).toBe(true);
    });

    it('devrait filtrer les insights non lus', async () => {
      const response = await fetch(`${functionUrl}/insights?unreadOnly=true`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.insights.every((i: any) => i.is_read === false)).toBe(true);
    });
  });

  describe('POST /generate-insights', () => {
    it('devrait générer des insights automatiquement', async () => {
      // Créer des données pour générer insights
      await supabase
        .from('emotional_stats')
        .update({
          average_mood_score: 75,
          emotional_variability: 10,
          current_streak: 10,
        })
        .eq('user_id', userId);

      const response = await fetch(`${functionUrl}/generate-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.insights).toBeDefined();
      expect(data.insights.length).toBeGreaterThan(0);
    });

    it('devrait générer un insight "Tendance Positive" si mood > 70', async () => {
      await supabase
        .from('emotional_stats')
        .update({ average_mood_score: 80 })
        .eq('user_id', userId);

      await supabase
        .from('emotional_insights')
        .delete()
        .eq('user_id', userId);

      const response = await fetch(`${functionUrl}/generate-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      const positiveInsight = data.insights.find((i: any) =>
        i.title.includes('Tendance Positive')
      );

      expect(positiveInsight).toBeDefined();
      expect(positiveInsight.type).toBe('positive');
    });
  });

  describe('GET /trends', () => {
    it('devrait récupérer les tendances', async () => {
      const response = await fetch(`${functionUrl}/trends?period=week`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.trends).toBeDefined();
      expect(Array.isArray(data.trends)).toBe(true);
    });
  });

  describe('PATCH /insights/:id/read', () => {
    it('devrait marquer un insight comme lu', async () => {
      // Créer un insight
      const { data: insight } = await supabase
        .from('emotional_insights')
        .insert({
          user_id: userId,
          title: 'Test Insight',
          description: 'Test description',
          type: 'neutral',
          category: 'trend',
          confidence: 0.8,
          priority: 5,
          is_read: false,
        })
        .select()
        .single();

      const response = await fetch(`${functionUrl}/insights/${insight.id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.insight.is_read).toBe(true);
      expect(data.insight.read_at).toBeDefined();
    });
  });

  describe('GET /leaderboard', () => {
    it('devrait récupérer le classement', async () => {
      const response = await fetch(`${functionUrl}/leaderboard?limit=10`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);

      const data = await response.json();
      expect(data.leaderboard).toBeDefined();
      expect(Array.isArray(data.leaderboard)).toBe(true);
    });
  });

  describe('Authentication', () => {
    it('devrait rejeter les requêtes non authentifiées', async () => {
      const response = await fetch(`${functionUrl}/stats`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    it('devrait retourner 404 pour une route invalide', async () => {
      const response = await fetch(`${functionUrl}/invalid-route`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(404);
    });
  });
});
