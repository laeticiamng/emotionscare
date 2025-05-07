
import React from 'react';
import { Track } from '@/services/music/types';
import { Music } from 'lucide-react';

interface VRMusicTrackInfoProps {
  currentTrack: Track;
}

const VRMusicTrackInfo: React.FC<VRMusicTrackInfoProps> = ({ currentTrack }) => {
  return (
    <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
        {currentTrack.cover ? (
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="h-full w-full object-cover rounded-md" 
          />
        ) : (
          <Music className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-tight truncate">{currentTrack.title}</p>
        <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>

      <div className="bg-primary/20 rounded-full px-2 py-1">
        <span className="text-xs text-primary font-medium">En lecture</span>
      </div>
    </div>
  );
};

export default VRMusicTrackInfo;
