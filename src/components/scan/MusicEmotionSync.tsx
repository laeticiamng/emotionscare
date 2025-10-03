
import React, { useEffect, useState } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { EmotionResult } from '@/types/emotion';
import { MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

interface MusicEmotionSyncProps {
  emotionResult?: EmotionResult | null;
  autoSync?: boolean;
  onPlaylistLoaded?: (playlist: MusicPlaylist | null) => void;
}

export const MusicEmotionSync: React.FC<MusicEmotionSyncProps> = ({
  emotionResult,
  autoSync = true,
  onPlaylistLoaded
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const { getMusicRecommendationForEmotion, isLoading } = useMusicEmotionIntegration();
  const { toast } = useToast();

  useEffect(() => {
    if (autoSync && emotionResult) {
      syncMusic(emotionResult);
    }
  }, [emotionResult, autoSync]);

  const syncMusic = async (result: EmotionResult) => {
    if (!result || !result.emotion) {
      return;
    }

    try {
      const recommendedPlaylist = await getMusicRecommendationForEmotion(result);
      if (recommendedPlaylist) {
        setPlaylist(recommendedPlaylist);
        
        if (onPlaylistLoaded) {
          onPlaylistLoaded(recommendedPlaylist);
        }
        
        toast({
          title: "Musique synchronisée",
          description: `Une playlist adaptée à votre humeur ${result.emotion} est prête.`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error syncing music with emotion:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de charger la musique adaptée à votre humeur.",
        variant: "destructive"
      });
    }
  };

  const manualSync = async () => {
    if (emotionResult) {
      await syncMusic(emotionResult);
    }
  };

  return (
    <div className="music-emotion-sync">
      {/* Component rendering can be added if needed */}
    </div>
  );
};

export default MusicEmotionSync;
