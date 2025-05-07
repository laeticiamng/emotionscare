
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Track } from '@/services/music/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TrackInfoProps {
  currentTrack: Track;
  loadingTrack: boolean;
  audioError: string | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ currentTrack, loadingTrack, audioError }) => {
  const defaultCoverUrl = '/images/default-cover.jpg';
  
  // Fonction pour tenter de recharger l'image en cas d'erreur
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image de couverture non chargée, utilisation de l'image par défaut");
    (e.target as HTMLImageElement).src = defaultCoverUrl;
  };
  
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border">
        <img 
          src={currentTrack.cover || defaultCoverUrl} 
          alt={currentTrack.title}
          className="object-cover h-full w-full"
          onError={handleImageError}
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
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <div className="flex-1">
                <AlertTitle className="text-xs">Erreur de lecture</AlertTitle>
                <AlertDescription className="text-xs">
                  {audioError}
                </AlertDescription>
              </div>
              <Button 
                size="sm" 
                variant="destructive" 
                className="h-6 text-xs py-0"
                onClick={() => window.location.reload()}
              >
                Rafraîchir
              </Button>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
