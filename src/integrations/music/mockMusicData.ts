
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { v4 as uuid } from 'uuid';

export const mockPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    name: 'Concentration',
    emotion: 'focus',
    tracks: [
      {
        id: uuid(),
        title: 'Deep Focus',
        artist: 'Ambient Studio',
        duration: 240,
        audioUrl: '/sounds/ambient-calm.mp3',
        coverUrl: '/images/covers/focus-1.jpg',
        emotion: 'focus'
      },
      {
        id: uuid(),
        title: 'Calm Working',
        artist: 'LoCi',
        duration: 320,
        audioUrl: '/sounds/ambient-calm.mp3',
        coverUrl: '/images/covers/focus-2.jpg',
        emotion: 'focus'
      }
    ]
  },
  {
    id: 'playlist-2',
    name: 'Relaxation',
    emotion: 'calm',
    tracks: [
      {
        id: uuid(),
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: 380,
        audioUrl: '/sounds/ambient-calm.mp3',
        coverUrl: '/images/covers/calm-1.jpg',
        emotion: 'calm'
      },
      {
        id: uuid(),
        title: 'Meditation',
        artist: 'Zen Garden',
        duration: 450,
        audioUrl: '/sounds/ambient-calm.mp3',
        coverUrl: '/images/covers/calm-2.jpg',
        emotion: 'calm'
      }
    ]
  },
  {
    id: 'playlist-3',
    name: 'Energie Positive',
    emotion: 'upbeat',
    tracks: [
      {
        id: uuid(),
        title: 'Morning Boost',
        artist: 'Energy Mix',
        duration: 210,
        audioUrl: '/sounds/welcome.mp3',
        coverUrl: '/images/covers/upbeat-1.jpg',
        emotion: 'upbeat'
      },
      {
        id: uuid(),
        title: 'Happy Days',
        artist: 'Sunshine Band',
        duration: 240,
        audioUrl: '/sounds/welcome.mp3',
        coverUrl: '/images/covers/upbeat-2.jpg',
        emotion: 'upbeat'
      }
    ]
  }
];

export const getPlaylistByEmotion = (emotion: string): MusicPlaylist => {
  const playlist = mockPlaylists.find(p => p.emotion === emotion);
  
  if (!playlist) {
    // Return default playlist if no match
    return mockPlaylists[0];
  }
  
  return playlist;
};

export default {
  mockPlaylists,
  getPlaylistByEmotion
};
