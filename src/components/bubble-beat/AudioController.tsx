/**
 * Audio Controller - Contrôle audio binaural et ambient
 */

import { memo, useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  isPlaying: boolean;
  mood: 'calm' | 'energetic' | 'focus';
  onVolumeChange?: (volume: number) => void;
}

// Fréquences binaurales par mood
const BINAURAL_FREQS = {
  calm: { base: 432, beat: 4 },     // Alpha waves (relaxation)
  energetic: { base: 528, beat: 15 }, // Beta waves (energy)
  focus: { base: 396, beat: 10 }     // Alpha/Beta (concentration)
};

export const AudioController = memo(function AudioController({
  isPlaying,
  mood,
  onVolumeChange
}: AudioControllerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const freqs = BINAURAL_FREQS[mood];

    // Stop existing oscillators
    oscillatorLeftRef.current?.stop();
    oscillatorRightRef.current?.stop();

    // Create gain node
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(isMuted ? 0 : volume[0] / 500, ctx.currentTime);
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    // Create stereo panner nodes for binaural effect
    const pannerLeft = ctx.createStereoPanner();
    pannerLeft.pan.setValueAtTime(-1, ctx.currentTime);
    pannerLeft.connect(gainNode);

    const pannerRight = ctx.createStereoPanner();
    pannerRight.pan.setValueAtTime(1, ctx.currentTime);
    pannerRight.connect(gainNode);

    // Left ear oscillator
    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(freqs.base, ctx.currentTime);
    oscLeft.connect(pannerLeft);
    oscLeft.start();
    oscillatorLeftRef.current = oscLeft;

    // Right ear oscillator (slightly different frequency for binaural beat)
    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(freqs.base + freqs.beat, ctx.currentTime);
    oscRight.connect(pannerRight);
    oscRight.start();
    oscillatorRightRef.current = oscRight;
  }, [mood, isMuted, volume]);

  const stopAudio = useCallback(() => {
    try {
      oscillatorLeftRef.current?.stop();
      oscillatorRightRef.current?.stop();
    } catch {
      // Already stopped
    }
    oscillatorLeftRef.current = null;
    oscillatorRightRef.current = null;
  }, []);

  // Start/stop audio based on play state
  useEffect(() => {
    if (isPlaying && !isMuted) {
      startAudio();
    } else {
      stopAudio();
    }

    return () => stopAudio();
  }, [isPlaying, isMuted, startAudio, stopAudio]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const targetVolume = isMuted ? 0 : volume[0] / 500;
      gainNodeRef.current.gain.setTargetAtTime(
        targetVolume,
        audioContextRef.current.currentTime,
        0.1
      );
    }
    onVolumeChange?.(volume[0]);
  }, [volume, isMuted, onVolumeChange]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (newVolume[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className={cn(
          'flex-shrink-0',
          isMuted && 'text-muted-foreground'
        )}
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </Button>

      <Slider
        value={volume}
        onValueChange={handleVolumeChange}
        max={100}
        min={0}
        step={5}
        className="flex-1"
        disabled={!isPlaying}
      />

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Music className="w-3 h-3" />
        <span className="capitalize">{mood}</span>
      </div>

      {/* Indicateur de fréquence binaurale */}
      {isPlaying && !isMuted && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      )}
    </div>
  );
});

export default AudioController;
