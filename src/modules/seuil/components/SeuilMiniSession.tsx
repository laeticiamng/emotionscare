/**
 * Mini-session guidée SEUIL (3min / 5min)
 * Contenu réel pour les actions de régulation
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Play, Pause, CheckCircle } from 'lucide-react';
import type {} from '../types';

interface SeuilMiniSessionProps {
  actionType: '3min' | '5min_guided';
  onComplete: () => void;
  onCancel: () => void;
}

interface SessionStep {
  instruction: string;
  duration: number; // seconds
  breathPattern?: { inhale: number; hold: number; exhale: number };
  icon: string;
}

const SESSION_3MIN: SessionStep[] = [
  {
    instruction: "Ferme les yeux. Inspire lentement par le nez.",
    duration: 30,
    breathPattern: { inhale: 4, hold: 0, exhale: 4 },
    icon: "🌬️"
  },
  {
    instruction: "Pose tes mains à plat. Sens leur contact avec la surface.",
    duration: 30,
    icon: "✋"
  },
  {
    instruction: "Nomme 3 choses que tu vois autour de toi.",
    duration: 30,
    icon: "👁️"
  },
  {
    instruction: "Continue de respirer. Laisse les pensées passer.",
    duration: 30,
    breathPattern: { inhale: 4, hold: 2, exhale: 6 },
    icon: "🍃"
  },
  {
    instruction: "Bouge doucement tes épaules. Relâche la tension.",
    duration: 30,
    icon: "💆"
  },
  {
    instruction: "Reviens doucement. Tu as pris soin de toi.",
    duration: 30,
    icon: "🌿"
  }
];

const SESSION_5MIN: SessionStep[] = [
  {
    instruction: "Installe-toi confortablement. Ferme les yeux si tu le souhaites.",
    duration: 30,
    icon: "🧘"
  },
  {
    instruction: "Respire naturellement. Observe simplement ton souffle.",
    duration: 45,
    breathPattern: { inhale: 4, hold: 0, exhale: 4 },
    icon: "🌬️"
  },
  {
    instruction: "Scan ton corps du haut vers le bas. Où sens-tu de la tension ?",
    duration: 45,
    icon: "🔍"
  },
  {
    instruction: "Respire vers cette zone de tension. Imagine-la se détendre.",
    duration: 45,
    breathPattern: { inhale: 4, hold: 4, exhale: 6 },
    icon: "✨"
  },
  {
    instruction: "Pense à un moment où tu t'es senti(e) calme et en sécurité.",
    duration: 45,
    icon: "💭"
  },
  {
    instruction: "Visualise ce moment. Les couleurs, les sons, les sensations.",
    duration: 45,
    icon: "🌈"
  },
  {
    instruction: "Respire profondément. Inhale la paix, exhale le stress.",
    duration: 45,
    breathPattern: { inhale: 5, hold: 2, exhale: 7 },
    icon: "🍃"
  },
  {
    instruction: "Doucement, reviens au présent. Bouge tes doigts et orteils.",
    duration: 30,
    icon: "👐"
  },
  {
    instruction: "Bravo. Tu viens de prendre 5 minutes pour toi. C'est précieux.",
    duration: 30,
    icon: "💚"
  }
];

export const SeuilMiniSession: React.FC<SeuilMiniSessionProps> = memo(({
  actionType,
  onComplete,
  onCancel
}) => {
  const steps = actionType === '3min' ? SESSION_3MIN : SESSION_5MIN;
  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(steps[0].duration);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (isPaused || isCompleted) return;

    const interval = setInterval(() => {
      setStepTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next step
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(idx => idx + 1);
            return steps[currentStepIndex + 1].duration;
          } else {
            setIsCompleted(true);
            return 0;
          }
        }
        return prev - 1;
      });
      setTotalTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCompleted, currentStepIndex, steps]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (totalTimeElapsed / totalDuration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
    >
      <Card className="w-full max-w-md border-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold">
            {actionType === '3min' ? '3 minutes' : '5 minutes guidées'}
          </span>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Step indicator */}
                <div className="flex justify-center gap-1">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx < currentStepIndex ? 'bg-primary' :
                        idx === currentStepIndex ? 'bg-primary animate-pulse' :
                        'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Icon */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-6xl text-center"
                >
                  {currentStep.icon}
                </motion.div>

                {/* Instruction */}
                <p className="text-center text-lg leading-relaxed">
                  {currentStep.instruction}
                </p>

                {/* Breath pattern visualization */}
                {currentStep.breathPattern && (
                  <BreathGuide pattern={currentStep.breathPattern} />
                )}

                {/* Timer */}
                <div className="text-center">
                  <span className="text-2xl font-mono text-muted-foreground">
                    {formatTime(stepTimeRemaining)}
                  </span>
                </div>

                {/* Global progress */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(totalTimeElapsed)}</span>
                    <span>{formatTime(totalDuration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Session terminée</h3>
                  <p className="text-muted-foreground">
                    Tu as pris {actionType === '3min' ? '3 minutes' : '5 minutes'} pour toi.
                    <br />
                    C'est un acte de bienveillance envers toi-même.
                  </p>
                </div>

                <Button onClick={handleComplete} size="lg">
                  Continuer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SeuilMiniSession.displayName = 'SeuilMiniSession';

interface BreathGuideProps {
  pattern: { inhale: number; hold: number; exhale: number };
}

const BreathGuide: React.FC<BreathGuideProps> = memo(({ pattern }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalCycle = pattern.inhale + pattern.hold + pattern.exhale;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed = (elapsed + 0.1) % totalCycle;
      
      if (elapsed < pattern.inhale) {
        setPhase('inhale');
        setProgress((elapsed / pattern.inhale) * 100);
      } else if (elapsed < pattern.inhale + pattern.hold) {
        setPhase('hold');
        setProgress(100);
      } else {
        setPhase('exhale');
        const exhaleProgress = (elapsed - pattern.inhale - pattern.hold) / pattern.exhale;
        setProgress((1 - exhaleProgress) * 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pattern]);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
        animate={{ scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full bg-primary/40"
          animate={{ scale: phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 0.8 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      <span className="text-sm text-muted-foreground capitalize">
        {phase === 'inhale' ? 'Inspire...' : phase === 'hold' ? 'Retiens...' : 'Expire...'}
      </span>
    </div>
  );
});

BreathGuide.displayName = 'BreathGuide';

export default SeuilMiniSession;
