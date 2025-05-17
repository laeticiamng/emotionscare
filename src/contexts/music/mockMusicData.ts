
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getMockMusicData = () => {
  const mockTracks: MusicTrack[] = [
    {
      id: 'track-1',
      title: 'Relaxation profonde',
      artist: 'Nature Sounds',
      duration: 180,
      url: 'https://example.com/audio/relaxation.mp3',
      coverUrl: 'https://example.com/images/covers/relaxation.jpg',
      emotion: 'calm',
      genre: 'ambient'
    },
    {
      id: 'track-2',
      title: 'Énergie positive',
      artist: 'Happy Vibes',
      duration: 210,
      url: 'https://example.com/audio/energy.mp3',
      coverUrl: 'https://example.com/images/covers/energy.jpg',
      emotion: 'joy',
      genre: 'upbeat'
    },
    {
      id: 'track-3',
      title: 'Méditation guidée',
      artist: 'Mindfulness',
      duration: 300,
      url: 'https://example.com/audio/meditation.mp3',
      coverUrl: 'https://example.com/images/covers/meditation.jpg',
      emotion: 'focus',
      genre: 'ambient'
    },
    {
      id: 'track-4',
      title: 'Douceur mélancolique',
      artist: 'Gentle Mood',
      duration: 240,
      url: 'https://example.com/audio/melancholy.mp3',
      coverUrl: 'https://example.com/images/covers/melancholy.jpg',
      emotion: 'sadness',
      genre: 'classical'
    }
  ];

  const mockPlaylists: MusicPlaylist[] = [
    {
      id: 'playlist-calm',
      name: 'Calme et sérénité',
      emotion: 'calm',
      mood: 'calm',
      tracks: [mockTracks[0], mockTracks[2]],
      description: 'Une playlist pour retrouver le calme intérieur',
      coverUrl: 'https://example.com/images/playlists/calm.jpg'
    },
    {
      id: 'playlist-joy',
      name: 'Énergie positive',
      emotion: 'joy',
      mood: 'happy',
      tracks: [mockTracks[1]],
      description: 'Des mélodies pour stimuler votre joie de vivre',
      coverUrl: 'https://example.com/images/playlists/joy.jpg'
    },
    {
      id: 'playlist-focus',
      name: 'Concentration',
      emotion: 'focus',
      mood: 'focused',
      tracks: [mockTracks[2]],
      description: 'Aide à la concentration et au travail',
      coverUrl: 'https://example.com/images/playlists/focus.jpg'
    },
    {
      id: 'playlist-sad',
      name: 'Mélancolie',
      emotion: 'sadness',
      mood: 'sad',
      tracks: [mockTracks[3]],
      description: 'Pour accompagner les moments de mélancolie',
      coverUrl: 'https://example.com/images/playlists/sadness.jpg'
    }
  ];

  return { mockTracks, mockPlaylists };
};

export default getMockMusicData;
