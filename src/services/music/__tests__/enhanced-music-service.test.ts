/**
 * Tests pour enhanced-music-service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { enhancedMusicService } from '../enhanced-music-service';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    }
  }
}));

// Mock quota service
vi.mock('../quota-service', () => ({
  quotaService: {
    checkQuota: vi.fn(),
    canGenerateWithDuration: vi.fn(),
    checkConcurrentGenerations: vi.fn(),
    incrementUsage: vi.fn(),
    decrementUsage: vi.fn()
  }
}));

// Mock Suno client
vi.mock('../../suno-client', () => ({
  generateMusic: vi.fn(),
  extendMusic: vi.fn(),
  addVocals: vi.fn()
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('EnhancedMusicService', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockUser = { id: mockUserId, email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock auth.getUser par défaut
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createPlaylist', () => {
    it('should create playlist with valid data', async () => {
      const mockPlaylist = {
        id: 'playlist-1',
        user_id: mockUserId,
        name: 'My Playlist',
        description: 'Test description',
        is_public: false,
        tags: ['ambient', 'relax'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockFrom = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockPlaylist, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.createPlaylist(
        'My Playlist',
        'Test description',
        false,
        ['ambient', 'relax']
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('My Playlist');
      expect(result.tags).toEqual(['ambient', 'relax']);
      expect(mockFrom.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUserId,
          name: 'My Playlist'
        })
      );
    });

    it('should throw error for invalid playlist name', async () => {
      await expect(
        enhancedMusicService.createPlaylist('')
      ).rejects.toThrow('Invalid playlist data');
    });

    it('should throw error for too long name', async () => {
      const longName = 'a'.repeat(101);

      await expect(
        enhancedMusicService.createPlaylist(longName)
      ).rejects.toThrow();
    });

    it('should throw error if user not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: null
      } as any);

      await expect(
        enhancedMusicService.createPlaylist('Test')
      ).rejects.toThrow('User not authenticated');
    });
  });

  describe('addToPlaylist', () => {
    const mockPlaylistId = 'playlist-123';
    const mockMusicId = 'music-456';

    it('should add track to playlist with valid IDs', async () => {
      const mockTracksFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: [{ position: 5 }],
          error: null
        })
      };

      const mockInsertFrom = {
        insert: vi.fn().mockResolvedValue({ error: null })
      };

      const mockUpdateFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockTracksFrom as any)
        .mockReturnValueOnce(mockInsertFrom as any)
        .mockReturnValueOnce(mockUpdateFrom as any);

      await enhancedMusicService.addToPlaylist(mockPlaylistId, mockMusicId);

      expect(mockInsertFrom.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          playlist_id: mockPlaylistId,
          music_generation_id: mockMusicId,
          position: 6
        })
      );
    });

    it('should throw error for invalid UUID', async () => {
      await expect(
        enhancedMusicService.addToPlaylist('invalid-id', mockMusicId)
      ).rejects.toThrow('Invalid data');
    });

    it('should set position to 1 for empty playlist', async () => {
      const mockTracksFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({
          data: [],
          error: null
        })
      };

      const mockInsertFrom = {
        insert: vi.fn().mockResolvedValue({ error: null })
      };

      const mockUpdateFrom = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };

      vi.mocked(supabase.from)
        .mockReturnValueOnce(mockTracksFrom as any)
        .mockReturnValueOnce(mockInsertFrom as any)
        .mockReturnValueOnce(mockUpdateFrom as any);

      await enhancedMusicService.addToPlaylist(mockPlaylistId, mockMusicId);

      expect(mockInsertFrom.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          position: 1
        })
      );
    });
  });

  describe('shareMusic', () => {
    const mockMusicId = '123e4567-e89b-12d3-a456-426614174001';

    it('should share music with valid data', async () => {
      const mockShare = {
        id: 'share-1',
        music_generation_id: mockMusicId,
        shared_by: mockUserId,
        is_public: true,
        share_token: 'share_abc123',
        created_at: new Date().toISOString()
      };

      const mockFrom = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockShare, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.shareMusic(mockMusicId, {
        isPublic: true,
        message: 'Check this out!'
      });

      expect(result).toBeDefined();
      expect(result.isPublic).toBe(true);
      expect(result.shareToken).toBeTruthy();
    });

    it('should throw error for invalid music ID', async () => {
      await expect(
        enhancedMusicService.shareMusic('invalid-id')
      ).rejects.toThrow('Invalid share data');
    });

    it('should throw error for too long message', async () => {
      const longMessage = 'a'.repeat(501);

      await expect(
        enhancedMusicService.shareMusic(mockMusicId, {
          message: longMessage
        })
      ).rejects.toThrow();
    });

    it('should throw error for invalid expiresInDays', async () => {
      await expect(
        enhancedMusicService.shareMusic(mockMusicId, {
          expiresInDays: 500 // Max 365
        })
      ).rejects.toThrow();
    });
  });

  describe('getMusicHistory', () => {
    it('should return music history with pagination', async () => {
      const mockGenerations = [
        {
          id: 'gen-1',
          user_id: mockUserId,
          title: 'Track 1',
          style: 'ambient',
          model: 'V4',
          instrumental: true,
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          id: 'gen-2',
          user_id: mockUserId,
          title: 'Track 2',
          style: 'upbeat',
          model: 'V4',
          instrumental: false,
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockGenerations, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.getMusicHistory(10, 0);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Track 1');
      expect(mockFrom.range).toHaveBeenCalledWith(0, 9);
    });

    it('should handle custom pagination', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      await enhancedMusicService.getMusicHistory(20, 40);

      expect(mockFrom.range).toHaveBeenCalledWith(40, 59);
    });
  });

  describe('getUserPlaylists', () => {
    it('should return user playlists with track counts', async () => {
      const mockPlaylists = [
        {
          id: 'playlist-1',
          user_id: mockUserId,
          name: 'Chill Vibes',
          is_public: false,
          tags: ['chill'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          playlist_tracks: [{ count: 10 }]
        },
        {
          id: 'playlist-2',
          user_id: mockUserId,
          name: 'Energetic',
          is_public: true,
          tags: ['energy'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          playlist_tracks: [{ count: 5 }]
        }
      ];

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockPlaylists, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.getUserPlaylists();

      expect(result).toHaveLength(2);
      expect(result[0].tracksCount).toBe(10);
      expect(result[1].tracksCount).toBe(5);
    });
  });

  describe('isFavorite', () => {
    const mockMusicId = '123e4567-e89b-12d3-a456-426614174002';

    it('should return true if music is favorite', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'fav-1' },
          error: null
        })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.isFavorite(mockMusicId);

      expect(result).toBe(true);
    });

    it('should return false if music is not favorite', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.isFavorite(mockMusicId);

      expect(result).toBe(false);
    });

    it('should return false if user not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: null
      } as any);

      const result = await enhancedMusicService.isFavorite(mockMusicId);

      expect(result).toBe(false);
    });
  });

  describe('getMusicByShareToken', () => {
    it('should return music for valid public token', async () => {
      const mockData = {
        share_token: 'share_abc123',
        is_public: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        music_generations: {
          id: 'music-1',
          user_id: mockUserId,
          title: 'Shared Track',
          style: 'ambient',
          model: 'V4',
          instrumental: true,
          status: 'completed',
          created_at: new Date().toISOString()
        }
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.getMusicByShareToken('share_abc123');

      expect(result).toBeDefined();
      expect(result?.title).toBe('Shared Track');
    });

    it('should return null for expired token', async () => {
      const mockData = {
        share_token: 'share_expired',
        is_public: true,
        expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        music_generations: {
          id: 'music-1',
          title: 'Expired Track'
        }
      };

      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockData, error: null })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.getMusicByShareToken('share_expired');

      expect(result).toBeNull();
    });

    it('should return null for invalid token', async () => {
      const mockFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      };

      vi.mocked(supabase.from).mockReturnValue(mockFrom as any);

      const result = await enhancedMusicService.getMusicByShareToken('invalid');

      expect(result).toBeNull();
    });
  });
});
