/**
 * Tests pour hooks useUserQuota
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useUserQuota,
  useCanGenerateWithDuration,
  useConcurrentGenerations,
  useTierLimits,
  useFormattedResetDate,
  useQuotaColor,
  useQuotaUI
} from '../useUserQuota';
import { supabase } from '@/integrations/supabase/client';
import { quotaService, UserTier } from '@/services/music/quota-service';
import type { UserQuota, QuotaStatus } from '@/services/music/quota-service';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    }
  }
}));

// Mock quotaService
vi.mock('@/services/music/quota-service', () => ({
  quotaService: {
    getUsageStats: vi.fn(),
    canGenerateWithDuration: vi.fn(),
    checkConcurrentGenerations: vi.fn(),
    getLimitsForTier: vi.fn()
  },
  UserTier: {
    FREE: 'FREE',
    PREMIUM: 'PREMIUM',
    ENTERPRISE: 'ENTERPRISE'
  }
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('useUserQuota Hooks', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockUser = { id: mockUserId, email: 'test@example.com' };

  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0
        }
      }
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock auth.getUser par défaut
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useUserQuota', () => {
    it('should return default values when loading', () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      // Initial state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.canGenerate).toBe(false);
      expect(result.current.remaining).toBe(0);
      expect(result.current.limit).toBe(0);
    });

    it('should fetch and return quota stats', async () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canGenerate).toBe(true);
      expect(result.current.remaining).toBe(5);
      expect(result.current.limit).toBe(10);
      expect(result.current.percentage).toBe(50);
      expect(result.current.tier).toBe('FREE');
      expect(result.current.concurrentCurrent).toBe(0);
      expect(result.current.concurrentLimit).toBe(1);
    });

    it('should handle quota exhausted', async () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 10,
          generations_limit: 10,
          reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: false,
          remaining: 0,
          limit: 10,
          percentage: 100,
          tier: 'FREE' as UserTier,
          resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          reason: 'Quota épuisé'
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canGenerate).toBe(false);
      expect(result.current.remaining).toBe(0);
      expect(result.current.percentage).toBe(100);
      expect(result.current.reason).toBe('Quota épuisé');
    });

    it('should handle premium user', async () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 50,
          generations_limit: 100,
          reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_premium: true,
          concurrent_generations_limit: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 50,
          limit: 100,
          percentage: 50,
          tier: 'PREMIUM' as UserTier,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 1,
          limit: 3
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.tier).toBe('PREMIUM');
      expect(result.current.limit).toBe(100);
      expect(result.current.concurrentLimit).toBe(3);
    });

    it('should handle no user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null
      } as any);

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canGenerate).toBe(false);
      expect(result.current.remaining).toBe(0);
    });

    it('should handle fetch error', async () => {
      vi.mocked(quotaService.getUsageStats).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should return default values on error
      expect(result.current.canGenerate).toBe(false);
    });

    it('should provide refetch function', async () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useUserQuota(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.refetch).toBe('function');
      expect(typeof result.current.invalidate).toBe('function');
    });
  });

  describe('useCanGenerateWithDuration', () => {
    it('should check if can generate with duration', async () => {
      vi.mocked(quotaService.canGenerateWithDuration).mockResolvedValue({
        canGenerate: true
      });

      const { result } = renderHook(() => useCanGenerateWithDuration(180), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.canGenerate).toBe(true);
      expect(quotaService.canGenerateWithDuration).toHaveBeenCalledWith(
        mockUserId,
        180
      );
    });

    it('should reject duration too long', async () => {
      vi.mocked(quotaService.canGenerateWithDuration).mockResolvedValue({
        canGenerate: false,
        reason: 'Durée trop longue pour votre tier'
      });

      const { result } = renderHook(() => useCanGenerateWithDuration(600), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.canGenerate).toBe(false);
      expect(result.current.data?.reason).toBe('Durée trop longue pour votre tier');
    });

    it('should not fetch without duration', async () => {
      const { result } = renderHook(() => useCanGenerateWithDuration(undefined), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(quotaService.canGenerateWithDuration).not.toHaveBeenCalled();
    });

    it('should not fetch without user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null
      } as any);

      const { result } = renderHook(() => useCanGenerateWithDuration(180), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(quotaService.canGenerateWithDuration).not.toHaveBeenCalled();
    });
  });

  describe('useConcurrentGenerations', () => {
    it('should check concurrent generations', async () => {
      vi.mocked(quotaService.checkConcurrentGenerations).mockResolvedValue({
        canGenerate: true,
        current: 1,
        limit: 3
      });

      const { result } = renderHook(() => useConcurrentGenerations(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.canGenerate).toBe(true);
      expect(result.current.data?.current).toBe(1);
      expect(result.current.data?.limit).toBe(3);
    });

    it('should reject when limit reached', async () => {
      vi.mocked(quotaService.checkConcurrentGenerations).mockResolvedValue({
        canGenerate: false,
        current: 3,
        limit: 3,
        reason: 'Trop de générations en cours'
      });

      const { result } = renderHook(() => useConcurrentGenerations(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data?.canGenerate).toBe(false);
      expect(result.current.data?.reason).toBe('Trop de générations en cours');
    });

    it('should not fetch without user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null
      } as any);

      const { result } = renderHook(() => useConcurrentGenerations(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(quotaService.checkConcurrentGenerations).not.toHaveBeenCalled();
    });
  });

  describe('useTierLimits', () => {
    it('should return tier limits for FREE', async () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: new Date().toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: new Date().toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);
      vi.mocked(quotaService.getLimitsForTier).mockReturnValue({
        generations: 10,
        durationMax: 180,
        concurrentGenerations: 1
      });

      const { result } = renderHook(() => useTierLimits(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      expect(result.current).toEqual({
        generations: 10,
        durationMax: 180,
        concurrentGenerations: 1
      });
    });

    it('should return tier limits for PREMIUM', async () => {
      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 50,
          generations_limit: 100,
          reset_date: new Date().toISOString(),
          is_premium: true,
          concurrent_generations_limit: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 50,
          limit: 100,
          percentage: 50,
          tier: 'PREMIUM' as UserTier,
          resetDate: new Date().toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 3
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);
      vi.mocked(quotaService.getLimitsForTier).mockReturnValue({
        generations: 100,
        durationMax: 600,
        concurrentGenerations: 3
      });

      const { result } = renderHook(() => useTierLimits(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      expect(result.current).toEqual({
        generations: 100,
        durationMax: 600,
        concurrentGenerations: 3
      });
    });

    it('should return null when no tier', async () => {
      vi.mocked(quotaService.getUsageStats).mockResolvedValue(null as any);

      const { result } = renderHook(() => useTierLimits(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBeNull();
      });
    });
  });

  describe('useFormattedResetDate', () => {
    it('should format date as "Aujourd\'hui"', async () => {
      const resetDate = new Date();
      resetDate.setHours(23, 59, 59, 999); // End of today

      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: resetDate.toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: resetDate.toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useFormattedResetDate(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe("Aujourd'hui");
      });
    });

    it('should format date as "Demain"', async () => {
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 1);

      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: resetDate.toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: resetDate.toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useFormattedResetDate(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe('Demain');
      });
    });

    it('should format date as "Dans X jours"', async () => {
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 5);

      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: resetDate.toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: resetDate.toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useFormattedResetDate(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe('Dans 5 jours');
      });
    });

    it('should format full date for > 7 days', async () => {
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 30);

      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: resetDate.toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: resetDate.toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useFormattedResetDate(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBeTruthy();
        // Should contain month name in French
        expect(result.current).toMatch(/[a-zéû]+/i);
      });
    });

    it('should return null when no reset date', async () => {
      vi.mocked(quotaService.getUsageStats).mockResolvedValue(null as any);

      const { result } = renderHook(() => useFormattedResetDate(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBeNull();
      });
    });
  });

  describe('useQuotaColor', () => {
    it('should return green for < 50%', async () => {
      const mockStats = {
        quota: {} as UserQuota,
        status: {
          canGenerate: true,
          remaining: 8,
          limit: 10,
          percentage: 20,
          tier: 'FREE' as UserTier,
          resetDate: new Date().toISOString()
        } as QuotaStatus,
        concurrent: { current: 0, limit: 1 }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useQuotaColor(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe('green');
      });
    });

    it('should return yellow for 50-69%', async () => {
      const mockStats = {
        quota: {} as UserQuota,
        status: {
          canGenerate: true,
          remaining: 4,
          limit: 10,
          percentage: 60,
          tier: 'FREE' as UserTier,
          resetDate: new Date().toISOString()
        } as QuotaStatus,
        concurrent: { current: 0, limit: 1 }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useQuotaColor(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe('yellow');
      });
    });

    it('should return orange for 70-89%', async () => {
      const mockStats = {
        quota: {} as UserQuota,
        status: {
          canGenerate: true,
          remaining: 2,
          limit: 10,
          percentage: 80,
          tier: 'FREE' as UserTier,
          resetDate: new Date().toISOString()
        } as QuotaStatus,
        concurrent: { current: 0, limit: 1 }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useQuotaColor(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe('orange');
      });
    });

    it('should return red for >= 90%', async () => {
      const mockStats = {
        quota: {} as UserQuota,
        status: {
          canGenerate: false,
          remaining: 0,
          limit: 10,
          percentage: 100,
          tier: 'FREE' as UserTier,
          resetDate: new Date().toISOString()
        } as QuotaStatus,
        concurrent: { current: 0, limit: 1 }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);

      const { result } = renderHook(() => useQuotaColor(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current).toBe('red');
      });
    });
  });

  describe('useQuotaUI', () => {
    it('should combine all UI hooks', async () => {
      const resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 5);

      const mockStats = {
        quota: {
          user_id: mockUserId,
          generations_used: 5,
          generations_limit: 10,
          reset_date: resetDate.toISOString(),
          is_premium: false,
          concurrent_generations_limit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserQuota,
        status: {
          canGenerate: true,
          remaining: 5,
          limit: 10,
          percentage: 50,
          tier: 'FREE' as UserTier,
          resetDate: resetDate.toISOString()
        } as QuotaStatus,
        concurrent: {
          current: 0,
          limit: 1
        }
      };

      vi.mocked(quotaService.getUsageStats).mockResolvedValue(mockStats);
      vi.mocked(quotaService.getLimitsForTier).mockReturnValue({
        generations: 10,
        durationMax: 180,
        concurrentGenerations: 1
      });

      const { result } = renderHook(() => useQuotaUI(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should include all data from useUserQuota
      expect(result.current.canGenerate).toBe(true);
      expect(result.current.remaining).toBe(5);
      expect(result.current.limit).toBe(10);
      expect(result.current.percentage).toBe(50);

      // Should include formatted reset date
      expect(result.current.formattedResetDate).toBe('Dans 5 jours');

      // Should include quota color
      expect(result.current.quotaColor).toBe('yellow');

      // Should include tier limits
      expect(result.current.tierLimits).toEqual({
        generations: 10,
        durationMax: 180,
        concurrentGenerations: 1
      });
    });

    it('should handle all edge cases', async () => {
      vi.mocked(quotaService.getUsageStats).mockResolvedValue(null as any);

      const { result } = renderHook(() => useQuotaUI(), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canGenerate).toBe(false);
      expect(result.current.formattedResetDate).toBeNull();
      expect(result.current.quotaColor).toBe('green'); // Default 0%
      expect(result.current.tierLimits).toBeNull();
    });
  });
});
