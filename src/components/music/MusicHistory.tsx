/**
 * MusicHistory - Historique d'écoute musical
 * Affiche l'historique des morceaux écoutés avec statistiques
 * Connecté à music_play_logs via useMusicPlayHistory
 */

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, TrendingUp, Heart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MusicTrack } from '@/types/music';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMusicPlayHistory } from '@/hooks/useMusicPlayHistory';

interface ListenEntry {
  track: MusicTrack;
  timestamp: Date;
  duration: number;
  completed: boolean;
}

interface MusicHistoryProps {
  history?: ListenEntry[];
  onPlayTrack?: (track: MusicTrack) => void;
  onToggleFavorite?: (trackId: string) => void;
  favorites?: Set<string>;
  useDatabase?: boolean;
}

export const MusicHistory: React.FC<MusicHistoryProps> = ({
  history: externalHistory,
  onPlayTrack,
  onToggleFavorite,
  favorites = new Set(),
  useDatabase = true,
}) => {
  // Use database hook if no external history provided
  const { history: dbHistory, isLoading, refetch } = useMusicPlayHistory(50);
  
  // Use external history if provided, otherwise use database
  const history = externalHistory || (useDatabase ? dbHistory : []);
  // Statistiques calculées
  const stats = useMemo(() => {
    const totalListens = history.length;
    const totalDuration = history.reduce((acc, entry) => acc + entry.duration, 0);
    const completedListens = history.filter(e => e.completed).length;
    const completionRate = totalListens > 0 ? (completedListens / totalListens) * 100 : 0;
    
    // Top artistes
    const artistCounts: Record<string, number> = {};
    history.forEach(entry => {
      artistCounts[entry.track.artist] = (artistCounts[entry.track.artist] || 0) + 1;
    });
    
    const topArtists = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([artist, count]) => ({ artist, count }));

    // Morceaux les plus écoutés
    const trackCounts: Record<string, { track: MusicTrack; count: number }> = {};
    history.forEach(entry => {
      if (!trackCounts[entry.track.id]) {
        trackCounts[entry.track.id] = { track: entry.track, count: 0 };
      }
      trackCounts[entry.track.id].count++;
    });

    const topTracks = Object.values(trackCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalListens,
      totalDuration,
      completionRate,
      topArtists,
      topTracks
    };
  }, [history]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const groupHistoryByDate = () => {
    const groups: Record<string, ListenEntry[]> = {};
    
    history.forEach(entry => {
      const dateKey = format(entry.timestamp, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  };

  const groupedHistory = groupHistoryByDate();

  if (isLoading && useDatabase) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      {useDatabase && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={refetch} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      )}
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total écoutes</p>
                <p className="text-3xl font-bold">{stats.totalListens}</p>
              </div>
              <Clock className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps d'écoute</p>
                <p className="text-3xl font-bold">{formatDuration(stats.totalDuration)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de complétion</p>
                <p className="text-3xl font-bold">{stats.completionRate.toFixed(0)}%</p>
              </div>
              <Heart className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top artistes et morceaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Artistes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topArtists.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée disponible
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topArtists.map(({ artist, count }, index) => (
                  <div key={artist} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{artist}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {count} écoute{count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Morceaux favoris</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topTracks.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée disponible
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topTracks.map(({ track, count }, index) => (
                  <div key={track.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                      {count}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historique chronologique */}
      <Card>
        <CardHeader>
          <CardTitle>Historique d'écoute</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {groupedHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun historique d'écoute</p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedHistory.map(([dateKey, entries]) => (
                  <div key={dateKey}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {format(new Date(dateKey), 'EEEE d MMMM yyyy', { locale: fr })}
                    </h3>
                    <div className="space-y-2">
                      {entries.map((entry, index) => (
                        <div
                          key={`${entry.track.id}-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                          onClick={() => onPlayTrack?.(entry.track)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{entry.track.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {entry.track.artist}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(entry.timestamp, 'HH:mm')}
                            </span>
                            {entry.completed && (
                              <div className="w-2 h-2 rounded-full bg-green-500" title="Écouté en entier" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite?.(entry.track.id);
                              }}
                              className="p-1 hover:bg-accent rounded transition-colors"
                              aria-label={favorites.has(entry.track.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                            >
                              <Heart 
                                className={`w-4 h-4 ${favorites.has(entry.track.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
