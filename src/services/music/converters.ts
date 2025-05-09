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
    url: track.url,
    duration: track.duration,
    audioUrl: track.audioUrl,
    cover: track.cover,
    coverUrl: track.coverUrl,
    emotion: track.emotion
  };
}

// Convert MusicPlaylist to Playlist
export function convertMusicPlaylistToPlaylist(musicPlaylist: MusicPlaylist): Playlist {
  return {
    id: musicPlaylist.id,
    name: musicPlaylist.name,
    emotion: musicPlaylist.emotion,
    tracks: musicPlaylist.tracks.map(convertMusicTrackToTrack)
  };
}

// Convert Playlist to MusicPlaylist
export function convertPlaylistToMusicPlaylist(playlist: Playlist): MusicPlaylist {
  return {
    id: playlist.id,
    name: playlist.name,
    emotion: playlist.emotion,
    tracks: playlist.tracks.map(convertTrackToMusicTrack)
  };
}
