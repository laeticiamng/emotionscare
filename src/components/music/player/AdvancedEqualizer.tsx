// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Equalizer, RotateCcw } from 'lucide-react';

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
  { name: 'Vocal', values: [0, 0, 1, 2, 2, 1, 0, 0], description: 'Voix claire' }
];

const frequencies = ['60Hz', '150Hz', '400Hz', '1kHz', '2.4kHz', '6kHz', '15kHz', '20kHz'];

const AdvancedEqualizer: React.FC = () => {
  const [bands, setBands] = useState<EqualizerBand[]>(
    frequencies.map(freq => ({ frequency: freq, gain: 0 }))
  );
  const [currentPreset, setCurrentPreset] = useState<string>('Flat');
  const [isEnabled, setIsEnabled] = useState(true);

  const handleBandChange = (index: number, value: number[]) => {
    const newBands = [...bands];
    newBands[index].gain = value[0];
    setBands(newBands);
    setCurrentPreset('Custom');
  };

  const applyPreset = (preset: EqualizerPreset) => {
    const newBands = bands.map((band, index) => ({
      ...band,
      gain: preset.values[index]
    }));
    setBands(newBands);
    setCurrentPreset(preset.name);
  };

  const resetEqualizer = () => {
    applyPreset(presets[0]); // Flat preset
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Equalizer className="h-5 w-5" />
            Égaliseur Avancé
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? "Activé" : "Désactivé"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEnabled(!isEnabled)}
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
                  <span className="text-xs text-muted-foreground">
                    {band.gain > 0 ? '+' : ''}{band.gain}dB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground text-center">
          Ajustez les fréquences pour personnaliser votre expérience audio
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedEqualizer;
