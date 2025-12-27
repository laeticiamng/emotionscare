import React from 'react';
import type { MusicTrack } from '@/types/music';
import { Badge } from '@/components/ui/badge';
import { Music, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackDetailsProps {
  track: MusicTrack;
  showDuration?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const TrackDetails: React.FC<TrackDetailsProps> = ({
  track,
  showDuration = true,
  className,
  size = 'md'
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sizeClasses = {
    sm: {
      container: 'gap-3',
      cover: 'w-12 h-12',
      title: 'text-sm font-medium',
      artist: 'text-xs',
      duration: 'text-xs'
    },
    md: {
      container: 'gap-4',
      cover: 'w-16 h-16',
      title: 'text-lg font-semibold',
      artist: 'text-sm',
      duration: 'text-sm'
    },
    lg: {
      container: 'gap-6',
      cover: 'w-24 h-24',
      title: 'text-xl font-bold',
      artist: 'text-base',
      duration: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn("flex items-center", classes.container, className)}>
      {/* Album Cover */}
      <div className={cn(
        "flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center",
        classes.cover
      )}>
        {track.coverUrl || track.cover ? (
          <img
            src={track.coverUrl || track.cover}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music className={cn(
            "text-primary",
            size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-7 w-7' : 'h-10 w-10'
          )} />
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className={cn(classes.title, "truncate")}>
          {track.title}
        </h3>
        
        <p className={cn(classes.artist, "text-muted-foreground truncate")}>
          {track.artist}
        </p>

        {/* Additional metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          {showDuration && track.duration && (
            <div className={cn(
              "flex items-center gap-1 text-muted-foreground",
              classes.duration
            )}>
              <Clock className="h-3 w-3" />
              <span>{formatDuration(track.duration)}</span>
            </div>
          )}
          
          {track.emotion && (
            <Badge variant="secondary" className="text-xs">
              {track.emotion}
            </Badge>
          )}
          
          {track.genre && (
            <Badge variant="outline" className="text-xs">
              {track.genre}
            </Badge>
          )}
        </div>

        {/* Description if available */}
        {track.description && size === 'lg' && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {track.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackDetails;
