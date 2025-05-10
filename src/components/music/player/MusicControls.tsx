
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume, Volume2, VolumeX, Repeat, Shuffle 
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { AudioPlayerState } from '@/types';

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
    play, pause, next, previous, 
    audioState, setAudioState, setVolume, setMuted 
  } = useMusic();
  
  const { isPlaying, volume, muted, repeat, shuffle } = audioState;
  
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      onPause?.();
    } else {
      play();
      onPlay?.();
    }
  };
  
  const handleNext = () => {
    next();
    onNext?.();
  };
  
  const handlePrevious = () => {
    previous();
    onPrevious?.();
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const toggleRepeat = () => {
    const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setAudioState({ repeat: modes[nextIndex] });
  };
  
  const toggleShuffle = () => {
    setAudioState({ shuffle: !shuffle });
  };
  
  const getVolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume />;
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
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
          className={`rounded-full ${repeat !== 'none' ? 'text-primary' : ''}`}
          onClick={toggleRepeat}
          title={`Repeat: ${repeat}`}
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
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
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
          className={`rounded-full ${shuffle ? 'text-primary' : ''}`}
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
            defaultValue={[volume]}
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
