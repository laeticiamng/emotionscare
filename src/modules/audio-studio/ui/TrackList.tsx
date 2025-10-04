/**
 * Liste des enregistrements
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Trash2, Music } from 'lucide-react';
import type { AudioTrack } from '../types';
import { AudioStudioService } from '../audioStudioService';

interface TrackListProps {
  tracks: AudioTrack[];
  onDelete: (trackId: string) => void;
}

export const TrackList = ({ tracks, onDelete }: TrackListProps) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (track: AudioTrack) => {
    const filename = `${track.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.webm`;
    AudioStudioService.downloadAudio(track.blob, filename);
  };

  if (tracks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Music className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Aucun enregistrement</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tracks.map((track) => (
        <Card key={track.id}>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">{track.name}</p>
                <p className="text-sm text-muted-foreground">
                  Durée: {formatDuration(track.duration)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(track)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(track.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
