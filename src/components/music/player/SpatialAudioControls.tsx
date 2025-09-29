
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Headphones, Radio, Waves, RotateCw } from 'lucide-react';

interface SpatialAudioControlsProps {
  className?: string;
}

const SpatialAudioControls: React.FC<SpatialAudioControlsProps> = ({ className }) => {
  const [enabled, setEnabled] = useState(false);
  const [roomSize, setRoomSize] = useState([50]);
  const [reverb, setReverb] = useState([30]);
  const [stereoWidth, setStereoWidth] = useState([80]);
  const [bassBoost, setBassBoost] = useState([40]);
  const [virtualSurround, setVirtualSurround] = useState(false);
  const [headphoneMode, setHeadphoneMode] = useState('studio');

  const headphoneModes = [
    { id: 'studio', name: 'Studio', description: 'Son neutre et précis' },
    { id: 'concert', name: 'Concert', description: 'Ambiance live' },
    { id: 'intimate', name: 'Intime', description: 'Proximité artistique' },
    { id: 'cinematic', name: 'Cinéma', description: 'Expérience immersive' }
  ];

  const resetSettings = () => {
    setRoomSize([50]);
    setReverb([30]);
    setStereoWidth([80]);
    setBassBoost([40]);
    setVirtualSurround(false);
    setHeadphoneMode('studio');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Audio Spatial Premium
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={enabled ? "default" : "secondary"}>
              {enabled ? "Activé" : "Désactivé"}
            </Badge>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Mode Casque */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Mode d'écoute</Label>
          <div className="grid grid-cols-2 gap-2">
            {headphoneModes.map(mode => (
              <Button
                key={mode.id}
                variant={headphoneMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => setHeadphoneMode(mode.id)}
                disabled={!enabled}
                className="h-auto p-3"
              >
                <div className="text-center">
                  <div className="font-medium">{mode.name}</div>
                  <div className="text-xs opacity-70">{mode.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Virtual Surround */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label>Surround Virtuel</Label>
              <p className="text-xs text-muted-foreground">
                Simulation 7.1 pour casques stéréo
              </p>
            </div>
          </div>
          <Switch 
            checked={virtualSurround} 
            onCheckedChange={setVirtualSurround}
            disabled={!enabled}
          />
        </div>

        {/* Spatial Controls */}
        <div className="space-y-6">
          {/* Room Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-muted-foreground" />
              <Label>Taille de la pièce</Label>
            </div>
            <Slider
              value={roomSize}
              onValueChange={setRoomSize}
              max={100}
              step={1}
              disabled={!enabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Intime</span>
              <span>{roomSize[0]}%</span>
              <span>Cathédrale</span>
            </div>
          </div>

          {/* Reverb */}
          <div className="space-y-3">
            <Label>Réverbération</Label>
            <Slider
              value={reverb}
              onValueChange={setReverb}
              max={100}
              step={1}
              disabled={!enabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sec</span>
              <span>{reverb[0]}%</span>
              <span>Éthéré</span>
            </div>
          </div>

          {/* Stereo Width */}
          <div className="space-y-3">
            <Label>Largeur stéréo</Label>
            <Slider
              value={stereoWidth}
              onValueChange={setStereoWidth}
              max={150}
              step={1}
              disabled={!enabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mono</span>
              <span>{stereoWidth[0]}%</span>
              <span>Ultra-large</span>
            </div>
          </div>

          {/* Bass Boost */}
          <div className="space-y-3">
            <Label>Renforcement des basses</Label>
            <Slider
              value={bassBoost}
              onValueChange={setBassBoost}
              max={100}
              step={1}
              disabled={!enabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Naturel</span>
              <span>{bassBoost[0]}%</span>
              <span>Puissant</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetSettings}
            disabled={!enabled}
            className="w-full"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Réinitialiser les paramètres
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
          <p>L'audio spatial simule un environnement d'écoute tridimensionnel pour une expérience immersive optimale.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpatialAudioControls;
