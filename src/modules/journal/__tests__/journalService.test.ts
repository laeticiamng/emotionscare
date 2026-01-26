// @ts-nocheck
/**
 * Tests complets pour journalService
 * Couvre toutes les méthodes CRUD et legacy
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { journalService } from '../journalService';

// Mock Supabase
const mockSupabaseResponse = {
  data: null as any,
  error: null as any,
};

const mockSingle = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({
  eq: vi.fn(() => ({ select: mockSelect })),
}));
const mockDelete = vi.fn(() => ({
  eq: vi.fn(() => Promise.resolve(mockSupabaseResponse)),
}));
const mockOrder = vi.fn(() => Promise.resolve(mockSupabaseResponse));
const mockContains = vi.fn(() => ({ order: mockOrder }));
const mockIlike = vi.fn(() => ({ order: mockOrder }));
const mockEq = vi.fn(() => ({
  order: mockOrder,
  contains: mockContains,
  ilike: mockIlike,
}));
const mockFrom = vi.fn(() => ({
  insert: mockInsert,
  select: vi.fn(() => ({ eq: mockEq })),
  update: mockUpdate,
  delete: mockDelete,
}));

const mockGetUser = vi.fn(() => Promise.resolve({
  data: { user: { id: 'test-user-123' } },
  error: null,
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    auth: {
      getUser: () => mockGetUser(),
    },
  },
}));

// Mock aiAnalysisService
const mockTranscribeAudio = vi.fn();
const mockAnalyzeSentiment = vi.fn();
const mockGenerateSummary = vi.fn();

vi.mock('@/services/aiAnalysisService', () => ({
  aiAnalysisService: {
    transcribeAudio: (...args: any[]) => mockTranscribeAudio(...args),
    analyzeSentiment: (...args: any[]) => mockAnalyzeSentiment(...args),
    generateSummary: (...args: any[]) => mockGenerateSummary(...args),
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

describe('journalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = null;
  });

  // ============================================================================
  // CREATE TEXT ENTRY
  // ============================================================================

  describe('createTextEntry', () => {
    it('should create a text entry successfully', async () => {
      const mockEntry = {
        id: 'entry-1',
        text: 'Mon journal du jour',
        tags: ['gratitude', 'réflexion'],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createTextEntry({
        text: 'Mon journal du jour',
        tags: ['gratitude', 'réflexion'],
      });

      expect(result).toEqual({
        id: 'entry-1',
        text: 'Mon journal du jour',
        tags: ['gratitude', 'réflexion'],
        summary: undefined,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      });
      expect(mockFrom).toHaveBeenCalledWith('journal_notes');
    });

    it('should return null if user is not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

      const result = await journalService.createTextEntry({
        text: 'Test',
        tags: [],
      });

      expect(result).toBeNull();
    });

    it('should return null on database error', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });

      const result = await journalService.createTextEntry({
        text: 'Test',
        tags: [],
      });

      expect(result).toBeNull();
    });

    it('should handle empty tags array', async () => {
      const mockEntry = {
        id: 'entry-2',
        text: 'Journal sans tags',
        tags: [],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createTextEntry({
        text: 'Journal sans tags',
      });

      expect(result?.tags).toEqual([]);
    });

    it('should handle unexpected errors', async () => {
      mockSingle.mockRejectedValueOnce(new Error('Network error'));

      const result = await journalService.createTextEntry({
        text: 'Test',
        tags: [],
      });

      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // CREATE VOICE ENTRY
  // ============================================================================

  describe('createVoiceEntry', () => {
    it('should create a voice entry from transcription', async () => {
      const mockEntry = {
        id: 'voice-entry-1',
        text: 'Transcription vocale',
        tags: ['vocal', 'matin'],
        summary: null,
        mode: 'voice',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createVoiceEntry(
        'Transcription vocale',
        ['vocal', 'matin']
      );

      expect(result).toEqual({
        id: 'voice-entry-1',
        text: 'Transcription vocale',
        tags: ['vocal', 'matin'],
        summary: undefined,
        mode: 'voice',
        created_at: '2024-01-15T10:00:00Z',
      });
    });

    it('should return null if user is not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

      const result = await journalService.createVoiceEntry('Test');

      expect(result).toBeNull();
    });

    it('should handle voice entry without tags', async () => {
      const mockEntry = {
        id: 'voice-entry-2',
        text: 'Sans tags',
        tags: [],
        summary: null,
        mode: 'voice',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createVoiceEntry('Sans tags');

      expect(result?.tags).toEqual([]);
    });

    it('should return null on database error', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Insert failed' }
      });

      const result = await journalService.createVoiceEntry('Test');

      expect(result).toBeNull();
    });
  });

  // ============================================================================
  // GET ALL NOTES
  // ============================================================================

  describe('getAllNotes', () => {
    it('should fetch all non-archived notes', async () => {
      const mockNotes = [
        { id: '1', text: 'Note 1', tags: ['tag1'], summary: 'Summary 1', mode: 'text', created_at: '2024-01-15T10:00:00Z' },
        { id: '2', text: 'Note 2', tags: [], summary: null, mode: 'voice', created_at: '2024-01-14T10:00:00Z' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockNotes, error: null });

      const result = await journalService.getAllNotes();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].summary).toBeUndefined();
    });

    it('should return empty array on error', async () => {
      mockOrder.mockResolvedValueOnce({
        data: null,
        error: { message: 'Query failed' }
      });

      const result = await journalService.getAllNotes();

      expect(result).toEqual([]);
    });

    it('should return empty array when no notes exist', async () => {
      mockOrder.mockResolvedValueOnce({ data: [], error: null });

      const result = await journalService.getAllNotes();

      expect(result).toEqual([]);
    });

    it('should handle null data gracefully', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: null });

      const result = await journalService.getAllNotes();

      expect(result).toEqual([]);
    });

    it('should handle unexpected errors', async () => {
      mockOrder.mockRejectedValueOnce(new Error('Network error'));

      const result = await journalService.getAllNotes();

      expect(result).toEqual([]);
    });
  });

  // ============================================================================
  // GET NOTES BY TAGS
  // ============================================================================

  describe('getNotesByTags', () => {
    it('should filter notes by tags', async () => {
      const mockNotes = [
        { id: '1', text: 'Note gratitude', tags: ['gratitude', 'matin'], summary: null, mode: 'text', created_at: '2024-01-15T10:00:00Z' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockNotes, error: null });

      const result = await journalService.getNotesByTags(['gratitude']);

      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('gratitude');
    });

    it('should return empty array when no matching tags', async () => {
      mockOrder.mockResolvedValueOnce({ data: [], error: null });

      const result = await journalService.getNotesByTags(['inexistant']);

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      mockOrder.mockResolvedValueOnce({
        data: null,
        error: { message: 'Query failed' }
      });

      const result = await journalService.getNotesByTags(['tag']);

      expect(result).toEqual([]);
    });

    it('should handle multiple tags filter', async () => {
      const mockNotes = [
        { id: '1', text: 'Note', tags: ['gratitude', 'soir'], summary: null, mode: 'text', created_at: '2024-01-15T10:00:00Z' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockNotes, error: null });

      const result = await journalService.getNotesByTags(['gratitude', 'soir']);

      expect(result).toHaveLength(1);
    });
  });

  // ============================================================================
  // SEARCH NOTES
  // ============================================================================

  describe('searchNotes', () => {
    it('should search notes by text content', async () => {
      const mockNotes = [
        { id: '1', text: 'Journée de méditation', tags: [], summary: null, mode: 'text', created_at: '2024-01-15T10:00:00Z' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockNotes, error: null });

      const result = await journalService.searchNotes('méditation');

      expect(result).toHaveLength(1);
      expect(result[0].text).toContain('méditation');
    });

    it('should return empty array when no results', async () => {
      mockOrder.mockResolvedValueOnce({ data: [], error: null });

      const result = await journalService.searchNotes('inexistant');

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      mockOrder.mockResolvedValueOnce({
        data: null,
        error: { message: 'Search failed' }
      });

      const result = await journalService.searchNotes('test');

      expect(result).toEqual([]);
    });

    it('should handle special characters in search query', async () => {
      mockOrder.mockResolvedValueOnce({ data: [], error: null });

      const result = await journalService.searchNotes("c'est l'été");

      expect(result).toEqual([]);
    });
  });

  // ============================================================================
  // UPDATE NOTE
  // ============================================================================

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      const mockUpdated = {
        id: 'note-1',
        text: 'Texte mis à jour',
        tags: ['nouveau'],
        summary: 'Nouveau résumé',
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      // Mock the chain: update().eq().select().single()
      const mockUpdateSingle = vi.fn(() => Promise.resolve({ data: mockUpdated, error: null }));
      const mockUpdateSelect = vi.fn(() => ({ single: mockUpdateSingle }));
      const mockUpdateEq = vi.fn(() => ({ select: mockUpdateSelect }));
      mockUpdate.mockReturnValueOnce({ eq: mockUpdateEq });

      const result = await journalService.updateNote('note-1', {
        text: 'Texte mis à jour',
        tags: ['nouveau'],
        summary: 'Nouveau résumé',
      });

      expect(result).toEqual({
        id: 'note-1',
        text: 'Texte mis à jour',
        tags: ['nouveau'],
        summary: 'Nouveau résumé',
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      });
    });

    it('should return null on update error', async () => {
      const mockUpdateSingle = vi.fn(() => Promise.resolve({
        data: null,
        error: { message: 'Update failed' }
      }));
      const mockUpdateSelect = vi.fn(() => ({ single: mockUpdateSingle }));
      const mockUpdateEq = vi.fn(() => ({ select: mockUpdateSelect }));
      mockUpdate.mockReturnValueOnce({ eq: mockUpdateEq });

      const result = await journalService.updateNote('note-1', { text: 'New' });

      expect(result).toBeNull();
    });

    it('should handle partial updates', async () => {
      const mockUpdated = {
        id: 'note-1',
        text: 'Seulement le texte',
        tags: ['original'],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      const mockUpdateSingle = vi.fn(() => Promise.resolve({ data: mockUpdated, error: null }));
      const mockUpdateSelect = vi.fn(() => ({ single: mockUpdateSingle }));
      const mockUpdateEq = vi.fn(() => ({ select: mockUpdateSelect }));
      mockUpdate.mockReturnValueOnce({ eq: mockUpdateEq });

      const result = await journalService.updateNote('note-1', { text: 'Seulement le texte' });

      expect(result?.text).toBe('Seulement le texte');
    });
  });

  // ============================================================================
  // DELETE NOTE
  // ============================================================================

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      const mockDeleteEq = vi.fn(() => Promise.resolve({ error: null }));
      mockDelete.mockReturnValueOnce({ eq: mockDeleteEq });

      const result = await journalService.deleteNote('note-to-delete');

      expect(result).toBe(true);
    });

    it('should return false on delete error', async () => {
      const mockDeleteEq = vi.fn(() => Promise.resolve({
        error: { message: 'Delete failed' }
      }));
      mockDelete.mockReturnValueOnce({ eq: mockDeleteEq });

      const result = await journalService.deleteNote('note-1');

      expect(result).toBe(false);
    });

    it('should handle unexpected errors', async () => {
      const mockDeleteEq = vi.fn(() => Promise.reject(new Error('Network error')));
      mockDelete.mockReturnValueOnce({ eq: mockDeleteEq });

      const result = await journalService.deleteNote('note-1');

      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // ARCHIVE NOTE
  // ============================================================================

  describe('archiveNote', () => {
    it('should archive a note successfully', async () => {
      const mockArchiveEq = vi.fn(() => Promise.resolve({ error: null }));
      mockUpdate.mockReturnValueOnce({ eq: mockArchiveEq });

      const result = await journalService.archiveNote('note-to-archive');

      expect(result).toBe(true);
    });

    it('should return false on archive error', async () => {
      const mockArchiveEq = vi.fn(() => Promise.resolve({
        error: { message: 'Archive failed' }
      }));
      mockUpdate.mockReturnValueOnce({ eq: mockArchiveEq });

      const result = await journalService.archiveNote('note-1');

      expect(result).toBe(false);
    });

    it('should handle unexpected errors', async () => {
      const mockArchiveEq = vi.fn(() => Promise.reject(new Error('Network error')));
      mockUpdate.mockReturnValueOnce({ eq: mockArchiveEq });

      const result = await journalService.archiveNote('note-1');

      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // GET ARCHIVED NOTES
  // ============================================================================

  describe('getArchivedNotes', () => {
    it('should fetch all archived notes', async () => {
      const mockArchivedNotes = [
        { id: '1', text: 'Archived note 1', tags: [], summary: null, mode: 'text', created_at: '2024-01-10T10:00:00Z' },
        { id: '2', text: 'Archived note 2', tags: ['old'], summary: 'Old summary', mode: 'voice', created_at: '2024-01-05T10:00:00Z' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockArchivedNotes, error: null });

      const result = await journalService.getArchivedNotes();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
    });

    it('should return empty array on error', async () => {
      mockOrder.mockResolvedValueOnce({
        data: null,
        error: { message: 'Query failed' }
      });

      const result = await journalService.getArchivedNotes();

      expect(result).toEqual([]);
    });

    it('should return empty array when no archived notes', async () => {
      mockOrder.mockResolvedValueOnce({ data: [], error: null });

      const result = await journalService.getArchivedNotes();

      expect(result).toEqual([]);
    });
  });

  // ============================================================================
  // LEGACY: SAVE ENTRY
  // ============================================================================

  describe('saveEntry (legacy)', () => {
    it('should save entry with legacy format', async () => {
      const mockEntry = {
        id: 'legacy-1',
        text: 'Legacy content',
        tags: ['legacy'],
        summary: 'Summary',
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.saveEntry({
        content: 'Legacy content',
        tags: ['legacy'],
        type: 'text',
      });

      expect(result).not.toBeNull();
      expect(result?.content).toBe('Legacy content'); // Legacy field
      expect(result?.text).toBe('Legacy content');
      expect(result?.type).toBe('text'); // Legacy field
      expect(result?.tone).toBe('neutral'); // Default legacy value
      expect(result?.ephemeral).toBe(false); // Default legacy value
    });

    it('should return null if user not authenticated', async () => {
      mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

      const result = await journalService.saveEntry({ text: 'Test' });

      expect(result).toBeNull();
    });

    it('should handle both text and content fields', async () => {
      const mockEntry = {
        id: 'legacy-2',
        text: 'Text field takes priority',
        tags: [],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.saveEntry({
        text: 'Text field takes priority',
      });

      expect(result?.text).toBe('Text field takes priority');
    });
  });

  // ============================================================================
  // LEGACY: GET ENTRIES
  // ============================================================================

  describe('getEntries (legacy)', () => {
    it('should fetch entries with legacy format', async () => {
      const mockNotes = [
        { id: '1', text: 'Note 1', tags: [], summary: null, mode: 'text', created_at: '2024-01-15T10:00:00Z' },
      ];

      mockOrder.mockResolvedValueOnce({ data: mockNotes, error: null });

      const result = await journalService.getEntries();

      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Note 1'); // Legacy field
      expect(result[0].type).toBe('text'); // Legacy field
      expect(result[0].tone).toBe('neutral'); // Legacy default
      expect(result[0].ephemeral).toBe(false); // Legacy default
    });
  });

  // ============================================================================
  // LEGACY: PROCESS VOICE ENTRY
  // ============================================================================

  describe('processVoiceEntry (legacy)', () => {
    it('should transcribe and analyze voice entry', async () => {
      const mockBlob = new Blob(['audio'], { type: 'audio/webm' });

      mockTranscribeAudio.mockResolvedValueOnce({ text: 'Transcription test' });
      mockAnalyzeSentiment.mockResolvedValueOnce({ tone: 'positive' });
      mockGenerateSummary.mockResolvedValueOnce('Résumé de la transcription');

      const result = await journalService.processVoiceEntry(mockBlob);

      expect(result.content).toBe('Transcription test');
      expect(result.summary).toBe('Résumé de la transcription');
      expect(result.tone).toBe('positive');
    });

    it('should handle empty transcription', async () => {
      const mockBlob = new Blob(['audio'], { type: 'audio/webm' });

      mockTranscribeAudio.mockResolvedValueOnce({ text: '' });

      const result = await journalService.processVoiceEntry(mockBlob);

      expect(result.content).toBe('[Enregistrement vocal - transcription vide]');
      expect(result.tone).toBe('neutral');
    });

    it('should handle transcription error', async () => {
      const mockBlob = new Blob(['audio'], { type: 'audio/webm' });

      mockTranscribeAudio.mockRejectedValueOnce(new Error('Transcription failed'));

      const result = await journalService.processVoiceEntry(mockBlob);

      expect(result.content).toBe("[Erreur lors du traitement de l'audio]");
      expect(result.tone).toBe('neutral');
    });

    it('should handle whitespace-only transcription', async () => {
      const mockBlob = new Blob(['audio'], { type: 'audio/webm' });

      mockTranscribeAudio.mockResolvedValueOnce({ text: '   ' });

      const result = await journalService.processVoiceEntry(mockBlob);

      expect(result.content).toBe('[Enregistrement vocal - transcription vide]');
    });
  });

  // ============================================================================
  // LEGACY: PROCESS TEXT ENTRY
  // ============================================================================

  describe('processTextEntry (legacy)', () => {
    it('should analyze text sentiment and generate summary', async () => {
      mockAnalyzeSentiment.mockResolvedValueOnce({ tone: 'negative' });
      mockGenerateSummary.mockResolvedValueOnce('Journée difficile');

      const result = await journalService.processTextEntry('Texte de test pour analyse');

      expect(result.content).toBe('Texte de test pour analyse');
      expect(result.summary).toBe('Journée difficile');
      expect(result.tone).toBe('negative');
    });

    it('should handle empty text', async () => {
      const result = await journalService.processTextEntry('');

      expect(result.content).toBe('');
      expect(result.tone).toBe('neutral');
    });

    it('should handle whitespace-only text', async () => {
      const result = await journalService.processTextEntry('   ');

      expect(result.content).toBe('   ');
      expect(result.tone).toBe('neutral');
    });

    it('should fallback on AI error', async () => {
      mockAnalyzeSentiment.mockRejectedValueOnce(new Error('AI error'));

      const result = await journalService.processTextEntry('Texte long de plus de cinquante caractères pour tester la troncature');

      expect(result.tone).toBe('neutral');
      expect(result.summary).toBe('Texte long de plus de cinquante caractères pour...');
    });

    it('should use full text as summary if short', async () => {
      mockAnalyzeSentiment.mockRejectedValueOnce(new Error('AI error'));

      const result = await journalService.processTextEntry('Texte court');

      expect(result.summary).toBe('Texte court');
    });

    it('should handle null summary from AI', async () => {
      mockAnalyzeSentiment.mockResolvedValueOnce({ tone: 'positive' });
      mockGenerateSummary.mockResolvedValueOnce(null);

      const result = await journalService.processTextEntry('Texte de plus de cinquante caractères pour tester le fallback résumé');

      expect(result.summary).toBe('Texte de plus de cinquante caractères pour test...');
    });
  });

  // ============================================================================
  // LEGACY: BURN ENTRY
  // ============================================================================

  describe('burnEntry (legacy)', () => {
    it('should archive note instead of burn (legacy mapping)', async () => {
      const mockArchiveEq = vi.fn(() => Promise.resolve({ error: null }));
      mockUpdate.mockReturnValueOnce({ eq: mockArchiveEq });

      await journalService.burnEntry('entry-to-burn');

      expect(mockFrom).toHaveBeenCalledWith('journal_notes');
    });
  });

  // ============================================================================
  // LEGACY: CLEANUP EPHEMERAL ENTRIES
  // ============================================================================

  describe('cleanupEphemeralEntries (legacy)', () => {
    it('should be a no-op (ephemeral no longer supported)', async () => {
      // Should not throw
      await expect(journalService.cleanupEphemeralEntries()).resolves.toBeUndefined();
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('edge cases', () => {
    it('should handle null tags in response', async () => {
      const mockEntry = {
        id: '1',
        text: 'Note',
        tags: null,
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createTextEntry({ text: 'Note' });

      expect(result?.tags).toEqual([]);
    });

    it('should handle undefined mode in response', async () => {
      const mockEntry = {
        id: '1',
        text: 'Note',
        tags: [],
        summary: null,
        mode: undefined,
        created_at: '2024-01-15T10:00:00Z',
      };

      mockOrder.mockResolvedValueOnce({ data: [mockEntry], error: null });

      const result = await journalService.getAllNotes();

      expect(result[0].mode).toBeUndefined();
    });

    it('should handle very long text entries', async () => {
      const longText = 'A'.repeat(10000);
      const mockEntry = {
        id: '1',
        text: longText,
        tags: [],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createTextEntry({ text: longText });

      expect(result?.text.length).toBe(10000);
    });

    it('should handle special characters in text', async () => {
      const specialText = "Test avec émojis 🎉 et caractères spéciaux: é, ñ, ü, 中文, العربية";
      const mockEntry = {
        id: '1',
        text: specialText,
        tags: ['emoji', 'special'],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      };

      mockSingle.mockResolvedValueOnce({ data: mockEntry, error: null });

      const result = await journalService.createTextEntry({
        text: specialText,
        tags: ['emoji', 'special'],
      });

      expect(result?.text).toBe(specialText);
    });

    it('should handle concurrent operations', async () => {
      const mockEntries = Array.from({ length: 5 }, (_, i) => ({
        id: `entry-${i}`,
        text: `Entry ${i}`,
        tags: [],
        summary: null,
        mode: 'text',
        created_at: '2024-01-15T10:00:00Z',
      }));

      mockEntries.forEach(entry => {
        mockSingle.mockResolvedValueOnce({ data: entry, error: null });
      });

      const promises = mockEntries.map((_, i) =>
        journalService.createTextEntry({ text: `Entry ${i}` })
      );

      const results = await Promise.all(promises);

      expect(results.filter(r => r !== null)).toHaveLength(5);
    });
  });
});
