
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock track data for development
export const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Peaceful Harmony',
    artist: 'Ambient Sounds',
    album: 'Relaxation Collection',
    duration: 280,
    url: '/audio/peaceful-harmony.mp3',
    coverUrl: '/images/covers/peaceful-harmony.jpg',
    mood: 'calm'
  },
  {
    id: '2',
    title: 'Energy Boost',
    artist: 'Electronic Beats',
    album: 'Workout Mix',
    duration: 195,
    url: '/audio/energy-boost.mp3',
    coverUrl: '/images/covers/energy-boost.jpg',
    mood: 'energetic'
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'Study Tunes',
    album: 'Concentration',
    duration: 340,
    url: '/audio/deep-focus.mp3',
    coverUrl: '/images/covers/deep-focus.jpg',
    mood: 'focused'
  },
  {
    id: '4',
    title: 'Joyful Melodies',
    artist: 'Happy Sounds',
    album: 'Positive Vibes',
    duration: 210,
    url: '/audio/joyful-melodies.mp3',
    coverUrl: '/images/covers/joyful-melodies.jpg',
    mood: 'happy'
  },
  {
    id: '5',
    title: 'Gentle Reflection',
    artist: 'Piano Dreams',
    album: 'Mindful Moments',
    duration: 305,
    url: '/audio/gentle-reflection.mp3',
    coverUrl: '/images/covers/gentle-reflection.jpg',
    mood: 'calm'
  }
];

// Mock playlist data for development
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'pl1',
    title: 'Calm & Relaxation',
    description: 'Soothing tracks to help you unwind and relax',
    coverUrl: '/images/playlists/calm-relaxation.jpg',
    tracks: mockTracks.filter(track => track.mood === 'calm'),
    category: 'relaxation',
    mood: 'calm'
  },
  {
    id: 'pl2',
    title: 'Energy & Motivation',
    description: 'Upbeat tracks to boost your energy',
    coverUrl: '/images/playlists/energy-motivation.jpg',
    tracks: mockTracks.filter(track => track.mood === 'energetic'),
    category: 'workout',
    mood: 'energetic'
  },
  {
    id: 'pl3',
    title: 'Focus & Concentration',
    description: 'Help maintain focus and concentration',
    coverUrl: '/images/playlists/focus-concentration.jpg',
    tracks: mockTracks.filter(track => track.mood === 'focused'),
    category: 'focus',
    mood: 'focused'
  },
  {
    id: 'pl4',
    title: 'Happy Vibes',
    description: 'Music to boost your mood and make you smile',
    coverUrl: '/images/playlists/happy-vibes.jpg',
    tracks: mockTracks.filter(track => track.mood === 'happy'),
    category: 'mood',
    mood: 'happy'
  }
];
