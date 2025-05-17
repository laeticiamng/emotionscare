
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AudioControlsProps {
  minimal?: boolean;
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ minimal = false, className = '' }) => {
  const { soundEnabled, setSoundEnabled } = useTheme();

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (minimal) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className={className}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{soundEnabled ? 'Désactiver le son' : 'Activer le son'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleSound}
        className="flex items-center gap-2"
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span>{soundEnabled ? 'Son activé' : 'Son désactivé'}</span>
      </Button>
      
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Music className="h-4 w-4" />
        <span>Musique</span>
      </Button>
    </div>
  );
};

export default AudioControls;
