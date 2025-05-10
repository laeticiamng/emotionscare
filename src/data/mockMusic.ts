
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock music tracks
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Ocean',
    artist: 'Nature Sounds',
    duration: 180,
    cover_url: '/images/music/ocean.jpg',
    audio_url: '/audio/calm-ocean.mp3',
    emotion_tag: 'calm',
    url: '/audio/calm-ocean.mp3' // Added required url property
  },
  {
    id: '2',
    title: 'Morning Motivation',
    artist: 'Upbeat Studio',
    duration: 240,
    cover_url: '/images/music/morning.jpg',
    audio_url: '/audio/morning-motivation.mp3',
    emotion_tag: 'happy',
    url: '/audio/morning-motivation.mp3' // Added required url property
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'Concentration Wave',
    duration: 320,
    cover_url: '/images/music/focus.jpg',
    audio_url: '/audio/deep-focus.mp3',
    emotion_tag: 'focused',
    url: '/audio/deep-focus.mp3' // Added required url property
  },
  {
    id: '4',
    title: 'Tension Release',
    artist: 'Relax Mode',
    duration: 290,
    cover_url: '/images/music/release.jpg',
    audio_url: '/audio/tension-release.mp3',
    emotion_tag: 'stressed',
    url: '/audio/tension-release.mp3' // Added required url property
  }
];

// Mock music playlists
export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: '1',
    title: 'Calming Sounds',
    name: 'Calming Sounds', // For backward compatibility
    description: 'Perfect for relaxation and stress relief',
    tracks: [mockTracks[0], mockTracks[3]],
    emotion: 'calm',
    cover_url: '/images/playlists/calm.jpg'
  },
  {
    id: '2',
    title: 'Energy Boost',
    name: 'Energy Boost', // For backward compatibility
    description: 'Get motivated and energized',
    tracks: [mockTracks[1]],
    emotion: 'happy',
    cover_url: '/images/playlists/energy.jpg'
  },
  {
    id: '3',
    title: 'Work Concentration',
    name: 'Work Concentration', // For backward compatibility
    description: 'Enhance your focus and productivity',
    tracks: [mockTracks[2]],
    emotion: 'focused',
    cover_url: '/images/playlists/focus.jpg'
  }
];

// Convenience export for backward compatibility
export const mockPlaylists = mockMusicPlaylists;
