// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStatsByRole, getMonthToMonthComparison, getCustomPeriodStats } from '../advancedAuditStatsService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('advancedAuditStatsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStatsByRole', () => {
    it('should fetch statistics filtered by role', async () => {
      const mockData = [
        { action: 'add', role: 'premium', changed_at: '2024-01-01' },
        { action: 'add', role: 'premium', changed_at: '2024-01-02' },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getStatsByRole('premium');

      expect(result.total).toBe(2);
      expect(result.byAction.add).toBe(2);
    });

    it('should handle errors gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getStatsByRole('premium');

      expect(result.total).toBe(0);
      expect(result.byAction).toEqual({});
    });
  });

  describe('getMonthToMonthComparison', () => {
    it('should return comparison between two months', async () => {
      const mockDataCurrent = [
        { action: 'add', role: 'premium', changed_at: '2024-02-01' },
        { action: 'add', role: 'premium', changed_at: '2024-02-02' },
      ];

      const mockDataPrevious = [
        { action: 'add', role: 'premium', changed_at: '2024-01-01' },
      ];

      let callCount = 0;
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ data: mockDataCurrent, error: null });
          }
          return Promise.resolve({ data: mockDataPrevious, error: null });
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getMonthToMonthComparison(1, 2024);

      expect(result.currentMonth.total).toBe(2);
      expect(result.previousMonth.total).toBe(1);
      expect(result.percentageChange).toBeGreaterThan(0);
    });

    it('should handle zero division in percentage calculation', async () => {
      const mockDataCurrent = [
        { action: 'add', role: 'premium', changed_at: '2024-02-01' },
      ];

      let callCount = 0;
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            return Promise.resolve({ data: mockDataCurrent, error: null });
          }
          return Promise.resolve({ data: [], error: null });
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getMonthToMonthComparison(1, 2024);

      expect(result.currentMonth.total).toBe(1);
      expect(result.previousMonth.total).toBe(0);
      expect(result.percentageChange).toBe(100);
    });
  });

  describe('getCustomPeriodStats', () => {
    it('should fetch statistics for custom period with filters', async () => {
      const mockData = [
        { action: 'add', role: 'premium', changed_at: '2024-01-15' },
        { action: 'update', role: 'admin', changed_at: '2024-01-16' },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const result = await getCustomPeriodStats({
        startDate,
        endDate,
        action: 'add',
      });

      expect(result.total).toBe(2);
      expect(mockQuery.eq).toHaveBeenCalledWith('action', 'add');
    });

    it('should return empty stats on error', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getCustomPeriodStats({
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      });

      expect(result.total).toBe(0);
      expect(result.byAction).toEqual({});
      expect(result.byRole).toEqual({});
    });
  });
});
