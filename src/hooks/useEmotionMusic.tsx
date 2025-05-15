
import { MusicPlaylist, EmotionMusicParams } from '@/types';

export const useEmotionMusic = () => {
  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    const { emotion, intensity = 50 } = params;
    
    // Simulate API call to get music for emotion
    console.log(`Loading music for emotion: ${emotion} with intensity: ${intensity}`);
    
    // Mock data
    return {
      id: '123',
      name: `${emotion} playlist`,
      tracks: [
        {
          id: '1',
          title: `${emotion} melody`,
          artist: 'Wellness Music',
          duration: 180, // Ajout de la propriété duration
          url: '/music/track1.mp3',
          audioUrl: '/music/track1.mp3',
          coverUrl: '/images/cover1.jpg'
        },
        {
          id: '2',
          title: 'Peaceful sounds',
          artist: 'Mindful Artists',
          duration: 240, // Ajout de la propriété duration
          url: '/music/track2.mp3',
          audioUrl: '/music/track2.mp3',
          coverUrl: '/images/cover2.jpg'
        }
      ]
    };
  };
  
  return { loadPlaylistForEmotion };
};

export default useEmotionMusic;

// Export the function directly for components that need it
export const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
  const { emotion, intensity = 50 } = params;
  // Reuse the same implementation
  console.log(`Loading music globally for emotion: ${emotion} with intensity: ${intensity}`);
  
  return {
    id: '123',
    name: `${emotion} playlist`,
    tracks: [
      {
        id: '1',
        title: `${emotion} melody`,
        artist: 'Wellness Music',
        duration: 180, // Ajout de la propriété duration
        url: '/music/track1.mp3',
        audioUrl: '/music/track1.mp3',
        coverUrl: '/images/cover1.jpg'
      },
      {
        id: '2',
        title: 'Peaceful sounds',
        artist: 'Mindful Artists',
        duration: 240, // Ajout de la propriété duration
        url: '/music/track2.mp3',
        audioUrl: '/music/track2.mp3',
        coverUrl: '/images/cover2.jpg'
      }
    ]
  };
};
