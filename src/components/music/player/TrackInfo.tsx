
import React from 'react';
import { Loader2, Music, AlertCircle } from 'lucide-react';

interface TrackInfoProps {
  currentTrack: any; // Using any to handle different track formats
  loadingTrack: boolean;
  audioError: boolean;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  currentTrack, 
  loadingTrack, 
  audioError 
}) => {
  // Extract track information with fallbacks
  const title = currentTrack.title || currentTrack.name || 'Unknown Track';
  const artist = currentTrack.artist || 'Unknown Artist';
  const imageUrl = currentTrack.imageUrl || currentTrack.coverArt || '';
  
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="relative h-16 w-16 min-w-16 rounded overflow-hidden bg-muted">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <Music className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        {loadingTrack && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {audioError && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-sm text-muted-foreground truncate">{artist}</div>
      </div>
    </div>
  );
};

export default TrackInfo;
