// @ts-nocheck

import React from 'react';
import { MusicTrack } from '@/types/music';
import { Music } from 'lucide-react';

interface TrackInfoProps {
  track?: MusicTrack | null;
  className?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  className = "" 
}) => {
  // Valeurs par défaut si aucun track n'est fourni
  const defaultTrack = {
    title: 'Ambiance Relaxante',
    artist: 'Sounds of Nature',
    coverUrl: undefined
  };

  const currentTrack = track || defaultTrack;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {currentTrack.coverUrl ? (
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title}
          className="w-12 h-12 rounded-md object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center" aria-hidden="true">
          <Music className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">
          {currentTrack.title}
        </h3>
        {currentTrack.artist && (
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
