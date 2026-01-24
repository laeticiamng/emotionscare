/**
 * Hook useAchievements - Tests Complets
 * Tests unitaires pour le hook React useAchievements
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { useAchievements } from '../useAchievements';
import { achievementsService } from '../achievementsService';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('../achievementsService', () => ({
  achievementsService: {
    getAllAchievements: vi.fn(),
    getUserProgress: vi.fn(),
    getUnlockedAchievements: vi.fn(),
    getUserStats: vi.fn(),
    getUserBadges: vi.fn(),
    getUnnotifiedAchievements: vi.fn(),
    recordProgress: vi.fn(),
    markAsNotified: vi.fn(),
  },
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com' };

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

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

const mockAchievements = [
  {
    id: 'ach-1',
    name: 'Premier Pas',
    description: 'Complétez votre première session',
    icon: '🌟',
    category: 'onboarding',
    rarity: 'common',
    conditions: [{ type: 'sessions', value: 1 }],
    rewards: { xp: 100, badge: true },
  },
  {
    id: 'ach-2',
    name: 'Marathonien',
    description: 'Complétez 10 sessions',
    icon: '🏃',
    category: 'engagement',
    rarity: 'rare',
    conditions: [{ type: 'sessions', value: 10 }],
    rewards: { xp: 500 },
  },
  {
    id: 'ach-3',
    name: 'Maître Zen',
    description: 'Atteignez 100 sessions',
    icon: '🧘',
    category: 'engagement',
    rarity: 'legendary',
    conditions: [{ type: 'sessions', value: 100 }],
    rewards: { xp: 2000, badge: true },
  },
];

const mockProgress = [
  {
    id: 'prog-1',
    user_id: 'test-user-id',
    achievement_id: 'ach-1',
    current_value: 1,
    target_value: 1,
    progress: 100,
    unlocked: true,
    notified: true,
    unlocked_at: new Date().toISOString(),
  },
  {
    id: 'prog-2',
    user_id: 'test-user-id',
    achievement_id: 'ach-2',
    current_value: 5,
    target_value: 10,
    progress: 50,
    unlocked: false,
    notified: false,
  },
];

const mockStats = {
  total_achievements: 3,
  unlocked_achievements: 1,
  unlock_percentage: 33.33,
  common_count: 1,
  rare_count: 0,
  epic_count: 0,
  legendary_count: 0,
  total_xp_earned: 500,
  recent_unlocks: [mockProgress[0]],
};

const mockBadges = [
  {
    id: 'badge-1',
    user_id: 'test-user-id',
    name: 'Premier Pas',
    description: 'Badge de bienvenue',
    image_url: 'https://example.com/badge.png',
    awarded_at: new Date().toISOString(),
  },
];

// ============================================================================
// TESTS
// ============================================================================

describe('useAchievements Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();

    // Default mock implementations
    (achievementsService.getAllAchievements as ReturnType<typeof vi.fn>).mockResolvedValue(mockAchievements);
    (achievementsService.getUserProgress as ReturnType<typeof vi.fn>).mockResolvedValue(mockProgress);
    (achievementsService.getUnlockedAchievements as ReturnType<typeof vi.fn>).mockResolvedValue([mockProgress[0]]);
    (achievementsService.getUserStats as ReturnType<typeof vi.fn>).mockResolvedValue(mockStats);
    (achievementsService.getUserBadges as ReturnType<typeof vi.fn>).mockResolvedValue(mockBadges);
    (achievementsService.getUnnotifiedAchievements as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (achievementsService.recordProgress as ReturnType<typeof vi.fn>).mockResolvedValue(mockProgress[0]);
    (achievementsService.markAsNotified as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
  });

  afterEach(() => {
    queryClient.clear();
  });

  // --------------------------------------------------------------------------
  // INITIAL STATE & DATA LOADING
  // --------------------------------------------------------------------------

  describe('Initial State & Data Loading', () => {
    it('charge tous les achievements au montage', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(achievementsService.getAllAchievements).toHaveBeenCalledWith(false);
      expect(result.current.achievements).toEqual(mockAchievements);
    });

    it('charge la progression de l\'utilisateur', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(achievementsService.getUserProgress).toHaveBeenCalledWith('test-user-id');
      expect(result.current.userProgress).toEqual(mockProgress);
    });

    it('charge les achievements débloqués', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(achievementsService.getUnlockedAchievements).toHaveBeenCalledWith('test-user-id');
      expect(result.current.unlockedAchievements).toHaveLength(1);
    });

    it('charge les statistiques', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.stats).not.toBeNull();
      });

      expect(achievementsService.getUserStats).toHaveBeenCalledWith('test-user-id');
      expect(result.current.stats).toEqual(mockStats);
    });

    it('charge les badges', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(achievementsService.getUserBadges).toHaveBeenCalledWith('test-user-id');
      expect(result.current.badges).toEqual(mockBadges);
    });

    it('compte les achievements non notifiés', async () => {
      (achievementsService.getUnnotifiedAchievements as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockProgress[0],
        mockProgress[1],
      ]);

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.unnotifiedCount).toBe(2);
      });
    });
  });

  // --------------------------------------------------------------------------
  // RECORD PROGRESS
  // --------------------------------------------------------------------------

  describe('recordProgress', () => {
    it('enregistre la progression avec succès', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.recordProgress({
          achievement_id: 'ach-2',
          increment: 1,
        });
      });

      expect(achievementsService.recordProgress).toHaveBeenCalledWith('test-user-id', {
        achievement_id: 'ach-2',
        increment: 1,
      });
    });

    it('affiche un toast de succès lors du déverrouillage', async () => {
      const unlockedProgress = {
        ...mockProgress[1],
        unlocked: true,
        progress: 100,
      };
      (achievementsService.recordProgress as ReturnType<typeof vi.fn>).mockResolvedValue(unlockedProgress);

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.recordProgress({
          achievement_id: 'ach-2',
          increment: 5,
        });
      });

      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Marathonien'),
        expect.objectContaining({
          description: expect.any(String),
        })
      );
    });

    it('invalide le cache après enregistrement', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.recordProgress({
          achievement_id: 'ach-1',
          increment: 1,
        });
      });

      expect(invalidateSpy).toHaveBeenCalled();
    });

    it('gère les erreurs d\'enregistrement', async () => {
      (achievementsService.recordProgress as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Record failed'));

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.recordProgress({
            achievement_id: 'ach-1',
            increment: 1,
          });
        })
      ).rejects.toThrow('Record failed');

      expect(toast.error).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // MARK AS NOTIFIED
  // --------------------------------------------------------------------------

  describe('markAsNotified', () => {
    it('marque les achievements comme notifiés', async () => {
      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markAsNotified(['ach-1', 'ach-2']);
      });

      expect(achievementsService.markAsNotified).toHaveBeenCalledWith('test-user-id', ['ach-1', 'ach-2']);
    });

    it('invalide le cache des non-notifiés', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markAsNotified(['ach-1']);
      });

      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // REFRESH ACHIEVEMENTS
  // --------------------------------------------------------------------------

  describe('refreshAchievements', () => {
    it('rafraîchit toutes les données', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshAchievements();
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['achievements'] });
    });
  });

  // --------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // --------------------------------------------------------------------------

  describe('Helper Functions', () => {
    describe('getAchievementById', () => {
      it('retourne l\'achievement correspondant', async () => {
        const { result } = renderHook(() => useAchievements(), {
          wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        const achievement = result.current.getAchievementById('ach-1');

        expect(achievement).toEqual(mockAchievements[0]);
      });

      it('retourne undefined si non trouvé', async () => {
        const { result } = renderHook(() => useAchievements(), {
          wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        const achievement = result.current.getAchievementById('non-existent');

        expect(achievement).toBeUndefined();
      });
    });

    describe('getProgressForAchievement', () => {
      it('retourne la progression correspondante', async () => {
        const { result } = renderHook(() => useAchievements(), {
          wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        const progress = result.current.getProgressForAchievement('ach-1');

        expect(progress).toEqual(mockProgress[0]);
      });

      it('retourne undefined si pas de progression', async () => {
        const { result } = renderHook(() => useAchievements(), {
          wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        const progress = result.current.getProgressForAchievement('ach-3');

        expect(progress).toBeUndefined();
      });
    });

    describe('isUnlocked', () => {
      it('retourne true si l\'achievement est débloqué', async () => {
        const { result } = renderHook(() => useAchievements(), {
          wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isUnlocked('ach-1')).toBe(true);
      });

      it('retourne false si l\'achievement n\'est pas débloqué', async () => {
        const { result } = renderHook(() => useAchievements(), {
          wrapper: createWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.isUnlocked('ach-2')).toBe(false);
        expect(result.current.isUnlocked('ach-3')).toBe(false);
      });
    });
  });

  // --------------------------------------------------------------------------
  // ERROR HANDLING
  // --------------------------------------------------------------------------

  describe('Error Handling', () => {
    it('expose l\'erreur si le chargement échoue', async () => {
      (achievementsService.getAllAchievements as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Fetch failed');
    });

    it('gère les erreurs de getUserProgress gracieusement', async () => {
      (achievementsService.getUserProgress as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Progress error'));

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should still have achievements loaded
      expect(result.current.achievements).toEqual(mockAchievements);
      // Progress should be empty array
      expect(result.current.userProgress).toEqual([]);
    });
  });

  // --------------------------------------------------------------------------
  // LOADING STATES
  // --------------------------------------------------------------------------

  describe('Loading States', () => {
    it('isLoading est true pendant le chargement initial', async () => {
      let resolveAchievements: (value: unknown) => void;
      (achievementsService.getAllAchievements as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((resolve) => {
          resolveAchievements = resolve;
        })
      );

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveAchievements!(mockAchievements);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('isLoading combine tous les états de chargement', async () => {
      // Slow down all queries
      const slowPromise = () => new Promise((resolve) => setTimeout(() => resolve([]), 100));

      (achievementsService.getAllAchievements as ReturnType<typeof vi.fn>).mockImplementation(slowPromise);
      (achievementsService.getUserProgress as ReturnType<typeof vi.fn>).mockImplementation(slowPromise);
      (achievementsService.getUnlockedAchievements as ReturnType<typeof vi.fn>).mockImplementation(slowPromise);
      (achievementsService.getUserStats as ReturnType<typeof vi.fn>).mockImplementation(slowPromise);
      (achievementsService.getUserBadges as ReturnType<typeof vi.fn>).mockImplementation(slowPromise);

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      // Should be loading initially
      expect(result.current.isLoading).toBe(true);

      // Wait for all to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 500 });
    });
  });

  // --------------------------------------------------------------------------
  // STATS CALCULATIONS
  // --------------------------------------------------------------------------

  describe('Stats', () => {
    it('retourne null stats si pas de données', async () => {
      (achievementsService.getUserStats as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.stats).toBeNull();
    });

    it('expose les compteurs par rareté', async () => {
      const detailedStats = {
        ...mockStats,
        common_count: 5,
        rare_count: 3,
        epic_count: 2,
        legendary_count: 1,
      };
      (achievementsService.getUserStats as ReturnType<typeof vi.fn>).mockResolvedValue(detailedStats);

      const { result } = renderHook(() => useAchievements(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.stats).not.toBeNull();
      });

      expect(result.current.stats?.common_count).toBe(5);
      expect(result.current.stats?.rare_count).toBe(3);
      expect(result.current.stats?.epic_count).toBe(2);
      expect(result.current.stats?.legendary_count).toBe(1);
    });
  });
});
