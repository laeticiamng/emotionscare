// @ts-nocheck
/**
 * NightBreathMode - Mode nuit (ex Nyvee Cocon)
 * Cocon d'endormissement avec respiration douce et ambiance sonore
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Moon, Play, Pause, Volume2, Wind, Clock, Star, CloudMoon } from 'lucide-react';

const AMBIANCES = [
  { id: 'rain', name: 'Pluie douce', emoji: '🌧️' },
  { id: 'ocean', name: 'Vagues', emoji: '🌊' },
  { id: 'forest', name: 'Forêt nocturne', emoji: '🌲' },
  { id: 'fire', name: 'Feu de cheminée', emoji: '🔥' },
  { id: 'wind', name: 'Vent léger', emoji: '🍃' },
  { id: 'silence', name: 'Silence', emoji: '🤫' },
];

const DURATIONS = [5, 10, 15, 20, 30];

export default function NightBreathMode() {
  const [isActive, setIsActive] = useState(false);
  const [selectedAmbiance, setSelectedAmbiance] = useState('rain');
  const [duration, setDuration] = useState(15);
  const [volume, setVolume] = useState([60]);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [elapsed, setElapsed] = useState(0);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);

  // Slower breath cycle for sleep (4-2-6)
  useEffect(() => {
    if (!isActive) return;
    
    const phases: { phase: typeof breathPhase; duration: number }[] = [
      { phase: 'inspire', duration: 4000 },
      { phase: 'hold', duration: 2000 },
      { phase: 'expire', duration: 6000 },
    ];
    
    let phaseIndex = 0;
    let timeout: NodeJS.Timeout;
    
    const next = () => {
      setBreathPhase(phases[phaseIndex].phase);
      timeout = setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        next();
      }, phases[phaseIndex].duration);
    };
    
    next();
    return () => clearTimeout(timeout);
  }, [isActive]);

  // Elapsed timer
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= duration * 60) {
          setIsActive(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, duration]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = (elapsed / (duration * 60)) * 100;
  const ambiance = AMBIANCES.find(a => a.id === selectedAmbiance)!;

  // Active cocoon mode
  if (isActive) {
    return (
      <div className="min-h-[500px] rounded-2xl overflow-hidden relative bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950">
        {/* Ambient particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-indigo-300/20 rounded-full"
            animate={{
              y: [-10, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 30}%`,
            }}
          />
        ))}

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
          {/* Breath cocoon */}
          <motion.div
            animate={{
              scale: breathPhase === 'inspire' ? 1.3 : breathPhase === 'hold' ? 1.3 : 0.9,
              opacity: breathPhase === 'expire' ? 0.6 : 0.9,
            }}
            transition={{ duration: breathPhase === 'inspire' ? 4 : breathPhase === 'hold' ? 0.5 : 6, ease: 'easeInOut' }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-500/10 border border-indigo-300/20 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center">
              <Moon className="h-8 w-8 text-indigo-300/70 mx-auto mb-2" />
              <p className="text-indigo-200 text-sm font-medium">
                {breathPhase === 'inspire' ? 'Inspirez' : breathPhase === 'hold' ? 'Retenez' : 'Expirez'}
              </p>
            </div>
          </motion.div>

          {/* Timer */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-indigo-200/60 text-3xl font-mono">{formatTime(elapsed)}</p>
            <p className="text-indigo-300/40 text-xs">{ambiance.emoji} {ambiance.name}</p>
          </div>

          {/* Volume slider */}
          <div className="mt-8 w-48 flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-indigo-300/40" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={5}
              className="flex-1"
            />
          </div>
        </div>

        {/* Stop button */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <Button
            variant="secondary"
            className="bg-white/5 backdrop-blur-md border-white/10 text-indigo-200 hover:bg-white/10"
            onClick={() => setIsActive(false)}
          >
            <Pause className="h-4 w-4 mr-2" /> Quitter le cocon
          </Button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-1 bg-indigo-300/10">
            <motion.div
              className="h-full bg-indigo-400/40"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Setup view
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CloudMoon className="h-10 w-10 text-indigo-400 mx-auto" />
        <h2 className="text-lg font-semibold">Mode Nuit — Cocon d'endormissement</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Respiration lente (4-2-6) avec ambiance sonore pour un endormissement serein.
        </p>
      </div>

      {/* Mood before */}
      {moodBefore === null ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comment vous sentez-vous ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(n => (
                <Button
                  key={n}
                  variant="outline"
                  size="lg"
                  className="text-2xl"
                  onClick={() => setMoodBefore(n)}
                >
                  {['😫', '😔', '😐', '🙂', '😌'][n - 1]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Ambiance selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ambiance sonore</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {AMBIANCES.map((amb) => (
                  <Button
                    key={amb.id}
                    variant={selectedAmbiance === amb.id ? 'default' : 'outline'}
                    className="h-auto py-3 flex flex-col gap-1"
                    onClick={() => setSelectedAmbiance(amb.id)}
                  >
                    <span className="text-xl">{amb.emoji}</span>
                    <span className="text-xs">{amb.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" /> Durée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                {DURATIONS.map(d => (
                  <Button
                    key={d}
                    variant={duration === d ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration(d)}
                  >
                    {d} min
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start */}
          <div className="text-center">
            <Button
              size="lg"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => { setIsActive(true); setElapsed(0); }}
            >
              <Moon className="h-5 w-5" /> Entrer dans le cocon
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
