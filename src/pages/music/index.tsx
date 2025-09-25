/**
 * Page principale du module de thérapie musicale
 * Intègre recommandations, lecteur, favoris et reprise
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Music, RefreshCw, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Player } from '@/modules/music/Player';
import SeoHead from '@/components/SeoHead';
import { getRecommendations, type Track } from '@/services/music/recoApi';
import { listFavorites, type FavoriteTrack } from '@/services/music/favoritesApi';
import { getRecent, shouldSuggestResume, type RecentTrack } from '@/services/music/recentApi';
import { moodToBucket, getBucketDescription, type Mood } from '@/services/music/moodMap';
import { cn } from '@/lib/utils';

export default function MusicTherapyPage() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // États principaux
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
  const [recentTrack, setRecentTrack] = useState<RecentTrack | null>(null);
  const [loading, setLoading] = useState({
    recommendations: true,
    favorites: false,
    recent: false
  });
  
  // État du mood (à récupérer depuis les paramètres ou le store global)
  const [currentMood] = useState<Mood>(() => {
    // Récupérer le mood depuis les paramètres URL ou valeurs par défaut
    const valence = searchParams.get('valence');
    const arousal = searchParams.get('arousal');
    
    if (valence && arousal) {
      return {
        valence: parseFloat(valence),
        arousal: parseFloat(arousal)
      };
    }
    
    // Mood neutre par défaut
    return {
      valence: 0,
      arousal: 0,
      sliders: {
        energy: 50,
        calm: 50,
        focus: 50,
        light: 50
      }
    };
  });
  
  // Charger les recommandations basées sur le mood
  const loadRecommendations = useCallback(async () => {
    setLoading(prev => ({ ...prev, recommendations: true }));
    
    try {
      const tracks = await getRecommendations(currentMood, { limit: 8 });
      setRecommendations(tracks);
      
      // Si aucune piste en cours et qu'on a des recommandations, en sélectionner une
      if (!currentTrack && tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      }
    } catch (error) {
      console.error('Erreur chargement recommandations:', error);
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les recommandations musicales',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  }, [currentMood, currentTrack, toast]);
  
  // Charger les favoris
  const loadFavorites = useCallback(async () => {
    setLoading(prev => ({ ...prev, favorites: true }));
    
    try {
      const favs = await listFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les favoris',
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, favorites: false }));
    }
  }, [toast]);
  
  // Charger la piste récente pour reprise
  const loadRecentTrack = useCallback(async () => {
    setLoading(prev => ({ ...prev, recent: true }));
    
    try {
      const recent = await getRecent();
      setRecentTrack(recent);
    } catch (error) {
      console.error('Erreur chargement piste récente:', error);
    } finally {
      setLoading(prev => ({ ...prev, recent: false }));
    }
  }, []);
  
  // Chargement initial
  useEffect(() => {
    loadRecommendations();
    loadFavorites();
    loadRecentTrack();
  }, [loadRecommendations, loadFavorites, loadRecentTrack]);
  
  // Sélectionner une piste pour la lecture
  const handleSelectTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
  }, []);
  
  // Reprendre la lecture d'une piste récente
  const handleResumeTrack = useCallback(async () => {
    if (!recentTrack) return;
    
    try {
      // Créer un objet Track à partir des métadonnées sauvegardées
      const track: Track = {
        id: recentTrack.track_id,
        title: recentTrack.meta.title || 'Piste inconnue',
        artist: recentTrack.meta.artist,
        cover: recentTrack.meta.cover,
        url: `/audio/tracks/${recentTrack.track_id}.mp3`, // URL reconstituée
        duration_sec: recentTrack.meta.duration_sec || 0,
        genre: recentTrack.meta.genre
      };
      
      setCurrentTrack(track);
      
      toast({
        title: 'Reprise de lecture',
        description: `Reprise de "${track.title}" à ${Math.floor(recentTrack.position_sec / 60)}:${(recentTrack.position_sec % 60).toString().padStart(2, '0')}`
      });
    } catch (error) {
      console.error('Erreur reprise:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de reprendre la lecture',
        variant: 'destructive'
      });
    }
  }, [recentTrack, toast]);
  
  // Rafraîchir les données
  const handleRefresh = useCallback(() => {
    loadRecommendations();
    loadFavorites();
    loadRecentTrack();
  }, [loadRecommendations, loadFavorites, loadRecentTrack]);
  
  // Callback quand une piste se termine
  const handleTrackEnd = useCallback(() => {
    // Passer à la piste suivante dans les recommandations
    if (currentTrack && recommendations.length > 1) {
      const currentIndex = recommendations.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % recommendations.length;
      setCurrentTrack(recommendations[nextIndex]);
    }
  }, [currentTrack, recommendations]);
  
  // Informations sur le mood actuel
  const moodBucket = moodToBucket(currentMood);
  const moodDescription = getBucketDescription(moodBucket);
  
  return (
    <>
      <SeoHead
        title="Thérapie Musicale Adaptative"
        description="Découvrez une expérience musicale personnalisée selon votre état émotionnel. Recommandations intelligentes, favoris et reprise automatique."
        keywords="thérapie musicale, bien-être, émotions, musique adaptative, relaxation"
        canonical="/music"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Music className="h-8 w-8 text-primary" />
              Thérapie Musicale
            </h1>
            <p className="text-muted-foreground mt-1">
              Musique adaptée à votre état émotionnel actuel
            </p>
            {moodDescription && (
              <p className="text-sm text-primary font-medium mt-1">
                🎵 {moodDescription}
              </p>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading.recommendations || loading.favorites}
            aria-label="Actualiser les recommandations"
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2",
              (loading.recommendations || loading.favorites) && "animate-spin"
            )} />
            Actualiser
          </Button>
        </div>
        
        {/* Carte de reprise si disponible */}
        {recentTrack && shouldSuggestResume(recentTrack) && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Reprendre l'écoute</h3>
                    <p className="text-sm text-muted-foreground">
                      "{recentTrack.meta.title}" - {Math.floor(recentTrack.position_sec / 60)}:{(recentTrack.position_sec % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <Button onClick={handleResumeTrack}>
                  Reprendre
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Lecteur principal */}
        {currentTrack && (
          <div className="mb-8">
            <Player
              track={currentTrack}
              resumePosition={
                recentTrack?.track_id === currentTrack.id ? recentTrack.position_sec : 0
              }
              onTrackEnd={handleTrackEnd}
              className="max-w-2xl mx-auto"
            />
          </div>
        )}
        
        {/* Onglets pour recommandations et favoris */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">
              Recommandations ({recommendations.length})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-1" />
              Favoris ({favorites.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Recommandations */}
          <TabsContent value="recommendations" className="mt-6">
            {loading.recommendations ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Chargement des recommandations...</span>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((track) => (
                  <Card
                    key={track.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      currentTrack?.id === track.id && "ring-2 ring-primary"
                    )}
                    onClick={() => handleSelectTrack(track)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {track.cover && (
                          <img
                            src={track.cover}
                            alt={`Pochette de ${track.title}`}
                            className="w-12 h-12 rounded object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{track.title}</h3>
                          {track.artist && (
                            <p className="text-sm text-muted-foreground truncate">
                              {track.artist}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {track.genre && (
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {track.genre}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(track.duration_sec / 60)}:{(track.duration_sec % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune recommandation</h3>
                <p className="text-muted-foreground">
                  Impossible de charger les recommandations pour le moment
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Favoris */}
          <TabsContent value="favorites" className="mt-6">
            {loading.favorites ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Chargement des favoris...</span>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((favorite) => (
                  <Card
                    key={favorite.track_id}
                    className="cursor-pointer transition-all hover:shadow-md"
                    onClick={() => {
                      // Créer un objet Track à partir des favoris
                      const track: Track = {
                        id: favorite.track_id,
                        title: favorite.meta.title || 'Piste favorite',
                        artist: favorite.meta.artist,
                        cover: favorite.meta.cover,
                        url: `/audio/tracks/${favorite.track_id}.mp3`,
                        duration_sec: favorite.meta.duration_sec || 0,
                        genre: favorite.meta.genre
                      };
                      handleSelectTrack(track);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                        {favorite.meta.cover && (
                          <img
                            src={favorite.meta.cover}
                            alt={`Pochette de ${favorite.meta.title}`}
                            className="w-12 h-12 rounded object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {favorite.meta.title || 'Piste favorite'}
                          </h3>
                          {favorite.meta.artist && (
                            <p className="text-sm text-muted-foreground truncate">
                              {favorite.meta.artist}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {favorite.meta.genre && (
                              <span className="text-xs bg-secondary px-2 py-1 rounded">
                                {favorite.meta.genre}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              Ajouté le {new Date(favorite.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun favori</h3>
                <p className="text-muted-foreground">
                  Ajoutez des pistes à vos favoris en cliquant sur le cœur pendant l'écoute
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}