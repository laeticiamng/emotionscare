
import { MusicTrack, MusicPlaylist } from "@/types/music";

/**
 * Find tracks by a specific mood
 */
export const findTracksByMood = (tracks: MusicTrack[], mood: string): MusicTrack[] => {
  return tracks.filter(track => 
    track.mood?.toLowerCase() === mood.toLowerCase() || 
    track.emotion?.toLowerCase() === mood.toLowerCase()
  );
};

/**
 * Find playlists by a specific mood
 */
export const findPlaylistsByMood = (playlists: MusicPlaylist[], mood: string): MusicPlaylist[] => {
  return playlists.filter(playlist => 
    playlist.mood?.toLowerCase() === mood.toLowerCase() || 
    playlist.emotion?.toLowerCase() === mood.toLowerCase()
  );
};

/**
 * Convert various music track formats to the standard format
 */
export const normalizeTrack = (track: any): MusicTrack => {
  return {
    id: track.id || track._id || `track-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: track.title || track.name || "Unknown Track",
    artist: track.artist || track.artistName || "Unknown Artist",
    url: track.url || track.audioUrl || track.src || track.track_url || "",
    cover: track.cover || track.coverUrl || track.coverImage || track.artwork || "",
    duration: track.duration || 0,
    emotion: track.emotion || track.mood || "",
    mood: track.mood || track.emotion || "",
    album: track.album || track.albumName || "",
    category: track.category || [],
    tags: track.tags || []
  };
};

/**
 * Convert various playlist formats to the standard format
 */
export const normalizePlaylist = (playlist: any): MusicPlaylist => {
  return {
    id: playlist.id || playlist._id || `playlist-${Date.now()}`,
    name: playlist.name || playlist.title || "Untitled Playlist",
    title: playlist.title || playlist.name || "Untitled Playlist",
    description: playlist.description || "",
    coverUrl: playlist.coverUrl || playlist.cover || playlist.coverImage || "",
    tracks: Array.isArray(playlist.tracks) ? playlist.tracks.map(normalizeTrack) : [],
    emotion: playlist.emotion || playlist.mood || "",
    mood: playlist.mood || playlist.emotion || "",
    creator: playlist.creator || playlist.author || "Unknown"
  };
};

export default {
  findTracksByMood,
  findPlaylistsByMood,
  normalizeTrack,
  normalizePlaylist
};
