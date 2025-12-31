/**
 * Composant d'ambiance sonore pour Nyvee
 * Joue des sons apaisants pendant la session de respiration
 */

import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AmbientSoundProps {
  isPlaying: boolean;
  className?: string;
}

// Sons ambiants disponibles (URLs de sons libres de droits)
const AMBIENT_SOUNDS = {
  nature: {
    label: 'Nature',
    emoji: '🌿',
    // Utilise l'API Web Audio pour générer un bruit blanc filtré
    type: 'generated' as const,
  },
  ocean: {
    label: 'Océan',
    emoji: '🌊',
    type: 'generated' as const,
  },
  rain: {
    label: 'Pluie',
    emoji: '🌧️',
    type: 'generated' as const,
  },
};

type SoundType = keyof typeof AMBIENT_SOUNDS;

export const AmbientSound = memo(({ isPlaying, className }: AmbientSoundProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(30);
  const [activeSound, setActiveSound] = useState<SoundType>('nature');
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Créer un bruit blanc filtré
  const createNoiseBuffer = useCallback((audioContext: AudioContext) => {
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return noiseBuffer;
  }, []);

  // Démarrer le son
  const startSound = useCallback(() => {
    if (audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Créer le noeud de gain
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume / 100 * 0.3; // Volume max réduit
      gainNodeRef.current = gainNode;

      // Créer le bruit
      const noiseBuffer = createNoiseBuffer(audioContext);
      const noiseNode = audioContext.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;
      noiseNodeRef.current = noiseNode;

      // Filtre passe-bas pour adoucir
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = activeSound === 'ocean' ? 400 : activeSound === 'rain' ? 800 : 600;

      // Connecter
      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      noiseNode.start();
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }, [volume, activeSound, createNoiseBuffer]);

  // Arrêter le son
  const stopSound = useCallback(() => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {
        // Ignore si déjà arrêté
      }
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
  }, []);

  // Gérer le play/pause
  useEffect(() => {
    if (isPlaying && !isMuted) {
      startSound();
    } else {
      stopSound();
    }

    return () => {
      stopSound();
    };
  }, [isPlaying, isMuted, startSound, stopSound]);

  // Mettre à jour le volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100 * 0.3;
    }
  }, [volume]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        aria-label={isMuted ? 'Activer le son ambiant' : 'Désactiver le son ambiant'}
        className="h-8 w-8"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Volume2 className="h-4 w-4 text-primary" />
        )}
      </Button>

      {!isMuted && (
        <>
          <Slider
            value={[volume]}
            onValueChange={(v) => setVolume(v[0])}
            min={0}
            max={100}
            step={5}
            className="w-20"
            aria-label="Volume du son ambiant"
          />
          
          <div className="flex gap-1">
            {(Object.keys(AMBIENT_SOUNDS) as SoundType[]).map((sound) => (
              <Button
                key={sound}
                variant={activeSound === sound ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => {
                  stopSound();
                  setActiveSound(sound);
                }}
                className="h-7 px-2 text-xs"
                aria-pressed={activeSound === sound}
              >
                {AMBIENT_SOUNDS[sound].emoji}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

AmbientSound.displayName = 'AmbientSound';

export default AmbientSound;
