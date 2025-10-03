
import React from 'react';
import { MusicTrack } from '@/types/music';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';

interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ 
  track, 
  className = '' 
}) => {
  const coverUrl = getTrackCover(track);
  const title = getTrackTitle(track);
  const artist = getTrackArtist(track);
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={title} 
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 rounded-md flex items-center justify-center text-primary">
            ♪
          </div>
        )}
      </div>
      
      <div className="min-w-0 flex-1">
        <h4 className="font-medium truncate">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {artist}
        </p>
      </div>
    </div>
  );
};

export default TrackInfo;
