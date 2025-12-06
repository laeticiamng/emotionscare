/**
 * Composant de recommandations de playlists personnalisées
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Loader2 } from '@/components/music/icons';
import { generatePersonalizedPlaylists, togglePlaylistFavorite, PersonalizedPlaylist } from '@/services/music/recommendations-service';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface PersonalizedPlaylistRecommendationsProps {
  userId: string;
  listeningHistory: any[];
}

export const PersonalizedPlaylistRecommendations: React.FC<PersonalizedPlaylistRecommendationsProps> = ({
  userId,
  listeningHistory
}) => {
  const [playlists, setPlaylists] = useState<PersonalizedPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const { setPlaylist, play } = useMusic();
  const { toast } = useToast();

  useEffect(() => {
    loadPlaylists();
  }, [userId, listeningHistory]);

  const loadPlaylists = async () => {
    setIsLoading(true);
    try {
      const generated = await generatePersonalizedPlaylists(userId, listeningHistory);
      setPlaylists(generated);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les recommandations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async (playlist: PersonalizedPlaylist) => {
    setPreviewingId(playlist.id);
    try {
      setPlaylist(playlist.tracks);
      await play(playlist.tracks[0]);
      toast({
        title: 'Lecture en cours',
        description: `${playlist.name} - ${playlist.tracks.length} titres`
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de lire la playlist',
        variant: 'destructive'
      });
    } finally {
      setPreviewingId(null);
    }
  };

  const handleToggleFavorite = async (playlist: PersonalizedPlaylist) => {
    const success = await togglePlaylistFavorite(userId, playlist.id);
    if (success) {
      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlist.id ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
      toast({
        title: playlist.isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
        description: playlist.name
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <LazyMotionWrapper>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Playlists pour vous</h2>
        <p className="text-muted-foreground">
          Basées sur votre historique d'écoute et vos préférences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist, index) => (
          <m.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">🎵</span>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    {playlist.matchScore}% match
                  </Badge>
                </div>
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-1">
                {playlist.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {playlist.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {playlist.basedOn.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handlePlay(playlist)}
                  disabled={previewingId === playlist.id}
                  className="flex-1"
                >
                  {previewingId === playlist.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Écouter
                </Button>
                <Button
                  variant={playlist.isFavorite ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleToggleFavorite(playlist)}
                  aria-label={playlist.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart
                    className={`h-4 w-4 ${playlist.isFavorite ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>
            </Card>
          </m.div>
        ))}
      </div>
    </div>
    </LazyMotionWrapper>
  );
};
