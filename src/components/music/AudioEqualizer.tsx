import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { useMusicCompat } from '@/hooks/useMusicCompat';

interface AudioEqualizerProps {
  className?: string;
}

/**
 * Composant d'égaliseur audio qui permet d'ajuster les fréquences de la musique
 * Compatible avec l'API Web Audio
 */
const AudioEqualizer: React.FC<AudioEqualizerProps> = ({ className }) => {
  const music = useMusicCompat();
  const { currentTrack } = music.state;
  const [equalizerEnabled, setEqualizerEnabled] = useState(false);
  const [bands, setBands] = useState([
    { name: 'Bass', freq: 60, gain: 0 },
    { name: 'Low Mid', freq: 250, gain: 0 },
    { name: 'Mid', freq: 1000, gain: 0 },
    { name: 'High Mid', freq: 4000, gain: 0 },
    { name: 'Treble', freq: 12000, gain: 0 }
  ]);
  
  // Reset all equalizer settings to 0
  const handleReset = () => {
    setBands(bands.map(band => ({ ...band, gain: 0 })));
  };
  
  // Update a specific frequency band
  const updateBand = (index: number, value: number[]) => {
    const newBands = [...bands];
    newBands[index].gain = value[0];
    setBands(newBands);
  };
  
  // Pour une future implémentation avec l'API Web Audio
  useEffect(() => {
    if (!equalizerEnabled || !currentTrack) return;
    
    // Note: Cette logique nécessite une intégration plus profonde avec le système audio
    // qui dépasse le cadre de cette amélioration, mais ce serait le lieu pour configurer
    // les filtres biquad pour chaque bande de fréquence
    
    return () => {
      // Cleanup au démontage
    };
  }, [bands, equalizerEnabled, currentTrack]);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Égaliseur Audio
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="h-7 w-7"
            title="Réinitialiser"
          >
            <RotateCcw size={14} />
          </Button>
        </CardTitle>
        <CardDescription>Ajustez les fréquences audio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-2">
          <Button
            size="sm"
            variant={equalizerEnabled ? "default" : "outline"}
            onClick={() => setEqualizerEnabled(!equalizerEnabled)}
          >
            {equalizerEnabled ? "Activé" : "Désactivé"}
          </Button>
        </div>
        
        <div className="grid grid-cols-5 gap-1 h-40" style={{ opacity: equalizerEnabled ? 1 : 0.6 }}>
          {bands.map((band, i) => (
            <div key={i} className="flex flex-col items-center justify-between h-full">
              <div className="h-28 flex items-center">
                <Slider
                  orientation="vertical"
                  defaultValue={[band.gain]}
                  min={-12}
                  max={12}
                  step={1}
                  disabled={!equalizerEnabled}
                  onValueChange={(value) => updateBand(i, value)}
                  className="h-full"
                />
              </div>
              <div className="text-center w-full">
                <div className="text-xs font-medium truncate">{band.name}</div>
                <div className="text-[10px] text-muted-foreground">{band.gain > 0 ? '+' : ''}{band.gain}dB</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioEqualizer;
