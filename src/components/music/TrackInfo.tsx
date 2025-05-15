
import React from 'react';
import { MusicTrack } from '@/types';

interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

/**
 * Component that displays information about a music track
 */
const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track,
  className = ""
}) => {
  // Determine the cover URL - handle different property names
  const getCoverUrl = () => {
    return track.coverUrl || track.cover || track.cover_url || '/images/music-placeholder.jpg';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 relative w-12 h-12 rounded-md overflow-hidden">
        <img 
          src={getCoverUrl()} 
          alt={`${track.title} cover`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/music-placeholder.jpg';
          }}
        />
      </div>
      
      <div className="min-w-0 overflow-hidden">
        <h4 className="text-base font-medium truncate">{track.title}</h4>
        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
      </div>
    </div>
  );
};

export default TrackInfo;
