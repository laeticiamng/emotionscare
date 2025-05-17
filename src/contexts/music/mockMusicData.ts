
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getMockMusicData = () => {
  const mockTracks: MusicTrack[] = [
    {
      id: 'track-1',
      title: 'Calm Waves',
      artist: 'Ocean Sounds',
      duration: 180,
      url: 'https://example.com/audio/calm-waves.mp3',
      coverUrl: 'https://example.com/images/calm-waves.jpg',
      emotion: 'calm'
    },
    {
      id: 'track-2',
      title: 'Morning Energy',
      artist: 'Sunrise Beats',
      duration: 210,
      url: 'https://example.com/audio/morning-energy.mp3',
      coverUrl: 'https://example.com/images/morning-energy.jpg',
      emotion: 'joy'
    },
    {
      id: 'track-3',
      title: 'Rainy Day',
      artist: 'Ambient Sounds',
      duration: 240,
      url: 'https://example.com/audio/rainy-day.mp3',
      coverUrl: 'https://example.com/images/rainy-day.jpg',
      emotion: 'sadness'
    },
    {
      id: 'track-4',
      title: 'Focus Zone',
      artist: 'Mind Clarity',
      duration: 300,
      url: 'https://example.com/audio/focus-zone.mp3',
      coverUrl: 'https://example.com/images/focus-zone.jpg',
      emotion: 'neutral'
    }
  ];

  const mockPlaylists: MusicPlaylist[] = [
    {
      id: 'playlist-calm',
      name: 'Calm Moments',
      emotion: 'calm',
      tracks: mockTracks.filter(track => track.emotion === 'calm'),
      description: 'Perfect for relaxation and stress reduction'
    },
    {
      id: 'playlist-joy',
      name: 'Joy & Energy',
      emotion: 'joy',
      tracks: mockTracks.filter(track => track.emotion === 'joy'),
      description: 'Uplifting tracks to boost your mood'
    },
    {
      id: 'playlist-focus',
      name: 'Deep Focus',
      emotion: 'neutral',
      tracks: mockTracks.filter(track => track.emotion === 'neutral'),
      description: 'Enhance your concentration and productivity'
    },
    {
      id: 'playlist-sadness',
      name: 'Melancholy Moods',
      emotion: 'sadness',
      tracks: mockTracks.filter(track => track.emotion === 'sadness'),
      description: 'Soothing tracks for emotional processing'
    }
  ];

  return { mockTracks, mockPlaylists };
};

export default getMockMusicData;
