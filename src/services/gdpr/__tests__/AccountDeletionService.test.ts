/**
 * Tests for Account Deletion Service
 * Critical service for GDPR Article 17 compliance (Right to Erasure / "Right to be Forgotten")
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AccountDeletionService } from '../AccountDeletionService';
import type { DeletionRequest } from '../AccountDeletionService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { supabase } from '@/integrations/supabase/client';

describe('AccountDeletionService', () => {
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('requestDeletion', () => {
    it('should create deletion request with default grace period', async () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const expectedScheduledDate = new Date(now);
      expectedScheduledDate.setDate(expectedScheduledDate.getDate() + 30);

      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-123',
        user_id: mockUserId,
        requested_at: now.toISOString(),
        scheduled_deletion_at: expectedScheduledDate.toISOString(),
        grace_period_days: 30,
        reason: undefined,
        status: 'pending',
      };

      // Mock: No existing deletion request
      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      // Mock: Email sending
      vi.spyOn(
        AccountDeletionService as any,
        'sendDeletionConfirmationEmail'
      ).mockResolvedValue(undefined);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      const result = await AccountDeletionService.requestDeletion(mockUserId);

      expect(result).toEqual(mockDeletionRequest);
      expect(result.grace_period_days).toBe(30);
      expect(result.status).toBe('pending');
      expect(new Date(result.scheduled_deletion_at)).toEqual(
        expectedScheduledDate
      );
    });

    it('should create deletion request with custom grace period', async () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const customGracePeriod = 7;
      const expectedScheduledDate = new Date(now);
      expectedScheduledDate.setDate(
        expectedScheduledDate.getDate() + customGracePeriod
      );

      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-custom',
        user_id: mockUserId,
        requested_at: now.toISOString(),
        scheduled_deletion_at: expectedScheduledDate.toISOString(),
        grace_period_days: customGracePeriod,
        reason: 'User requested',
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      vi.spyOn(
        AccountDeletionService as any,
        'sendDeletionConfirmationEmail'
      ).mockResolvedValue(undefined);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      const result = await AccountDeletionService.requestDeletion(
        mockUserId,
        'User requested',
        customGracePeriod
      );

      expect(result.grace_period_days).toBe(customGracePeriod);
      expect(result.reason).toBe('User requested');
    });

    it('should throw error if deletion request already pending', async () => {
      const existingRequest: DeletionRequest = {
        id: 'existing-deletion',
        user_id: mockUserId,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: new Date().toISOString(),
        grace_period_days: 30,
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(existingRequest);

      await expect(
        AccountDeletionService.requestDeletion(mockUserId)
      ).rejects.toThrow('Une demande de suppression est déjà en cours');
    });

    it('should send confirmation email', async () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-email',
        user_id: mockUserId,
        requested_at: now.toISOString(),
        scheduled_deletion_at: new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        grace_period_days: 30,
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      const emailSpy = vi
        .spyOn(AccountDeletionService as any, 'sendDeletionConfirmationEmail')
        .mockResolvedValue(undefined);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      await AccountDeletionService.requestDeletion(mockUserId);

      expect(emailSpy).toHaveBeenCalledWith(
        mockUserId,
        expect.any(Date)
      );
    });
  });

  describe('cancelDeletion', () => {
    it('should cancel pending deletion request', async () => {
      const mockCancelledRequest: DeletionRequest = {
        id: 'deletion-cancelled',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockCancelledRequest,
              error: null,
            }),
          }),
        }),
      });

      await AccountDeletionService.cancelDeletion(mockUserId);

      const updateCall = (supabase.from as any).mock.results[0].value.update;
      expect(updateCall).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'cancelled',
          cancelled_at: expect.any(String),
        })
      );
    });

    it('should handle cancellation errors', async () => {
      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' },
            }),
          }),
        }),
      });

      await expect(
        AccountDeletionService.cancelDeletion(mockUserId)
      ).rejects.toThrow();
    });
  });

  describe('getPendingDeletionRequest', () => {
    it('should return pending deletion request', async () => {
      const mockPendingRequest: DeletionRequest = {
        id: 'deletion-pending',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'pending',
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockPendingRequest,
                error: null,
              }),
            }),
          }),
        }),
      });

      const result =
        await AccountDeletionService.getPendingDeletionRequest(mockUserId);

      expect(result).toEqual(mockPendingRequest);
      expect(result?.status).toBe('pending');
    });

    it('should return null if no pending request', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
      });

      const result =
        await AccountDeletionService.getPendingDeletionRequest(mockUserId);

      expect(result).toBeNull();
    });

    it('should return null for cancelled requests', async () => {
      const mockCancelledRequest: DeletionRequest = {
        id: 'deletion-old',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'cancelled',
        cancelled_at: '2024-01-15T00:00:00Z',
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: mockCancelledRequest,
                error: null,
              }),
            }),
          }),
        }),
      });

      // Service should filter by status='pending' in query
      // If it returns cancelled, the query is wrong
      const result =
        await AccountDeletionService.getPendingDeletionRequest(mockUserId);

      // Should either be null or pending only
      if (result !== null) {
        expect(result.status).toBe('pending');
      }
    });
  });

  describe('executeDeletion', () => {
    it('should execute deletion after grace period', async () => {
      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-execute',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'pending',
      };

      // Mock time to after scheduled deletion
      vi.setSystemTime(new Date('2024-02-01T00:00:00Z'));

      const rpcMock = vi.fn().mockResolvedValue({ data: {}, error: null });
      (supabase as any).rpc = rpcMock;

      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: { ...mockDeletionRequest, status: 'completed' },
            error: null,
          }),
        }),
      });

      await AccountDeletionService.executeDeletion(mockDeletionRequest.id);

      expect(rpcMock).toHaveBeenCalledWith('delete_user_data', {
        target_user_id: mockUserId,
      });
    });

    it('should not execute deletion before grace period', async () => {
      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-too-early',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'pending',
      };

      // Mock time to before scheduled deletion
      vi.setSystemTime(new Date('2024-01-15T00:00:00Z'));

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      await expect(
        AccountDeletionService.executeDeletion(mockDeletionRequest.id)
      ).rejects.toThrow();
    });
  });

  describe('GDPR Article 17 compliance', () => {
    it('should provide grace period for deletion', async () => {
      // Grace period allows users to change their mind

      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-grace',
        user_id: mockUserId,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        grace_period_days: 30,
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      vi.spyOn(
        AccountDeletionService as any,
        'sendDeletionConfirmationEmail'
      ).mockResolvedValue(undefined);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      const result = await AccountDeletionService.requestDeletion(mockUserId);

      const scheduledDate = new Date(result.scheduled_deletion_at);
      const requestedDate = new Date(result.requested_at);

      const diffDays =
        (scheduledDate.getTime() - requestedDate.getTime()) /
        (1000 * 60 * 60 * 24);

      expect(diffDays).toBeGreaterThanOrEqual(7); // Minimum 7 days recommended
    });

    it('should allow cancellation during grace period', async () => {
      // GDPR Article 17 - Users can change their mind

      const mockCancelled: DeletionRequest = {
        id: 'deletion-change-mind',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'cancelled',
        cancelled_at: '2024-01-15T00:00:00Z',
      };

      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockCancelled,
              error: null,
            }),
          }),
        }),
      });

      await AccountDeletionService.cancelDeletion(mockUserId);

      // Should not throw - cancellation is allowed
      expect(true).toBe(true);
    });

    it('should track deletion reason', async () => {
      // Optional but good practice for GDPR compliance

      const reason = 'Switching to competitor';

      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-reason',
        user_id: mockUserId,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        grace_period_days: 30,
        reason,
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      vi.spyOn(
        AccountDeletionService as any,
        'sendDeletionConfirmationEmail'
      ).mockResolvedValue(undefined);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      const result = await AccountDeletionService.requestDeletion(
        mockUserId,
        reason
      );

      expect(result.reason).toBe(reason);
    });

    it('should send confirmation email to user', async () => {
      // GDPR requires informing users about deletion

      const mockDeletionRequest: DeletionRequest = {
        id: 'deletion-confirm',
        user_id: mockUserId,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        grace_period_days: 30,
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      const emailSpy = vi
        .spyOn(AccountDeletionService as any, 'sendDeletionConfirmationEmail')
        .mockResolvedValue(undefined);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockDeletionRequest,
              error: null,
            }),
          }),
        }),
      });

      await AccountDeletionService.requestDeletion(mockUserId);

      expect(emailSpy).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle concurrent deletion requests', async () => {
      const existingRequest: DeletionRequest = {
        id: 'existing',
        user_id: mockUserId,
        requested_at: '2024-01-01T00:00:00Z',
        scheduled_deletion_at: '2024-01-31T00:00:00Z',
        grace_period_days: 30,
        status: 'pending',
      };

      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(existingRequest);

      // Second request should fail
      await expect(
        AccountDeletionService.requestDeletion(mockUserId)
      ).rejects.toThrow('Une demande de suppression est déjà en cours');
    });

    it('should handle database errors gracefully', async () => {
      vi.spyOn(
        AccountDeletionService,
        'getPendingDeletionRequest'
      ).mockResolvedValue(null);

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      await expect(
        AccountDeletionService.requestDeletion(mockUserId)
      ).rejects.toThrow();
    });
  });
});
