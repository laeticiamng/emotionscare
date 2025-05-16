
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Music } from 'lucide-react';

interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showCover?: boolean;
}

const TrackInfo: React.FC<TrackInfoProps> = ({
  track,
  className = '',
  showCover = true
}) => {
  // Determine cover URL from various possible properties
  const coverUrl = track.coverUrl || track.cover || track.coverImage || '';
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showCover && (
        <div className="w-10 h-10 bg-secondary/50 rounded-md overflow-hidden flex-shrink-0">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/30">
              <Music className="h-5 w-5 text-foreground/60" />
            </div>
          )}
        </div>
      )}
      
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-sm truncate">{track.title}</h4>
        {track.artist && (
          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
