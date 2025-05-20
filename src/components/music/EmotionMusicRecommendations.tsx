
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Play, Pause } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { motion } from 'framer-motion';

interface EmotionMusicRecommendationsProps {
  emotion: string;
  intensity?: number;
  showPlayButton?: boolean;
  compact?: boolean;
}

export const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion,
  intensity = 0.5,
  showPlayButton = true,
  compact = false
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();

  useEffect(() => {
    const loadRecommendation = async () => {
      setIsLoading(true);
      
      try {
        const params: EmotionMusicParams = { 
          emotion, 
          intensity 
        };
        const result = await activateMusicForEmotion(params);
        if (result) {
          setPlaylist(result);
        }
      } catch (error) {
        console.error('Failed to load music recommendation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecommendation();
  }, [emotion, intensity, activateMusicForEmotion]);

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = { emotion, intensity };
      await activateMusicForEmotion(params);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
                <Headphones className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Musique recommandée</h4>
                <p className="text-xs text-muted-foreground">{getEmotionMusicDescription(emotion)}</p>
              </div>
            </div>
            
            {showPlayButton && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handlePlay}
                className="h-8 w-8 p-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-100 dark:border-blue-800/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Recommandations musicales</span>
          </CardTitle>
          <CardDescription>
            {getEmotionMusicDescription(emotion)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playlist && playlist.tracks && playlist.tracks.length > 0 ? (
              <div className="bg-white/60 dark:bg-gray-800/30 p-3 rounded-lg">
                <p className="text-sm font-medium">{playlist.title || playlist.name}</p>
                <p className="text-xs text-muted-foreground">
                  {playlist.tracks.length} pistes musicales disponibles
                </p>
              </div>
            ) : (
              <div className="bg-blue-50/70 dark:bg-blue-900/30 p-3 rounded-lg">
                <p className="text-sm">
                  {isLoading 
                    ? "Recherche des meilleures recommandations musicales..." 
                    : "Aucune playlist n'est actuellement disponible pour cette émotion."}
                </p>
              </div>
            )}
            
            {showPlayButton && (
              <Button 
                onClick={handlePlay} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Chargement...
                  </span>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Jouer la musique recommandée
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmotionMusicRecommendations;
