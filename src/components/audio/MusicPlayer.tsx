
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, Volume2, Music } from 'lucide-react';

interface MusicPlayerProps {
  autoPlay?: boolean;
  volume?: number;
  className?: string;
  minimal?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  autoPlay = false,
  volume = 0.5,
  className = '',
  minimal = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Méditation Ambiante',
    artist: 'IA Music Generator',
    duration: '5:32',
  });
  const [expanded, setExpanded] = useState(false);

  // In a production environment, this would integrate with an actual music API
  useEffect(() => {
    if (isPlaying) {
      console.log('Music would start playing here');
    } else {
      console.log('Music would stop playing here');
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setCurrentVolume(value[0]);
  };

  const skipTrack = () => {
    // In a production environment, this would use a music API to get next track
    const tracks = [
      { title: 'Méditation Ambiante', artist: 'IA Music Generator', duration: '5:32' },
      { title: 'Calme Intérieur', artist: 'IA Music Generator', duration: '4:45' },
      { title: 'Équilibre Mental', artist: 'IA Music Generator', duration: '6:12' }
    ];
    
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    setCurrentTrack(randomTrack);
  };

  if (minimal && !expanded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-white/10 backdrop-blur-sm"
        onClick={() => setExpanded(true)}
      >
        <Music size={18} />
      </Button>
    );
  }

  return (
    <Card className={`w-72 bg-background/80 backdrop-blur-md ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium truncate">{currentTrack.title}</h4>
            <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
          </div>
          
          {minimal && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setExpanded(false)}
            >
              <span className="sr-only">Minimize</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4V11H11V4Z" fill="currentColor" />
              </svg>
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={skipTrack}
          >
            <SkipForward size={16} />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full" 
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9" 
            onClick={skipTrack}
          >
            <SkipForward size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider
            defaultValue={[currentVolume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};
