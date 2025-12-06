/**
 * Contrôles de la session de respiration
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square } from 'lucide-react';
import type { BreathingPhase } from '../types';

interface BreathingControlsProps {
  status: 'idle' | 'active' | 'paused' | 'completed';
  currentPhase: BreathingPhase;
  cyclesCompleted: number;
  elapsedTime: number;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
}

export const BreathingControls = ({
  status,
  currentPhase,
  cyclesCompleted,
  elapsedTime,
  onPause,
  onResume,
  onComplete
}: BreathingControlsProps) => {
  const phaseLabels: Record<BreathingPhase, string> = {
    inhale: 'Inspirez',
    hold: 'Retenez',
    exhale: 'Expirez',
    rest: 'Repos'
  };

  const phaseColors: Record<BreathingPhase, string> = {
    inhale: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    hold: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    exhale: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rest: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'idle') return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge className={`text-lg px-4 py-2 ${phaseColors[currentPhase]}`}>
          {phaseLabels[currentPhase]}
        </Badge>
        <div className="text-muted-foreground text-sm">
          <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
          {' • '}
          <span>{cyclesCompleted} cycles</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === 'active' && (
          <>
            <Button onClick={onPause} variant="secondary" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button onClick={onComplete} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Terminer
            </Button>
          </>
        )}

        {status === 'paused' && (
          <>
            <Button onClick={onResume} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Reprendre
            </Button>
            <Button onClick={onComplete} variant="destructive" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Terminer
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
