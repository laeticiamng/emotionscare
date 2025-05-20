
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, RotateCw } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { EmotionMusicParams, MusicPlaylist } from '@/types/music';
import { motion } from 'framer-motion';

interface MusicEmotionSyncProps {
  detectedEmotion: string;
  intensity?: number;
  onMusicActivated?: () => void;
}

export const MusicEmotionSync: React.FC<MusicEmotionSyncProps> = ({
  detectedEmotion,
  intensity = 0.5,
  onMusicActivated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const { activateMusicForEmotion, getEmotionMusicDescription, isLoading: hookLoading } = useMusicEmotionIntegration();

  // Load music recommendations when emotion changes
  useEffect(() => {
    const syncWithEmotion = async () => {
      if (!detectedEmotion) return;
      
      setIsLoading(true);
      try {
        const params: EmotionMusicParams = {
          emotion: detectedEmotion,
          intensity: intensity
        };
        const result = await activateMusicForEmotion(params);
        if (result) {
          setPlaylist(result);
          if (onMusicActivated) onMusicActivated();
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    syncWithEmotion();
  }, [detectedEmotion, intensity, activateMusicForEmotion, onMusicActivated]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = {
        emotion: detectedEmotion,
        intensity: intensity
      };
      const result = await activateMusicForEmotion(params);
      if (result) {
        setPlaylist(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-blue-100 dark:border-blue-800/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-3">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Musique adaptée
          </CardTitle>
          <CardDescription>
            {detectedEmotion ? getEmotionMusicDescription(detectedEmotion) : "En attente de détection d'émotion..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {detectedEmotion ? (
              <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Émotion détectée</p>
                  <p className="text-xs text-muted-foreground capitalize">{detectedEmotion}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm">Aucune émotion détectée pour le moment</p>
              </div>
            )}
            
            {playlist && (
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <p className="text-sm font-medium">{playlist.title || playlist.name}</p>
                <p className="text-xs text-muted-foreground">
                  {playlist.tracks.length} pistes musicales disponibles
                </p>
              </div>
            )}
            
            <Button
              className="w-full"
              disabled={isLoading || hookLoading || !detectedEmotion}
              onClick={handleRefresh}
            >
              {isLoading || hookLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : playlist ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Jouer la musique
                </>
              ) : (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Rafraîchir
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MusicEmotionSync;
