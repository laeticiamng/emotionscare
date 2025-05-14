
import React, { useEffect, useState } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types/music';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Emotion } from '@/types/emotion';
import { useMusic } from '@/contexts/MusicContext';
import { Music, Activity } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import TrackList from './TrackList';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  userMood?: Emotion | null;
  isLoading?: boolean;
}

// Map emotions to music moods
const EMOTION_TO_MOOD_MAP: Record<string, string> = {
  joy: 'happy',
  happiness: 'happy',
  calm: 'calm',
  neutral: 'neutral',
  sadness: 'melancholic',
  anger: 'energetic',
  fear: 'ambient',
  anxiety: 'soothing',
  surprise: 'upbeat'
};

// Mock API call
const getRecommendedTracks = async (emotion: string): Promise<MusicTrack[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock tracks
  return [
    {
      id: '1',
      title: 'Calm Waters',
      artist: 'Serenity',
      coverUrl: '/images/music/calm-1.jpg',
      audioUrl: '/audio/calm-1.mp3',
      url: '/audio/calm-1.mp3',
      duration: 180,
      emotion: 'calm'
    },
    {
      id: '2',
      title: 'Peaceful Mind',
      artist: 'Zen Masters',
      coverUrl: '/images/music/calm-2.jpg',
      audioUrl: '/audio/calm-2.mp3',
      url: '/audio/calm-2.mp3',
      duration: 240,
      emotion: 'calm'
    },
    {
      id: '3',
      title: 'Morning Light',
      artist: 'Nature Sounds',
      coverUrl: '/images/music/calm-3.jpg',
      audioUrl: '/audio/calm-3.mp3',
      url: '/audio/calm-3.mp3',
      duration: 210,
      emotion: 'joy'
    }
  ];
};

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion = 'neutral',
  userMood,
  isLoading = false
}) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useMusic();
  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Determine the emotion to use for recommendations
  const targetEmotion = userMood?.emotion || emotion;
  const mood = EMOTION_TO_MOOD_MAP[targetEmotion.toLowerCase()] || 'neutral';
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const tracks = await getRecommendedTracks(targetEmotion);
        setRecommendedTracks(tracks);
      } catch (error) {
        console.error('Error fetching music recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [targetEmotion]);
  
  const handlePlayTrack = (track: MusicTrack) => {
    // Make sure track has the required properties
    const normalizedTrack: MusicTrack = {
      ...track,
      url: track.url || track.audioUrl || '',
      audioUrl: track.audioUrl || track.url || '',
      coverUrl: track.coverUrl || ''
    };
    
    playTrack(normalizedTrack);
  };
  
  if (isLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musique recommandée
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Activity className="h-3.5 w-3.5" />
          Sélection basée sur vos émotions actuelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendedTracks.length > 0 ? (
          <TrackList 
            tracks={recommendedTracks}
            onTrackSelect={handlePlayTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            showEmotionTag={true}
            compact={true}
          />
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Aucune recommandation musicale disponible pour le moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
