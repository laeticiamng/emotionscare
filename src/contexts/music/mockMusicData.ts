
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getMockMusicData = () => {
  const tracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Calm Waters',
      artist: 'Nature Sounds',
      duration: 180,
      audioUrl: '/sounds/ambient-calm.mp3',
      src: '/sounds/ambient-calm.mp3',
      coverImage: '/images/covers/calm.jpg',
      emotion: 'calm',
      intensity: 0.8,
      category: 'meditation'
    },
    {
      id: '2',
      title: 'Focus Flow',
      artist: 'Deep Concentration',
      duration: 240,
      audioUrl: '/sounds/focus-flow.mp3',
      src: '/sounds/focus-flow.mp3',
      coverImage: '/images/covers/focus.jpg',
      emotion: 'focus',
      intensity: 0.7,
      category: 'productivity'
    },
    {
      id: '3',
      title: 'Joyful Morning',
      artist: 'Happy Tunes',
      duration: 210,
      audioUrl: '/sounds/happy-tunes.mp3',
      src: '/sounds/happy-tunes.mp3',
      coverImage: '/images/covers/happy.jpg',
      emotion: 'happy',
      intensity: 0.9,
      category: 'upbeat'
    },
    {
      id: '4',
      title: 'Peaceful Meditation',
      artist: 'Zen Master',
      duration: 300,
      audioUrl: '/sounds/meditation.mp3',
      src: '/sounds/meditation.mp3',
      coverImage: '/images/covers/meditation.jpg',
      emotion: 'relaxed',
      intensity: 0.5,
      category: 'meditation'
    }
  ];

  const playlists: MusicPlaylist[] = [
    {
      id: 'calm-playlist',
      name: 'Calming Sounds',
      description: 'Collection of soothing tunes for relaxation',
      tracks: tracks.filter(t => t.emotion === 'calm' || t.emotion === 'relaxed'),
      emotion: 'calm',
      coverImage: '/images/playlists/calm.jpg',
      category: 'meditation'
    },
    {
      id: 'focus-playlist',
      name: 'Focus Tracks',
      description: 'Music designed to enhance focus and productivity',
      tracks: tracks.filter(t => t.emotion === 'focus'),
      emotion: 'focus',
      coverImage: '/images/playlists/focus.jpg',
      category: 'productivity'
    },
    {
      id: 'happy-playlist',
      name: 'Mood Boosters',
      description: 'Uplifting and energizing tracks to boost your mood',
      tracks: tracks.filter(t => t.emotion === 'happy'),
      emotion: 'happy',
      coverImage: '/images/playlists/happy.jpg',
      category: 'upbeat'
    }
  ];

  return { tracks, playlists };
};

export const mockMusicTracks = getMockMusicData().tracks;
export const mockPlaylists = getMockMusicData().playlists;
