
import React from 'react';
import { MusicTrack } from '@/types';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface TrackListProps {
  tracks: MusicTrack[];
  onPlay: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  compact?: boolean;
  className?: string;
}

export const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  onPlay,
  currentTrack,
  isPlaying = false,
  compact = false,
  className = ''
}) => {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Aucune piste disponible
      </div>
    );
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isCurrentTrack = (track: MusicTrack) => {
    return currentTrack?.id === track.id;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {tracks.map((track) => (
        <div 
          key={track.id}
          className={`flex items-center p-2 rounded-md hover:bg-secondary/50 transition-colors ${
            isCurrentTrack(track) ? 'bg-secondary/30' : ''
          } ${compact ? 'gap-2' : 'gap-3'}`}
        >
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} flex-shrink-0`}>
            <img 
              src={track.coverUrl || track.cover_url || track.cover || '/images/music/default-cover.jpg'} 
              alt={track.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>{track.title}</p>
                <p className={`text-muted-foreground truncate ${compact ? 'text-xs' : 'text-sm'}`}>
                  {track.artist}
                </p>
              </div>
              
              {!compact && track.duration > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDuration(track.duration)}
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0 flex-shrink-0"
            onClick={() => onPlay(track)}
          >
            {isCurrentTrack(track) && isPlaying ? (
              <Pause className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
            ) : (
              <Play className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};
