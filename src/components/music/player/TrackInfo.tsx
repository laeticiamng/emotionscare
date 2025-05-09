
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MusicTrack } from '@/types/music';
import { TrackInfoProps } from '@/types/audio-player';

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track,
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack,
  audioError
}) => {
  const displayTrack = currentTrack || track;
  
  if (loadingTrack) {
    return (
      <div className="flex items-center space-x-4">
        {showCover && <Skeleton className="h-12 w-12 rounded-md" />}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    );
  }

  if (audioError) {
    return (
      <div className="text-sm text-destructive">
        Erreur de lecture: {audioError.message}
      </div>
    );
  }

  if (!displayTrack) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Aucune piste sélectionnée
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {showCover && (
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center">
            {displayTrack.cover_url || displayTrack.coverUrl || displayTrack.cover || displayTrack.coverImage ? (
              <img 
                src={displayTrack.cover_url || displayTrack.coverUrl || displayTrack.cover || displayTrack.coverImage} 
                alt={displayTrack.title}
                className="h-full w-full object-cover rounded-md"
              />
            ) : (
              <span className="text-xl">🎵</span>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <h3 className="font-medium leading-none">{displayTrack.title}</h3>
        <p className="text-xs text-muted-foreground">{displayTrack.artist}</p>
      </div>
    </div>
  );
};

export default TrackInfo;
