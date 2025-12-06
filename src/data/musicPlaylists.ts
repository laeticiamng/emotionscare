// @ts-nocheck

// @ts-nocheck
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Sample tracks
export const sampleTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Calm Waters',
    artist: 'Nature Sounds',
    url: '/sounds/ambient-calm.mp3',
    duration: 180,
    audioUrl: '/sounds/ambient-calm.mp3',
    emotion: 'calm',
    genre: 'ambient'
  },
  {
    id: '2',
    title: 'Peaceful Mind',
    artist: 'Meditation Masters',
    url: '/sounds/welcome.mp3',
    duration: 240,
    audioUrl: '/sounds/welcome.mp3',
    emotion: 'relaxed',
    genre: 'meditation'
  }
];

// Sample playlists
export const defaultPlaylists: MusicPlaylist[] = [
  {
    id: 'calm-playlist',
    name: 'Calming Sounds',
    title: 'Calming Sounds',
    tracks: sampleTracks,
    description: 'Relaxing sounds to calm your mind',
    tags: ['calm', 'relax', 'meditation'],
    creator: 'EmotionsCare'
  }
];

export default defaultPlaylists;
