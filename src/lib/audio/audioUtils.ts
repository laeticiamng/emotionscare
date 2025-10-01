// @ts-nocheck
import { AudioTrack, AudioPlaylist } from '@/types/audio';

// Format duration from seconds to mm:ss
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Get audio URL from track
export const getAudioUrl = (track: AudioTrack): string => {
  return track.audioUrl || track.url;
};

// Get track description with fallbacks
export const getTrackDescription = (track: AudioTrack): string => {
  return track.description || track.summary || `${track.artist} - ${track.title}`;
};

// Filter tracks by mood/category
export const filterTracksByMood = (
  tracks: AudioTrack[],
  mood: string
): AudioTrack[] => {
  return tracks.filter(track => 
    track.mood?.toLowerCase() === mood.toLowerCase() ||
    track.category?.toLowerCase() === mood.toLowerCase()
  );
};

// Create a playlist from tracks
export const createPlaylist = (
  tracks: AudioTrack[],
  mood: string
): AudioPlaylist => {
  return {
    id: `playlist-${Date.now()}`,
    name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Playlist`,
    tracks,
    emotion: mood,
    description: `A playlist designed for your ${mood} mood`
  };
};

export default {
  formatDuration,
  getAudioUrl,
  getTrackDescription,
  filterTracksByMood,
  createPlaylist
};
