
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Heart } from 'lucide-react';
import { useMusic } from '@/contexts/music';
import { EmotionMusicParams } from '@/types/music';

interface MusicEmotionRecommendationProps {
  emotion: string;
  onSelect: (playlist: any) => void;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotion, onSelect }) => {
  const { loadPlaylistForEmotion } = useMusic();
  
  // Mock playlists based on emotions
  const playlists = {
    happy: { id: 'happy-1', name: 'Énergie positive', tracks: 12 },
    sad: { id: 'sad-1', name: 'Réconfort et douceur', tracks: 8 },
    angry: { id: 'angry-1', name: 'Libération et calme', tracks: 10 },
    anxious: { id: 'anxious-1', name: 'Apaisement et sérénité', tracks: 9 },
    calm: { id: 'calm-1', name: 'Pleine conscience', tracks: 7 },
    neutral: { id: 'neutral-1', name: 'Equilibre émotionnel', tracks: 11 }
  };
  
  // Get playlist based on emotion or fallback to neutral
  const playlist = playlists[emotion as keyof typeof playlists] || playlists.neutral;
  
  const handleSelectPlaylist = async () => {
    try {
      const params: EmotionMusicParams = { emotion };
      const musicPlaylist = await loadPlaylistForEmotion(params);
      onSelect(musicPlaylist || playlist);
    } catch (error) {
      console.error("Error loading emotion-based playlist:", error);
      onSelect(playlist);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musique recommandée pour votre état émotionnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.tracks} morceaux • Adaptés à l'émotion <span className="font-medium">{emotion}</span>
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <p className="text-sm">
            Cette sélection musicale est spécialement conçue pour harmoniser votre état émotionnel 
            actuel et favoriser votre bien-être.
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" onClick={handleSelectPlaylist}>
          Écouter cette playlist
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicEmotionRecommendation;
