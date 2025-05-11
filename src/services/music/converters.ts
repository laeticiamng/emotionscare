
import { MusicTrack, MusicPlaylist, Playlist } from '@/types/music';

// Fix the convertTrackToMusicTrack function
export const convertTrackToMusicTrack = (track: any): MusicTrack => ({
  id: track.id || `track-${Date.now()}`,
  title: track.title || track.name || '',
  artist: track.artist || 'Unknown Artist',
  album: track.album || '',
  url: track.url || '',
  duration: track.duration || 0,
  coverUrl: track.coverUrl || track.cover_url || '',
  coverImage: track.coverImage || track.coverUrl || '',
  genre: track.genre || '',
  mood: track.mood || '',
  emotion: track.emotion || ''
});

// Fix the convertMusicTrackToTrack function
export const convertMusicTrackToTrack = (musicTrack: MusicTrack): any => ({
  id: musicTrack.id,
  title: musicTrack.title,
  artist: musicTrack.artist,
  album: musicTrack.album || '',
  url: musicTrack.url,
  duration: musicTrack.duration,
  coverUrl: musicTrack.coverUrl || '',
  genre: musicTrack.genre || '',
  mood: musicTrack.mood || '',
  emotion: musicTrack.emotion || ''
});

// Fix the convertMusicPlaylistToPlaylist function
export const convertMusicPlaylistToPlaylist = (musicPlaylist: MusicPlaylist): Playlist => ({
  id: musicPlaylist.id,
  name: musicPlaylist.name,
  title: musicPlaylist.name,
  emotion: musicPlaylist.emotion || '',
  tracks: musicPlaylist.tracks
});

// Fix the convertPlaylistToMusicPlaylist function
export const convertPlaylistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => ({
  id: playlist.id,
  name: playlist.name,
  description: playlist.description || '', // Add required description
  coverUrl: playlist.coverUrl || '',
  emotion: playlist.emotion || '',
  mood: playlist.mood || '',
  tracks: playlist.tracks.map(convertTrackToMusicTrack)
});
