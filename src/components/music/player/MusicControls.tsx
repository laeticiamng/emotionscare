
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import { useAudioPlayerState } from '@/hooks/audio/useAudioPlayerState';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface MusicControlsProps {
  showVolume?: boolean;
  showRepeat?: boolean;
  showShuffle?: boolean;
  compact?: boolean;
}

/**
 * Flexible music control component that can be configured with different options
 */
const MusicControls: React.FC<MusicControlsProps> = ({
  showVolume = true,
  showRepeat = false,
  showShuffle = false,
  compact = false
}) => {
  const {
    isPlaying,
    volume,
    loadingTrack,
    repeat,
    shuffle,
    toggleRepeat,
    toggleShuffle
  } = useAudioPlayerState();
  
  const {
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    handleVolumeChange
  } = useAudioPlayer();
  
  const handlePlay = () => {
    resumeTrack();
  };
  
  const handlePause = () => {
    pauseTrack();
  };

  return (
    <div className={`flex ${compact ? 'flex-row' : 'flex-col'} gap-2`}>
      <div className="flex items-center justify-center gap-2">
        <PlayerControls
          isPlaying={isPlaying}
          loadingTrack={loadingTrack}
          onPlay={handlePlay}
          onPause={handlePause}
          onPrevious={previousTrack}
          onNext={nextTrack}
        />
        
        {showRepeat && (
          <Button 
            variant={repeat ? "secondary" : "ghost"} 
            size="icon"
            onClick={toggleRepeat}
            className="rounded-full"
            title="Répéter"
          >
            <Repeat className="h-4 w-4" />
          </Button>
        )}
        
        {showShuffle && (
          <Button 
            variant={shuffle ? "secondary" : "ghost"} 
            size="icon"
            onClick={toggleShuffle}
            className="rounded-full"
            title="Lecture aléatoire"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {showVolume && (
        <div className={`${compact ? 'ml-auto' : 'mt-2'} flex justify-center`}>
          <VolumeControl 
            volume={volume} 
            onVolumeChange={handleVolumeChange} 
          />
        </div>
      )}
      
      {!compact && (
        <div className="text-xs text-center text-muted-foreground mt-1">
          {isPlaying ? "En cours de lecture" : "En pause"}
        </div>
      )}
    </div>
  );
};

export default MusicControls;
