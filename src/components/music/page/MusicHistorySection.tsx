/**
 * MusicHistorySection - Section historique d'écoute avec données DB réelles
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Loader2, RefreshCw } from 'lucide-react';
import type { MusicTrack } from '@/types/music';
import { getRecentlyPlayed, MusicHistoryEntry } from '@/services/music/history-service';
import { useAuth } from '@/contexts/AuthContext';

interface VinylTrack extends MusicTrack {
  vinylColor: string;
}

interface MusicHistorySectionProps {
  tracks: VinylTrack[];
  playHistory: string[];
  loadingTrackId: string | null;
  onStartTrack: (track: VinylTrack) => void;
}

export const MusicHistorySection: React.FC<MusicHistorySectionProps> = ({
  tracks,
  playHistory,
  loadingTrackId,
  onStartTrack
}) => {
  const { user } = useAuth();
  const [dbHistory, setDbHistory] = useState<MusicHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger l'historique depuis Supabase
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const history = await getRecentlyPlayed(10);
      setDbHistory(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combiner l'historique DB avec les tracks locaux
  const historyTracks: VinylTrack[] = [];
  const seenIds = new Set<string>();

  // D'abord ajouter les tracks de l'historique DB
  dbHistory.forEach(entry => {
    if (!seenIds.has(entry.track_id)) {
      seenIds.add(entry.track_id);
      // Trouver le track correspondant ou créer un track minimal
      const existingTrack = tracks.find(t => t.id === entry.track_id);
      if (existingTrack) {
        historyTracks.push(existingTrack);
      } else {
        // Track de l'historique non présent dans les tracks actuels
        historyTracks.push({
          id: entry.track_id,
          title: entry.track_title || 'Unknown',
          artist: entry.track_artist || 'Unknown',
          url: entry.track_url || '',
          audioUrl: entry.track_url || '',
          duration: entry.track_duration || 180,
          emotion: entry.emotion || undefined,
          mood: entry.mood || undefined,
          vinylColor: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.5))',
        });
      }
    }
  });

  // Ensuite ajouter les tracks de playHistory local non encore ajoutés
  playHistory.forEach(id => {
    if (!seenIds.has(id)) {
      const track = tracks.find(t => t.id === id);
      if (track) {
        seenIds.add(id);
        historyTracks.push(track);
      }
    }
  });

  const displayTracks = historyTracks.slice(0, 8);

  if (displayTracks.length === 0 && !isLoading) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Récemment Écoutés</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={loadHistory}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {isLoading && displayTracks.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {displayTracks.map(track => (
            <Card
              key={track.id}
              className="min-w-[200px] cursor-pointer hover:shadow-lg transition-all"
              onClick={() => onStartTrack(track)}
            >
              <CardContent className="p-4 space-y-2">
                <div
                  className="w-16 h-16 mx-auto rounded-full"
                  style={{ background: track.vinylColor }}
                />
                <p className="text-sm font-medium text-center truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground text-center truncate">{track.artist}</p>
                <Button size="sm" className="w-full" disabled={loadingTrackId === track.id}>
                  {loadingTrackId === track.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicHistorySection;
