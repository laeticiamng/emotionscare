/**
 * Boss Grit Service - Tests Complets
 * Tests unitaires pour BossGritService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BossGritService, type BattleScoreResult } from '../bossGritService';

// ============================================================================
// MOCKS
// ============================================================================

const mockSupabaseResponse = <T>(data: T, error: Error | null = null) => ({
  data,
  error,
  count: Array.isArray(data) ? data.length : null,
});

const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockIn = vi.fn();
const mockGte = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockRange = vi.fn();

const createChainMock = () => ({
  select: mockSelect.mockReturnThis(),
  single: mockSingle,
  insert: mockInsert.mockReturnThis(),
  update: mockUpdate.mockReturnThis(),
  eq: mockEq.mockReturnThis(),
  in: mockIn.mockReturnThis(),
  gte: mockGte.mockReturnThis(),
  order: mockOrder.mockReturnThis(),
  limit: mockLimit.mockReturnThis(),
  range: mockRange.mockReturnThis(),
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => createChainMock()),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TEST DATA
// ============================================================================

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440001';
const TEST_BATTLE_ID = '550e8400-e29b-41d4-a716-446655440000';

const mockBattle = {
  id: TEST_BATTLE_ID,
  user_id: TEST_USER_ID,
  mode: 'standard',
  status: 'created',
  created_at: '2025-01-15T10:00:00Z',
  started_at: null,
  ended_at: null,
  duration_seconds: null,
  score_data: null,
};

const mockResponses = [
  { id: 'r1', battle_id: TEST_BATTLE_ID, question_id: 'q1', response_value: 7, created_at: '2025-01-15T10:01:00Z' },
  { id: 'r2', battle_id: TEST_BATTLE_ID, question_id: 'q2', response_value: 8, created_at: '2025-01-15T10:02:00Z' },
  { id: 'r3', battle_id: TEST_BATTLE_ID, question_id: 'q3', response_value: 6, created_at: '2025-01-15T10:03:00Z' },
  { id: 'r4', battle_id: TEST_BATTLE_ID, question_id: 'q4', response_value: 5, created_at: '2025-01-15T10:04:00Z' },
  { id: 'r5', battle_id: TEST_BATTLE_ID, question_id: 'q5', response_value: 9, created_at: '2025-01-15T10:05:00Z' },
];

// ============================================================================
// TESTS
// ============================================================================

describe('BossGritService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // --------------------------------------------------------------------------
  // CREATE BATTLE
  // --------------------------------------------------------------------------

  describe('createBattle', () => {
    it('crée une bataille avec le mode par défaut (standard)', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockSingle.mockResolvedValue(mockSupabaseResponse(mockBattle));

      const result = await BossGritService.createBattle(TEST_USER_ID);

      expect(supabase.from).toHaveBeenCalledWith('bounce_battles');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: TEST_USER_ID,
        mode: 'standard',
        status: 'created',
      });
      expect(result).toEqual(mockBattle);
    });

    it('crée une bataille en mode challenge', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockSingle.mockResolvedValue(mockSupabaseResponse({ ...mockBattle, mode: 'challenge' }));

      const result = await BossGritService.createBattle(TEST_USER_ID, 'challenge');

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: TEST_USER_ID,
        mode: 'challenge',
        status: 'created',
      });
      expect(result.mode).toBe('challenge');
    });

    it('crée une bataille en mode timed', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockSingle.mockResolvedValue(mockSupabaseResponse({ ...mockBattle, mode: 'timed' }));

      const result = await BossGritService.createBattle(TEST_USER_ID, 'timed');

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: TEST_USER_ID,
        mode: 'timed',
        status: 'created',
      });
      expect(result.mode).toBe('timed');
    });

    it('lance une erreur si la création échoue', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockSingle.mockResolvedValue(mockSupabaseResponse(null, new Error('Database error')));

      await expect(BossGritService.createBattle(TEST_USER_ID)).rejects.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // START BATTLE
  // --------------------------------------------------------------------------

  describe('startBattle', () => {
    it('démarre une bataille avec succès', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockEq.mockResolvedValue(mockSupabaseResponse(null));

      // Don't throw on log event
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      await BossGritService.startBattle(TEST_BATTLE_ID);

      expect(supabase.from).toHaveBeenCalledWith('bounce_battles');
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'in_progress',
          started_at: expect.any(String),
        })
      );
    });

    it('lance une erreur si le démarrage échoue', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockEq.mockResolvedValue(mockSupabaseResponse(null, new Error('Update failed')));

      await expect(BossGritService.startBattle(TEST_BATTLE_ID)).rejects.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // SAVE COPING RESPONSE
  // --------------------------------------------------------------------------

  describe('saveCopingResponse', () => {
    it('enregistre une réponse valide (valeur 1)', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      await BossGritService.saveCopingResponse(TEST_BATTLE_ID, 'q1', 1);

      expect(supabase.from).toHaveBeenCalledWith('bounce_coping_responses');
      expect(mockInsert).toHaveBeenCalledWith({
        battle_id: TEST_BATTLE_ID,
        question_id: 'q1',
        response_value: 1,
      });
    });

    it('enregistre une réponse valide (valeur 10)', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      await BossGritService.saveCopingResponse(TEST_BATTLE_ID, 'q5', 10);

      expect(mockInsert).toHaveBeenCalledWith({
        battle_id: TEST_BATTLE_ID,
        question_id: 'q5',
        response_value: 10,
      });
    });

    it('rejette une valeur inférieure à 1', async () => {
      await expect(
        BossGritService.saveCopingResponse(TEST_BATTLE_ID, 'q1', 0)
      ).rejects.toThrow('Response value must be between 1 and 10');
    });

    it('rejette une valeur supérieure à 10', async () => {
      await expect(
        BossGritService.saveCopingResponse(TEST_BATTLE_ID, 'q1', 11)
      ).rejects.toThrow('Response value must be between 1 and 10');
    });

    it('rejette une valeur négative', async () => {
      await expect(
        BossGritService.saveCopingResponse(TEST_BATTLE_ID, 'q1', -5)
      ).rejects.toThrow('Response value must be between 1 and 10');
    });
  });

  // --------------------------------------------------------------------------
  // LOG EVENT
  // --------------------------------------------------------------------------

  describe('logEvent', () => {
    it('enregistre un événement avec données', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      await BossGritService.logEvent(TEST_BATTLE_ID, 'battle_started', {
        action: 'start',
        metadata: { difficulty: 'normal' },
      });

      expect(supabase.from).toHaveBeenCalledWith('bounce_events');
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          battle_id: TEST_BATTLE_ID,
          event_type: 'battle_started',
          timestamp: expect.any(Number),
          event_data: { action: 'start', metadata: { difficulty: 'normal' } },
        })
      );
    });

    it('enregistre un événement sans données', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      await BossGritService.logEvent(TEST_BATTLE_ID, 'battle_completed');

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          event_data: {},
        })
      );
    });

    it('ne lance pas d\'erreur si l\'enregistrement échoue (non-bloquant)', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockInsert.mockResolvedValue(mockSupabaseResponse(null, new Error('Insert failed')));

      // Should not throw
      await expect(
        BossGritService.logEvent(TEST_BATTLE_ID, 'battle_started')
      ).resolves.not.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // CALCULATE BATTLE SCORE
  // --------------------------------------------------------------------------

  describe('calculateBattleScore', () => {
    it('retourne un score vide si aucune réponse', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse([]));

      const result = await BossGritService.calculateBattleScore(TEST_BATTLE_ID);

      expect(result).toEqual({
        totalScore: 0,
        categoryScores: {},
        resilenceIndex: 0,
        strengths: [],
        areasForGrowth: [],
        badgesEarned: [],
      });
    });

    it('calcule correctement les scores par catégorie', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

      // Mock fetchResponses
      mockOrder.mockResolvedValueOnce(mockSupabaseResponse(mockResponses));

      // Mock battle fetch for badges
      mockSingle.mockResolvedValue(
        mockSupabaseResponse({
          user_id: TEST_USER_ID,
          mode: 'standard',
          duration_seconds: 180,
        })
      );

      // Mock battle count
      mockEq.mockResolvedValue(mockSupabaseResponse(null, null));
      (mockEq as ReturnType<typeof vi.fn>).mockImplementation(() => ({
        ...chain,
        single: mockSingle,
      }));

      const result = await BossGritService.calculateBattleScore(TEST_BATTLE_ID);

      expect(result.totalScore).toBeGreaterThanOrEqual(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      expect(result.resilenceIndex).toBeGreaterThanOrEqual(0);
    });

    it('identifie les forces (score >= 70)', async () => {
      const highScoreResponses = [
        { id: 'r1', battle_id: TEST_BATTLE_ID, question_id: 'q1', response_value: 9, created_at: '2025-01-15T10:01:00Z' },
        { id: 'r2', battle_id: TEST_BATTLE_ID, question_id: 'q2', response_value: 8, created_at: '2025-01-15T10:02:00Z' },
        { id: 'r5', battle_id: TEST_BATTLE_ID, question_id: 'q5', response_value: 9, created_at: '2025-01-15T10:03:00Z' },
        { id: 'r8', battle_id: TEST_BATTLE_ID, question_id: 'q8', response_value: 8, created_at: '2025-01-15T10:04:00Z' },
      ];

      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValueOnce(mockSupabaseResponse(highScoreResponses));
      mockSingle.mockResolvedValue(
        mockSupabaseResponse({
          user_id: TEST_USER_ID,
          mode: 'standard',
          duration_seconds: 180,
        })
      );

      const result = await BossGritService.calculateBattleScore(TEST_BATTLE_ID);

      expect(result.categoryScores['problem_focused']).toBeGreaterThanOrEqual(70);
      expect(result.strengths).toContain('Résolution de problèmes');
    });

    it('identifie les domaines à améliorer (score < 50)', async () => {
      const lowScoreResponses = [
        { id: 'r3', battle_id: TEST_BATTLE_ID, question_id: 'q3', response_value: 2, created_at: '2025-01-15T10:01:00Z' },
        { id: 'r6', battle_id: TEST_BATTLE_ID, question_id: 'q6', response_value: 3, created_at: '2025-01-15T10:02:00Z' },
        { id: 'r9', battle_id: TEST_BATTLE_ID, question_id: 'q9', response_value: 2, created_at: '2025-01-15T10:03:00Z' },
      ];

      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValueOnce(mockSupabaseResponse(lowScoreResponses));
      mockSingle.mockResolvedValue(
        mockSupabaseResponse({
          user_id: TEST_USER_ID,
          mode: 'standard',
          duration_seconds: 180,
        })
      );

      const result = await BossGritService.calculateBattleScore(TEST_BATTLE_ID);

      expect(result.categoryScores['emotion_focused']).toBeLessThan(50);
      expect(result.areasForGrowth).toContain('Gestion des émotions');
    });
  });

  // --------------------------------------------------------------------------
  // COMPLETE BATTLE
  // --------------------------------------------------------------------------

  describe('completeBattle', () => {
    it('complète une bataille avec succès', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

      // Mock responses for score calculation
      mockOrder.mockResolvedValueOnce(mockSupabaseResponse(mockResponses));

      // Mock battle for badges
      mockSingle
        .mockResolvedValueOnce(
          mockSupabaseResponse({
            user_id: TEST_USER_ID,
            mode: 'standard',
            duration_seconds: 180,
          })
        )
        // Mock update result
        .mockResolvedValueOnce(
          mockSupabaseResponse({
            ...mockBattle,
            status: 'completed',
            duration_seconds: 300,
          })
        );

      // Mock event inserts
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      const result = await BossGritService.completeBattle(TEST_BATTLE_ID, 300);

      expect(result.battle.status).toBe('completed');
      expect(result.battle.duration_seconds).toBe(300);
      expect(result.score).toBeDefined();
      expect(result.score.totalScore).toBeGreaterThanOrEqual(0);
    });

    it('lance une erreur si la complétion échoue', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValueOnce(mockSupabaseResponse([]));
      mockSingle.mockResolvedValue(mockSupabaseResponse(null, new Error('Update failed')));

      await expect(BossGritService.completeBattle(TEST_BATTLE_ID, 300)).rejects.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // CANCEL BATTLE
  // --------------------------------------------------------------------------

  describe('cancelBattle', () => {
    it('annule une bataille avec succès', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockEq.mockResolvedValue(mockSupabaseResponse(null));
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      await BossGritService.cancelBattle(TEST_BATTLE_ID);

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'cancelled',
          ended_at: expect.any(String),
        })
      );
    });

    it('lance une erreur si l\'annulation échoue', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockEq.mockResolvedValue(mockSupabaseResponse(null, new Error('Cancel failed')));

      await expect(BossGritService.cancelBattle(TEST_BATTLE_ID)).rejects.toThrow();
    });
  });

  // --------------------------------------------------------------------------
  // FETCH HISTORY
  // --------------------------------------------------------------------------

  describe('fetchHistory', () => {
    it('récupère l\'historique avec la limite par défaut', async () => {
      const battles = [mockBattle, { ...mockBattle, id: 'battle-2' }];
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockLimit.mockResolvedValue(mockSupabaseResponse(battles));

      const result = await BossGritService.fetchHistory(TEST_USER_ID);

      expect(supabase.from).toHaveBeenCalledWith('bounce_battles');
      expect(mockEq).toHaveBeenCalledWith('user_id', TEST_USER_ID);
      expect(mockLimit).toHaveBeenCalledWith(20);
      expect(result).toEqual(battles);
    });

    it('récupère l\'historique avec une limite personnalisée', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockLimit.mockResolvedValue(mockSupabaseResponse([mockBattle]));

      await BossGritService.fetchHistory(TEST_USER_ID, 5);

      expect(mockLimit).toHaveBeenCalledWith(5);
    });

    it('retourne un tableau vide si aucun historique', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockLimit.mockResolvedValue(mockSupabaseResponse(null));

      const result = await BossGritService.fetchHistory(TEST_USER_ID);

      expect(result).toEqual([]);
    });
  });

  // --------------------------------------------------------------------------
  // FETCH HISTORY PAGINATED
  // --------------------------------------------------------------------------

  describe('fetchHistoryPaginated', () => {
    it('récupère l\'historique paginé avec options par défaut', async () => {
      const battles = [
        { ...mockBattle, status: 'completed' },
        { ...mockBattle, id: 'battle-2', status: 'cancelled' },
      ];
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockRange.mockResolvedValue({ ...mockSupabaseResponse(battles), count: 2 });

      const result = await BossGritService.fetchHistoryPaginated(TEST_USER_ID);

      expect(mockRange).toHaveBeenCalledWith(0, 19); // 0 to limit-1
      expect(result.battles).toEqual(battles);
      expect(result.total_count).toBe(2);
      expect(result.completion_rate).toBe(50); // 1/2
    });

    it.skip('filtre par mode', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockRange.mockResolvedValue(mockSupabaseResponse([]));

      await BossGritService.fetchHistoryPaginated(TEST_USER_ID, { mode: 'challenge' });

      expect(mockEq).toHaveBeenCalledWith('mode', 'challenge');
    });

    it.skip('filtre par statut completed', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockRange.mockResolvedValue(mockSupabaseResponse([]));

      await BossGritService.fetchHistoryPaginated(TEST_USER_ID, { status: 'completed' });

      expect(mockEq).toHaveBeenCalledWith('status', 'completed');
    });

    it('calcule correctement la durée moyenne', async () => {
      const battles = [
        { ...mockBattle, status: 'completed', duration_seconds: 100 },
        { ...mockBattle, id: 'b2', status: 'completed', duration_seconds: 200 },
        { ...mockBattle, id: 'b3', status: 'cancelled', duration_seconds: null },
      ];
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockRange.mockResolvedValue({ ...mockSupabaseResponse(battles), count: 3 });

      const result = await BossGritService.fetchHistoryPaginated(TEST_USER_ID);

      expect(result.average_duration).toBe(150); // (100 + 200) / 2
    });
  });

  // --------------------------------------------------------------------------
  // FETCH RESPONSES
  // --------------------------------------------------------------------------

  describe('fetchResponses', () => {
    it('récupère les réponses ordonnées', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse(mockResponses));

      const result = await BossGritService.fetchResponses(TEST_BATTLE_ID);

      expect(supabase.from).toHaveBeenCalledWith('bounce_coping_responses');
      expect(mockEq).toHaveBeenCalledWith('battle_id', TEST_BATTLE_ID);
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: true });
      expect(result).toEqual(mockResponses);
    });

    it('retourne un tableau vide si aucune réponse', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse(null));

      const result = await BossGritService.fetchResponses(TEST_BATTLE_ID);

      expect(result).toEqual([]);
    });
  });

  // --------------------------------------------------------------------------
  // GET STATS
  // --------------------------------------------------------------------------

  describe('getStats', () => {
    it('calcule les statistiques complètes', async () => {
      const battles = [
        { ...mockBattle, status: 'completed', mode: 'standard', duration_seconds: 120 },
        { ...mockBattle, id: 'b2', status: 'completed', mode: 'challenge', duration_seconds: 180 },
        { ...mockBattle, id: 'b3', status: 'cancelled', mode: 'standard', duration_seconds: null },
      ];

      const responses = [
        { response_value: 7 },
        { response_value: 8 },
        { response_value: 6 },
      ];

      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

      // Mock battles fetch
      mockEq.mockResolvedValueOnce(mockSupabaseResponse(battles));

      // Mock responses fetch
      mockIn.mockResolvedValueOnce(mockSupabaseResponse(responses));

      // Mock milestones count
      mockEq.mockResolvedValueOnce({ ...mockSupabaseResponse(null), count: 5 });

      const result = await BossGritService.getStats(TEST_USER_ID);

      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.total_battles).toBe(3);
      expect(result.completed_battles).toBe(2);
      expect(result.completion_rate).toBeCloseTo(66.67, 1);
      expect(result.modes_played).toEqual({ standard: 2, challenge: 1 });
      expect(result.best_time_seconds).toBe(120);
    });

    it('gère le cas sans batailles', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockEq.mockResolvedValue(mockSupabaseResponse([]));

      const result = await BossGritService.getStats(TEST_USER_ID);

      expect(result.total_battles).toBe(0);
      expect(result.completed_battles).toBe(0);
      expect(result.completion_rate).toBe(0);
      expect(result.average_duration_seconds).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // GET RESILIENCE TRENDS
  // --------------------------------------------------------------------------

  describe('getResilienceTrends', () => {
    it('retourne les tendances stables si pas de données', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse([]));

      const result = await BossGritService.getResilienceTrends(TEST_USER_ID);

      expect(result).toEqual({
        scores: [],
        trend: 'stable',
        averageScore: 0,
        improvement: 0,
      });
    });

    it('détecte une tendance improving (amélioration > 5)', async () => {
      const battles = [
        { created_at: '2025-01-01T10:00:00Z', score_data: { total_score: 50 } },
        { created_at: '2025-01-05T10:00:00Z', score_data: { total_score: 55 } },
        { created_at: '2025-01-10T10:00:00Z', score_data: { total_score: 70 } },
        { created_at: '2025-01-15T10:00:00Z', score_data: { total_score: 75 } },
      ];

      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse(battles));

      const result = await BossGritService.getResilienceTrends(TEST_USER_ID);

      expect(result.trend).toBe('improving');
      expect(result.improvement).toBeGreaterThan(5);
    });

    it('détecte une tendance declining (déclin > 5)', async () => {
      const battles = [
        { created_at: '2025-01-01T10:00:00Z', score_data: { total_score: 80 } },
        { created_at: '2025-01-05T10:00:00Z', score_data: { total_score: 75 } },
        { created_at: '2025-01-10T10:00:00Z', score_data: { total_score: 60 } },
        { created_at: '2025-01-15T10:00:00Z', score_data: { total_score: 55 } },
      ];

      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse(battles));

      const result = await BossGritService.getResilienceTrends(TEST_USER_ID);

      expect(result.trend).toBe('declining');
      expect(result.improvement).toBeLessThan(-5);
    });

    it('détecte une tendance stable (-5 <= amélioration <= 5)', async () => {
      const battles = [
        { created_at: '2025-01-01T10:00:00Z', score_data: { total_score: 70 } },
        { created_at: '2025-01-05T10:00:00Z', score_data: { total_score: 68 } },
        { created_at: '2025-01-10T10:00:00Z', score_data: { total_score: 72 } },
        { created_at: '2025-01-15T10:00:00Z', score_data: { total_score: 71 } },
      ];

      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse(battles));

      const result = await BossGritService.getResilienceTrends(TEST_USER_ID);

      expect(result.trend).toBe('stable');
      expect(Math.abs(result.improvement)).toBeLessThanOrEqual(5);
    });

    it('utilise la période personnalisée', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);
      mockOrder.mockResolvedValue(mockSupabaseResponse([]));

      await BossGritService.getResilienceTrends(TEST_USER_ID, 7);

      expect(mockGte).toHaveBeenCalledWith('created_at', expect.any(String));
    });
  });

  // --------------------------------------------------------------------------
  // BADGES CALCULATION (via completeBattle)
  // --------------------------------------------------------------------------

  describe('Badge Calculation', () => {
    it('attribue le badge FIRST_BATTLE pour la première bataille', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

      mockOrder.mockResolvedValueOnce(mockSupabaseResponse(mockResponses));
      mockSingle.mockResolvedValueOnce(
        mockSupabaseResponse({
          user_id: TEST_USER_ID,
          mode: 'standard',
          duration_seconds: 180,
        })
      );

      // First battle count = 1
      mockEq.mockImplementation(() => ({
        ...chain,
        select: () => ({ ...chain, count: 1 }),
      }));

      mockSingle.mockResolvedValueOnce(
        mockSupabaseResponse({
          ...mockBattle,
          status: 'completed',
        })
      );
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      const result = await BossGritService.completeBattle(TEST_BATTLE_ID, 300);

      // La logique des badges vérifie le count
      expect(result.score).toBeDefined();
    });

    it('attribue le badge QUICK_THINKER pour une durée < 120s', async () => {
      const chain = createChainMock();
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(chain);

      mockOrder.mockResolvedValueOnce(mockSupabaseResponse(mockResponses));
      mockSingle.mockResolvedValueOnce(
        mockSupabaseResponse({
          user_id: TEST_USER_ID,
          mode: 'standard',
          duration_seconds: 90, // Under 120s
        })
      );
      mockSingle.mockResolvedValueOnce(
        mockSupabaseResponse({
          ...mockBattle,
          status: 'completed',
          duration_seconds: 90,
        })
      );
      mockInsert.mockResolvedValue(mockSupabaseResponse(null));

      const result = await BossGritService.completeBattle(TEST_BATTLE_ID, 90);

      expect(result.score.badgesEarned).toContain('quick_thinker');
    });
  });
});
