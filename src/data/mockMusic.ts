
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock music tracks
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Ocean',
    artist: 'Nature Sounds',
    duration: 180,
    coverUrl: '/images/music/ocean.jpg',
    audioUrl: '/audio/calm-ocean.mp3',
    emotion: 'calm', // Now supported in MusicTrack type
    url: '/audio/calm-ocean.mp3'
  },
  {
    id: '2',
    title: 'Morning Motivation',
    artist: 'Upbeat Studio',
    duration: 240,
    coverUrl: '/images/music/morning.jpg',
    audioUrl: '/audio/morning-motivation.mp3',
    emotion: 'happy', // Now supported in MusicTrack type
    url: '/audio/morning-motivation.mp3'
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'Concentration Wave',
    duration: 320,
    coverUrl: '/images/music/focus.jpg',
    audioUrl: '/audio/deep-focus.mp3',
    emotion: 'focused', // Now supported in MusicTrack type
    url: '/audio/deep-focus.mp3'
  },
  {
    id: '4',
    title: 'Tension Release',
    artist: 'Relax Mode',
    duration: 290,
    coverUrl: '/images/music/release.jpg',
    audioUrl: '/audio/tension-release.mp3',
    emotion: 'stressed', // Now supported in MusicTrack type
    url: '/audio/tension-release.mp3'
  }
];

// Mock music playlists
export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: '1',
    name: 'Calming Sounds',
    description: 'Perfect for relaxation and stress relief',
    tracks: [mockTracks[0], mockTracks[3]],
    emotion: 'calm', // Now supported in MusicPlaylist type
    coverUrl: '/images/playlists/calm.jpg'
  },
  {
    id: '2',
    name: 'Energy Boost',
    description: 'Get motivated and energized',
    tracks: [mockTracks[1]],
    emotion: 'happy', // Now supported in MusicPlaylist type
    coverUrl: '/images/playlists/energy.jpg'
  },
  {
    id: '3',
    name: 'Work Concentration',
    description: 'Enhance your focus and productivity',
    tracks: [mockTracks[2]],
    emotion: 'focused', // Now supported in MusicPlaylist type
    coverUrl: '/images/playlists/focus.jpg'
  }
];

// Convenience export for backward compatibility
export const mockPlaylists = mockMusicPlaylists;
