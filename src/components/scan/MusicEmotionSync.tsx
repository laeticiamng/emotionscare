/**
 * MusicEmotionSync - Synchronisation scan → musique
 * Connecte les résultats de scan émotionnel au module musique
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { useMusic } from '@/hooks/useMusic';
import { EmotionResult } from '@/types/emotion';
import { MusicPlaylist } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, RefreshCw, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface MusicEmotionSyncProps {
  emotionResult?: EmotionResult | null;
  autoSync?: boolean;
  onPlaylistLoaded?: (playlist: MusicPlaylist | null) => void;
  showUI?: boolean;
}

export const MusicEmotionSync: React.FC<MusicEmotionSyncProps> = ({
  emotionResult,
  autoSync = true,
  onPlaylistLoaded,
  showUI = false
}) => {
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [syncing, setSyncing] = useState(false);
  const { activateMusicForEmotion, isGenerating } = useMusicEmotionIntegration();
  const { toast } = useToast();
  
  // Accès safe au contexte music
  let musicContext;
  try {
    musicContext = useMusic();
  } catch {
    musicContext = null;
  }

  const syncMusic = useCallback(async (result: EmotionResult) => {
    if (!result?.emotion) return;

    setSyncing(true);
    try {
      // Utiliser activateMusicForEmotion qui existe dans le hook
      const recommendedPlaylist = await activateMusicForEmotion({
        emotion: result.emotion,
        intensity: result.intensity || result.confidence || 0.5,
        duration: 120,
        instrumental: true
      });
      
      if (recommendedPlaylist) {
        setPlaylist(recommendedPlaylist);
        onPlaylistLoaded?.(recommendedPlaylist);
        
        logger.info('Music synced with emotion', { emotion: result.emotion }, 'MUSIC');
        
        toast({
          title: "🎵 Musique synchronisée",
          description: `Playlist adaptée à "${result.emotion}" prête.`,
          duration: 3000
        });
      }
    } catch (error) {
      logger.error('Music sync failed', error as Error, 'MUSIC');
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de charger la musique adaptée.",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  }, [activateMusicForEmotion, onPlaylistLoaded, toast]);

  useEffect(() => {
    if (autoSync && emotionResult) {
      syncMusic(emotionResult);
    }
  }, [emotionResult, autoSync, syncMusic]);

  const handleManualSync = () => {
    if (emotionResult) {
      syncMusic(emotionResult);
    }
  };

  const handlePlayNow = () => {
    if (playlist && musicContext?.play && playlist.tracks.length > 0) {
      musicContext.play(playlist.tracks[0]);
    }
  };

  // Mode invisible (composant fonctionnel sans UI)
  if (!showUI) {
    return null;
  }

  // Mode avec UI visible
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Sync Musique</p>
              {emotionResult?.emotion && (
                <Badge variant="secondary" className="text-xs capitalize">
                  {emotionResult.emotion}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {playlist && (
              <Button
                variant="default"
                size="sm"
                onClick={handlePlayNow}
                disabled={!musicContext}
              >
                <Play className="h-4 w-4 mr-1" />
                Écouter
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSync}
              disabled={!emotionResult || syncing || isGenerating}
            >
              {syncing || isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {playlist && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              {playlist.tracks.length} piste{playlist.tracks.length > 1 ? 's' : ''} prête{playlist.tracks.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicEmotionSync;
