
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MusicPlaylist } from '@/types/music';
import { EmotionMusicParams } from '@/types/music';
import { useMusicContext } from '@/contexts/MusicContext';
import { Music, Play, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ensurePlaylist, convertToPlaylist } from '@/utils/musicCompatibility';

interface RecommendedPresetsProps {
  emotion?: string;
  mood?: string;
  autoLoad?: boolean;
  className?: string;
}

const RecommendedPresets: React.FC<RecommendedPresetsProps> = ({
  emotion = 'calm',
  mood,
  autoLoad = false,
  className,
}) => {
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<MusicPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const music = useMusicContext();

  // Fonction pour charger les playlists recommandées
  const loadRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (music.loadPlaylistForEmotion) {
        const emotionParams: EmotionMusicParams = {
          emotion,
          mood,
        };
        
        const playlist = await music.loadPlaylistForEmotion(emotionParams);
        if (playlist) {
          setRecommendedPlaylists([playlist]);
        } else {
          setRecommendedPlaylists([]);
        }
      } else if (music.getRecommendationByEmotion) {
        const emotionParams: EmotionMusicParams = {
          emotion,
          mood,
        };
        
        const playlist = await music.getRecommendationByEmotion(emotionParams);
        if (playlist) {
          setRecommendedPlaylists([playlist]);
        } else {
          setRecommendedPlaylists([]);
        }
      } else {
        console.error("Aucune méthode de recommandation disponible dans le contexte musical");
        setError("Impossible de charger les recommandations musicales");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des recommandations:", err);
      setError("Une erreur s'est produite lors du chargement des recommandations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les playlists au montage si autoLoad est activé
  useEffect(() => {
    if (autoLoad) {
      loadRecommendations();
    }
  }, [emotion, mood, autoLoad]);

  // Gérer la lecture d'une playlist
  const handlePlayPlaylist = (playlist: MusicPlaylist) => {
    try {
      // Si la playlist a des pistes, jouer la première
      if (playlist.tracks && playlist.tracks.length > 0) {
        // Ouvrir le drawer si disponible
        if (music.setOpenDrawer) music.setOpenDrawer(true);
        
        // Définir la playlist comme playlist courante
        if (music.playPlaylist) {
          // Utiliser la fonction convertToPlaylist pour assurer la compatibilité
          const compatiblePlaylist = convertToPlaylist(playlist);
          music.playPlaylist(playlist);
          
          // Définir la première piste comme piste courante si nécessaire
          if (music.setCurrentTrack) {
            music.setCurrentTrack(playlist.tracks[0]);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de la playlist:", error);
    }
  };

  // Charger les playlists si elles ne sont pas déjà chargées
  const handleLoadIfNeeded = () => {
    if (recommendedPlaylists.length === 0 && !isLoading) {
      loadRecommendations();
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Headphones className="mr-2 h-5 w-5" />
          Playlists recommandées
        </CardTitle>
        <CardDescription>
          Musique adaptée à votre état émotionnel actuel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <Button onClick={loadRecommendations}>Réessayer</Button>
          </div>
        ) : recommendedPlaylists.length > 0 ? (
          <div className="space-y-3">
            {recommendedPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-between py-6 h-auto"
                  onClick={() => handlePlayPlaylist(playlist)}
                >
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-md p-2 mr-3">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{playlist.title || playlist.name || 'Playlist sans titre'}</p>
                      <p className="text-sm text-muted-foreground">
                        {playlist.tracks?.length || 0} morceaux
                      </p>
                    </div>
                  </div>
                  <Play className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Aucune playlist recommandée disponible.
            </p>
            <Button onClick={loadRecommendations}>
              Découvrir des playlists
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedPresets;
