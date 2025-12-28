/**
 * MusicLibrarySection - Section bibliothèque des musiques générées
 * Affiche les tracks sauvegardées automatiquement
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Play, Clock, Trash2, Library, Sparkles, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { MusicTrack } from '@/types/music';

interface SavedTrack {
  id: string;
  task_id: string;
  status: string;
  emotion_state: {
    mood?: string;
    genre?: string;
    tempo?: string;
    energy?: number;
    instrumental?: boolean;
  };
  suno_config: {
    prompt?: string;
    style?: string;
    bpm?: number;
  };
  result: {
    audio_url?: string;
    image_url?: string;
    duration?: number;
    title?: string;
  };
  created_at: string;
  completed_at: string | null;
}

interface MusicLibrarySectionProps {
  onPlayTrack?: (track: MusicTrack) => void;
}

export const MusicLibrarySection: React.FC<MusicLibrarySectionProps> = ({ onPlayTrack }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tracks, setTracks] = useState<SavedTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user]);

  const fetchLibrary = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('music_generation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type assertion pour les données JSON
      const typedData = (data || []).map(item => ({
        ...item,
        emotion_state: item.emotion_state as SavedTrack['emotion_state'],
        suno_config: item.suno_config as SavedTrack['suno_config'],
        result: item.result as SavedTrack['result'],
      }));
      
      setTracks(typedData);
    } catch (error) {
      logger.error('Failed to fetch music library', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (track: SavedTrack) => {
    if (!track.result?.audio_url) {
      toast({
        title: 'Audio non disponible',
        description: 'Cette piste n\'a pas d\'audio disponible',
        variant: 'destructive'
      });
      return;
    }

    const musicTrack: MusicTrack = {
      id: track.task_id,
      title: track.result?.title || `Musique ${track.emotion_state?.mood || 'générée'}`,
      artist: 'Suno AI',
      url: track.result.audio_url,
      audioUrl: track.result.audio_url,
      duration: track.result?.duration || 180,
      mood: track.emotion_state?.mood,
      coverUrl: track.result?.image_url,
    };

    onPlayTrack?.(musicTrack);
  };

  const handleDelete = async (trackId: string) => {
    try {
      const { error } = await supabase
        .from('music_generation_sessions')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      setTracks(prev => prev.filter(t => t.id !== trackId));
      toast({
        title: 'Supprimé',
        description: 'La piste a été retirée de votre bibliothèque',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la piste',
        variant: 'destructive'
      });
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const moodColors: Record<string, string> = {
    calm: 'bg-blue-500/20 text-blue-400',
    energizing: 'bg-orange-500/20 text-orange-400',
    focused: 'bg-purple-500/20 text-purple-400',
    happy: 'bg-yellow-500/20 text-yellow-400',
    meditative: 'bg-teal-500/20 text-teal-400',
    uplifting: 'bg-pink-500/20 text-pink-400',
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Library className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Connectez-vous pour voir votre bibliothèque</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="h-5 w-5 text-primary" />
          Ma Bibliothèque Musicale
          {tracks.length > 0 && (
            <Badge variant="secondary" className="ml-2">{tracks.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Vos musiques générées sont automatiquement sauvegardées ici
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Bibliothèque vide</p>
            <p className="text-muted-foreground text-sm">
              Générez de la musique pour remplir votre bibliothèque !
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group"
                >
                  {/* Cover */}
                  {track.result?.image_url ? (
                    <img 
                      src={track.result.image_url} 
                      alt={track.result?.title || 'Cover'}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                      <Music className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {track.result?.title || `Musique ${track.emotion_state?.mood || 'générée'}`}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {track.emotion_state?.mood && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${moodColors[track.emotion_state.mood] || ''}`}
                        >
                          {track.emotion_state.mood}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(track.result?.duration)}
                      </span>
                      <span className="hidden sm:inline">
                        {formatDistanceToNow(new Date(track.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(track.id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => handlePlay(track)}
                      disabled={!track.result?.audio_url}
                      aria-label="Lire"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicLibrarySection;
