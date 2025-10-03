
import React, { useEffect, useState } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicPlaylist } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface MusicRecommendationProps {
  emotion: string;
  autoPlay?: boolean;
}

export const MusicRecommendation: React.FC<MusicRecommendationProps> = ({
  emotion,
  autoPlay = false
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const { playEmotion, isLoading, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  useEffect(() => {
    if (autoPlay && emotion) {
      handlePlay();
    }
  }, [emotion, autoPlay]);
  
  const handlePlay = async () => {
    if (emotion) {
      try {
        const result = await playEmotion(emotion);
        if (result) {
          setPlaylist(result);
        }
      } catch (error) {
        console.error('Error playing emotion music:', error);
      }
    }
  };
  
  return (
    <div className="music-recommendation p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-2">Recommandation musicale</h3>
      <p className="text-muted-foreground mb-4">{getEmotionMusicDescription(emotion)}</p>
      
      <Button 
        onClick={handlePlay} 
        disabled={isLoading} 
        className="w-full"
      >
        <Play className="mr-2 h-4 w-4" />
        {isLoading ? 'Chargement...' : 'Écouter la playlist adaptée'}
      </Button>
      
      {playlist && (
        <div className="mt-4">
          <p className="text-sm font-medium">{playlist.name || 'Playlist personnalisée'}</p>
          <p className="text-xs text-muted-foreground">{playlist.tracks.length} morceaux</p>
        </div>
      )}
    </div>
  );
};

export default MusicRecommendation;
