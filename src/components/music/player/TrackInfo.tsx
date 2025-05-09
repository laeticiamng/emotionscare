
import React from 'react';
import { Loader2, Music } from 'lucide-react';
import { TrackInfoProps } from '@/types/audio-player';
import { MusicTrack } from '@/types/music';

/**
 * Display for current track information (title, artist, cover)
 */
const TrackInfo: React.FC<TrackInfoProps> = ({
  currentTrack,
  loadingTrack,
  audioError
}) => {
  // Get cover URL from different possible properties
  const getCoverUrl = () => {
    if (!currentTrack) return null;
    
    if (currentTrack.cover_url) {
      return currentTrack.cover_url;
    }
    
    if (currentTrack.cover) {
      return currentTrack.cover;
    }
    
    if (currentTrack.coverUrl) {
      return currentTrack.coverUrl;
    }
    
    if (currentTrack.coverImage) {
      return currentTrack.coverImage;
    }
    
    return null;
  };
  
  const coverUrl = getCoverUrl();
  
  return (
    <div className="flex items-center mb-6 gap-4">
      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center overflow-hidden relative">
        {coverUrl ? (
          <img src={coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
        ) : (
          <Music className="h-8 w-8 text-muted-foreground" />
        )}
        
        {loadingTrack && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium leading-tight truncate">
          {currentTrack.title}
          {audioError && (
            <span className="text-destructive text-xs ml-2">(Erreur)</span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {currentTrack.artist}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
