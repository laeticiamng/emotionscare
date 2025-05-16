
import { useState, useEffect } from 'react';
import { MusicTrack } from '@/types/music';

// Mockup music tracks
const musicLibrary: Record<string, MusicTrack[]> = {
  joy: [
    {
      id: 'joy1',
      title: 'Happy Days',
      artist: 'Sunshine Band',
      album: 'Positive Vibes',
      mood: 'joy',
      genre: 'Pop',
      coverImage: 'https://via.placeholder.com/100?text=Happy',
      url: 'https://example.com/music/happy.mp3'
    },
    {
      id: 'joy2',
      title: 'Celebration',
      artist: 'Party People',
      album: 'Good Times',
      mood: 'joy',
      genre: 'Dance',
      coverImage: 'https://via.placeholder.com/100?text=Party',
      url: 'https://example.com/music/celebration.mp3'
    }
  ],
  calm: [
    {
      id: 'calm1',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      album: 'Relaxation',
      mood: 'calm',
      genre: 'Ambient',
      coverImage: 'https://via.placeholder.com/100?text=Calm',
      url: 'https://example.com/music/ocean.mp3'
    },
    {
      id: 'calm2',
      title: 'Gentle Rain',
      artist: 'Dream Orchestra',
      album: 'Peaceful Sleep',
      mood: 'calm',
      genre: 'Classical',
      coverImage: 'https://via.placeholder.com/100?text=Rain',
      url: 'https://example.com/music/rain.mp3'
    }
  ],
  sadness: [
    {
      id: 'sad1',
      title: 'Rainy Day',
      artist: 'Melancholy Mood',
      album: 'Reflections',
      mood: 'sadness',
      genre: 'Jazz',
      coverImage: 'https://via.placeholder.com/100?text=Rainy',
      url: 'https://example.com/music/rainy.mp3'
    },
    {
      id: 'sad2',
      title: 'Lost in Thoughts',
      artist: 'Deep Soul',
      album: 'Introspection',
      mood: 'sadness',
      genre: 'Blues',
      coverImage: 'https://via.placeholder.com/100?text=Lost',
      url: 'https://example.com/music/lost.mp3'
    }
  ],
  anxiety: [
    {
      id: 'anx1',
      title: 'Breathe In, Breathe Out',
      artist: 'Mindfulness',
      album: 'Calming Anxiety',
      mood: 'anxiety',
      genre: 'Meditation',
      coverImage: 'https://via.placeholder.com/100?text=Breathe',
      url: 'https://example.com/music/breathe.mp3'
    },
    {
      id: 'anx2',
      title: 'Let Go',
      artist: 'Healing Sounds',
      album: 'Release',
      mood: 'anxiety',
      genre: 'Ambient',
      coverImage: 'https://via.placeholder.com/100?text=Let+Go',
      url: 'https://example.com/music/letgo.mp3'
    }
  ],
  neutral: [
    {
      id: 'neu1',
      title: 'Ambient Study',
      artist: 'Focus Mind',
      album: 'Concentration',
      mood: 'neutral',
      genre: 'Electronic',
      coverImage: 'https://via.placeholder.com/100?text=Study',
      url: 'https://example.com/music/study.mp3'
    },
    {
      id: 'neu2',
      title: 'Background Harmony',
      artist: 'Subtle Sounds',
      album: 'Easy Listening',
      mood: 'neutral',
      genre: 'Instrumental',
      coverImage: 'https://via.placeholder.com/100?text=Harmony',
      url: 'https://example.com/music/harmony.mp3'
    }
  ],
  excitement: [
    {
      id: 'exc1',
      title: 'Energy Rush',
      artist: 'Power Band',
      album: 'Motivation',
      mood: 'excitement',
      genre: 'Rock',
      coverImage: 'https://via.placeholder.com/100?text=Energy',
      url: 'https://example.com/music/energy.mp3'
    },
    {
      id: 'exc2',
      title: 'Breakthrough',
      artist: 'Inspirational Beats',
      album: 'Success',
      mood: 'excitement',
      genre: 'Electronic',
      coverImage: 'https://via.placeholder.com/100?text=Success',
      url: 'https://example.com/music/breakthrough.mp3'
    }
  ]
};

// Fallback tracks if no mood matches
const defaultTracks: MusicTrack[] = [
  {
    id: 'default1',
    title: 'Peaceful Melody',
    artist: 'Wellness Sounds',
    album: 'Balance',
    mood: 'neutral',
    genre: 'Instrumental',
    coverImage: 'https://via.placeholder.com/100?text=Peaceful',
    url: 'https://example.com/music/peaceful.mp3'
  },
  {
    id: 'default2',
    title: 'Harmony Flow',
    artist: 'Serenity',
    album: 'Inner Peace',
    mood: 'calm',
    genre: 'New Age',
    coverImage: 'https://via.placeholder.com/100?text=Harmony',
    url: 'https://example.com/music/harmony.mp3'
  }
];

export function useMusicRecommendation(emotion: string | null, intensity?: number) {
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!emotion) {
          setRecommendedTracks(defaultTracks);
          return;
        }
        
        // Check if we have tracks for this emotion
        const emotionTracks = musicLibrary[emotion];
        
        if (emotionTracks && emotionTracks.length > 0) {
          setRecommendedTracks(emotionTracks);
        } else {
          // If no exact match, try to find related emotions
          const relatedEmotions: Record<string, string[]> = {
            joy: ['excitement', 'neutral'],
            sadness: ['anxiety', 'neutral'],
            anxiety: ['sadness', 'neutral'],
            calm: ['neutral', 'joy'],
            excitement: ['joy', 'neutral'],
            neutral: ['calm', 'joy']
          };
          
          const related = relatedEmotions[emotion] || ['neutral', 'calm'];
          
          // Try to get tracks from related emotions
          for (const relatedEmotion of related) {
            if (musicLibrary[relatedEmotion] && musicLibrary[relatedEmotion].length > 0) {
              setRecommendedTracks(musicLibrary[relatedEmotion]);
              return;
            }
          }
          
          // Fallback to default tracks if no related emotions found
          setRecommendedTracks(defaultTracks);
        }
      } catch (err) {
        console.error('Error getting music recommendations:', err);
        setError('Error retrieving music recommendations');
        setRecommendedTracks(defaultTracks);
      } finally {
        setIsLoading(false);
      }
    };
    
    getRecommendations();
  }, [emotion, intensity]);

  return { recommendedTracks, isLoading, error };
}
