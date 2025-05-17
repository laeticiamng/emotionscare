
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Mock tracks for testing purposes
export const mockMusicTracks: MusicTrack[] = [
  {
    id: 'track-001',
    title: 'Calm Waters',
    artist: 'Ambient Sounds',
    album: 'Nature Sounds',
    duration: 180,
    url: 'https://example.com/sounds/calm-waters.mp3',
    coverUrl: 'https://example.com/images/calm-waters.jpg',
    genre: 'ambient',
    emotion: 'calm',
    description: 'Relaxing sounds of gentle waves on a peaceful shore'
  },
  {
    id: 'track-002',
    title: 'Morning Energy',
    artist: 'Dawn Breakers',
    album: 'Sunrise',
    duration: 210,
    url: 'https://example.com/sounds/morning-energy.mp3',
    coverUrl: 'https://example.com/images/sunrise.jpg',
    genre: 'uplifting',
    emotion: 'energized',
    description: 'Start your day with this energetic composition'
  },
  {
    id: 'track-003',
    title: 'Deep Focus',
    artist: 'Concentration Sounds',
    album: 'Focus',
    duration: 240,
    url: 'https://example.com/sounds/deep-focus.mp3',
    coverUrl: 'https://example.com/images/focus.jpg',
    genre: 'electronic',
    emotion: 'focused',
    description: 'Enhanced concentration with deep electronic beats'
  }
];

// Mock playlists for testing purposes
export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-001',
    title: 'Relaxation',
    name: 'Relaxation Playlist',
    description: 'A collection of relaxing sounds to help you unwind',
    coverUrl: 'https://example.com/images/relaxation.jpg',
    tracks: mockMusicTracks.filter(track => track.emotion === 'calm'),
    emotion: 'calm'
  },
  {
    id: 'playlist-002',
    title: 'Energy Boost',
    name: 'Energy Boost Playlist',
    description: 'Uplifting tracks to boost your energy levels',
    coverUrl: 'https://example.com/images/energy.jpg',
    tracks: mockMusicTracks.filter(track => track.emotion === 'energized'),
    emotion: 'energized'
  },
  {
    id: 'playlist-003',
    title: 'Focus Zone',
    name: 'Focus Zone Playlist',
    description: 'Enhance your concentration and productivity',
    coverUrl: 'https://example.com/images/focus.jpg',
    tracks: mockMusicTracks.filter(track => track.emotion === 'focused'),
    emotion: 'focused'
  },
  {
    id: 'playlist-004',
    title: 'Mixed Emotions',
    name: 'Mixed Emotions Playlist',
    description: 'A varied collection for all moods',
    coverUrl: 'https://example.com/images/mixed.jpg',
    tracks: mockMusicTracks,
    emotion: 'mixed'
  }
];
