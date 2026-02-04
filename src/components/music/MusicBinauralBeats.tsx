/**
 * MusicBinauralBeats - Générateur de sons binauraux personnalisés
 * Crée des battements binauraux pour différents états mentaux
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, Volume2, VolumeX, Brain, Moon, 
  Zap, Heart, Focus, Timer, Info 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BinauralPreset {
  id: string;
  name: string;
  description: string;
  baseFrequency: number;
  beatFrequency: number;
  icon: React.ElementType;
  color: string;
  benefits: string[];
}

const BINAURAL_PRESETS: BinauralPreset[] = [
  {
    id: 'delta',
    name: 'Delta (Sommeil profond)',
    description: '0.5-4 Hz - Régénération et guérison',
    baseFrequency: 200,
    beatFrequency: 2,
    icon: Moon,
    color: 'bg-indigo-500',
    benefits: ['Sommeil profond', 'Récupération physique', 'Régénération cellulaire']
  },
  {
    id: 'theta',
    name: 'Theta (Méditation)',
    description: '4-8 Hz - Relaxation profonde et créativité',
    baseFrequency: 220,
    beatFrequency: 6,
    icon: Heart,
    color: 'bg-purple-500',
    benefits: ['Méditation', 'Créativité', 'Réduction du stress']
  },
  {
    id: 'alpha',
    name: 'Alpha (Relaxation)',
    description: '8-12 Hz - Calme et détente légère',
    baseFrequency: 240,
    beatFrequency: 10,
    icon: Brain,
    color: 'bg-blue-500',
    benefits: ['Relaxation', 'Calme mental', 'Positivité']
  },
  {
    id: 'beta',
    name: 'Beta (Concentration)',
    description: '12-30 Hz - Focus et productivité',
    baseFrequency: 260,
    beatFrequency: 20,
    icon: Focus,
    color: 'bg-green-500',
    benefits: ['Concentration', 'Mémorisation', 'Productivité']
  },
  {
    id: 'gamma',
    name: 'Gamma (Peak Performance)',
    description: '30-100 Hz - Performance cognitive maximale',
    baseFrequency: 280,
    beatFrequency: 40,
    icon: Zap,
    color: 'bg-yellow-500',
    benefits: ['Insight', 'Apprentissage rapide', 'Performance mentale']
  }
];

const MusicBinauralBeats = memo(() => {
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<BinauralPreset>(BINAURAL_PRESETS[2]);
  const [volume, setVolume] = useState(30);
  const [customBaseFreq, setCustomBaseFreq] = useState(240);
  const [customBeatFreq, setCustomBeatFreq] = useState(10);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [duration, setDuration] = useState(15);
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      stopAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    // Créer les oscillateurs
    oscillatorLeftRef.current = audioContextRef.current.createOscillator();
    oscillatorRightRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    // Créer le panner pour séparer gauche/droite
    const pannerLeft = audioContextRef.current.createStereoPanner();
    const pannerRight = audioContextRef.current.createStereoPanner();
    pannerLeft.pan.value = -1;
    pannerRight.pan.value = 1;

    // Configurer les fréquences
    const baseFreq = isCustomMode ? customBaseFreq : selectedPreset.baseFrequency;
    const beatFreq = isCustomMode ? customBeatFreq : selectedPreset.beatFrequency;

    oscillatorLeftRef.current.frequency.value = baseFreq;
    oscillatorRightRef.current.frequency.value = baseFreq + beatFreq;

    oscillatorLeftRef.current.type = 'sine';
    oscillatorRightRef.current.type = 'sine';

    // Connecter le graphe audio
    oscillatorLeftRef.current.connect(pannerLeft);
    oscillatorRightRef.current.connect(pannerRight);
    pannerLeft.connect(gainNodeRef.current);
    pannerRight.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    // Volume
    gainNodeRef.current.gain.value = volume / 100;
  };

  const startAudio = () => {
    initAudio();
    
    if (oscillatorLeftRef.current && oscillatorRightRef.current) {
      oscillatorLeftRef.current.start();
      oscillatorRightRef.current.start();
      setIsPlaying(true);

      // Timer
      setRemainingTime(duration * 60);
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            stopAudio();
            toast({
              title: 'Session terminée',
              description: `${duration} minutes de sons binauraux complétées`
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: 'Session démarrée',
        description: `${isCustomMode ? 'Mode personnalisé' : selectedPreset.name} - ${duration} min`
      });
    }
  };

  const stopAudio = () => {
    if (oscillatorLeftRef.current) {
      oscillatorLeftRef.current.stop();
      oscillatorLeftRef.current.disconnect();
      oscillatorLeftRef.current = null;
    }
    if (oscillatorRightRef.current) {
      oscillatorRightRef.current.stop();
      oscillatorRightRef.current.disconnect();
      oscillatorRightRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setRemainingTime(0);
  };

  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume / 100;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Sons Binauraux
        </CardTitle>
        <CardDescription>
          Utilisez un casque pour profiter des effets des battements binauraux
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avertissement casque */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Casque stéréo obligatoire pour percevoir les battements binauraux
          </p>
        </div>

        {/* Sélection preset */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Preset</h4>
            <Button
              variant={isCustomMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsCustomMode(!isCustomMode)}
            >
              {isCustomMode ? 'Retour aux presets' : 'Mode personnalisé'}
            </Button>
          </div>

          {!isCustomMode && (
            <div className="grid gap-2">
                  {BINAURAL_PRESETS.map(preset => {
                    const IconComponent = preset.icon;
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => !isPlaying && setSelectedPreset(preset)}
                        disabled={isPlaying}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted hover:border-primary/50'
                    } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${preset.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-sm text-muted-foreground">{preset.description}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {preset.benefits.map(benefit => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mode personnalisé */}
          {isCustomMode && (
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div>
                <label className="text-sm font-medium">
                  Fréquence de base: {customBaseFreq} Hz
                </label>
                <Slider
                  value={[customBaseFreq]}
                  onValueChange={([v]) => setCustomBaseFreq(v)}
                  min={100}
                  max={400}
                  step={10}
                  disabled={isPlaying}
                  aria-label="Fréquence de base"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Fréquence du battement: {customBeatFreq} Hz
                </label>
                <Slider
                  value={[customBeatFreq]}
                  onValueChange={([v]) => setCustomBeatFreq(v)}
                  min={0.5}
                  max={50}
                  step={0.5}
                  disabled={isPlaying}
                  aria-label="Fréquence du battement"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Delta (sommeil)</span>
                  <span>Gamma (focus)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Durée et volume */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              <Timer className="h-4 w-4 inline mr-1" />
              Durée: {duration} min
            </label>
            <Slider
              value={[duration]}
              onValueChange={([v]) => setDuration(v)}
              min={5}
              max={60}
              step={5}
              disabled={isPlaying}
              aria-label="Durée de la session"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              {volume > 0 ? (
                <Volume2 className="h-4 w-4 inline mr-1" />
              ) : (
                <VolumeX className="h-4 w-4 inline mr-1" />
              )}
              Volume: {volume}%
            </label>
            <Slider
              value={[volume]}
              onValueChange={([v]) => updateVolume(v)}
              min={0}
              max={100}
              step={5}
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Timer en cours */}
        {isPlaying && remainingTime > 0 && (
          <div className="text-center p-4 rounded-lg bg-primary/10">
            <div className="text-3xl font-bold">{formatTime(remainingTime)}</div>
            <p className="text-sm text-muted-foreground">temps restant</p>
          </div>
        )}

        {/* Contrôles */}
        <Button
          onClick={isPlaying ? stopAudio : startAudio}
          className="w-full"
          size="lg"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Arrêter
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Démarrer la session
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

MusicBinauralBeats.displayName = 'MusicBinauralBeats';

export default MusicBinauralBeats;
