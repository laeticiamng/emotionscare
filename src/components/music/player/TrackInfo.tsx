
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Track } from '@/services/music/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface TrackInfoProps {
  currentTrack: Track;
  loadingTrack: boolean;
  audioError: string | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ currentTrack, loadingTrack, audioError }) => {
  const defaultCoverUrl = '/images/default-cover.jpg';
  
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
        <img 
          src={currentTrack.cover || defaultCoverUrl} 
          alt={currentTrack.title}
          className="object-cover h-full w-full"
          onError={(e) => {
            // Fallback to default image if cover fails to load
            (e.target as HTMLImageElement).src = defaultCoverUrl;
          }}
        />
        
        {loadingTrack && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-medium truncate">{currentTrack.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
        
        {audioError && (
          <Alert variant="destructive" className="mt-2 py-1">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-xs">Erreur de lecture</AlertTitle>
            <AlertDescription className="text-xs">
              {audioError}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
