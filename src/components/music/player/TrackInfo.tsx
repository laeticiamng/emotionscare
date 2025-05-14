
import React from 'react';
import { Disc } from 'lucide-react';
import { MusicTrack, TrackInfoProps } from '@/types/music';

const TrackInfo: React.FC<TrackInfoProps> = ({
  track,
  title,
  artist,
  coverUrl,
  showCover = true,
  showControls = false,
  currentTrack,
  loadingTrack = false,
  audioError = null,
  className = '',
  compact = false
}) => {
  // Use provided info or track info
  const displayTitle = title || track?.title || currentTrack?.title || 'Aucun titre';
  const displayArtist = artist || track?.artist || currentTrack?.artist || 'Artiste inconnu';
  const displayCover = coverUrl || track?.coverUrl || track?.cover || currentTrack?.coverUrl || currentTrack?.cover || '/images/music/default-cover.jpg';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showCover && (
        <div className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} rounded bg-primary/10 flex items-center justify-center overflow-hidden`}>
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
        <p className={`font-medium truncate ${compact ? 'text-sm' : ''}`}>{loadingTrack ? 'Chargement...' : displayTitle}</p>
        <p className="text-xs text-muted-foreground truncate">
          {loadingTrack ? '...' : audioError ? 'Erreur audio' : displayArtist}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
