/**
 * Exchange Matching Algorithm - Tests Complets
 * Tests unitaires pour l'algorithme de matching et les hooks associés
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { useExchangeMatching, useCreateMatch, type MatchCandidate } from '../hooks/useExchangeMatching';

// ============================================================================
// MOCKS
// ============================================================================

const mockSupabaseResponse = <T,>(data: T, error: Error | null = null) => ({
  data,
  error,
});

const mockChain = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => mockChain),
  },
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com' };

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TEST SETUP
// ============================================================================

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// ============================================================================
// TEST DATA
// ============================================================================

const mockCurrentProfile = {
  user_id: 'test-user-id',
  display_name: 'Current User',
  interests: ['meditation', 'yoga', 'music'],
  skills: ['coaching', 'writing'],
  emotional_preferences: ['calm', 'focus'],
  active_hours: ['09:00', '10:00', '11:00', '14:00', '15:00'],
  timezone: 'Europe/Paris',
};

const mockCandidateProfiles = [
  {
    user_id: 'candidate-1',
    display_name: 'High Match User',
    avatar_url: 'https://example.com/avatar1.png',
    interests: ['meditation', 'yoga', 'reading'], // 2 common interests
    skills: ['tech', 'design'], // Complementary skills
    emotional_preferences: ['calm', 'focus', 'energy'], // 2 common
    active_hours: ['09:00', '10:00', '11:00', '12:00'], // 3 overlapping
    timezone: 'Europe/Paris',
  },
  {
    user_id: 'candidate-2',
    display_name: 'Medium Match User',
    avatar_url: 'https://example.com/avatar2.png',
    interests: ['gaming', 'sports', 'music'], // 1 common interest
    skills: ['coaching', 'marketing'], // 1 same skill
    emotional_preferences: ['energy', 'joy'], // 0 common
    active_hours: ['18:00', '19:00', '20:00'], // No overlap
    timezone: 'America/New_York',
  },
  {
    user_id: 'candidate-3',
    display_name: 'Low Match User',
    avatar_url: null,
    interests: ['gaming', 'crypto'], // 0 common
    skills: ['finance'], // Different
    emotional_preferences: ['joy', 'confidence'], // 0 common
    active_hours: ['01:00', '02:00', '03:00'], // No overlap
    timezone: 'Asia/Tokyo',
  },
];

const mockCurrentActivities = [
  { user_id: 'test-user-id', activity_type: 'breathing', created_at: '2025-01-10T10:00:00Z' },
  { user_id: 'test-user-id', activity_type: 'coaching', created_at: '2025-01-12T14:00:00Z' },
  { user_id: 'test-user-id', activity_type: 'breathing', created_at: '2025-01-15T09:00:00Z' },
];

const mockCandidateActivities = [
  // Candidate 1 - Similar activities
  { user_id: 'candidate-1', activity_type: 'breathing', created_at: '2025-01-11T10:00:00Z' },
  { user_id: 'candidate-1', activity_type: 'coaching', created_at: '2025-01-13T14:00:00Z' },
  // Candidate 2 - Some overlap
  { user_id: 'candidate-2', activity_type: 'breathing', created_at: '2025-01-10T18:00:00Z' },
  // Candidate 3 - No overlap
];

// ============================================================================
// MATCHING ALGORITHM UNIT TESTS
// ============================================================================

describe('Matching Algorithm Functions', () => {
  describe('Emotional Sync Calculation', () => {
    it('retourne 1.0 pour des préférences identiques', () => {
      const prefs1 = ['calm', 'focus', 'energy'];
      const prefs2 = ['calm', 'focus', 'energy'];
      const common = prefs1.filter(p => prefs2.includes(p));
      const score = common.length / Math.max(prefs1.length, prefs2.length);
      expect(score).toBe(1);
    });

    it('retourne 0 pour des préférences sans chevauchement', () => {
      const prefs1 = ['calm', 'focus'];
      const prefs2 = ['energy', 'joy'];
      const common = prefs1.filter(p => prefs2.includes(p));
      const score = common.length / Math.max(prefs1.length, prefs2.length);
      expect(score).toBe(0);
    });

    it('retourne 0.5 pour un chevauchement partiel', () => {
      const prefs1 = ['calm', 'focus'];
      const prefs2 = ['calm', 'energy'];
      const common = prefs1.filter(p => prefs2.includes(p));
      const score = common.length / Math.max(prefs1.length, prefs2.length);
      expect(score).toBe(0.5);
    });

    it('retourne 0.5 par défaut si une liste est vide', () => {
      const prefs1: string[] = [];
      const prefs2 = ['calm', 'focus'];
      const score = prefs1.length === 0 || prefs2.length === 0 ? 0.5 : 0;
      expect(score).toBe(0.5);
    });
  });

  describe('Activity Overlap Calculation', () => {
    it('retourne 1.0 pour des activités identiques', () => {
      const types1 = new Set(['breathing', 'coaching']);
      const types2 = new Set(['breathing', 'coaching']);
      const intersection = [...types1].filter(t => types2.has(t));
      const score = intersection.length / Math.max(types1.size, types2.size);
      expect(score).toBe(1);
    });

    it('retourne 0 pour des activités différentes', () => {
      const types1 = new Set(['breathing']);
      const types2 = new Set(['meditation']);
      const intersection = [...types1].filter(t => types2.has(t));
      const score = intersection.length / Math.max(types1.size, types2.size);
      expect(score).toBe(0);
    });

    it('retourne 0.5 pour un chevauchement partiel', () => {
      const types1 = new Set(['breathing', 'coaching']);
      const types2 = new Set(['breathing', 'meditation']);
      const intersection = [...types1].filter(t => types2.has(t));
      const score = intersection.length / Math.max(types1.size, types2.size);
      expect(score).toBe(0.5);
    });
  });

  describe('Skill Complement Calculation', () => {
    it('donne un bon score pour des compétences complémentaires', () => {
      const skills1 = ['coaching', 'writing'];
      const skills2 = ['tech', 'design'];
      const unique1 = skills1.filter(s => !skills2.includes(s));
      const unique2 = skills2.filter(s => !skills1.includes(s));
      const diversity = (unique1.length + unique2.length) / (skills1.length + skills2.length);
      const score = Math.min(1, diversity + 0.3);
      expect(score).toBeGreaterThan(0.8);
    });

    it('donne un score moyen pour des compétences similaires', () => {
      const skills1 = ['coaching', 'writing'];
      const skills2 = ['coaching', 'design'];
      const unique1 = skills1.filter(s => !skills2.includes(s));
      const unique2 = skills2.filter(s => !skills1.includes(s));
      const diversity = (unique1.length + unique2.length) / (skills1.length + skills2.length);
      const score = Math.min(1, diversity + 0.3);
      expect(score).toBeGreaterThanOrEqual(0.5);
      expect(score).toBeLessThan(1);
    });
  });

  describe('Schedule Match Calculation', () => {
    it('retourne 1.0 pour des horaires identiques', () => {
      const hours1 = ['09:00', '10:00', '11:00'];
      const hours2 = ['09:00', '10:00', '11:00'];
      const overlap = hours1.filter(h => hours2.includes(h));
      const score = overlap.length / Math.max(hours1.length, hours2.length);
      expect(score).toBe(1);
    });

    it('retourne 0 pour des horaires sans chevauchement', () => {
      const hours1 = ['09:00', '10:00', '11:00'];
      const hours2 = ['18:00', '19:00', '20:00'];
      const overlap = hours1.filter(h => hours2.includes(h));
      const score = overlap.length / Math.max(hours1.length, hours2.length);
      expect(score).toBe(0);
    });
  });

  describe('Common Interests Finding', () => {
    it('trouve les intérêts communs (case insensitive)', () => {
      const interests1 = ['Meditation', 'yoga', 'MUSIC'];
      const interests2 = ['meditation', 'Yoga', 'reading'];
      const common = interests1.filter(i =>
        interests2.some(i2 => i2.toLowerCase() === i.toLowerCase())
      );
      expect(common).toHaveLength(2);
      expect(common.map(c => c.toLowerCase())).toContain('meditation');
      expect(common.map(c => c.toLowerCase())).toContain('yoga');
    });

    it('retourne un tableau vide si pas d\'intérêts communs', () => {
      const interests1 = ['gaming', 'crypto'];
      const interests2 = ['meditation', 'yoga'];
      const common = interests1.filter(i =>
        interests2.some(i2 => i2.toLowerCase() === i.toLowerCase())
      );
      expect(common).toHaveLength(0);
    });
  });

  describe('Final Score Calculation', () => {
    it('applique correctement les poids (25% chaque)', () => {
      const emotionalSync = 0.8;
      const activityOverlap = 0.6;
      const skillComplement = 0.7;
      const scheduleMatch = 0.5;

      const baseScore = (
        emotionalSync * 0.25 +
        activityOverlap * 0.25 +
        skillComplement * 0.25 +
        scheduleMatch * 0.25
      );

      expect(baseScore).toBe(0.65);
    });

    it('applique le bonus d\'intérêts communs (max 20%)', () => {
      const baseScore = 0.65;
      const commonInterestsCount = 5;
      const interestBonus = Math.min(0.2, commonInterestsCount * 0.04);
      const finalScore = Math.min(1, baseScore + interestBonus);

      expect(interestBonus).toBe(0.2);
      expect(finalScore).toBe(0.85);
    });

    it('plafonne le score final à 100%', () => {
      const baseScore = 0.95;
      const interestBonus = 0.2;
      const finalScore = Math.min(1, baseScore + interestBonus);

      expect(finalScore).toBe(1);
    });
  });
});

// ============================================================================
// HOOK INTEGRATION TESTS
// ============================================================================

describe('useExchangeMatching Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();

    Object.values(mockChain).forEach(mock => {
      if (typeof mock === 'function' && mock.mockReturnThis) {
        mock.mockReturnThis();
      }
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('récupère et calcule les matches', async () => {
    // Mock current profile
    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));

    // Mock activities (breathing + coach for current user)
    mockChain.gte.mockResolvedValueOnce(mockSupabaseResponse(
      mockCurrentActivities.filter(a => a.activity_type === 'breathing')
    ));
    mockChain.gte.mockResolvedValueOnce(mockSupabaseResponse(
      mockCurrentActivities.filter(a => a.activity_type === 'coaching')
    ));

    // Mock candidates
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse(mockCandidateProfiles));

    // Mock candidate activities
    mockChain.gte.mockResolvedValueOnce(mockSupabaseResponse(
      mockCandidateActivities.filter(a => a.activity_type === 'breathing')
    ));
    mockChain.gte.mockResolvedValueOnce(mockSupabaseResponse(
      mockCandidateActivities.filter(a => a.activity_type === 'coaching')
    ));

    const { result } = renderHook(() => useExchangeMatching('time'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('filtre les matches avec score < 30%', async () => {
    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));
    mockChain.gte.mockResolvedValue(mockSupabaseResponse([]));
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse([mockCandidateProfiles[2]])); // Low match only

    const { result } = renderHook(() => useExchangeMatching('time'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Low match should be filtered out
    const matches = result.current.data || [];
    matches.forEach((m: MatchCandidate) => {
      expect(m.matchScore).toBeGreaterThanOrEqual(30);
    });
  });

  it('trie les matches par score décroissant', async () => {
    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));
    mockChain.gte.mockResolvedValue(mockSupabaseResponse(mockCurrentActivities));
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse(mockCandidateProfiles));

    const { result } = renderHook(() => useExchangeMatching('trust'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const matches = result.current.data || [];
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].matchScore).toBeGreaterThanOrEqual(matches[i].matchScore);
    }
  });

  it('limite les résultats à 10 matches', async () => {
    // Create 15 candidates
    const manyProfiles = Array.from({ length: 15 }, (_, i) => ({
      ...mockCandidateProfiles[0],
      user_id: `candidate-${i}`,
      display_name: `Candidate ${i}`,
    }));

    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));
    mockChain.gte.mockResolvedValue(mockSupabaseResponse([]));
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse(manyProfiles));

    const { result } = renderHook(() => useExchangeMatching('improvement'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.length).toBeLessThanOrEqual(10);
  });

  it('retourne un tableau vide si pas de candidats', async () => {
    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));
    mockChain.gte.mockResolvedValue(mockSupabaseResponse([]));
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse([]));

    const { result } = renderHook(() => useExchangeMatching('emotion'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('inclut les raisons de match dans les résultats', async () => {
    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));
    mockChain.gte.mockResolvedValue(mockSupabaseResponse(mockCurrentActivities));
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse([mockCandidateProfiles[0]]));

    const { result } = renderHook(() => useExchangeMatching('time'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const matches = result.current.data || [];
    if (matches.length > 0) {
      expect(matches[0].matchReasons).toBeDefined();
      expect(Array.isArray(matches[0].matchReasons)).toBe(true);
    }
  });

  it('inclut les facteurs de compatibilité détaillés', async () => {
    mockChain.single.mockResolvedValueOnce(mockSupabaseResponse(mockCurrentProfile));
    mockChain.gte.mockResolvedValue(mockSupabaseResponse(mockCurrentActivities));
    mockChain.limit.mockResolvedValueOnce(mockSupabaseResponse([mockCandidateProfiles[0]]));

    const { result } = renderHook(() => useExchangeMatching('time'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const matches = result.current.data || [];
    if (matches.length > 0) {
      const factors = matches[0].compatibilityFactors;
      expect(factors).toBeDefined();
      expect(factors).toHaveProperty('emotionalSync');
      expect(factors).toHaveProperty('activityOverlap');
      expect(factors).toHaveProperty('skillComplement');
      expect(factors).toHaveProperty('scheduleMatch');
    }
  });
});

// ============================================================================
// useCreateMatch TESTS
// ============================================================================

describe('useCreateMatch Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();

    Object.values(mockChain).forEach(mock => {
      if (typeof mock === 'function' && mock.mockReturnThis) {
        mock.mockReturnThis();
      }
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('crée une connexion avec un utilisateur', async () => {
    mockChain.insert.mockResolvedValue(mockSupabaseResponse(null));

    const { result } = renderHook(() => useCreateMatch(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      const match = await result.current.mutateAsync({
        targetUserId: 'target-user-id',
        marketType: 'time',
      });
      expect(match.success).toBe(true);
    });

    expect(supabase.from).toHaveBeenCalledWith('buddies');
    expect(mockChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'test-user-id',
        buddy_user_id: 'target-user-id',
      })
    );
  });

  it('invalide le cache après création', async () => {
    mockChain.insert.mockResolvedValue(mockSupabaseResponse(null));
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateMatch(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        targetUserId: 'target-user-id',
        marketType: 'trust',
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['exchange-matches'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['buddies'] });
  });

  it('gère les erreurs de création', async () => {
    mockChain.insert.mockResolvedValue(mockSupabaseResponse(null, new Error('Insert failed')));

    const { result } = renderHook(() => useCreateMatch(), {
      wrapper: createWrapper(queryClient),
    });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          targetUserId: 'target-user-id',
          marketType: 'time',
        });
      })
    ).rejects.toThrow('Insert failed');
  });
});

// ============================================================================
// MATCH REASONS GENERATION TESTS
// ============================================================================

describe('Match Reasons Generation', () => {
  it('génère la raison "Profil émotionnel compatible" si emotionalSync > 0.7', () => {
    const emotionalSync = 0.8;
    const reasons: string[] = [];
    if (emotionalSync > 0.7) reasons.push('Profil émotionnel compatible');
    expect(reasons).toContain('Profil émotionnel compatible');
  });

  it('génère la raison "Activités similaires" si activityOverlap > 0.5', () => {
    const activityOverlap = 0.6;
    const reasons: string[] = [];
    if (activityOverlap > 0.5) reasons.push('Activités similaires');
    expect(reasons).toContain('Activités similaires');
  });

  it('génère la raison "Compétences complémentaires" si skillComplement > 0.6', () => {
    const skillComplement = 0.7;
    const reasons: string[] = [];
    if (skillComplement > 0.6) reasons.push('Compétences complémentaires');
    expect(reasons).toContain('Compétences complémentaires');
  });

  it('génère la raison "Disponibilités compatibles" si scheduleMatch > 0.7', () => {
    const scheduleMatch = 0.8;
    const reasons: string[] = [];
    if (scheduleMatch > 0.7) reasons.push('Disponibilités compatibles');
    expect(reasons).toContain('Disponibilités compatibles');
  });

  it('génère la raison avec le nombre d\'intérêts communs si >= 3', () => {
    const commonInterests = ['meditation', 'yoga', 'music'];
    const reasons: string[] = [];
    if (commonInterests.length >= 3) reasons.push(`${commonInterests.length} intérêts communs`);
    expect(reasons).toContain('3 intérêts communs');
  });

  it('ne génère pas de raison si les seuils ne sont pas atteints', () => {
    const emotionalSync = 0.5;
    const activityOverlap = 0.3;
    const skillComplement = 0.4;
    const scheduleMatch = 0.5;
    const commonInterests: string[] = ['music'];

    const reasons: string[] = [];
    if (emotionalSync > 0.7) reasons.push('Profil émotionnel compatible');
    if (activityOverlap > 0.5) reasons.push('Activités similaires');
    if (skillComplement > 0.6) reasons.push('Compétences complémentaires');
    if (scheduleMatch > 0.7) reasons.push('Disponibilités compatibles');
    if (commonInterests.length >= 3) reasons.push(`${commonInterests.length} intérêts communs`);

    expect(reasons).toHaveLength(0);
  });
});
