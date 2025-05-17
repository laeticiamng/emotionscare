
import { MusicPlaylist, MusicTrack } from '@/types/music';

// Sample tracks
export const sampleTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Waters',
    artist: 'Nature Sounds',
    duration: 180,
    src: '/sounds/ambient-calm.mp3',
    emotion: 'calm',
    genre: 'ambient'
  },
  {
    id: '2',
    title: 'Peaceful Mind',
    artist: 'Meditation Masters',
    duration: 240,
    src: '/sounds/welcome.mp3',
    emotion: 'relaxed',
    genre: 'meditation'
  }
];

// Sample playlists
export const defaultPlaylists: MusicPlaylist[] = [
  {
    id: 'calm-playlist',
    name: 'Calming Sounds',
    tracks: sampleTracks,
    description: 'Relaxing sounds to calm your mind',
    tags: ['calm', 'relax', 'meditation']
  }
];

export default defaultPlaylists;
