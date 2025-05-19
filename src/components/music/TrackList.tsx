
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';

interface TrackListProps {
  tracks: MusicTrack[];
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  onTrackSelect?: (track: MusicTrack) => void;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  currentTrack, 
  isPlaying = false,
  onTrackSelect 
}) => {
  // Format duration to MM:SS
  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Artiste</TableHead>
          <TableHead className="text-right">Durée</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track) => {
          const coverUrl = getTrackCover(track);
          const title = getTrackTitle(track);
          const artist = getTrackArtist(track);
          
          return (
            <TableRow 
              key={track.id} 
              className={`group ${currentTrack?.id === track.id ? 'bg-muted/50' : ''}`}
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={() => onTrackSelect?.(track)}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                {coverUrl ? (
                  <img 
                    src={coverUrl} 
                    alt={title} 
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary text-xs">
                    ♪
                  </div>
                )}
                <span className="font-medium truncate">{title}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {artist}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDuration(track.duration || 0)}
              </TableCell>
            </TableRow>
          );
        })}

        {tracks.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              <p className="text-muted-foreground">Aucun morceau disponible</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TrackList;
