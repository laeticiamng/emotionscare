// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchUnacknowledgedAlerts,
  acknowledgeAlert,
  getAlertStatistics,
} from '../securityAlertsService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    channel: vi.fn(),
    removeChannel: vi.fn(),
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('securityAlertsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUnacknowledgedAlerts', () => {
    it('should fetch unacknowledged alerts', async () => {
      const mockAlerts = [
        {
          id: '1',
          alert_type: 'premium_role_add',
          severity: 'high',
          message: 'Multiple premium roles added',
          details: {},
          created_at: '2024-01-01T00:00:00Z',
          acknowledged: false,
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockAlerts, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await fetchUnacknowledgedAlerts();

      expect(result).toEqual(mockAlerts);
      expect(mockQuery.eq).toHaveBeenCalledWith('acknowledged', false);
    });

    it('should return empty array on error', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await fetchUnacknowledgedAlerts();

      expect(result).toEqual([]);
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge an alert', async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await acknowledgeAlert('alert-1', 'user-1');

      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          acknowledged: true,
          acknowledged_by: 'user-1',
        })
      );
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'alert-1');
    });

    it('should throw error on failure', async () => {
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: new Error('Update failed') }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(acknowledgeAlert('alert-1', 'user-1')).rejects.toThrow();
    });
  });

  describe('getAlertStatistics', () => {
    it('should calculate alert statistics', async () => {
      const mockAlerts = [
        {
          alert_type: 'premium_role_add',
          severity: 'high',
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          alert_type: 'premium_role_add',
          severity: 'medium',
          created_at: '2024-01-02T00:00:00Z',
        },
        {
          alert_type: 'bulk_role_changes',
          severity: 'high',
          created_at: '2024-01-03T00:00:00Z',
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockResolvedValue({ data: mockAlerts, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getAlertStatistics(7);

      expect(result.total).toBe(3);
      expect(result.bySeverity.high).toBe(2);
      expect(result.bySeverity.medium).toBe(1);
      expect(result.byType.premium_role_add).toBe(2);
      expect(result.byType.bulk_role_changes).toBe(1);
    });

    it('should return empty stats on error', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockResolvedValue({ data: null, error: new Error('DB Error') }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await getAlertStatistics(7);

      expect(result.total).toBe(0);
      expect(result.bySeverity).toEqual({});
      expect(result.byType).toEqual({});
    });
  });
});
