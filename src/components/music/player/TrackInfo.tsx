
import React from 'react';
import { Disc } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { TrackInfoProps } from '@/types/music';

const TrackInfo: React.FC<TrackInfoProps> = ({
  title,
  artist,
  coverUrl,
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack = false,
  audioError = false,
  className = '',
}) => {
  // Use provided info or track info
  const displayTitle = title || currentTrack?.title || 'Aucun titre';
  const displayArtist = artist || currentTrack?.artist || 'Artiste inconnu';
  const displayCover = coverUrl || currentTrack?.coverUrl || currentTrack?.cover_url || '/images/music/default-cover.jpg';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showCover && (
        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center overflow-hidden">
          {displayCover ? (
            <img 
              src={displayCover} 
              alt={displayTitle} 
              className="h-full w-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/music/default-cover.jpg';
              }}
            />
          ) : (
            <Disc className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      )}
      
      <div className="overflow-hidden">
        <p className="font-medium truncate">{loadingTrack ? 'Chargement...' : displayTitle}</p>
        <p className="text-xs text-muted-foreground truncate">
          {loadingTrack ? '...' : audioError ? 'Erreur audio' : displayArtist}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
