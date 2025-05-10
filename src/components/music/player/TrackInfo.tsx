
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { TrackInfoProps } from '@/types';
import { cn } from '@/lib/utils';

const TrackInfo: React.FC<TrackInfoProps> = ({
  title,
  artist,
  coverUrl,
  track,
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack = false,
  audioError = null,
  className = ''
}) => {
  // Use track properties if provided, otherwise use individual props
  const displayTrack = track || currentTrack || {
    title,
    artist,
    coverUrl: coverUrl || ''
  };

  if (loadingTrack) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        {showCover && (
          <Skeleton className="h-12 w-12 rounded-md" />
        )}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (audioError) {
    return (
      <div className={cn("flex items-center gap-2 text-destructive", className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Erreur de lecture audio</span>
      </div>
    );
  }

  // Get the cover URL from the track object, considering multiple property names
  const getCoverUrl = () => {
    if (!displayTrack) return null;
    
    if ('coverUrl' in displayTrack && displayTrack.coverUrl) return displayTrack.coverUrl;
    if ('cover' in displayTrack && displayTrack.cover) return displayTrack.cover;
    if ('coverImage' in displayTrack && displayTrack.coverImage) return displayTrack.coverImage;
    if ('imageUrl' in displayTrack && displayTrack.imageUrl) return displayTrack.imageUrl;
    
    return null;
  };
  
  const trackCoverUrl = getCoverUrl();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showCover && trackCoverUrl && (
        <img 
          src={trackCoverUrl} 
          alt={`${displayTrack?.title} cover`} 
          className="h-12 w-12 rounded-md object-cover"
          onError={(e) => {
            // If image fails to load, hide it
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      
      <div>
        <p className="font-medium line-clamp-1">
          {displayTrack?.title || 'Titre inconnu'}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {displayTrack?.artist || 'Artiste inconnu'}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
