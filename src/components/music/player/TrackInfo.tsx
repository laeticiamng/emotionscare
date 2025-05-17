
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Avatar } from '@/components/ui/avatar';

interface TrackInfoProps {
  track: MusicTrack | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  if (!track) {
    return <div className="flex items-center space-x-3 p-2">No track selected</div>;
  }

  // Determine the correct cover image property
  const coverImage = track.coverImage || track.coverUrl || track.cover || '/images/default-album.jpg';

  return (
    <div className="flex items-center space-x-3 p-2">
      <Avatar className="h-12 w-12 rounded-md">
        <img 
          src={coverImage} 
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
