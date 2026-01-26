/**
 * Mixeur de sons ambiants pour méditation
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, VolumeX, RotateCcw,
  Waves, Wind, CloudRain, Bird, Flame, Trees
} from 'lucide-react';

interface AmbientSound {
  id: string;
  name: string;
  icon: React.ReactNode;
  audioUrl: string;
  category: 'nature' | 'weather' | 'ambient';
}

interface SoundState {
  volume: number;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
}

const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: 'ocean',
    name: 'Océan',
    icon: <Waves className="w-5 h-5" />,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/06/07/audio_3cd0e0dc1f.mp3',
    category: 'nature',
  },
  {
    id: 'rain',
    name: 'Pluie',
    icon: <CloudRain className="w-5 h-5" />,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/02/23/audio_ea70ad08b6.mp3',
    category: 'weather',
  },
  {
    id: 'wind',
    name: 'Vent',
    icon: <Wind className="w-5 h-5" />,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/13/audio_3e6e6f2f51.mp3',
    category: 'weather',
  },
  {
    id: 'birds',
    name: 'Oiseaux',
    icon: <Bird className="w-5 h-5" />,
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/09/audio_51b0d8fe96.mp3',
    category: 'nature',
  },
  {
    id: 'fire',
    name: 'Feu',
    icon: <Flame className="w-5 h-5" />,
    audioUrl: 'https://cdn.pixabay.com/audio/2021/08/09/audio_c3f2c3c4e4.mp3',
    category: 'ambient',
  },
  {
    id: 'forest',
    name: 'Forêt',
    icon: <Trees className="w-5 h-5" />,
    audioUrl: 'https://cdn.pixabay.com/audio/2021/09/06/audio_e9c7a7f6fb.mp3',
    category: 'nature',
  },
];

const PRESETS = [
  { id: 'zen', name: 'Zen', sounds: { ocean: 60, birds: 30 } },
  { id: 'storm', name: 'Orage', sounds: { rain: 80, wind: 40 } },
  { id: 'forest', name: 'Forêt', sounds: { forest: 70, birds: 50, wind: 20 } },
  { id: 'cozy', name: 'Cosy', sounds: { fire: 60, rain: 40 } },
];

interface AmbientSoundMixerProps {
  onVolumeChange?: (masterVolume: number) => void;
  compact?: boolean;
}

export const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({
  onVolumeChange,
  compact = false,
}) => {
  const [masterVolume, setMasterVolume] = useState(70);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [soundStates, setSoundStates] = useState<Record<string, SoundState>>({});
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Initialize sounds
  useEffect(() => {
    const initial: Record<string, SoundState> = {};
    AMBIENT_SOUNDS.forEach(sound => {
      initial[sound.id] = { volume: 0, isPlaying: false, audio: null };
    });
    setSoundStates(initial);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(soundStates).forEach(state => {
        if (state.audio) {
          state.audio.pause();
          state.audio.src = '';
        }
      });
    };
  }, []);

  const updateSoundVolume = useCallback((soundId: string, volume: number) => {
    setSoundStates(prev => {
      const state = prev[soundId];
      if (!state) return prev;

      // Create or update audio element
      let audio = state.audio;
      if (!audio && volume > 0) {
        const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
        if (sound) {
          audio = new Audio(sound.audioUrl);
          audio.loop = true;
        }
      }

      if (audio) {
        const effectiveVolume = isMasterMuted ? 0 : (volume / 100) * (masterVolume / 100);
        audio.volume = effectiveVolume;
        
        if (volume > 0 && !state.isPlaying) {
          audio.play().catch(() => {});
        } else if (volume === 0 && state.isPlaying) {
          audio.pause();
        }
      }

      setActivePreset(null);

      return {
        ...prev,
        [soundId]: {
          volume,
          isPlaying: volume > 0,
          audio,
        },
      };
    });
  }, [masterVolume, isMasterMuted]);

  // Update all volumes when master changes
  useEffect(() => {
    Object.entries(soundStates).forEach(([_soundId, state]) => {
      if (state.audio) {
        const effectiveVolume = isMasterMuted ? 0 : (state.volume / 100) * (masterVolume / 100);
        state.audio.volume = effectiveVolume;
      }
    });
    onVolumeChange?.(masterVolume);
  }, [masterVolume, isMasterMuted, soundStates, onVolumeChange]);

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    // Reset all sounds
    AMBIENT_SOUNDS.forEach(sound => {
      const volume = preset.sounds[sound.id as keyof typeof preset.sounds] || 0;
      updateSoundVolume(sound.id, volume);
    });

    setActivePreset(presetId);
  };

  const resetAll = () => {
    Object.keys(soundStates).forEach(soundId => {
      updateSoundVolume(soundId, 0);
    });
    setActivePreset(null);
  };

  const activeSoundsCount = Object.values(soundStates).filter(s => s.isPlaying).length;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMasterMuted(!isMasterMuted)}
          className="gap-2"
        >
          {isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{activeSoundsCount} sons</span>
        </Button>
        <Slider
          value={[masterVolume]}
          onValueChange={([v]) => setMasterVolume(v)}
          max={100}
          className="w-24"
          disabled={isMasterMuted}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Sons ambiants
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activeSoundsCount} actif{activeSoundsCount > 1 ? 's' : ''}</Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetAll}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Master volume */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMasterMuted(!isMasterMuted)}
          >
            {isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[masterVolume]}
            onValueChange={([v]) => setMasterVolume(v)}
            max={100}
            className="flex-1"
            disabled={isMasterMuted}
          />
          <span className="text-sm text-muted-foreground w-10 text-right">{masterVolume}%</span>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <Button
              key={preset.id}
              variant={activePreset === preset.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyPreset(preset.id)}
            >
              {preset.name}
            </Button>
          ))}
        </div>

        {/* Individual sounds */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMBIENT_SOUNDS.map(sound => {
            const state = soundStates[sound.id] || { volume: 0, isPlaying: false };
            return (
              <motion.div
                key={sound.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg border transition-colors ${
                  state.isPlaying
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-muted/30 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={state.isPlaying ? 'text-primary' : 'text-muted-foreground'}>
                    {sound.icon}
                  </div>
                  <span className="text-sm font-medium">{sound.name}</span>
                  {state.isPlaying && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-success rounded-full"
                    />
                  )}
                </div>
                <Slider
                  value={[state.volume]}
                  onValueChange={([v]) => updateSoundVolume(sound.id, v)}
                  max={100}
                  className="w-full"
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AmbientSoundMixer;
