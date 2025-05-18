
import React from 'react';
import { MusicTrack } from '@/types/music';
import { Avatar } from '@/components/ui/avatar';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';

interface TrackInfoProps {
  track: MusicTrack | null;
}

const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  if (!track) {
    return <div className="flex items-center space-x-3 p-2">No track selected</div>;
  }

  // Get the correct properties using our utility functions
  const coverImage = getTrackCover(track) || '/images/default-album.jpg';
  const title = getTrackTitle(track);
  const artist = getTrackArtist(track);

  return (
    <div className="flex items-center space-x-3 p-2">
      <Avatar className="h-12 w-12 rounded-md">
        <img 
          src={coverImage} 
          alt={title}
          className="object-cover"
        />
      </Avatar>
      <div className="space-y-1 overflow-hidden">
        <h3 className="text-sm font-medium leading-none truncate">{title}</h3>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
      </div>
    </div>
  );
};

export default TrackInfo;
