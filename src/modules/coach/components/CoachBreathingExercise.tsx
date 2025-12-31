/**
 * CoachBreathingExercise - Exercice de respiration inline
 */

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Wind, Play, Pause, RotateCcw, X } from 'lucide-react';

interface CoachBreathingExerciseProps {
  technique?: '4-7-8' | 'box' | 'simple';
  duration?: number; // seconds
  onComplete?: () => void;
  onDismiss?: () => void;
  className?: string;
}

interface BreathPhase {
  name: string;
  duration: number; // seconds
  instruction: string;
}

const techniques: Record<string, { name: string; phases: BreathPhase[]; cycles: number }> = {
  '4-7-8': {
    name: 'Technique 4-7-8',
    phases: [
      { name: 'Inspire', duration: 4, instruction: 'Inspire par le nez' },
      { name: 'Retiens', duration: 7, instruction: 'Retiens ta respiration' },
      { name: 'Expire', duration: 8, instruction: 'Expire par la bouche' },
    ],
    cycles: 4
  },
  box: {
    name: 'Respiration carrée',
    phases: [
      { name: 'Inspire', duration: 4, instruction: 'Inspire lentement' },
      { name: 'Retiens', duration: 4, instruction: 'Pause' },
      { name: 'Expire', duration: 4, instruction: 'Expire lentement' },
      { name: 'Attends', duration: 4, instruction: 'Pause' },
    ],
    cycles: 4
  },
  simple: {
    name: 'Respiration simple',
    phases: [
      { name: 'Inspire', duration: 4, instruction: 'Inspire profondément' },
      { name: 'Expire', duration: 6, instruction: 'Expire doucement' },
    ],
    cycles: 6
  }
};

export const CoachBreathingExercise = memo(function CoachBreathingExercise({
  technique = 'simple',
  onComplete,
  onDismiss,
  className
}: CoachBreathingExerciseProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const config = techniques[technique];
  const currentPhase = config.phases[currentPhaseIndex];

  const resetExercise = useCallback(() => {
    setIsRunning(false);
    setCurrentCycle(1);
    setCurrentPhaseIndex(0);
    setPhaseProgress(0);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Main breathing loop
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    intervalRef.current = setInterval(() => {
      setPhaseProgress(prev => {
        const increment = 100 / (currentPhase.duration * 10); // 10 updates per second
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          // Move to next phase
          const nextPhaseIndex = currentPhaseIndex + 1;
          
          if (nextPhaseIndex >= config.phases.length) {
            // Completed a cycle
            const nextCycle = currentCycle + 1;
            
            if (nextCycle > config.cycles) {
              // All cycles completed
              setIsCompleted(true);
              setIsRunning(false);
              onComplete?.();
              return 100;
            }
            
            setCurrentCycle(nextCycle);
            setCurrentPhaseIndex(0);
          } else {
            setCurrentPhaseIndex(nextPhaseIndex);
          }
          
          return 0;
        }

        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isCompleted, currentPhase, currentPhaseIndex, currentCycle, config, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const totalProgress = ((currentCycle - 1) / config.cycles) * 100 + 
    (phaseProgress / config.cycles);

  if (isCompleted) {
    return (
      <Card className={cn('border-dashed bg-teal-50/50 dark:bg-teal-950/20', className)}>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
              <Wind className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="font-medium text-teal-800 dark:text-teal-200">Bravo !</p>
              <p className="text-sm text-teal-600 dark:text-teal-400">
                Exercice de respiration terminé
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetExercise}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Refaire
            </Button>
            {onDismiss && (
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Wind className="h-4 w-4 text-teal-600" />
            {config.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Cycle {currentCycle}/{config.cycles}
            </span>
            {onDismiss && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current phase display */}
        <div className="flex flex-col items-center justify-center py-4">
          <div 
            className={cn(
              'flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300',
              isRunning ? 'animate-pulse' : '',
              currentPhase.name === 'Inspire' && 'bg-blue-100 dark:bg-blue-900/30 scale-110',
              currentPhase.name === 'Retiens' && 'bg-amber-100 dark:bg-amber-900/30',
              currentPhase.name === 'Expire' && 'bg-teal-100 dark:bg-teal-900/30 scale-95',
              currentPhase.name === 'Attends' && 'bg-gray-100 dark:bg-gray-800/50'
            )}
          >
            <span className="text-lg font-semibold">{currentPhase.name}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{currentPhase.instruction}</p>
        </div>

        {/* Phase progress */}
        <Progress value={phaseProgress} className="h-2" />

        {/* Total progress */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progression totale</span>
          <span>{Math.round(totalProgress)}%</span>
        </div>
        <Progress value={totalProgress} className="h-1.5" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={isRunning ? 'outline' : 'default'}
            size="sm"
            onClick={toggleRunning}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                {phaseProgress > 0 ? 'Reprendre' : 'Démarrer'}
              </>
            )}
          </Button>
          {(isRunning || phaseProgress > 0) && (
            <Button variant="ghost" size="sm" onClick={resetExercise}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Recommencer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
