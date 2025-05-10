
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music } from 'lucide-react';
import { TrackInfoProps } from '@/types/audio-player';
import { MusicTrack } from '@/types/music';

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack = false,
  audioError = null
}) => {
  // Use the provided track or fall back to currentTrack
  const displayTrack = track || currentTrack;
  
  if (!displayTrack) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-muted h-12 w-12 rounded-md flex items-center justify-center">
          <Music className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">Aucune piste sélectionnée</p>
          <p className="text-sm text-muted-foreground">Sélectionnez une piste pour commencer</p>
        </div>
      </div>
    );
  }
  
  // Determine the URL of the track cover
  const getCoverUrl = () => {
    if (displayTrack.coverUrl) return displayTrack.coverUrl;
    if (displayTrack.cover) return displayTrack.cover;
    if (displayTrack.coverImage) return displayTrack.coverImage;
    
    return null;
  };
  
  const coverUrl = getCoverUrl();
  
  return (
    <div className="flex items-center gap-3">
      {showCover && (
        <div className="bg-muted h-12 w-12 rounded-md flex-shrink-0 overflow-hidden">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={displayTrack.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10">
              <Music className="h-6 w-6 text-primary/60" />
            </div>
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{displayTrack.title}</p>
        <p className="text-sm text-muted-foreground truncate">
          {displayTrack.artist}
          {audioError && (
            <span className="text-destructive ml-2">Erreur: {audioError.message}</span>
          )}
        </p>
      </div>
      {showControls && (
        <div className="flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm"
            className="rounded-full h-8 w-8"
            disabled={loadingTrack}
          >
            {loadingTrack ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              false ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrackInfo;
