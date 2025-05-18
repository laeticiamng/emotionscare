
import { MusicTrack, MusicPlaylist } from '@/types/music';

export const getMockMusicData = () => {
  const tracks: MusicTrack[] = [
    {
      id: 'track-1',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 300,
      audioUrl: '/audio/ocean-waves.mp3',
      coverUrl: '/images/waves.jpg',
      emotion: 'calm',
      genre: 'ambient',
      album: 'Relaxation Collection',
      year: 2023,
      tags: ['relaxation', 'meditation', 'nature']
    },
    {
      id: 'track-2',
      title: 'Morning Energy',
      artist: 'Positive Vibes',
      duration: 240,
      audioUrl: '/audio/morning-energy.mp3',
      coverUrl: '/images/sunrise.jpg',
      emotion: 'happy',
      genre: 'electronic',
      album: 'Daily Boost',
      year: 2023,
      tags: ['energetic', 'morning', 'motivation']
    },
    {
      id: 'track-3',
      title: 'Deep Focus',
      artist: 'Concentration',
      duration: 360,
      audioUrl: '/audio/deep-focus.mp3',
      coverUrl: '/images/focus.jpg',
      emotion: 'focus',
      genre: 'minimal',
      album: 'Productivity Series',
      year: 2022,
      tags: ['focus', 'work', 'study']
    }
  ];

  const playlists: MusicPlaylist[] = [
    {
      id: 'playlist-1',
      name: 'Relaxation Collection',
      description: 'Calm your mind and body with these soothing tracks',
      tracks: [tracks[0]],
      emotion: 'calm',
      coverUrl: '/images/relaxation.jpg',
      tags: ['relaxation', 'calm', 'meditation'],
      created_at: '2023-10-05T14:48:00.000Z'
    },
    {
      id: 'playlist-2',
      name: 'Productivity Boost',
      description: 'Music to help you focus and get things done',
      tracks: [tracks[2]],
      emotion: 'focus',
      coverUrl: '/images/productivity.jpg',
      tags: ['focus', 'work', 'productivity'],
      created_at: '2023-09-15T09:30:00.000Z'
    },
    {
      id: 'playlist-3',
      name: 'Morning Motivation',
      description: 'Start your day with positive energy',
      tracks: [tracks[1]],
      emotion: 'happy',
      coverUrl: '/images/morning.jpg',
      tags: ['morning', 'motivation', 'positive'],
      created_at: '2023-09-01T07:15:00.000Z'
    }
  ];

  return { tracks, playlists };
};

export default getMockMusicData;
