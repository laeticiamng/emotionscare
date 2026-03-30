// @ts-nocheck
/**
 * ClassicBreathMode - Mode classique de respiration
 * Protocoles : cohérence cardiaque, 4-7-8, box breathing, etc.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Wind, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Protocol {
  name: string;
  pattern: string;
  duration: string;
  difficulty: string;
}

interface ClassicBreathModeProps {
  protocols: Protocol[];
  stats: { totalSessions: number; totalMinutes: number };
}

type Phase = 'inspire' | 'hold' | 'expire' | 'holdOut';
type SessionState = 'idle' | 'running' | 'paused' | 'complete';

const DIFFICULTY_COLORS: Record<string, string> = {
  'Débutant': 'bg-emerald-500/10 text-emerald-600',
  'Intermédiaire': 'bg-amber-500/10 text-amber-600',
  'Avancé': 'bg-rose-500/10 text-rose-600',
  'Urgence': 'bg-red-500/10 text-red-600',
};

const PHASE_LABELS: Record<Phase, string> = {
  inspire: 'Inspirez',
  hold: 'Retenez',
  expire: 'Expirez',
  holdOut: 'Pause',
};

const PHASE_COLORS: Record<Phase, string> = {
  inspire: 'text-sky-400',
  hold: 'text-amber-400',
  expire: 'text-emerald-400',
  holdOut: 'text-violet-400',
};

// Define breath cycles per protocol
const PROTOCOL_CYCLES: Record<string, { phase: Phase; duration: number }[]> = {
  'Cohérence cardiaque': [
    { phase: 'inspire', duration: 5 },
    { phase: 'expire', duration: 5 },
  ],
  'Technique 4-7-8': [
    { phase: 'inspire', duration: 4 },
    { phase: 'hold', duration: 7 },
    { phase: 'expire', duration: 8 },
  ],
  'Box Breathing': [
    { phase: 'inspire', duration: 4 },
    { phase: 'hold', duration: 4 },
    { phase: 'expire', duration: 4 },
    { phase: 'holdOut', duration: 4 },
  ],
  'Respiration 2:1': [
    { phase: 'inspire', duration: 3 },
    { phase: 'expire', duration: 6 },
  ],
  'Souffle anti-panique': [
    { phase: 'inspire', duration: 3 },
    { phase: 'expire', duration: 6 },
  ],
};

export default function ClassicBreathMode({ protocols, stats }: ClassicBreathModeProps) {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [currentPhase, setCurrentPhase] = useState<Phase>('inspire');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cycle = selectedProtocol
    ? PROTOCOL_CYCLES[selectedProtocol.name] || PROTOCOL_CYCLES['Cohérence cardiaque']
    : [];

  const currentPhaseData = cycle.find(c => c.phase === currentPhase);
  const phaseDuration = currentPhaseData?.duration || 5;

  // Breath animation loop
  useEffect(() => {
    if (sessionState !== 'running') return;

    let phaseIndex = cycle.findIndex(c => c.phase === currentPhase);
    let timer = 0;

    intervalRef.current = setInterval(() => {
      timer += 0.1;
      const currentDuration = cycle[phaseIndex]?.duration || 5;
      const progress = Math.min((timer / currentDuration) * 100, 100);
      setPhaseProgress(progress);

      if (timer >= currentDuration) {
        timer = 0;
        phaseIndex = (phaseIndex + 1) % cycle.length;
        setCurrentPhase(cycle[phaseIndex].phase);
        if (phaseIndex === 0) {
          setCycleCount(prev => prev + 1);
        }
      }

      setElapsedSeconds(prev => prev + 0.1);
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionState, currentPhase, cycle]);

  const handleStart = () => {
    setSessionState('running');
    setCurrentPhase(cycle[0]?.phase || 'inspire');
    setCycleCount(0);
    setElapsedSeconds(0);
    setPhaseProgress(0);
  };

  const handlePause = () => {
    setSessionState(prev => prev === 'running' ? 'paused' : 'running');
  };

  const handleStop = () => {
    setSessionState('complete');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setSessionState('idle');
    setSelectedProtocol(null);
    setCycleCount(0);
    setElapsedSeconds(0);
    setPhaseProgress(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Protocol Selection View
  if (!selectedProtocol) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Choisir un protocole</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {protocols.map((protocol) => (
            <Card
              key={protocol.name}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedProtocol(protocol)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{protocol.name}</CardTitle>
                  <Badge className={DIFFICULTY_COLORS[protocol.difficulty] || ''}>
                    {protocol.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Wind className="h-3.5 w-3.5" /> {protocol.pattern}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {protocol.duration}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Session Complete View
  if (sessionState === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 className="h-20 w-20 text-emerald-500" />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Session terminée !</h2>
          <p className="text-muted-foreground">
            {selectedProtocol.name} · {cycleCount} cycles · {formatTime(elapsedSeconds)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Nouveau protocole
          </Button>
          <Button onClick={handleStart}>
            <Play className="h-4 w-4 mr-2" /> Recommencer
          </Button>
        </div>
      </div>
    );
  }

  // Active Session / Ready View
  return (
    <div className="space-y-6">
      {/* Protocol header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{selectedProtocol.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedProtocol.pattern} · {selectedProtocol.duration}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Changer de protocole
        </Button>
      </div>

      {/* Breath Circle */}
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: currentPhase === 'inspire' ? 1.4 : currentPhase === 'expire' ? 0.8 : 1.1,
          }}
          transition={{ duration: phaseDuration, ease: 'easeInOut' }}
        >
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center">
            <div className="text-center">
              <p className={`text-2xl font-bold ${PHASE_COLORS[currentPhase]}`}>
                {sessionState === 'idle' ? 'Prêt' : PHASE_LABELS[currentPhase]}
              </p>
              {sessionState !== 'idle' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Cycle {cycleCount + 1}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Phase progress */}
        {sessionState !== 'idle' && (
          <div className="w-full max-w-xs mt-8">
            <Progress value={phaseProgress} className="h-2" />
          </div>
        )}

        {/* Timer */}
        <p className="text-2xl font-mono text-muted-foreground mt-4">
          {formatTime(elapsedSeconds)}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {sessionState === 'idle' ? (
          <Button size="lg" onClick={handleStart} className="gap-2">
            <Play className="h-5 w-5" /> Commencer
          </Button>
        ) : (
          <>
            <Button variant="outline" size="lg" onClick={handlePause} className="gap-2">
              {sessionState === 'paused' ? (
                <><Play className="h-5 w-5" /> Reprendre</>
              ) : (
                <><Pause className="h-5 w-5" /> Pause</>
              )}
            </Button>
            <Button size="lg" onClick={handleStop} className="gap-2">
              <CheckCircle2 className="h-5 w-5" /> Terminer
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
