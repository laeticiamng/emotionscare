
import { Track, Playlist } from './types';
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Convert from MusicTrack type to Track type
export const musicTrackToTrack = (track: MusicTrack): Track => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    url: track.url,
    cover: track.coverUrl || track.cover_url || track.cover || undefined,
    coverUrl: track.coverUrl || track.cover_url || track.cover || undefined,
    audioUrl: track.audioUrl || track.audio_url || track.url || undefined,
    emotion: track.emotion || track.emotion_tag || undefined,
  };
};

// Convert from Track type to MusicTrack type
export const trackToMusicTrack = (track: Track): MusicTrack => {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    url: track.url || track.audioUrl || '',
    coverUrl: track.coverUrl || track.cover || undefined,
    audioUrl: track.audioUrl || track.url || undefined,
    emotion: track.emotion || undefined,
  };
};

// Convert from MusicPlaylist type to Playlist type
export const musicPlaylistToPlaylist = (playlist: MusicPlaylist): Playlist => {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.title,
    tracks: playlist.tracks.map(musicTrackToTrack),
  };
};

// Convert from Playlist type to MusicPlaylist type
export const playlistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.title,
    description: playlist.name, // Use name as description if not provided
    coverUrl: '/images/default-cover.jpg', // Default cover URL
    tracks: playlist.tracks.map(trackToMusicTrack),
  };
};
