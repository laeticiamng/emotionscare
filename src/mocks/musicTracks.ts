
import { MusicTrack, MusicPlaylist } from '@/types';

export const mockMusicTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Méditation matinale',
    artist: 'Nature Sounds',
    duration: 360, // 6 minutes
    url: '/audio/meditation-morning.mp3',
    audioUrl: '/audio/meditation-morning.mp3',
    coverUrl: '/images/covers/meditation.jpg',
    emotion: 'calm'
  },
  {
    id: '2',
    title: 'Focus intense',
    artist: 'Deep Work',
    duration: 1200, // 20 minutes
    url: '/audio/focus-beats.mp3',
    audioUrl: '/audio/focus-beats.mp3',
    coverUrl: '/images/covers/focus.jpg',
    emotion: 'focused'
  },
  {
    id: '3',
    title: 'Énergie positive',
    artist: 'Happy Vibes',
    duration: 240, // 4 minutes
    url: '/audio/positive-energy.mp3',
    audioUrl: '/audio/positive-energy.mp3',
    coverUrl: '/images/covers/energy.jpg',
    emotion: 'happy'
  }
];

export const mockMusicPlaylists: MusicPlaylist[] = [
  {
    id: 'playlist-1',
    name: 'Méditation quotidienne',
    emotion: 'calm',
    tracks: mockMusicTracks.filter(track => track.emotion === 'calm')
  },
  {
    id: 'playlist-2',
    name: 'Concentration',
    emotion: 'focused',
    tracks: mockMusicTracks.filter(track => track.emotion === 'focused')
  },
  {
    id: 'playlist-3',
    name: 'Boost d\'énergie',
    emotion: 'happy',
    tracks: mockMusicTracks.filter(track => track.emotion === 'happy')
  }
];

export default { tracks: mockMusicTracks, playlists: mockMusicPlaylists };
