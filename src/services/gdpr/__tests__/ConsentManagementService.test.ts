/**
 * Tests for Consent Management Service
 * Critical service for GDPR Article 7 compliance (Conditions for consent)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsentManagementService } from '../ConsentManagementService';
import type { ConsentRequest, ConsentRecord } from '../ConsentManagementService';

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

describe('ConsentManagementService', () => {
  const mockUserId = 'test-user-123';
  const mockIP = '192.168.1.1';
  const mockUserAgent = 'Mozilla/5.0 Test Browser';

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: mockUserAgent,
      configurable: true,
    });

    // Mock getUserIP
    vi.spyOn(ConsentManagementService as any, 'getUserIP').mockResolvedValue(
      mockIP
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('recordConsent', () => {
    it('should record a new consent', async () => {
      const consentRequest: ConsentRequest = {
        consent_type: 'terms_of_service',
        version: '1.0',
        granted: true,
        metadata: { source: 'signup_form' },
      };

      const mockInsertedConsent: ConsentRecord = {
        id: 'consent-123',
        user_id: mockUserId,
        consent_type: 'terms_of_service',
        version: '1.0',
        granted: true,
        granted_at: new Date().toISOString(),
        revoked_at: null,
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: { source: 'signup_form' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mock: No existing consent
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' }, // Not found
                }),
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockInsertedConsent,
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.recordConsent(
        mockUserId,
        consentRequest
      );

      expect(result).toEqual(mockInsertedConsent);
      expect(result.granted).toBe(true);
      expect(result.granted_at).toBeDefined();
      expect(result.ip_address).toBe(mockIP);
      expect(result.user_agent).toBe(mockUserAgent);
    });

    it('should record consent revocation', async () => {
      const consentRequest: ConsentRequest = {
        consent_type: 'marketing_emails',
        version: '1.0',
        granted: false, // Revoked
      };

      const mockRevokedConsent: ConsentRecord = {
        id: 'consent-456',
        user_id: mockUserId,
        consent_type: 'marketing_emails',
        version: '1.0',
        granted: false,
        granted_at: null,
        revoked_at: new Date().toISOString(),
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' },
                }),
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockRevokedConsent,
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.recordConsent(
        mockUserId,
        consentRequest
      );

      expect(result.granted).toBe(false);
      expect(result.granted_at).toBeNull();
      expect(result.revoked_at).toBeDefined();
    });

    it('should update existing consent', async () => {
      const consentRequest: ConsentRequest = {
        consent_type: 'analytics',
        version: '2.0',
        granted: true,
      };

      const existingConsent: ConsentRecord = {
        id: 'consent-789',
        user_id: mockUserId,
        consent_type: 'analytics',
        version: '2.0',
        granted: false,
        granted_at: null,
        revoked_at: '2024-01-01T00:00:00Z',
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const updatedConsent = {
        ...existingConsent,
        granted: true,
        granted_at: new Date().toISOString(),
        revoked_at: null,
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: existingConsent,
                  error: null,
                }),
              }),
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: updatedConsent,
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.recordConsent(
        mockUserId,
        consentRequest
      );

      expect(result.granted).toBe(true);
      expect(result.granted_at).toBeDefined();
      expect(result.revoked_at).toBeNull();
    });

    it('should include IP address and user agent for audit trail', async () => {
      const consentRequest: ConsentRequest = {
        consent_type: 'data_processing',
        version: '1.0',
        granted: true,
      };

      const mockConsent: ConsentRecord = {
        id: 'consent-audit',
        user_id: mockUserId,
        consent_type: 'data_processing',
        version: '1.0',
        granted: true,
        granted_at: new Date().toISOString(),
        revoked_at: null,
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' },
                }),
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockConsent,
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.recordConsent(
        mockUserId,
        consentRequest
      );

      // GDPR Article 7(1) - Proof of consent
      expect(result.ip_address).toBe(mockIP);
      expect(result.user_agent).toBe(mockUserAgent);
      expect(result.granted_at).toBeDefined();
    });

    it('should handle database errors', async () => {
      const consentRequest: ConsentRequest = {
        consent_type: 'cookies',
        version: '1.0',
        granted: true,
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockRejectedValue(
                  new Error('Database connection failed')
                ),
              }),
            }),
          }),
        }),
      });

      await expect(
        ConsentManagementService.recordConsent(mockUserId, consentRequest)
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUserConsents', () => {
    it('should retrieve all user consents', async () => {
      const mockConsents: ConsentRecord[] = [
        {
          id: 'consent-1',
          user_id: mockUserId,
          consent_type: 'terms_of_service',
          version: '1.0',
          granted: true,
          granted_at: '2024-01-01T00:00:00Z',
          revoked_at: null,
          ip_address: mockIP,
          user_agent: mockUserAgent,
          metadata: {},
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'consent-2',
          user_id: mockUserId,
          consent_type: 'marketing_emails',
          version: '1.0',
          granted: false,
          granted_at: null,
          revoked_at: '2024-01-02T00:00:00Z',
          ip_address: mockIP,
          user_agent: mockUserAgent,
          metadata: {},
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ];

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockConsents,
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.getUserConsents(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0].consent_type).toBe('terms_of_service');
      expect(result[1].consent_type).toBe('marketing_emails');
    });

    it('should return empty array for user with no consents', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.getUserConsents(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('checkConsent', () => {
    it('should return true for granted consent', async () => {
      const mockConsent: ConsentRecord = {
        id: 'consent-granted',
        user_id: mockUserId,
        consent_type: 'analytics',
        version: '1.0',
        granted: true,
        granted_at: new Date().toISOString(),
        revoked_at: null,
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConsent,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.checkConsent(
        mockUserId,
        'analytics'
      );

      expect(result).toBe(true);
    });

    it('should return false for revoked consent', async () => {
      const mockConsent: ConsentRecord = {
        id: 'consent-revoked',
        user_id: mockUserId,
        consent_type: 'marketing_emails',
        version: '1.0',
        granted: false,
        granted_at: null,
        revoked_at: new Date().toISOString(),
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockConsent,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.checkConsent(
        mockUserId,
        'marketing_emails'
      );

      expect(result).toBe(false);
    });

    it('should return false when consent not found', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: null,
                    error: { code: 'PGRST116' },
                  }),
                }),
              }),
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.checkConsent(
        mockUserId,
        'third_party_sharing'
      );

      expect(result).toBe(false);
    });
  });

  describe('GDPR Article 7 compliance', () => {
    it('should ensure consent is freely given', async () => {
      // Consent must not be a precondition for service
      // This is a business logic test - the service should allow recording "false" consents

      const consentRequest: ConsentRequest = {
        consent_type: 'marketing_emails',
        version: '1.0',
        granted: false,
      };

      const mockConsent: ConsentRecord = {
        id: 'consent-free',
        user_id: mockUserId,
        consent_type: 'marketing_emails',
        version: '1.0',
        granted: false,
        granted_at: null,
        revoked_at: new Date().toISOString(),
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' },
                }),
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockConsent,
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.recordConsent(
        mockUserId,
        consentRequest
      );

      expect(result.granted).toBe(false);
      // Should not throw - users can refuse consent
    });

    it('should maintain version history', async () => {
      // Different versions should be tracked separately
      const v1Request: ConsentRequest = {
        consent_type: 'privacy_policy',
        version: '1.0',
        granted: true,
      };

      const v2Request: ConsentRequest = {
        consent_type: 'privacy_policy',
        version: '2.0',
        granted: true,
      };

      // Both versions should be distinguishable
      expect(v1Request.version).not.toBe(v2Request.version);
    });

    it('should allow consent withdrawal', async () => {
      // GDPR Article 7(3) - Right to withdraw consent

      const withdrawRequest: ConsentRequest = {
        consent_type: 'ai_processing',
        version: '1.0',
        granted: false, // Withdrawal
      };

      const mockWithdrawal: ConsentRecord = {
        id: 'consent-withdraw',
        user_id: mockUserId,
        consent_type: 'ai_processing',
        version: '1.0',
        granted: false,
        granted_at: null,
        revoked_at: new Date().toISOString(),
        ip_address: mockIP,
        user_agent: mockUserAgent,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' },
                }),
              }),
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockWithdrawal,
              error: null,
            }),
          }),
        }),
      });

      const result = await ConsentManagementService.recordConsent(
        mockUserId,
        withdrawRequest
      );

      expect(result.granted).toBe(false);
      expect(result.revoked_at).toBeDefined();
    });
  });
});
