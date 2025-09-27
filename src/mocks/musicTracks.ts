
/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels MusicTrack et MusicPlaylist
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';

export const mockMusicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Méditation matinale',
    artist: 'Nature Sounds',
    url: '/audio/meditation-morning.mp3',
    duration: 360, // 6 minutes
    audioUrl: '/audio/meditation-morning.mp3',
    coverUrl: '/images/covers/meditation.jpg',
    emotion: 'calm'
  },
  {
    id: '2',
    title: 'Focus intense',
    artist: 'Deep Work',
    url: '/audio/focus-beats.mp3',
    duration: 1200, // 20 minutes
    audioUrl: '/audio/focus-beats.mp3',
    coverUrl: '/images/covers/focus.jpg',
    emotion: 'focused'
  },
  {
    id: '3',
    title: 'Énergie positive',
    artist: 'Happy Vibes',
    url: '/audio/positive-energy.mp3',
    duration: 240, // 4 minutes
    audioUrl: '/audio/positive-energy.mp3',
    coverUrl: '/images/covers/energy.jpg',
    emotion: 'happy'
  }
];

export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    title: 'Méditation quotidienne',
    name: 'Méditation quotidienne',
    emotion: 'calm',
    tracks: mockMusicTracks.filter(track => track.emotion === 'calm')
  },
  {
    id: 'playlist-2',
    title: 'Concentration',
    name: 'Concentration',
    emotion: 'focused',
    tracks: mockMusicTracks.filter(track => track.emotion === 'focused')
  },
  {
    id: 'playlist-3',
    title: 'Boost d\'énergie',
    name: 'Boost d\'énergie',
    emotion: 'happy',
    tracks: mockMusicTracks.filter(track => track.emotion === 'happy')
  }
];

export default { tracks: mockMusicTracks, playlists: mockMusicPlaylists };
