/**
 * Journal API Client - Tests
 * Tests unitaires pour journalApi.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock schemas
vi.mock('@emotionscare/contracts', () => ({
  createJournalEntrySchema: {
    parse: (data: any) => data,
  },
  listJournalEntriesSchema: {
    parse: (data: any) => data,
  },
}));

// Import after mocks
import { journalApi } from '../services/journalApi';

describe('JournalApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('list', () => {
    it('fetches journal entries without filters', async () => {
      const mockEntries = [
        { id: '1', title: 'Entry 1', content: 'Content 1' },
        { id: '2', title: 'Entry 2', content: 'Content 2' },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockEntries }),
      });

      const result = await journalApi.list();

      expect(result).toEqual(mockEntries);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/journal'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('fetches journal entries with filters', async () => {
      const mockEntries = [{ id: '1', title: 'Filtered Entry' }];
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockEntries }),
      });

      // Use proper filter format
      const filters = { 
        limit: 10, 
        offset: 0, 
        sortBy: 'date' as const, 
        sortOrder: 'desc' as const 
      };
      const result = await journalApi.list(filters);

      expect(result).toEqual(mockEntries);
      expect(mockFetch).toHaveBeenCalled();
    });

    it('handles empty result', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const result = await journalApi.list();

      expect(result).toEqual([]);
    });
  });

  describe('get', () => {
    it('fetches a single journal entry by ID', async () => {
      const mockEntry = { id: 'entry-123', title: 'My Entry', content: 'Content' };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockEntry }),
      });

      const result = await journalApi.get('entry-123');

      expect(result).toEqual(mockEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/journal/entry-123'),
        expect.any(Object)
      );
    });
  });

  describe('create', () => {
    it('creates a new journal entry', async () => {
      const newEntry = { title: 'New Entry', content: 'New Content' };
      const createdEntry = { id: 'new-id', ...newEntry };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: createdEntry }),
      });

      const result = await journalApi.create(newEntry as any);

      expect(result).toEqual(createdEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/journal'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newEntry),
        })
      );
    });
  });

  describe('update', () => {
    it('updates an existing journal entry', async () => {
      const updates = { title: 'Updated Title' };
      const updatedEntry = { id: 'entry-123', title: 'Updated Title', content: 'Content' };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: updatedEntry }),
      });

      const result = await journalApi.update('entry-123', updates);

      expect(result).toEqual(updatedEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/journal/entry-123'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updates),
        })
      );
    });
  });

  describe('delete', () => {
    it('deletes a journal entry', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await journalApi.delete('entry-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/journal/entry-123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('stats', () => {
    it('fetches journal statistics', async () => {
      const mockStats = {
        totalEntries: 42,
        avgMoodScore: 7.5,
        streakDays: 15,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockStats }),
      });

      const result = await journalApi.stats();

      expect(result).toEqual(mockStats);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/journal/stats'),
        expect.any(Object)
      );
    });
  });

  describe('Error handling', () => {
    it('throws error on HTTP failure', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Entry not found' }),
      });

      await expect(journalApi.get('non-existent')).rejects.toThrow('Entry not found');
    });

    it('throws generic error when no message in response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(journalApi.get('any-id')).rejects.toThrow('HTTP 500');
    });

    it('handles JSON parse errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(journalApi.list()).rejects.toThrow('Unknown error');
    });
  });
});

describe('JournalApiClient - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('encodes special characters in IDs', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: 'test-id' } }),
    });

    await journalApi.get('entry/with/slashes');

    expect(mockFetch).toHaveBeenCalled();
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(journalApi.list()).rejects.toThrow('Network error');
  });
});
