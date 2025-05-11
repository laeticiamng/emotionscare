
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
    emotion: 'calm',
    url: '/audio/calm-ocean.mp3' // Added required url property
  },
  {
    id: '2',
    title: 'Morning Motivation',
    artist: 'Upbeat Studio',
    duration: 240,
    coverUrl: '/images/music/morning.jpg',
    audioUrl: '/audio/morning-motivation.mp3',
    emotion: 'happy',
    url: '/audio/morning-motivation.mp3' // Added required url property
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'Concentration Wave',
    duration: 320,
    coverUrl: '/images/music/focus.jpg',
    audioUrl: '/audio/deep-focus.mp3',
    emotion: 'focused',
    url: '/audio/deep-focus.mp3' // Added required url property
  },
  {
    id: '4',
    title: 'Tension Release',
    artist: 'Relax Mode',
    duration: 290,
    coverUrl: '/images/music/release.jpg',
    audioUrl: '/audio/tension-release.mp3',
    emotion: 'stressed',
    url: '/audio/tension-release.mp3' // Added required url property
  }
];

// Mock music playlists
export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: '1',
    name: 'Calming Sounds',
    title: 'Calming Sounds', // For backward compatibility
    description: 'Perfect for relaxation and stress relief',
    tracks: [mockTracks[0], mockTracks[3]],
    emotion: 'calm',
    coverUrl: '/images/playlists/calm.jpg'
  },
  {
    id: '2',
    name: 'Energy Boost',
    title: 'Energy Boost', // For backward compatibility
    description: 'Get motivated and energized',
    tracks: [mockTracks[1]],
    emotion: 'happy',
    coverUrl: '/images/playlists/energy.jpg'
  },
  {
    id: '3',
    name: 'Work Concentration',
    title: 'Work Concentration', // For backward compatibility
    description: 'Enhance your focus and productivity',
    tracks: [mockTracks[2]],
    emotion: 'focused',
    coverUrl: '/images/playlists/focus.jpg'
  }
];

// Convenience export for backward compatibility
export const mockPlaylists = mockMusicPlaylists;
