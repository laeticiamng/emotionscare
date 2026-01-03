/**
 * AudioEqualizer - Égaliseur audio avec persistance des réglages
 * Compatible avec l'API Web Audio et le hook useEqualizerSettings
 */

import React, { useCallback, memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw, Check } from 'lucide-react';
import { useEqualizerSettings } from '@/hooks/music/useEqualizerSettings';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';

interface AudioEqualizerProps {
  className?: string;
  compact?: boolean;
}

// Labels pour les bandes de fréquence (10 bandes standard)
const BAND_LABELS = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

/**
 * Composant d'égaliseur audio qui permet d'ajuster les fréquences de la musique
 * Les réglages sont persistés via useEqualizerSettings
 */
const AudioEqualizer: React.FC<AudioEqualizerProps> = ({ className, compact = false }) => {
  const { state } = useMusic();
  const currentTrack = state.currentTrack;
  
  const {
    settings,
    isLoading,
    setEnabled,
    setPreset,
    setBand,
    resetToDefault,
    presets,
    currentBands,
    isEnabled,
  } = useEqualizerSettings();

  const { currentPreset } = settings;

  // Détermine si les réglages sont "flat" (tous à 0)
  const isFlat = currentBands.every((g: number) => g === 0);

  // Handler pour changer une bande
  const handleBandChange = useCallback((index: number, value: number[]) => {
    setBand(index, value[0]);
  }, [setBand]);

  // Handler pour appliquer un preset
  const handlePresetChange = useCallback((presetName: string) => {
    setPreset(presetName);
  }, [setPreset]);

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="eq-enabled-compact"
              checked={isEnabled}
              onCheckedChange={setEnabled}
              disabled={isLoading}
            />
            <Label htmlFor="eq-enabled-compact" className="text-sm font-medium">
              Égaliseur
            </Label>
          </div>
          <div className="flex gap-1">
            {presets.slice(0, 4).map((preset) => (
              <Button
                key={preset.name}
                size="sm"
                variant={currentPreset === preset.name ? 'default' : 'ghost'}
                onClick={() => handlePresetChange(preset.name)}
                disabled={!isEnabled}
                className="h-6 px-2 text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
        
        {isEnabled && (
          <div className="flex items-end justify-around gap-1 h-20">
            {currentBands.slice(0, 6).map((gain: number, i: number) => (
              <div key={BAND_LABELS[i]} className="flex flex-col items-center gap-0.5">
                <Slider
                  orientation="vertical"
                  value={[gain + 12]}
                  max={24}
                  step={1}
                  onValueChange={(v) => handleBandChange(i, [v[0] - 12])}
                  className="h-14"
                />
                <span className="text-[8px] text-muted-foreground">{BAND_LABELS[i]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              id="eq-enabled"
              checked={isEnabled}
              onCheckedChange={setEnabled}
              disabled={isLoading}
            />
            <div>
              <CardTitle className="text-lg">Égaliseur Audio</CardTitle>
              <CardDescription className="text-xs">
                {isEnabled ? (currentPreset || 'Personnalisé') : 'Désactivé'}
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetToDefault}
            disabled={!isEnabled || isFlat}
            className="h-7 w-7 p-0"
            title="Réinitialiser"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Presets */}
        <div className="flex flex-wrap gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              size="sm"
              variant={currentPreset === preset.name ? 'default' : 'outline'}
              onClick={() => handlePresetChange(preset.name)}
              disabled={!isEnabled}
              className="h-7 px-2 text-xs gap-1"
            >
              {currentPreset === preset.name && <Check className="h-3 w-3" />}
              {preset.name}
            </Button>
          ))}
        </div>
        
        {/* Equalizer Bands */}
        <div 
          className={cn(
            "grid gap-2 h-32 transition-opacity",
            "grid-cols-10"
          )}
          style={{ opacity: isEnabled ? 1 : 0.4 }}
        >
          {currentBands.map((gain: number, i: number) => (
            <div key={BAND_LABELS[i] || i} className="flex flex-col items-center justify-between h-full">
              <div className="text-[10px] font-medium text-center">
                {gain > 0 ? '+' : ''}{gain}
              </div>
              <div className="flex-1 flex items-center py-1">
                <Slider
                  orientation="vertical"
                  value={[gain + 12]}
                  min={0}
                  max={24}
                  step={1}
                  disabled={!isEnabled}
                  onValueChange={(value) => handleBandChange(i, [value[0] - 12])}
                  className="h-full"
                />
              </div>
              <div className="text-center w-full">
                <div className="text-[9px] text-muted-foreground">{BAND_LABELS[i]}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Status message */}
        {!currentTrack && isEnabled && (
          <p className="text-xs text-muted-foreground text-center">
            L'égaliseur sera appliqué lors de la lecture
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(AudioEqualizer);
