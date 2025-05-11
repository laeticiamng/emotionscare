
import React from 'react';
import { TrackInfoProps } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Music } from 'lucide-react';

const TrackInfo: React.FC<TrackInfoProps> = ({
  track,
  title,
  artist,
  coverUrl,
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack = false,
  audioError = false,
  className = ''
}) => {
  // Use provided values or default to track properties
  const displayTitle = title || track?.title || 'Unknown Track';
  const displayArtist = artist || track?.artist || 'Unknown Artist';
  const displayCoverUrl = coverUrl || track?.coverUrl || track?.cover_url;
  
  return (
    <div className={`flex items-center ${className}`}>
      {showCover && (
        <div className="relative mr-3 rounded-md overflow-hidden w-12 h-12 flex-shrink-0">
          {loadingTrack ? (
            <Skeleton className="w-12 h-12" />
          ) : displayCoverUrl ? (
            <img
              src={displayCoverUrl}
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Music className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
      
      <div className="truncate">
        <div className="font-medium truncate">
          {loadingTrack ? (
            <Skeleton className="h-4 w-32" />
          ) : audioError ? (
            <span className="text-destructive">Error loading track</span>
          ) : (
            displayTitle
          )}
        </div>
        
        <div className="text-sm text-muted-foreground truncate">
          {loadingTrack ? (
            <Skeleton className="h-3 w-24 mt-1" />
          ) : (
            displayArtist
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackInfo;
