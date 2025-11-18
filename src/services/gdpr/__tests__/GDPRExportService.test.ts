/**
 * Tests for GDPR User Data Export Service
 * Critical service for GDPR Article 20 compliance (Right to Data Portability)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GDPRExportService } from '../GDPRExportService';
import type { UserDataExport } from '../GDPRExportService';

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
    debug: vi.fn(),
  },
}));

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    text: vi.fn(),
    autoTable: vi.fn(),
    save: vi.fn(),
    output: vi.fn().mockReturnValue('mock-pdf-data'),
  })),
}));

import { supabase } from '@/integrations/supabase/client';

describe('GDPRExportService', () => {
  const mockUserId = 'test-user-123';

  const mockProfile = {
    id: mockUserId,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    created_at: '2024-01-01T00:00:00Z',
    avatar_url: null,
    preferences: { theme: 'dark' },
  };

  const mockJournalEntries = [
    {
      id: 'journal-1',
      text: 'Test journal entry',
      tags: ['mood', 'wellness'],
      created_at: '2024-01-02T00:00:00Z',
      mode: 'text',
    },
  ];

  const mockEmotionScans = [
    {
      id: 'scan-1',
      created_at: '2024-01-03T00:00:00Z',
      mood_score: 75,
      payload: { emotion: 'happy' },
    },
  ];

  const mockActivitySessions = [
    {
      id: 'activity-1',
      module_name: 'meditation',
      created_at: '2024-01-04T00:00:00Z',
      duration_seconds: 600,
    },
  ];

  const mockConsents = [
    {
      id: 'consent-1',
      type: 'terms_of_service',
      granted: true,
      granted_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('collectUserData', () => {
    it('should successfully collect all user data', async () => {
      // Setup mocks
      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        const baseQuery = {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn(),
              single: vi.fn(),
            }),
          }),
        };

        // Return appropriate data based on table name
        if (table === 'profiles') {
          baseQuery.select().eq().single = vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          });
        } else if (table === 'journal_notes') {
          baseQuery.select().eq().order = vi.fn().mockResolvedValue({
            data: mockJournalEntries,
            error: null,
          });
        } else if (table === 'emotion_scans') {
          baseQuery.select().eq().order = vi.fn().mockResolvedValue({
            data: mockEmotionScans,
            error: null,
          });
        } else if (table === 'activity_sessions') {
          baseQuery.select().eq().order = vi.fn().mockResolvedValue({
            data: mockActivitySessions,
            error: null,
          });
        } else if (table === 'user_consents') {
          baseQuery.select().eq = vi.fn().mockResolvedValue({
            data: mockConsents,
            error: null,
          });
        } else if (table === 'gdpr_export_logs') {
          baseQuery.select().eq().order = vi.fn().mockResolvedValue({
            data: [],
            error: null,
          });
        }

        return baseQuery;
      });

      const result = await GDPRExportService.collectUserData(mockUserId);

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.profile).toEqual(mockProfile);
      expect(result.exportDate).toBeDefined();
    });

    it('should throw error if profile not found', async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found', code: 'PGRST116' },
            }),
          }),
        }),
      });

      await expect(
        GDPRExportService.collectUserData(mockUserId)
      ).rejects.toThrow();
    });

    it('should handle missing consents table gracefully', async () => {
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockProfile,
                  error: null,
                }),
              }),
            }),
          };
        }

        if (table === 'user_consents') {
          throw new Error('Table does not exist');
        }

        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        };
      });

      const result = await GDPRExportService.collectUserData(mockUserId);

      expect(result).toBeDefined();
      expect(result.consents).toEqual([]);
    });

    it('should handle user with no data', async () => {
      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockProfile,
                  error: null,
                }),
              }),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        };
      });

      const result = await GDPRExportService.collectUserData(mockUserId);

      expect(result.journalEntries).toEqual([]);
      expect(result.emotionScans).toEqual([]);
      expect(result.activitySessions).toEqual([]);
    });
  });

  describe('exportToJSON', () => {
    it('should export data to JSON format', async () => {
      const mockData: UserDataExport = {
        exportDate: new Date().toISOString(),
        userId: mockUserId,
        profile: mockProfile,
        journalEntries: mockJournalEntries,
        emotionScans: mockEmotionScans,
        activitySessions: mockActivitySessions,
        consents: mockConsents,
        exportLogs: [],
      };

      const result = await GDPRExportService.exportToJSON(mockData);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');

      const parsed = JSON.parse(result);
      expect(parsed.userId).toBe(mockUserId);
      expect(parsed.profile.email).toBe(mockProfile.email);
    });

    it('should produce valid JSON', async () => {
      const mockData: UserDataExport = {
        exportDate: new Date().toISOString(),
        userId: mockUserId,
        profile: mockProfile,
        journalEntries: [],
        emotionScans: [],
        activitySessions: [],
        consents: [],
        exportLogs: [],
      };

      const result = await GDPRExportService.exportToJSON(mockData);

      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe('logExport', () => {
    it('should log export operation', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ data: {}, error: null });

      (supabase.from as any).mockReturnValue({
        insert: mockInsert,
      });

      await GDPRExportService.logExport(mockUserId, 'json');

      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUserId,
        export_type: 'json',
      });
    });

    it('should handle logging errors gracefully', async () => {
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Insert failed' },
        }),
      });

      // Should not throw - logging is best-effort
      await expect(
        GDPRExportService.logExport(mockUserId, 'pdf')
      ).resolves.not.toThrow();
    });
  });

  describe('GDPR compliance', () => {
    it('should include all required GDPR fields in export', async () => {
      const mockData: UserDataExport = {
        exportDate: new Date().toISOString(),
        userId: mockUserId,
        profile: mockProfile,
        journalEntries: mockJournalEntries,
        emotionScans: mockEmotionScans,
        activitySessions: mockActivitySessions,
        consents: mockConsents,
        exportLogs: [],
      };

      const json = await GDPRExportService.exportToJSON(mockData);
      const parsed = JSON.parse(json);

      // GDPR Article 20 - Right to data portability
      expect(parsed).toHaveProperty('exportDate');
      expect(parsed).toHaveProperty('userId');
      expect(parsed).toHaveProperty('profile');
      expect(parsed).toHaveProperty('journalEntries');
      expect(parsed).toHaveProperty('consents');

      // Export date must be present and valid
      expect(new Date(parsed.exportDate).toString()).not.toBe('Invalid Date');
    });

    it('should export data in machine-readable format', async () => {
      const mockData: UserDataExport = {
        exportDate: new Date().toISOString(),
        userId: mockUserId,
        profile: mockProfile,
        journalEntries: mockJournalEntries,
        emotionScans: mockEmotionScans,
        activitySessions: mockActivitySessions,
        consents: mockConsents,
        exportLogs: [],
      };

      const json = await GDPRExportService.exportToJSON(mockData);

      // Must be valid JSON (machine-readable)
      expect(() => JSON.parse(json)).not.toThrow();

      // Should be structured data, not a blob
      const parsed = JSON.parse(json);
      expect(typeof parsed).toBe('object');
      expect(Array.isArray(parsed.journalEntries)).toBe(true);
    });

    it('should include consent records in export', async () => {
      const mockData: UserDataExport = {
        exportDate: new Date().toISOString(),
        userId: mockUserId,
        profile: mockProfile,
        journalEntries: [],
        emotionScans: [],
        activitySessions: [],
        consents: mockConsents,
        exportLogs: [],
      };

      const json = await GDPRExportService.exportToJSON(mockData);
      const parsed = JSON.parse(json);

      expect(parsed.consents).toBeDefined();
      expect(parsed.consents.length).toBeGreaterThan(0);
      expect(parsed.consents[0]).toHaveProperty('type');
      expect(parsed.consents[0]).toHaveProperty('granted');
      expect(parsed.consents[0]).toHaveProperty('granted_at');
    });
  });
});
