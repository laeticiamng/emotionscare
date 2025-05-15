
import React from 'react';
import { MusicTrack } from '@/types';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrackInfoProps {
  track?: MusicTrack;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
}

const TrackInfo: React.FC<TrackInfoProps> = ({
  track,
  className = '',
  compact = false,
  title,
  artist,
  coverUrl,
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack = false,
  audioError = null,
  onPlay,
  onPause,
  isPlaying = false,
}) => {
  // Use passed props first, then track properties
  const displayTitle = title || track?.title || 'Unknown Title';
  const displayArtist = artist || track?.artist || 'Unknown Artist';
  const displayCoverUrl = coverUrl || track?.coverUrl || track?.cover_url || track?.cover || '';
  
  // The actual track we're displaying info for
  const displayTrack = currentTrack || track;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showCover && (
        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-primary/10">
          {displayCoverUrl ? (
            <img 
              src={displayCoverUrl} 
              alt={displayTitle} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg">♪</span>
            </div>
          )}
        </div>
      )}

      <div className={`flex-1 min-w-0 ${compact ? '' : 'space-y-0.5'}`}>
        {loadingTrack ? (
          <>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-1"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
          </>
        ) : (
          <>
            <div className="font-medium truncate">{displayTitle}</div>
            <div className="text-xs text-muted-foreground truncate">{displayArtist}</div>
            
            {audioError && (
              <div className="text-xs text-destructive mt-1">
                Impossible de charger l'audio
              </div>
            )}
          </>
        )}
      </div>

      {showControls && (
        <div className="flex-shrink-0">
          {isPlaying ? (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={onPause}
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={onPlay}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackInfo;
