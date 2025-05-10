
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume, Volume2, VolumeX, Repeat, Shuffle 
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { AudioPlayerState } from '@/types/audio-player';

interface MusicControlsProps {
  minimal?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  showVolume?: boolean;
}

const MusicControls: React.FC<MusicControlsProps> = ({ 
  minimal = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  showVolume = true
}) => {
  const { 
    isPlaying, volume, setVolume, currentTrack,
    playTrack, pauseTrack, nextTrack, previousTrack,
    toggleRepeat, toggleShuffle
  } = useMusic();
  
  // Mock audioState for backwards compatibility
  const audioState = {
    isPlaying,
    volume,
    muted: false,
    repeat: false,
    shuffle: false,
    currentTime: 0,
    duration: 0
  };
  
  const [muted, setMuted] = React.useState(false);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
      onPause?.();
    } else {
      // For now, we'll just assume it resumes the current track
      if (currentTrack) {
        playTrack(currentTrack);
      }
      onPlay?.();
    }
  };
  
  const handleNext = () => {
    nextTrack();
    onNext?.();
  };
  
  const handlePrevious = () => {
    previousTrack();
    onPrevious?.();
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const getVolumeIcon = () => {
    if (muted || audioState.volume === 0) return <VolumeX />;
    if (audioState.volume < 0.5) return <Volume />;
    return <Volume2 />;
  };
  
  if (minimal) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 p-0 rounded-full"
          onClick={handlePlayPause}
        >
          {audioState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="rounded-full"
          onClick={toggleRepeat}
          title="Repeat"
        >
          <Repeat className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="rounded-full"
          onClick={handlePrevious}
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon"
          className="rounded-full w-10 h-10"
          onClick={handlePlayPause}
        >
          {audioState.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="rounded-full"
          onClick={handleNext}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className={`rounded-full ${audioState.shuffle ? 'text-primary' : ''}`}
          onClick={toggleShuffle}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      
      {showVolume && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={toggleMute}
          >
            {getVolumeIcon()}
          </Button>
          <Slider
            defaultValue={[audioState.volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};

export default MusicControls;
