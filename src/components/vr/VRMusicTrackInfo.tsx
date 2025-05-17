import React from 'react';
import { MusicTrack } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface VRMusicTrackInfoProps {
  track: MusicTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  className?: string;
}

const VRMusicTrackInfo: React.FC<VRMusicTrackInfoProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 p-4 bg-black/30 backdrop-blur-md rounded-xl ${className}`}>
      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={track?.coverUrl || track?.cover_url || track?.cover || '/images/default-album-cover.jpg'} 
          alt={track.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-white">{track.title}</h3>
        <p className="text-sm text-white/70">{track.artist}</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </Button>
    </div>
  );
};

export default VRMusicTrackInfo;
