import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { getTrackCover } from '@/utils/musicCompatibility';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Play, Music } from 'lucide-react';

interface EmotionMusicRecommendationsProps {
  emotion: string;
  intensity?: number;
  autoActivate?: boolean;
  onPlaylistLoaded?: (playlist: MusicPlaylist | null) => void;
  className?: string;
}

export const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion,
  intensity = 0.5,
  autoActivate = false,
  onPlaylistLoaded,
  className = ''
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();

  useEffect(() => {
    if (autoActivate && emotion) {
      loadMusicForEmotion();
    }
  }, [emotion, autoActivate]);

  const loadMusicForEmotion = async () => {
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = {
        emotion,
        intensity
      };
      
      const result = await activateMusicForEmotion(params);
      if (result) {
        setPlaylist(result);
        
        if (onPlaylistLoaded) {
          onPlaylistLoaded(result);
        }
      }
    } catch (error) {
      logger.error('Error loading music for emotion', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="mr-2 h-5 w-5" />
          Recommandations musicales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{getEmotionMusicDescription(emotion)}</p>
        
        {playlist && (
          <div className="space-y-2">
            <h4 className="font-medium">{playlist.name || 'Playlist personnalisée'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {playlist.tracks.slice(0, 4).map((track: MusicTrack) => (
                <div key={track.id} className="flex items-center space-x-2">
                  <img 
                    src={getTrackCover(track)} 
                    alt={track.title} 
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!playlist && !isLoading && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Aucune playlist chargée</p>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Chargement des recommandations...</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={loadMusicForEmotion} 
          disabled={isLoading} 
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          {playlist ? 'Actualiser les recommandations' : 'Découvrir des morceaux adaptés'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionMusicRecommendations;
