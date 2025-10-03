import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { insertVoice, insertText, listFeed } from '../lib/db';

describe('Journal DB - Supabase Integration', () => {
  const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
  let createdIds: string[] = [];

  afterEach(async () => {
    // Cleanup test data
    if (createdIds.length > 0) {
      await supabase.from('journal_voice').delete().in('id', createdIds);
      await supabase.from('journal_text').delete().in('id', createdIds);
      createdIds = [];
    }
  });

  describe('insertVoice', () => {
    it('should insert voice journal entry successfully', async () => {
      const voiceData = {
        user_id: TEST_USER_ID,
        audio_url: 'https://example.com/audio.mp3',
        transcript: 'Test transcript content',
        emotion: 'neutral' as const,
        confidence: 0.85,
        valence: 0.5,
        arousal: 0.3,
      };

      const result = await insertVoice(voiceData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.transcript).toBe('Test transcript content');
      expect(result.emotion).toBe('neutral');
      expect(result.confidence).toBe(0.85);

      createdIds.push(result.id);
    });

    it('should handle missing optional fields', async () => {
      const voiceData = {
        user_id: TEST_USER_ID,
        audio_url: 'https://example.com/audio2.mp3',
        transcript: 'Minimal entry',
      };

      const result = await insertVoice(voiceData);

      expect(result).toBeDefined();
      expect(result.emotion).toBeNull();
      expect(result.confidence).toBeNull();

      createdIds.push(result.id);
    });

    it('should reject invalid user_id', async () => {
      const voiceData = {
        user_id: 'invalid-uuid',
        audio_url: 'https://example.com/audio.mp3',
        transcript: 'Test',
      };

      await expect(insertVoice(voiceData as any)).rejects.toThrow();
    });
  });

  describe('insertText', () => {
    it('should insert text journal entry successfully', async () => {
      const textData = {
        user_id: TEST_USER_ID,
        content: 'This is a test journal text entry.',
        emotion: 'happy' as const,
        confidence: 0.92,
        tags: ['test', 'journal'],
      };

      const result = await insertText(textData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.user_id).toBe(TEST_USER_ID);
      expect(result.content).toBe('This is a test journal text entry.');
      expect(result.emotion).toBe('happy');
      expect(result.tags).toEqual(['test', 'journal']);

      createdIds.push(result.id);
    });

    it('should handle empty tags array', async () => {
      const textData = {
        user_id: TEST_USER_ID,
        content: 'Entry without tags',
        tags: [],
      };

      const result = await insertText(textData);

      expect(result).toBeDefined();
      expect(result.tags).toEqual([]);

      createdIds.push(result.id);
    });
  });

  describe('listFeed', () => {
    beforeEach(async () => {
      // Insert test data
      const voice = await insertVoice({
        user_id: TEST_USER_ID,
        audio_url: 'https://example.com/feed-test.mp3',
        transcript: 'Feed test voice',
        emotion: 'neutral',
      });

      const text = await insertText({
        user_id: TEST_USER_ID,
        content: 'Feed test text',
        emotion: 'happy',
      });

      createdIds.push(voice.id, text.id);
    });

    it('should list journal feed with mixed entries', async () => {
      const feed = await listFeed(TEST_USER_ID, 10);

      expect(feed).toBeDefined();
      expect(Array.isArray(feed)).toBe(true);
      expect(feed.length).toBeGreaterThanOrEqual(2);

      const hasVoice = feed.some((entry) => entry.type === 'voice');
      const hasText = feed.some((entry) => entry.type === 'text');

      expect(hasVoice).toBe(true);
      expect(hasText).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const feed = await listFeed(TEST_USER_ID, 1);

      expect(feed.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array for non-existent user', async () => {
      const feed = await listFeed('00000000-0000-0000-0000-999999999999', 10);

      expect(feed).toEqual([]);
    });

    it('should order by created_at desc', async () => {
      const feed = await listFeed(TEST_USER_ID, 10);

      if (feed.length > 1) {
        const dates = feed.map((entry) => new Date(entry.created_at).getTime());
        const isSorted = dates.every((date, i) => i === 0 || date <= dates[i - 1]);
        expect(isSorted).toBe(true);
      }
    });
  });
});
