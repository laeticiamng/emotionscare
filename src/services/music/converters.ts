
import { Track, Playlist } from './types';
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Convert Track to MusicTrack
export function convertTrackToMusicTrack(track: Track): MusicTrack {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    url: track.url,
    duration: track.duration,
    audioUrl: track.audioUrl,
    audio_url: track.audioUrl || track.url, // Ensure audio_url is set
    coverUrl: track.coverUrl || track.cover,
    cover: track.cover,
    emotion: track.emotion
  };
}

// Convert MusicTrack to Track
export function convertMusicTrackToTrack(track: MusicTrack): Track {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    url: track.url || track.audio_url || track.audioUrl || '',
    duration: track.duration,
    audioUrl: track.audioUrl || track.audio_url || track.url || '',
    cover: track.cover || track.coverUrl || track.cover_url || '',
    coverUrl: track.coverUrl || track.cover_url || track.cover || '',
    emotion: track.emotion || track.emotion_tag || track.mood || ''
  };
}

// Convert MusicPlaylist to Playlist
export function convertMusicPlaylistToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name || musicPlaylist.title || '',
    emotion: musicPlaylist.emotion,
    tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
  };
}

// Convert Playlist to MusicPlaylist
export function convertPlaylistToMusicPlaylist(playlist: Playlist): MusicPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    title: playlist.name, // Ensure title is set
    emotion: playlist.emotion,
    tracks: playlist.tracks.map(convertTrackToMusicTrack)
  };
}
