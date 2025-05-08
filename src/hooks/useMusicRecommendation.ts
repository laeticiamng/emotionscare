
import { useCallback, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';
import type { MusicTrack } from '@/types';

// Mapping plus complet des émotions vers les types de musique
const EMOTION_TO_MUSIC: Record<string, string> = {
  // États positifs
  happy: 'happy',
  excited: 'energetic',
  joyful: 'happy',
  satisfied: 'happy',
  energetic: 'energetic',
  
  // États calmes
  calm: 'calm',
  relaxed: 'calm',
  peaceful: 'calm',
  tranquil: 'calm',
  
  // États négatifs - musique apaisante
  sad: 'calm',
  anxious: 'calm',
  stressed: 'calm',
  angry: 'calm',
  frustrated: 'calm',
  overwhelmed: 'calm',
  tired: 'calm',
  
  // États de concentration
  focused: 'focused',
  determined: 'focused',
  concentrated: 'focused',
  
  // État neutre
  neutral: 'neutral',
  normal: 'neutral',
  
  // Valeurs par défaut pour émotions non mappées
  default: 'neutral'
};

export function useMusicRecommendation() {
  const { loadPlaylistForEmotion, openDrawer, setCurrentTrack, isPlaying, pauseTrack, playTrack, currentTrack } = useMusic();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fix the function causing the error by ensuring proper type compatibility
  const playTrackWrapper = (track: MusicTrack) => {
    // Convert track to the expected format if needed
    const compatibleTrack: MusicTrack = {
      ...track,
      url: track.url || track.audioUrl || '',  // Ensure url is defined
      artist: track.artist || 'Unknown Artist', // Ensure artist is defined
      // Include other required fields to satisfy the type
      id: track.id,
      title: track.title,
    };
    
    setCurrentTrack(compatibleTrack);
    playTrack(compatibleTrack);
  };

  // Toggle play/pause functionality
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  // Load music for a specific mood/emotion
  const loadMusicForMood = useCallback((emotion: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const musicType = EMOTION_TO_MUSIC[emotion.toLowerCase()] || EMOTION_TO_MUSIC.default;
      loadPlaylistForEmotion(musicType);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading music for mood:', err);
      setError('Failed to load music for this mood');
      setIsLoading(false);
    }
  }, [loadPlaylistForEmotion]);

  // Handler pour activer la musique adaptée à l'émotion
  const handlePlayMusic = useCallback((emotionResult?: EmotionResult | null) => {
    if (!emotionResult || !emotionResult.emotion) return;
    
    const emotionKey = emotionResult.emotion.toLowerCase();
    const musicType = EMOTION_TO_MUSIC[emotionKey] || EMOTION_TO_MUSIC.default;
    
    console.log(`Émotion détectée: ${emotionKey} → Type de musique: ${musicType}`);
    
    loadPlaylistForEmotion(musicType);
    openDrawer();
    
    toast({
      title: "Playlist activée",
      description: `Votre ambiance musicale "${musicType}" est prête à être écoutée`,
    });
  }, [loadPlaylistForEmotion, openDrawer, toast]);

  return {
    handlePlayMusic,
    EMOTION_TO_MUSIC,
    isLoading,
    loadMusicForMood,
    togglePlayPause,
    currentTrack,
    error,
    playTrack: playTrackWrapper
  };
}
