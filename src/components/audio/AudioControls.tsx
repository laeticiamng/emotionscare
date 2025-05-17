
import React, { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Volume2, VolumeX, Volume1, Play, Pause, Music } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AudioControlsProps {
  minimal?: boolean;
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ minimal = false, className = '' }) => {
  const { isPlaying, togglePlay, volume, setVolume, currentTrackName, setCurrentTrack } = useAudio();
  const { soundEnabled, setSoundEnabled } = useTheme();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  // Déterminer l'icône du volume en fonction du niveau
  const getVolumeIcon = () => {
    if (!soundEnabled || volume === 0) return <VolumeX size={minimal ? 16 : 20} />;
    if (volume < 0.5) return <Volume1 size={minimal ? 16 : 20} />;
    return <Volume2 size={minimal ? 16 : 20} />;
  };
  
  const handleVolumeClick = () => {
    if (minimal) {
      setSoundEnabled(!soundEnabled);
    } else {
      setShowVolumeSlider(!showVolumeSlider);
    }
  };
  
  const audioTracks = [
    { id: 'ambient', name: 'Ambiance Zen' },
    { id: 'focus', name: 'Concentration' },
    { id: 'relax', name: 'Relaxation' },
    { id: 'energy', name: 'Énergie' }
  ];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!minimal && (
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${isPlaying ? 'text-primary' : ''}`}
          onClick={togglePlay}
          disabled={!soundEnabled}
          title={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
      )}
      
      {!minimal && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              disabled={!soundEnabled}
              title="Sélectionner une ambiance"
            >
              <Music size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {audioTracks.map(track => (
              <DropdownMenuItem
                key={track.id}
                onClick={() => setCurrentTrack(track.id)}
                className={`cursor-pointer ${currentTrackName === track.id ? 'font-medium bg-accent/50' : ''}`}
              >
                {track.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${!soundEnabled ? 'opacity-50' : ''}`}
          onClick={handleVolumeClick}
          title={soundEnabled ? "Activer/désactiver le son" : "Activer/désactiver le son"}
        >
          {getVolumeIcon()}
        </Button>
        
        {!minimal && showVolumeSlider && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border border-border rounded-lg p-3 w-32 shadow-lg z-50">
            <Slider
              value={[volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;
