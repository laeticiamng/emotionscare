/**
 * MusicHistorySection - Section historique d'écoute
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, Loader2 } from 'lucide-react';
import type { MusicTrack } from '@/types/music';

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
  if (playHistory.length === 0) return null;

  // Trier par ordre de lecture récent (le plus récent d'abord)
  const historyTracks = tracks
    .filter(t => playHistory.includes(t.id))
    .sort((a, b) => playHistory.indexOf(b.id) - playHistory.indexOf(a.id))
    .slice(0, 5);

  if (historyTracks.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Récemment Écoutés</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {historyTracks.map(track => (
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
    </div>
  );
};

export default MusicHistorySection;
