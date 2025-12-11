import React, { useState, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VolumePreset {
  label: string;
  value: number;
}

const VOLUME_PRESETS: VolumePreset[] = [
  { label: 'Muet', value: 0 },
  { label: 'Faible', value: 0.25 },
  { label: 'Moyen', value: 0.5 },
  { label: 'Fort', value: 0.75 },
  { label: 'Max', value: 1 },
];

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  showPresets?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  className = '',
  onChange,
  showLabel = false,
  isMuted = false,
  onMuteToggle,
  showPresets = false,
  orientation = 'horizontal',
  size = 'md',
}) => {
  const [previousVolume, setPreviousVolume] = useState(volume || 0.5);

  // Use the callback provided, or fall back to onVolumeChange
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    if (onChange) {
      onChange(newVolume);
    } else {
      onVolumeChange(newVolume);
    }
  }, [onChange, onVolumeChange]);

  const handleMuteToggle = useCallback(() => {
    if (onMuteToggle) {
      onMuteToggle();
    } else {
      // Fallback: toggle between 0 and previous volume
      if (volume > 0) {
        setPreviousVolume(volume);
        handleVolumeChange([0]);
      } else {
        handleVolumeChange([previousVolume]);
      }
    }
  }, [onMuteToggle, volume, previousVolume, handleVolumeChange]);

  const handlePresetClick = useCallback((presetValue: number) => {
    handleVolumeChange([presetValue]);
  }, [handleVolumeChange]);

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'h-3 w-3',
      slider: 'w-16',
      button: 'h-6 w-6',
    },
    md: {
      icon: 'h-4 w-4',
      slider: 'w-24',
      button: 'h-8 w-8',
    },
    lg: {
      icon: 'h-5 w-5',
      slider: 'w-32',
      button: 'h-10 w-10',
    },
  };

  const config = sizeConfig[size];

  const VolumeIcon = () => {
    const effectiveVolume = isMuted ? 0 : volume;
    const iconClass = cn(
      config.icon, 
      'transition-all duration-200',
      effectiveVolume === 0 && 'text-muted-foreground'
    );
    
    if (effectiveVolume === 0) return <VolumeX className={iconClass} />;
    if (effectiveVolume < 0.33) return <Volume className={iconClass} />;
    if (effectiveVolume < 0.66) return <Volume1 className={iconClass} />;
    return <Volume2 className={iconClass} />;
  };

  // Volume bar visualization
  const VolumeBar = () => {
    const segments = 5;
    const activeSegments = Math.round((isMuted ? 0 : volume) * segments);
    
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1 rounded-full transition-all duration-200',
              i < activeSegments 
                ? 'bg-primary' 
                : 'bg-muted-foreground/30',
              // Height varies by position
              i === 0 && 'h-1.5',
              i === 1 && 'h-2',
              i === 2 && 'h-2.5',
              i === 3 && 'h-3',
              i === 4 && 'h-3.5',
            )}
          />
        ))}
      </div>
    );
  };

  // Vertical orientation
  if (orientation === 'vertical') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(config.button, className)}
            aria-label={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          >
            <VolumeIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          className="w-12 p-3"
          align="center"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.01}
              orientation="vertical"
              className="h-24"
              aria-label="Contrôle du volume"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleMuteToggle}
              aria-label={isMuted || volume === 0 ? 'Activer le son' : 'Couper le son'}
            >
              <VolumeIcon />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Horizontal orientation (default)
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="icon"
        className={config.button}
        onClick={handleMuteToggle}
        aria-label={isMuted || volume === 0 ? 'Activer le son' : 'Couper le son'}
      >
        <VolumeIcon />
      </Button>

      <Slider 
        value={[isMuted ? 0 : volume]}
        onValueChange={handleVolumeChange}
        min={0}
        max={1}
        step={0.01}
        className={cn(config.slider, 'cursor-pointer')}
        aria-label="Contrôle du volume"
      />

      {showLabel && (
        <span className="text-xs text-muted-foreground font-mono tabular-nums w-9 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      )}

      {showPresets && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <VolumeBar />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground px-2 pb-1">
                Préréglages
              </span>
              {VOLUME_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant={Math.abs(volume - preset.value) < 0.05 ? 'secondary' : 'ghost'}
                  size="sm"
                  className="justify-start h-7 text-xs"
                  onClick={() => handlePresetClick(preset.value)}
                >
                  {preset.label} ({Math.round(preset.value * 100)}%)
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default VolumeControl;
