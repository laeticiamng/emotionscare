import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JournalService } from '@/services/journal';

describe('JournalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEntries', () => {
    it('should fetch entries successfully', async () => {
      const entries = await JournalService.getEntries();
      expect(Array.isArray(entries)).toBe(true);
    });
  });

  describe('createEntry', () => {
    it('should create entry with valid content', async () => {
      const content = 'Test journal entry';
      const entry = await JournalService.createEntry(content);
      
      expect(entry).toBeDefined();
      expect(typeof entry).toBe('object');
    });

    it('should throw error for empty content', async () => {
      await expect(JournalService.createEntry('')).rejects.toThrow();
    });
  });

  describe('updateEntry', () => {
    it('should update existing entry', async () => {
      const entry = await JournalService.updateEntry('test-id', 'Updated content');
      expect(entry).toBeDefined();
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry without error', async () => {
      await expect(JournalService.deleteEntry('test-id')).resolves.not.toThrow();
    });
  });
});