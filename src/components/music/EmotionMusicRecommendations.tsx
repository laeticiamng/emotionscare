
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { EmotionMusicParams } from '@/types/music';
import { Music, Play, Loader2 } from 'lucide-react';

interface EmotionMusicRecommendationsProps {
  emotion: string;
  description?: string;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion,
  description
}) => {
  const { 
    currentTrack, 
    playTrack, 
    isPlaying, 
    pauseTrack,
    loadPlaylistForEmotion
  } = useMusic();
  
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get a description of the emotion-based music
  const getEmotionMusicDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      'calm': 'Une musique apaisante pour vous aider à vous détendre et retrouver votre sérénité.',
      'happy': 'Des mélodies joyeuses et entraînantes pour amplifier votre bonne humeur.',
      'sad': 'Des compositions mélancoliques pour accompagner vos moments de réflexion.',
      'angry': 'Une musique énergique pour canaliser et transformer votre colère.',
      'anxious': 'Des sons doux et réguliers pour vous aider à retrouver votre calme intérieur.',
      'focus': 'Une ambiance sonore équilibrée pour améliorer votre concentration.',
      'energetic': 'Des rythmes dynamiques pour stimuler votre énergie et votre motivation.',
      'melancholy': 'Des mélodies douces et introspectives pour accompagner vos moments de nostalgie.'
    };
    
    return descriptions[emotion.toLowerCase()] || 'Musique adaptée à votre état émotionnel actuel.';
  };
  
  useEffect(() => {
    const loadRecommendation = async () => {
      if (!emotion) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the loadPlaylistForEmotion function from MusicContext
        const playlist = await loadPlaylistForEmotion(emotion);
        setRecommendation(playlist);
      } catch (err) {
        console.error('Failed to load music recommendation:', err);
        setError('Impossible de charger les recommandations musicales.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendation();
  }, [emotion, loadPlaylistForEmotion]);
  
  const handlePlayRecommendation = () => {
    if (recommendation && recommendation.tracks && recommendation.tracks.length > 0) {
      playTrack(recommendation.tracks[0]);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des recommandations musicales...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Music className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">
              Musique pour {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {description || getEmotionMusicDescription(emotion)}
            </p>
            
            {recommendation ? (
              <div className="space-y-4">
                <h4 className="font-medium">Recommandation: {recommendation.name || recommendation.title}</h4>
                {recommendation.tracks && recommendation.tracks.length > 0 && (
                  <Button onClick={handlePlayRecommendation}>
                    <Play className="mr-2 h-4 w-4" />
                    Écouter maintenant
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm italic">Aucune recommandation disponible pour le moment.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
