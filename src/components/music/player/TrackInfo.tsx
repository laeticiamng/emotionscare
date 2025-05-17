
import React from 'react';
import { MusicTrack } from '@/types';
import { Avatar } from '@/components/ui/avatar';
// Remove next/image import and use standard img tag instead

interface TrackInfoProps {
  track: MusicTrack | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  if (!track) {
    return <div className="flex items-center space-x-3 p-2">No track selected</div>;
  }

  return (
    <div className="flex items-center space-x-3 p-2">
      <Avatar className="h-12 w-12 rounded-md">
        {/* Use standard img instead of next/image */}
        <img 
          src={track.coverImage || '/images/default-album.jpg'} 
          alt={track.title}
          className="object-cover"
        />
      </Avatar>
      <div className="space-y-1 overflow-hidden">
        <h3 className="text-sm font-medium leading-none truncate">{track.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>
    </div>
  );
};

export default TrackInfo;
