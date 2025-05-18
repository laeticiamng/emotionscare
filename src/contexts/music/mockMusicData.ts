
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getMockMusicData = () => {
  const tracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Calm Waters',
      artist: 'Ambient Sounds',
      duration: 180,
      audioUrl: '/audio/calm-waters.mp3',
      coverUrl: '/images/calm-waters.jpg',
      emotion: 'calm',
      category: 'relax',
      genre: 'ambient',
      intensity: 0.3
    },
    {
      id: '2',
      title: 'Deep Focus',
      artist: 'Concentration Music',
      duration: 240,
      audioUrl: '/audio/deep-focus.mp3',
      coverUrl: '/images/deep-focus.jpg',
      emotion: 'focused',
      category: 'focus',
      genre: 'electronic',
      intensity: 0.5
    },
    {
      id: '3',
      title: 'Energy Boost',
      artist: 'Motivation Tracks',
      duration: 200,
      audioUrl: '/audio/energy-boost.mp3',
      coverUrl: '/images/energy-boost.jpg',
      emotion: 'energetic',
      category: 'energy',
      genre: 'pop',
      intensity: 0.8
    },
    {
      id: '4',
      title: 'Gentle Rain',
      artist: 'Nature Sounds',
      duration: 300,
      audioUrl: '/audio/gentle-rain.mp3',
      coverUrl: '/images/gentle-rain.jpg',
      emotion: 'calm',
      category: 'relax',
      genre: 'ambient',
      intensity: 0.2
    },
    {
      id: '5',
      title: 'Productive Morning',
      artist: 'Work Mode',
      duration: 260,
      audioUrl: '/audio/productive-morning.mp3',
      coverUrl: '/images/productive-morning.jpg',
      emotion: 'focused',
      category: 'focus',
      genre: 'minimal',
      intensity: 0.6
    }
  ];

  const playlists: MusicPlaylist[] = [
    {
      id: 'playlist-1',
      name: 'Calm & Relax',
      title: 'Calm & Relax',
      description: 'Soothing sounds for relaxation',
      coverUrl: '/images/calm-relax.jpg',
      cover: '/images/calm-relax.jpg',
      coverImage: '/images/calm-relax.jpg',
      tracks: tracks.filter(t => t.emotion === 'calm'),
      emotion: 'calm',
      mood: 'relaxed'
    },
    {
      id: 'playlist-2',
      name: 'Focus Mode',
      title: 'Focus Mode',
      description: 'Enhance your concentration',
      coverUrl: '/images/focus-mode.jpg',
      cover: '/images/focus-mode.jpg',
      coverImage: '/images/focus-mode.jpg',
      tracks: tracks.filter(t => t.emotion === 'focused'),
      emotion: 'focused',
      mood: 'concentrated'
    },
    {
      id: 'playlist-3',
      name: 'Energy & Motivation',
      title: 'Energy & Motivation',
      description: 'Boost your energy levels',
      coverUrl: '/images/energy-motivation.jpg',
      cover: '/images/energy-motivation.jpg',
      coverImage: '/images/energy-motivation.jpg',
      tracks: tracks.filter(t => t.emotion === 'energetic'),
      emotion: 'energetic',
      mood: 'energetic'
    }
  ];

  return { tracks, playlists };
};

// Export mock data for direct consumption
export const mockMusicTracks = getMockMusicData().tracks;
export const mockPlaylists = getMockMusicData().playlists;
