import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handlePostVoice } from '../handlers/postVoice';
import { handlePostText } from '../handlers/postText';
import * as db from '../lib/db';

// Mock db functions
vi.mock('../lib/db', () => ({
  insertVoice: vi.fn(),
  insertText: vi.fn(),
}));

describe('Journal Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handlePostVoice', () => {
    it('should handle valid voice journal POST request', async () => {
      const mockVoiceEntry = {
        id: 'test-voice-id',
        user_id: 'user-123',
        audio_url: 'https://example.com/audio.mp3',
        transcript: 'Test transcript',
        emotion: 'neutral' as const,
        confidence: 0.85,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      vi.mocked(db.insertVoice).mockResolvedValue(mockVoiceEntry);

      const mockRequest = new Request('https://api.example.com/journal/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-123',
          audio_url: 'https://example.com/audio.mp3',
          transcript: 'Test transcript',
          emotion: 'neutral',
          confidence: 0.85,
        }),
      });

      const response = await handlePostVoice(mockRequest);

      expect(response.status).toBe(201);
      
      const responseData = await response.json();
      expect(responseData.id).toBe('test-voice-id');
      expect(responseData.transcript).toBe('Test transcript');
      expect(db.insertVoice).toHaveBeenCalledWith({
        user_id: 'user-123',
        audio_url: 'https://example.com/audio.mp3',
        transcript: 'Test transcript',
        emotion: 'neutral',
        confidence: 0.85,
      });
    });

    it('should return 400 for missing required fields', async () => {
      const mockRequest = new Request('https://api.example.com/journal/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-123',
          // Missing audio_url and transcript
        }),
      });

      const response = await handlePostVoice(mockRequest);

      expect(response.status).toBe(400);
      
      const responseData = await response.json();
      expect(responseData.error).toBeDefined();
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(db.insertVoice).mockRejectedValue(new Error('Database error'));

      const mockRequest = new Request('https://api.example.com/journal/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-123',
          audio_url: 'https://example.com/audio.mp3',
          transcript: 'Test',
        }),
      });

      const response = await handlePostVoice(mockRequest);

      expect(response.status).toBe(500);
      
      const responseData = await response.json();
      expect(responseData.error).toContain('Database error');
    });
  });

  describe('handlePostText', () => {
    it('should handle valid text journal POST request', async () => {
      const mockTextEntry = {
        id: 'test-text-id',
        user_id: 'user-123',
        content: 'Test journal content',
        emotion: 'happy' as const,
        confidence: 0.92,
        tags: ['test', 'journal'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      vi.mocked(db.insertText).mockResolvedValue(mockTextEntry);

      const mockRequest = new Request('https://api.example.com/journal/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-123',
          content: 'Test journal content',
          emotion: 'happy',
          confidence: 0.92,
          tags: ['test', 'journal'],
        }),
      });

      const response = await handlePostText(mockRequest);

      expect(response.status).toBe(201);
      
      const responseData = await response.json();
      expect(responseData.id).toBe('test-text-id');
      expect(responseData.content).toBe('Test journal content');
      expect(db.insertText).toHaveBeenCalledWith({
        user_id: 'user-123',
        content: 'Test journal content',
        emotion: 'happy',
        confidence: 0.92,
        tags: ['test', 'journal'],
      });
    });

    it('should return 400 for missing content', async () => {
      const mockRequest = new Request('https://api.example.com/journal/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-123',
          // Missing content
        }),
      });

      const response = await handlePostText(mockRequest);

      expect(response.status).toBe(400);
    });

    it('should handle optional tags field', async () => {
      const mockTextEntry = {
        id: 'test-text-id',
        user_id: 'user-123',
        content: 'Content without tags',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      vi.mocked(db.insertText).mockResolvedValue(mockTextEntry);

      const mockRequest = new Request('https://api.example.com/journal/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-123',
          content: 'Content without tags',
        }),
      });

      const response = await handlePostText(mockRequest);

      expect(response.status).toBe(201);
      expect(db.insertText).toHaveBeenCalledWith({
        user_id: 'user-123',
        content: 'Content without tags',
      });
    });
  });
});
