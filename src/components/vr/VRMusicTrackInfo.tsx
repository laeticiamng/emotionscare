
import React from 'react';
import { Music, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MusicTrack } from '@/types';

interface VRMusicTrackInfoProps {
  currentTrack: MusicTrack;
  className?: string;
}

const VRMusicTrackInfo: React.FC<VRMusicTrackInfoProps> = ({ 
  currentTrack,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-md">
        <Music className="h-5 w-5 text-primary" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate" title={currentTrack.title}>
          {currentTrack.title || "Titre inconnu"}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {currentTrack.artist || "Artiste inconnu"}
        </p>
      </div>
      
      {currentTrack.externalUrl && (
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          title="Ouvrir dans le lecteur de musique"
          onClick={() => window.open(currentTrack.externalUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VRMusicTrackInfo;
