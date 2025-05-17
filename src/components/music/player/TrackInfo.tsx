
import React from 'react';
import { MusicTrack } from '@/types/music';
import Image from 'next/image';

interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showCover?: boolean;
}

const TrackInfo: React.FC<TrackInfoProps> = ({
  track,
  className = '',
  showCover = true,
}) => {
  // Get the cover URL from any of the possible fields
  const getCoverUrl = () => {
    return track.coverUrl || track.cover_url || track.cover || track.coverImage || '/images/default-album-cover.jpg';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showCover && (
        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
          <img
            src={getCoverUrl()}
            alt={`Cover for ${track.title}`}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-medium text-sm truncate">{track.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>
    </div>
  );
};

export default TrackInfo;
