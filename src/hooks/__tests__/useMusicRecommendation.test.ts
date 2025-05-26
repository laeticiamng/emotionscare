
import { act, waitFor } from '@testing-library/react';
import { renderHookWithMusicProvider } from '@/tests/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMusicRecommendation } from '@/hooks/useMusicRecommendation';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

// Mock des hooks externes
vi.mock('@/contexts/MusicContext');
vi.mock('@/hooks/use-toast');

const mockUseMusic = vi.mocked(useMusic);
const mockUseToast = vi.mocked(useToast);

describe('useMusicRecommendation', () => {
  const mockLoadPlaylistForEmotion = vi.fn();
  const mockPlayTrack = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseMusic.mockReturnValue({
      loadPlaylistForEmotion: mockLoadPlaylistForEmotion,
      play: mockPlayTrack,
      setPlaylist: vi.fn(),
      currentTrack: null,
      isPlaying: false,
    } as any);

    mockUseToast.mockReturnValue({
      toast: mockToast,
    } as any);
  });

  describe('Chargement des recommandations', () => {
    it('devrait charger des recommandations pour une émotion', async () => {
      const mockPlaylist = {
        id: 'test-playlist',
        name: 'Happy Playlist',
        tracks: [
          { id: '1', title: 'Happy Song', artist: 'Artist', url: 'test.mp3', duration: 180 }
        ]
      };

      mockLoadPlaylistForEmotion.mockResolvedValue(mockPlaylist);

      const { result } = renderHookWithMusicProvider(() =>
        useMusicRecommendation({ autoActivate: false })
      );

      await act(async () => {
        await result.current.loadRecommendations('happy');
      });

      await waitFor(() => {
        expect(result.current.recommendedTracks).toHaveLength(1);
        expect(result.current.playlist).toEqual(mockPlaylist);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('devrait gérer les erreurs de chargement', async () => {
      const errorMessage = 'Erreur de réseau';
      mockLoadPlaylistForEmotion.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHookWithMusicProvider(() =>
        useMusicRecommendation({ autoActivate: false })
      );

      await act(async () => {
        await result.current.loadRecommendations('sad');
      });

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe(errorMessage);
        expect(result.current.recommendedTracks).toHaveLength(0);
      });
    });

    it('devrait activer automatiquement la musique si autoActivate est true', async () => {
      const mockPlaylist = {
        id: 'auto-playlist',
        name: 'Auto Playlist',
        tracks: [
          { id: '2', title: 'Auto Song', artist: 'Auto Artist', url: 'auto.mp3', duration: 200 }
        ]
      };

      mockLoadPlaylistForEmotion.mockResolvedValue(mockPlaylist);

      renderHookWithMusicProvider(() =>
        useMusicRecommendation({
          autoActivate: true,
          defaultEmotion: 'calm'
        })
      );

      await waitFor(() => {
        expect(mockLoadPlaylistForEmotion).toHaveBeenCalledWith({
          emotion: 'ambient',
          intensity: 0.5
        });
      });
    });
  });

  describe('Lecture de musique', () => {
    it('devrait jouer une piste recommandée', async () => {
      const track = {
        id: '3',
        title: 'Test Track',
        artist: 'Test Artist',
        url: 'test-track.mp3',
        duration: 240
      };

      const { result } = renderHookWithMusicProvider(() =>
        useMusicRecommendation({ autoActivate: false })
      );

      act(() => {
        result.current.playRecommendedTrack(track);
      });

      expect(mockPlayTrack).toHaveBeenCalledWith(track);
      expect(mockToast).toHaveBeenCalledWith({
        title: "Lecture en cours",
        description: `${track.title} - ${track.artist}`,
        duration: 2000
      });
    });

    it('devrait jouer la première recommandation', async () => {
      const mockPlaylist = {
        id: 'first-playlist',
        name: 'First Playlist',
        tracks: [
          { id: '4', title: 'First Song', artist: 'First Artist', url: 'first.mp3', duration: 300 }
        ]
      };

      mockLoadPlaylistForEmotion.mockResolvedValue(mockPlaylist);

      const { result } = renderHookWithMusicProvider(() =>
        useMusicRecommendation({ autoActivate: false })
      );

      await act(async () => {
        await result.current.loadRecommendations('energetic');
      });

      act(() => {
        const played = result.current.playFirstRecommendation();
        expect(played).toBe(true);
      });

      expect(mockPlayTrack).toHaveBeenCalledWith(mockPlaylist.tracks[0]);
    });
  });

  describe('Mapping des émotions', () => {
    it('devrait mapper correctement les émotions vers les types musicaux', () => {
      const { result } = renderHookWithMusicProvider(() =>
        useMusicRecommendation({ autoActivate: false })
      );

      expect(result.current.EMOTION_TO_MUSIC.joy).toBe('upbeat');
      expect(result.current.EMOTION_TO_MUSIC.calm).toBe('ambient');
      expect(result.current.EMOTION_TO_MUSIC.anxious).toBe('calming');
      expect(result.current.EMOTION_TO_MUSIC.sad).toBe('gentle');
    });
  });
});
