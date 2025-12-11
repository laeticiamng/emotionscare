// @ts-nocheck

import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX, Volume1, Settings2, Save, RotateCcw, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VolumePreset {
  name: string;
  value: number;
  icon?: string;
}

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
  showPresets?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const DEFAULT_PRESETS: VolumePreset[] = [
  { name: 'Silence', value: 0, icon: '🔇' },
  { name: 'Murmure', value: 0.2, icon: '🤫' },
  { name: 'Ambiance', value: 0.4, icon: '🎵' },
  { name: 'Normal', value: 0.6, icon: '🔊' },
  { name: 'Fort', value: 0.8, icon: '📢' },
  { name: 'Maximum', value: 1, icon: '🔥' },
];

const STORAGE_KEY = 'volume-settings';
const PRESETS_KEY = 'volume-presets';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  className = "",
  showPresets = true,
  orientation = 'horizontal',
}) => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [presets, setPresets] = useState<VolumePreset[]>(DEFAULT_PRESETS);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [customPresetName, setCustomPresetName] = useState('');
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      if (settings.previousVolume !== undefined) {
        setPreviousVolume(settings.previousVolume);
      }
    }

    const storedPresets = localStorage.getItem(PRESETS_KEY);
    if (storedPresets) {
      setPresets(JSON.parse(storedPresets));
    }
  }, []);

  // Save volume to history
  useEffect(() => {
    if (volume !== volumeHistory[volumeHistory.length - 1]) {
      setVolumeHistory(prev => [...prev.slice(-20), volume]);
    }
  }, [volume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          onMuteToggle();
          break;
        case 'arrowup':
          if (e.shiftKey) {
            onVolumeChange(Math.min(1, volume + 0.1));
          }
          break;
        case 'arrowdown':
          if (e.shiftKey) {
            onVolumeChange(Math.max(0, volume - 0.1));
          }
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          if (e.altKey) {
            onVolumeChange(parseInt(e.key) / 10);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, onVolumeChange, onMuteToggle]);

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    if (!isMuted && volume > 0) {
      setPreviousVolume(volume);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ previousVolume: volume }));
    }
    onVolumeChange(newVolume);
  };

  const handleMuteToggle = () => {
    if (!isMuted) {
      setPreviousVolume(volume);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ previousVolume: volume }));
    }
    onMuteToggle();
  };

  const handlePresetClick = (preset: VolumePreset) => {
    onVolumeChange(preset.value);
    toast({
      title: `Volume: ${preset.name}`,
      description: `${Math.round(preset.value * 100)}%`,
    });
  };

  const saveCustomPreset = () => {
    if (!customPresetName.trim()) return;

    const newPreset: VolumePreset = {
      name: customPresetName,
      value: volume,
      icon: '⭐',
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
    setCustomPresetName('');

    toast({
      title: 'Preset sauvegardé',
      description: `"${customPresetName}" à ${Math.round(volume * 100)}%`,
    });
  };

  const deletePreset = (index: number) => {
    const updated = presets.filter((_, i) => i !== index);
    setPresets(updated);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(updated));
  };

  const resetPresets = () => {
    setPresets(DEFAULT_PRESETS);
    localStorage.removeItem(PRESETS_KEY);
    toast({
      title: 'Presets réinitialisés',
      description: 'Les presets par défaut ont été restaurés',
    });
  };

  // Get appropriate volume icon
  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="h-4 w-4" />;
    }
    return <Volume2 className="h-4 w-4" />;
  };

  // Find closest preset
  const closestPreset = presets.reduce((closest, preset) => {
    return Math.abs(preset.value - volume) < Math.abs(closest.value - volume) ? preset : closest;
  }, presets[0]);

  const volumePercent = Math.round((isMuted ? 0 : volume) * 100);

  if (orientation === 'vertical') {
    return (
      <TooltipProvider>
        <div className={cn('flex flex-col items-center gap-2', className)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
                className="h-8 w-8"
                aria-label={isMuted || volume === 0 ? "Réactiver le son" : "Couper le son"}
              >
                <VolumeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isMuted ? 'Réactiver (M)' : 'Couper (M)'}
            </TooltipContent>
          </Tooltip>

          <div className="h-24">
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              orientation="vertical"
              onValueChange={handleVolumeChange}
              className="h-full"
              aria-label="Contrôle du volume"
            />
          </div>

          <Badge variant="outline" className="text-xs">
            {volumePercent}%
          </Badge>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        {/* Mute button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMuteToggle}
              className="h-8 w-8"
              aria-label={isMuted || volume === 0 ? "Réactiver le son" : "Couper le son"}
            >
              <VolumeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <span>{isMuted ? 'Réactiver' : 'Couper'}</span>
              <Badge variant="secondary" className="text-xs">M</Badge>
            </div>
          </TooltipContent>
        </Tooltip>
        
        {/* Volume slider */}
        <div className="w-24 relative group">
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
            aria-label="Contrôle du volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volumePercent}
          />
          
          {/* Volume percentage tooltip on hover */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="secondary" className="text-xs">
              {volumePercent}%
            </Badge>
          </div>
        </div>

        {/* Current preset indicator */}
        {showPresets && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-muted transition-colors"
                onClick={() => setShowSettings(true)}
              >
                {closestPreset?.icon} {closestPreset?.name}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Cliquez pour les presets</TooltipContent>
          </Tooltip>
        )}

        {/* Settings popover */}
        {showPresets && (
          <Popover open={showSettings} onOpenChange={setShowSettings}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Presets de volume</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetPresets}
                    className="h-7 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>

                {/* Presets grid */}
                <div className="grid grid-cols-3 gap-2">
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded-lg border transition-all',
                        Math.abs(preset.value - volume) < 0.05
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                      )}
                    >
                      <span className="text-lg">{preset.icon}</span>
                      <span className="text-xs font-medium">{preset.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(preset.value * 100)}%
                      </span>
                    </button>
                  ))}
                </div>

                {/* Save custom preset */}
                <div className="space-y-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Sauvegarder le volume actuel ({volumePercent}%)
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPresetName}
                      onChange={(e) => setCustomPresetName(e.target.value)}
                      placeholder="Nom du preset"
                      className="flex-1 px-2 py-1 text-sm border rounded-md bg-background"
                    />
                    <Button
                      size="sm"
                      onClick={saveCustomPreset}
                      disabled={!customPresetName.trim()}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div className="space-y-2 pt-2 border-t">
                  <button
                    onClick={() => setShowKeyboardHints(!showKeyboardHints)}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Keyboard className="h-3 w-3" />
                    Raccourcis clavier
                  </button>
                  
                  {showKeyboardHints && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Mute/Unmute</span>
                        <Badge variant="secondary" className="text-xs">M</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume +10%</span>
                        <Badge variant="secondary" className="text-xs">Shift + ↑</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume -10%</span>
                        <Badge variant="secondary" className="text-xs">Shift + ↓</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume direct</span>
                        <Badge variant="secondary" className="text-xs">Alt + 0-9</Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Volume history mini chart */}
                {volumeHistory.length > 5 && (
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Historique récent</span>
                    <div className="flex items-end gap-0.5 h-8 mt-1">
                      {volumeHistory.slice(-15).map((v, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/60 rounded-t transition-all"
                          style={{ height: `${v * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TooltipProvider>
  );
};

export default VolumeControl;
