/**
 * Tests pour quota-service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { quotaService, UserTier, type UserQuota, type QuotaStatus } from '../quota-service';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    }
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

describe('QuotaService', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUserQuota', () => {
    it('should return existing quota', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 5,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await quotaService.getUserQuota(mockUserId);

      expect(result).toBeDefined();
      expect(result?.userId).toBe(mockUserId);
      expect(result?.generationsUsed).toBe(5);
      expect(result?.generationsLimit).toBe(10);
      expect(result?.tier).toBe(UserTier.FREE);
    });

    it('should create new quota if none exists', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' } // Not found
        })
      };

      const mockInsert = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            user_id: mockUserId,
            generations_used: 0,
            generations_limit: 10,
            reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null
        })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockFrom as any)
        .mockReturnValueOnce(mockFrom as any) // For getUserTier
        .mockReturnValueOnce(mockInsert as any);

      const result = await quotaService.getUserQuota(mockUserId);

      expect(result).toBeDefined();
      expect(result?.generationsUsed).toBe(0);
      expect(result?.generationsLimit).toBe(10);
    });

    it('should reset quota if expired', async () => {
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const mockQuota = {
        user_id: mockUserId,
        generations_used: 8,
        generations_limit: 10,
        reset_date: expiredDate,
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockSelectFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      const mockUpdateFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            ...mockQuota,
            generations_used: 0,
            reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          error: null
        })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockSelectFrom as any)
        .mockReturnValueOnce(mockSelectFrom as any) // getUserTier
        .mockReturnValueOnce(mockUpdateFrom as any);

      const result = await quotaService.getUserQuota(mockUserId);

      expect(result).toBeDefined();
      expect(result?.generationsUsed).toBe(0);
    });
  });

  describe('checkQuota', () => {
    it('should return can generate when quota available', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 3,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const status = await quotaService.checkQuota(mockUserId);

      expect(status.canGenerate).toBe(true);
      expect(status.remaining).toBe(7);
      expect(status.limit).toBe(10);
      expect(status.percentage).toBe(30);
    });

    it('should return cannot generate when quota exceeded', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 10,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const status = await quotaService.checkQuota(mockUserId);

      expect(status.canGenerate).toBe(false);
      expect(status.remaining).toBe(0);
      expect(status.reason).toBe('Quota limit reached');
    });
  });

  describe('incrementUsage', () => {
    it('should increment usage successfully', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 5,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockSelectFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      const mockUpdateFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockSelectFrom as any)
        .mockReturnValueOnce(mockUpdateFrom as any);

      const result = await quotaService.incrementUsage(mockUserId, 1);

      expect(result).toBe(true);
      expect(mockUpdateFrom.update).toHaveBeenCalledWith(
        expect.objectContaining({
          generations_used: 6
        })
      );
    });

    it('should fail when exceeding limit', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 10,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await quotaService.incrementUsage(mockUserId, 1);

      expect(result).toBe(false);
    });
  });

  describe('canGenerateWithDuration', () => {
    it('should allow generation within tier limits', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 5,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await quotaService.canGenerateWithDuration(mockUserId, 120);

      expect(result.canGenerate).toBe(true);
    });

    it('should reject generation exceeding duration limit for free tier', async () => {
      const mockQuota = {
        user_id: mockUserId,
        generations_used: 5,
        generations_limit: 10,
        reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_premium: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockQuota, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await quotaService.canGenerateWithDuration(mockUserId, 300); // 5 min > 180s limit

      expect(result.canGenerate).toBe(false);
      expect(result.reason).toContain('Duration exceeds');
    });
  });

  describe('checkConcurrentGenerations', () => {
    it('should allow generation when under concurrent limit', async () => {
      const mockProfileFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { subscription_tier: 'free' },
          error: null
        })
      };

      const mockGenerationsFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ count: 0, error: null })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockProfileFrom as any)
        .mockReturnValueOnce(mockGenerationsFrom as any);

      const result = await quotaService.checkConcurrentGenerations(mockUserId);

      expect(result.canGenerate).toBe(true);
      expect(result.current).toBe(0);
      expect(result.limit).toBe(1); // FREE tier
    });

    it('should reject when concurrent limit reached', async () => {
      const mockProfileFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { subscription_tier: 'free' },
          error: null
        })
      };

      const mockGenerationsFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockResolvedValue({ count: 1, error: null })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockProfileFrom as any)
        .mockReturnValueOnce(mockGenerationsFrom as any);

      const result = await quotaService.checkConcurrentGenerations(mockUserId);

      expect(result.canGenerate).toBe(false);
      expect(result.reason).toBe('Concurrent generation limit reached');
    });
  });

  describe('getLimitsForTier', () => {
    it('should return correct limits for FREE tier', () => {
      const limits = quotaService.getLimitsForTier(UserTier.FREE);

      expect(limits.generations).toBe(10);
      expect(limits.durationMax).toBe(180);
      expect(limits.concurrentGenerations).toBe(1);
    });

    it('should return correct limits for PREMIUM tier', () => {
      const limits = quotaService.getLimitsForTier(UserTier.PREMIUM);

      expect(limits.generations).toBe(100);
      expect(limits.durationMax).toBe(600);
      expect(limits.concurrentGenerations).toBe(3);
    });

    it('should return correct limits for ENTERPRISE tier', () => {
      const limits = quotaService.getLimitsForTier(UserTier.ENTERPRISE);

      expect(limits.generations).toBe(1000);
      expect(limits.durationMax).toBe(600);
      expect(limits.concurrentGenerations).toBe(10);
    });
  });

  describe('upgradeTier', () => {
    it('should upgrade user to premium successfully', async () => {
      const mockFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await quotaService.upgradeTier(mockUserId, UserTier.PREMIUM);

      expect(result).toBe(true);
      expect(mockFrom.update).toHaveBeenCalledWith(
        expect.objectContaining({
          generations_limit: 100,
          is_premium: true
        })
      );
    });
  });
});
