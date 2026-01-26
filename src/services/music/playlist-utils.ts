// @ts-nocheck

import { MusicPlaylist } from '@/types/music';
import { getPlaylist } from '@/services/music/playlist-service';
import { playlistToMusicPlaylist } from '@/services/music/converters';
import { logger } from '@/lib/logger';

/**
 * Loads a playlist by ID from the service
 */
export const loadPlaylistById = async (id: string, onError?: (message: string) => void): Promise<MusicPlaylist | null> => {
  try {
    const playlist = await getPlaylist(id);
    if (playlist) {
      return playlistToMusicPlaylist(playlist);
    }
    return null;
  } catch (err) {
    logger.error('Error loading playlist', err as Error, 'MUSIC');
    if (onError) {
      onError("Unable to load the playlist");
    }
    return null;
  }
};

/**
 * Converts playlists data to MusicPlaylist[] format
 */
export const convertPlaylistsData = (playlistsData: Record<string, any>): MusicPlaylist[] => {
  return Object.values(playlistsData).map(playlist => 
    playlistToMusicPlaylist(playlist)
  );
};
