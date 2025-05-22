
import React, { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AudioControlsProps {
  minimal?: boolean;
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  minimal = false,
  className = '',
}) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const playSound = (sound: string) => {
    if (isMuted) return;
    toast.info(`Lecture: ${sound}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={minimal ? 'icon' : 'default'} 
          className={cn("", className)}
        >
          {isMuted ? (
            <VolumeX className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Volume2 className="h-[1.2rem] w-[1.2rem]" />
          )}
          {!minimal && <span className="ml-2">Audio</span>}
          <span className="sr-only">Contrôles audio</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Volume</span>
            <span className="text-xs text-muted-foreground">{volume}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => playSound('Ambiance Relaxante')}>
          <Music className="mr-2 h-4 w-4" />
          <span>Ambiance Relaxante</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => playSound('Sons de la nature')}>
          <Music className="mr-2 h-4 w-4" />
          <span>Sons de la nature</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => playSound('Méditation guidée')}>
          <Music className="mr-2 h-4 w-4" />
          <span>Méditation guidée</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => toast.info('Ouverture des paramètres audio')}
          className="text-xs"
        >
          Paramètres audio avancés
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AudioControls;
