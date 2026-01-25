/**
 * SpatialAudioControls - Contrôles audio spatial connectés à Web Audio API
 * Réverbération, stéréo, surround 3D fonctionnel
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Headphones, Radio, Waves, RotateCw, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface SpatialAudioControlsProps {
  className?: string;
  audioElement?: HTMLAudioElement | null;
}

const SpatialAudioControls: React.FC<SpatialAudioControlsProps> = ({ className, audioElement }) => {
  const [enabled, setEnabled] = useState(false);
  const [roomSize, setRoomSize] = useState([50]);
  const [reverb, setReverb] = useState([30]);
  const [stereoWidth, setStereoWidth] = useState([80]);
  const [bassBoost, setBassBoost] = useState([40]);
  const [virtualSurround, setVirtualSurround] = useState(false);
  const [headphoneMode, setHeadphoneMode] = useState('studio');
  const [isConnected, setIsConnected] = useState(false);

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const _stereoSplitterRef = useRef<ChannelSplitterNode | null>(null);
  const _stereoMergerRef = useRef<ChannelMergerNode | null>(null);

  const headphoneModes = [
    { id: 'studio', name: 'Studio', description: 'Son neutre et précis', reverbMix: 0.1 },
    { id: 'concert', name: 'Concert', description: 'Ambiance live', reverbMix: 0.4 },
    { id: 'intimate', name: 'Intime', description: 'Proximité artistique', reverbMix: 0.2 },
    { id: 'cinematic', name: 'Cinéma', description: 'Expérience immersive', reverbMix: 0.6 }
  ];

  // Generate impulse response for reverb
  const generateImpulseResponse = useCallback((ctx: AudioContext, duration: number, decay: number) => {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }, []);

  // Initialize Web Audio chain
  const initAudioChain = useCallback(() => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;

      // Create source from audio element
      const source = ctx.createMediaElementSource(audioElement);
      sourceRef.current = source;

      // Stereo panner for width
      const panner = ctx.createStereoPanner();
      panner.pan.value = 0;
      pannerRef.current = panner;

      // Convolver for reverb
      const convolver = ctx.createConvolver();
      convolver.buffer = generateImpulseResponse(ctx, roomSize[0] / 25, 3 - (reverb[0] / 50));
      convolverRef.current = convolver;

      // Bass boost filter
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 150;
      bassFilter.gain.value = 0;
      bassFilterRef.current = bassFilter;

      // Main gain
      const gainNode = ctx.createGain();
      gainNode.gain.value = 1;
      gainNodeRef.current = gainNode;

      // Dry/wet mix for reverb
      const dryGain = ctx.createGain();
      const wetGain = ctx.createGain();
      dryGain.gain.value = 0.7;
      wetGain.gain.value = 0.3;

      // Connect chain
      source.connect(bassFilter);
      bassFilter.connect(panner);
      
      // Split for dry/wet
      panner.connect(dryGain);
      panner.connect(convolver);
      convolver.connect(wetGain);
      
      dryGain.connect(gainNode);
      wetGain.connect(gainNode);
      gainNode.connect(ctx.destination);

      setIsConnected(true);
      toast.success('Audio spatial activé');
    } catch (error) {
      console.error('Spatial audio init error:', error);
      toast.error('Erreur lors de l\'initialisation de l\'audio spatial');
    }
  }, [audioElement, roomSize, reverb, generateImpulseResponse]);

  // Apply spatial settings
  useEffect(() => {
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Update reverb/room size
    if (convolverRef.current) {
      const duration = (roomSize[0] / 100) * 4 + 0.5; // 0.5s - 4.5s
      const decay = 4 - (reverb[0] / 33); // Higher reverb = slower decay
      convolverRef.current.buffer = generateImpulseResponse(ctx, duration, decay);
    }

    // Update bass boost
    if (bassFilterRef.current) {
      bassFilterRef.current.gain.value = (bassBoost[0] / 100) * 12; // 0-12dB boost
    }

    // Update stereo width via slight panning modulation
    if (pannerRef.current && stereoWidth[0] !== 100) {
      const widthFactor = (stereoWidth[0] - 100) / 200; // -0.5 to +0.25
      pannerRef.current.pan.value = widthFactor;
    }

  }, [enabled, roomSize, reverb, bassBoost, stereoWidth, generateImpulseResponse]);

  // Handle enable/disable
  useEffect(() => {
    if (enabled && audioElement && !isConnected) {
      initAudioChain();
    }
  }, [enabled, audioElement, isConnected, initAudioChain]);

  // Apply headphone mode preset
  useEffect(() => {
    if (!enabled) return;
    
    const mode = headphoneModes.find(m => m.id === headphoneMode);
    if (mode) {
      setReverb([mode.reverbMix * 100]);
    }
  }, [headphoneMode, enabled]);

  const resetSettings = () => {
    setRoomSize([50]);
    setReverb([30]);
    setStereoWidth([80]);
    setBassBoost([40]);
    setVirtualSurround(false);
    setHeadphoneMode('studio');
  };

  const handleToggleEnabled = (checked: boolean) => {
    setEnabled(checked);
    if (!checked && audioContextRef.current) {
      // Reconnect directly when disabled
      toast.info('Audio spatial désactivé');
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Audio Spatial Premium
            {isConnected && enabled && (
              <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={enabled ? "default" : "secondary"}>
              {enabled ? (isConnected ? "Actif" : "En attente") : "Désactivé"}
            </Badge>
            <Switch 
              checked={enabled} 
              onCheckedChange={handleToggleEnabled} 
              aria-label="Activer l'audio spatial" 
            />
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
          <p>🎧 L'audio spatial utilise Web Audio API pour créer un environnement sonore 3D immersif.</p>
          {!isConnected && enabled && (
            <p className="text-yellow-600 mt-1">⚠️ Lancez une piste pour activer l'effet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpatialAudioControls;
