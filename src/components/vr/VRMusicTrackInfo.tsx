
import React from 'react';
import { Music } from 'lucide-react';
import { Track } from '@/services/music/types';

interface VRMusicTrackInfoProps {
  currentTrack: Track | null;
}

const VRMusicTrackInfo: React.FC<VRMusicTrackInfoProps> = ({ currentTrack }) => {
  if (!currentTrack) return null;
  
  return (
    <div className="mt-2 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center mr-3">
          <Music className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default VRMusicTrackInfo;
