import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { AudioTrack } from '@/types/audio';
import { Play, Pause, SkipForward, SkipBack, Volume, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerSectionProps {
  audioUrl: string;
  title: string;
  artist?: string;
}

const AudioPlayerSection: React.FC<AudioPlayerSectionProps> = ({ audioUrl, title, artist }) => {
  // Create a track object from props
  const track: AudioTrack = {
    id: 'current-track',
    title,
    artist: artist || 'Unknown Artist',
    url: audioUrl,
    audioUrl,
    duration: 0,
  };
  
  const audioPlayer = useAudioPlayer();
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    play, 
    pause, 
    setVolume
  } = audioPlayer;
  
  // Add local state for mute functionality
  const [isMuted, setIsMuted] = useState(false);
  const prevVolume = React.useRef(volume);

  // Track is now just informational, no need to set it on the player

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume.current);
    } else {
      prevVolume.current = volume;
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    audioPlayer.seek(value[0]);
  };

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{title}</h3>
            {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleToggleMute} aria-label={isMuted || volume === 0 ? 'Activer le son' : 'Couper le son'}>
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume size={18} />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
              className="w-24"
            />
          </div>
        </div>
        
        <div>
          <div className="space-y-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Piste précédente">
            <SkipBack size={16} />
          </Button>
          
          <Button onClick={togglePlay} className="mx-2" aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Piste suivante">
            <SkipForward size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayerSection;
