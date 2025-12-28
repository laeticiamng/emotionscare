/**
 * AdvancedEqualizer - Égaliseur connecté à Web Audio API
 * Modifications audio en temps réel
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, RotateCcw, Zap } from 'lucide-react';
import { useWebAudioContext } from '@/hooks/useWebAudioContext';
import { toast } from 'sonner';

interface EqualizerBand {
  frequency: string;
  gain: number;
}

interface EqualizerPreset {
  name: string;
  values: number[];
  description: string;
}

const presets: EqualizerPreset[] = [
  { name: 'Flat', values: [0, 0, 0, 0, 0, 0, 0, 0], description: 'Son naturel' },
  { name: 'Rock', values: [2, 1, -1, -2, 1, 2, 3, 3], description: 'Punch et clarté' },
  { name: 'Pop', values: [1, 2, 1, 0, -1, 1, 2, 2], description: 'Voix mise en avant' },
  { name: 'Jazz', values: [2, 1, 0, 1, -1, 1, 2, 2], description: 'Chaud et détaillé' },
  { name: 'Classical', values: [3, 2, 0, 0, 0, 0, 1, 2], description: 'Dynamique naturelle' },
  { name: 'Electronic', values: [2, 1, 0, -1, 1, 2, 2, 3], description: 'Basses profondes' },
  { name: 'Hip-Hop', values: [3, 2, 0, -1, 0, 1, 2, 2], description: 'Basses puissantes' },
  { name: 'Vocal', values: [0, 0, 1, 2, 2, 1, 0, 0], description: 'Voix claire' },
  { name: 'Thérapie', values: [1, 0, 0, 1, 1, 0, -1, -1], description: 'Relaxant et doux' }
];

const frequencies = ['60Hz', '150Hz', '400Hz', '1kHz', '2.4kHz', '6kHz', '15kHz', '20kHz'];
const frequencyValues = [60, 150, 400, 1000, 2400, 6000, 15000, 20000];

interface AdvancedEqualizerProps {
  className?: string;
}

const AdvancedEqualizer: React.FC<AdvancedEqualizerProps> = ({ className }) => {
  const [bands, setBands] = useState<EqualizerBand[]>(
    frequencies.map(freq => ({ frequency: freq, gain: 0 }))
  );
  const [currentPreset, setCurrentPreset] = useState<string>('Flat');
  const [isEnabled, setIsEnabled] = useState(true);
  
  const { setEqualizerBand, getEqualizerValues, isConnected } = useWebAudioContext();

  // Sync with Web Audio on band change
  const handleBandChange = useCallback((index: number, value: number[]) => {
    const newBands = [...bands];
    newBands[index].gain = value[0];
    setBands(newBands);
    setCurrentPreset('Custom');
    
    // Apply to Web Audio API
    if (isEnabled && isConnected) {
      // Map 8 bands to 5 EQ bands in useWebAudioContext
      const mappedIndex = Math.floor(index * 5 / 8);
      setEqualizerBand(mappedIndex, value[0]);
    }
  }, [bands, isEnabled, isConnected, setEqualizerBand]);

  const applyPreset = useCallback((preset: EqualizerPreset) => {
    const newBands = bands.map((band, index) => ({
      ...band,
      gain: preset.values[index]
    }));
    setBands(newBands);
    setCurrentPreset(preset.name);
    
    // Apply all bands to Web Audio
    if (isEnabled && isConnected) {
      preset.values.forEach((gain, index) => {
        const mappedIndex = Math.floor(index * 5 / 8);
        setEqualizerBand(mappedIndex, gain);
      });
      toast.success(`Preset "${preset.name}" appliqué`);
    }
  }, [bands, isEnabled, isConnected, setEqualizerBand]);

  const resetEqualizer = () => {
    applyPreset(presets[0]); // Flat preset
  };

  // Toggle equalizer effect
  const toggleEqualizer = useCallback(() => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    
    if (isConnected) {
      if (newEnabled) {
        // Restore current values
        bands.forEach((band, index) => {
          const mappedIndex = Math.floor(index * 5 / 8);
          setEqualizerBand(mappedIndex, band.gain);
        });
        toast.success('Égaliseur activé');
      } else {
        // Set all to 0
        for (let i = 0; i < 5; i++) {
          setEqualizerBand(i, 0);
        }
        toast.info('Égaliseur désactivé');
      }
    }
  }, [isEnabled, bands, isConnected, setEqualizerBand]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Égaliseur Avancé
            {isConnected && isEnabled && (
              <Zap className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? (isConnected ? "Actif" : "Activé") : "Désactivé"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEqualizer}
            >
              {isEnabled ? "Désactiver" : "Activer"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Préréglages</label>
            <Button variant="ghost" size="sm" onClick={resetEqualizer}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <Select value={currentPreset} onValueChange={(value) => {
            const preset = presets.find(p => p.name === value);
            if (preset) applyPreset(preset);
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presets.map(preset => (
                <SelectItem key={preset.name} value={preset.name}>
                  <div>
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">{preset.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Equalizer Bands */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Bandes de fréquences</label>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {bands.map((band, index) => (
              <div key={band.frequency} className="space-y-2">
                <div className="text-center">
                  <span className="text-xs font-medium">{band.frequency}</span>
                </div>
                <div className="h-32 flex items-center justify-center">
                  <Slider
                    orientation="vertical"
                    value={[band.gain]}
                    min={-12}
                    max={12}
                    step={0.5}
                    onValueChange={(value) => handleBandChange(index, value)}
                    className="h-full"
                    disabled={!isEnabled}
                  />
                </div>
                <div className="text-center">
                  <span className={`text-xs ${band.gain !== 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {band.gain > 0 ? '+' : ''}{band.gain}dB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
          {isConnected ? (
            <p className="text-green-600">✓ Connecté à Web Audio - modifications en temps réel</p>
          ) : (
            <p>⏳ Lancez une piste pour activer l'égaliseur audio</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedEqualizer;
