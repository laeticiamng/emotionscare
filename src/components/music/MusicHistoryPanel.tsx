/**
 * MusicHistoryPanel - Historique d'écoute
 * Affiche les morceaux récemment écoutés avec persistance Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Play, Trash2, Clock, Heart, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import type { MusicTrack } from '@/types/music';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryEntry {
  id: string;
  track_id: string;
  track_title: string;
  track_artist: string | null;
  track_url: string | null;
  cover_url: string | null;
  duration: number;
  played_at: string;
  play_count: number;
}

interface MusicHistoryPanelProps {
  onPlayTrack?: (track: MusicTrack) => void;
  onAddToFavorites?: (track: MusicTrack) => void;
}

export const MusicHistoryPanel: React.FC<MusicHistoryPanelProps> = ({
  onPlayTrack,
  onAddToFavorites
}) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load history
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('music_history')
        .select('*')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      logger.error('Failed to load music history', error as Error, 'MUSIC');
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Clear history
  const clearHistory = async () => {
    if (!window.confirm('Supprimer tout l\'historique d\'écoute ?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('music_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setHistory([]);
      toast.success('Historique effacé');
    } catch (error) {
      logger.error('Failed to clear history', error as Error, 'MUSIC');
      toast.error('Erreur lors de la suppression');
    }
  };

  // Remove single entry
  const removeEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('music_history')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setHistory(prev => prev.filter(h => h.id !== entryId));
    } catch (error) {
      logger.error('Failed to remove history entry', error as Error, 'MUSIC');
    }
  };

  // Play track from history
  const handlePlay = (entry: HistoryEntry) => {
    if (!onPlayTrack) return;

    const track: MusicTrack = {
      id: entry.track_id,
      title: entry.track_title,
      artist: entry.track_artist || 'Artiste inconnu',
      url: entry.track_url || '',
      audioUrl: entry.track_url || '',
      duration: entry.duration,
      coverUrl: entry.cover_url || undefined
    };

    onPlayTrack(track);
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Connectez-vous pour voir votre historique d'écoute
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historique d'écoute
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadHistory}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun morceau écouté récemment</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  {/* Cover */}
                  <div className="relative w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                    {entry.cover_url ? (
                      <img
                        src={entry.cover_url}
                        alt={entry.track_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <History className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    {onPlayTrack && (
                      <button
                        onClick={() => handlePlay(entry)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        aria-label={`Jouer ${entry.track_title}`}
                      >
                        <Play className="w-6 h-6 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.track_title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.track_artist || 'Artiste inconnu'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(entry.played_at), { addSuffix: true, locale: fr })}</span>
                      {entry.play_count > 1 && (
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          ×{entry.play_count}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(entry.duration)}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onAddToFavorites && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          const track: MusicTrack = {
                            id: entry.track_id,
                            title: entry.track_title,
                            artist: entry.track_artist || 'Artiste inconnu',
                            url: entry.track_url || '',
                            audioUrl: entry.track_url || '',
                            duration: entry.duration,
                            coverUrl: entry.cover_url || undefined
                          };
                          onAddToFavorites(track);
                        }}
                        aria-label="Ajouter aux favoris"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeEntry(entry.id)}
                      aria-label="Supprimer de l'historique"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
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

// Static method to add entry (called from player)
export const addToMusicHistory = async (track: MusicTrack): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upsert: increment play_count if exists, else insert
    const { data: existing } = await supabase
      .from('music_history')
      .select('id, play_count')
      .eq('user_id', user.id)
      .eq('track_id', track.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('music_history')
        .update({
          play_count: existing.play_count + 1,
          played_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('music_history')
        .insert({
          user_id: user.id,
          track_id: track.id,
          track_title: track.title,
          track_artist: track.artist,
          track_url: track.audioUrl || track.url,
          cover_url: track.coverUrl || null,
          duration: track.duration,
          play_count: 1
        });
    }
  } catch (error) {
    logger.error('Failed to add to history', error as Error, 'MUSIC');
  }
};

export default MusicHistoryPanel;
