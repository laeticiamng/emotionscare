
import React from 'react';
import { MusicTrack } from '@/types';

interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10">
        {track.coverUrl ? (
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 rounded-md flex items-center justify-center text-primary">
            ♪
          </div>
        )}
      </div>
      
      <div className="min-w-0 flex-1">
        <h4 className="font-medium truncate">{track.title}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {track.artist || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
