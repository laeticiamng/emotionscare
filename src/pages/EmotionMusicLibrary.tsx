// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Trash2, Play, Pause, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

interface EmotionTrack {
  id: string;
  task_id: string;
  title?: string;
  emotion_label?: string;
  storage_path?: string;
  duration_seconds?: number;
  created_at: string;
  metadata?: any;
}

const EmotionMusicLibrary: React.FC = () => {
  const [tracks, setTracks] = useState<EmotionTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('emotion_tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTracks(data || []);
    } catch (error) {
      logger.error('Error loading tracks', error as Error, 'MUSIC');
      toast.error('Erreur lors du chargement de la bibliothèque');
    } finally {
      setLoading(false);
    }
  };

  const getSignedUrl = async (taskId: string) => {
    if (signedUrls[taskId]) return signedUrls[taskId];

    try {
      const { data, error } = await supabase.functions.invoke('sign-emotion-track', {
        body: { taskId }
      });

      if (error || !data?.url) {
        throw new Error('Failed to get signed URL');
      }

      setSignedUrls(prev => ({ ...prev, [taskId]: data.url }));
      return data.url;
    } catch (error) {
      logger.error('Error getting signed URL', error as Error, 'MUSIC');
      toast.error('Impossible de charger l\'audio');
      return null;
    }
  };

  const handlePlay = async (track: EmotionTrack) => {
    if (!track.storage_path) {
      toast.warning('Cette piste n\'est pas encore disponible');
      return;
    }

    if (playingTrackId === track.task_id) {
      // Pause
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      // Play
      const url = await getSignedUrl(track.task_id);
      if (url && audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.crossOrigin = 'anonymous';
        audioRef.current.preload = 'metadata';
        
        audioRef.current.addEventListener('canplay', () => {
          audioRef.current?.play().catch(err => {
            logger.error('Play error', err as Error, 'MUSIC');
            toast.error('Erreur de lecture');
          });
        }, { once: true });

        setPlayingTrackId(track.task_id);
      }
    }
  };

  const handleDelete = async (track: EmotionTrack) => {
    if (!confirm('Supprimer cette piste de votre bibliothèque ?')) return;

    try {
      const { error } = await supabase
        .from('emotion_tracks')
        .delete()
        .eq('id', track.id);

      if (error) throw error;

      setTracks(prev => prev.filter(t => t.id !== track.id));
      toast.success('Piste supprimée');
      
      if (playingTrackId === track.task_id) {
        audioRef.current?.pause();
        setPlayingTrackId(null);
      }
    } catch (error) {
      logger.error('Error deleting track', error as Error, 'MUSIC');
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Music className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ma Bibliothèque Musicale
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Retrouvez toutes vos créations musicales émotionnelles
          </p>
        </motion.div>

        {/* Player audio global (invisible) */}
        <audio ref={audioRef} onEnded={() => setPlayingTrackId(null)} />

        {/* Liste des pistes */}
        {tracks.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Aucune musique encore</p>
              <p className="text-sm text-muted-foreground">
                Créez votre première musique émotionnelle pour la voir apparaître ici
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {track.title || 'Sans titre'}
                        </CardTitle>
                        {track.emotion_label && (
                          <Badge variant="secondary" className="mt-2">
                            {track.emotion_label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {track.duration_seconds && (
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(track.duration_seconds / 60)}:
                            {String(track.duration_seconds % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        Créée {formatDistance(new Date(track.created_at), new Date(), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                      {track.metadata?.uploaded_via_poll && (
                        <Badge variant="outline" className="text-xs">via polling</Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={playingTrackId === track.task_id ? "secondary" : "default"}
                        onClick={() => handlePlay(track)}
                        disabled={!track.storage_path}
                        className="flex-1"
                      >
                        {playingTrackId === track.task_id ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Écouter
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(track)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {!track.storage_path && (
                      <p className="text-xs text-yellow-600">
                        ⏳ Téléchargement en cours depuis Suno...
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionMusicLibrary;
