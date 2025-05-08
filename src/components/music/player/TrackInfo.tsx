
import React from 'react';
import { Loader2, Music } from 'lucide-react';
import { Track } from '@/services/music/types';
import { MusicTrack } from '@/types/music';

interface TrackInfoProps {
  currentTrack: Track | MusicTrack;
  loadingTrack: boolean;
  audioError: boolean;
}

const TrackInfo: React.FC<TrackInfoProps> = ({
  currentTrack,
  loadingTrack,
  audioError
}) => {
  // Déterminer l'URL de la couverture de la piste selon le type de piste
  const getCoverUrl = () => {
    if (!currentTrack) return null;
    
    if ('coverUrl' in currentTrack && currentTrack.coverUrl) {
      return currentTrack.coverUrl;
    }
    
    if ('cover' in currentTrack && currentTrack.cover) {
      return currentTrack.cover;
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
      
      <div>
        <h3 className="font-medium leading-tight">
          {currentTrack.title}
          {audioError && (
            <span className="text-destructive text-xs ml-2">(Erreur)</span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">
          {currentTrack.artist}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
