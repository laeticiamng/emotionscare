
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Play } from 'lucide-react';
import { MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { useMusic } from '@/hooks/useMusic';

interface EmotionMusicRecommendationsProps {
  emotion: string;
  intensity?: number;
  hideHeader?: boolean;
  className?: string;
  onPlayStart?: () => void;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion,
  intensity,
  hideHeader = false,
  className,
  onPlayStart,
}) => {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const musicContext = useMusic();

  useEffect(() => {
    const loadRecommendation = async () => {
      if (!emotion) return;
      
      setLoading(true);
      try {
        const params: EmotionMusicParams = {
          emotion,
          intensity,
        };
        
        let newPlaylist = null;
        
        // Essayer loadPlaylistForEmotion ou getRecommendationByEmotion
        if (musicContext.loadPlaylistForEmotion) {
          newPlaylist = await musicContext.loadPlaylistForEmotion(params);
        } else if (musicContext.getRecommendationByEmotion) {
          newPlaylist = await musicContext.getRecommendationByEmotion(params);
        }
        
        if (newPlaylist) {
          setPlaylist(newPlaylist);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des recommandations musicales:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendation();
  }, [emotion, intensity]);

  const handlePlayMusic = () => {
    if (playlist && musicContext.playPlaylist) {
      if (onPlayStart) onPlayStart();
      if (playlist.tracks && playlist.tracks.length > 0) {
        // Jouer la première piste et ouvrir le drawer si disponible
        musicContext.playPlaylist(playlist);
        
        // Si une fonction spécifique pour définir la piste courante existe
        if (musicContext.currentTrack !== null && playlist.tracks[0]) {
          if (typeof musicContext.play === 'function') {
            musicContext.play(playlist.tracks[0], playlist);
          }
        }
        
        // Ouvrir le drawer si cette fonction existe
        if (musicContext.toggleDrawer) {
          musicContext.toggleDrawer();
        } else if (musicContext.openDrawer !== undefined && typeof musicContext.setOpenDrawer === 'function') {
          musicContext.setOpenDrawer(true);
        }
      }
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        {!hideHeader && (
          <CardHeader>
            <CardTitle>Musique recommandée</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <Card className={className}>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>Musique recommandée</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{playlist.title || playlist.name || 'Playlist sans titre'}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.tracks?.length || 0} morceaux
              </p>
            </div>
            <Button onClick={handlePlayMusic} size="sm">
              <Play className="mr-2 h-4 w-4" />
              Écouter
            </Button>
          </div>
          
          {/* Aperçu des chansons */}
          <div className="mt-4">
            {playlist.tracks?.slice(0, 3).map((track) => (
              <div key={track.id} className="flex items-center py-2 border-b last:border-0">
                <div className="bg-primary/10 rounded-full p-2 mr-2">
                  <Music className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{track.title || track.name}</p>
                  <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
              </div>
            ))}
            
            {playlist.tracks?.length > 3 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                + {playlist.tracks.length - 3} autres morceaux
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
