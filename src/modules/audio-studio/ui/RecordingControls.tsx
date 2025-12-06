/**
 * Contrôles d'enregistrement
 */

import { Button } from '@/components/ui/button';
import { Mic, Square, Pause, Play } from 'lucide-react';
import type { RecordingStatus } from '../types';

interface RecordingControlsProps {
  status: RecordingStatus;
  elapsedTime: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const RecordingControls = ({
  status,
  elapsedTime,
  onStart,
  onPause,
  onResume,
  onStop
}: RecordingControlsProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {status !== 'idle' && (
        <div className="text-3xl font-mono font-bold text-foreground">
          {formatTime(elapsedTime)}
        </div>
      )}

      <div className="flex items-center gap-3">
        {status === 'idle' && (
          <Button size="lg" onClick={onStart} className="gap-2">
            <Mic className="h-5 w-5" />
            Démarrer
          </Button>
        )}

        {status === 'recording' && (
          <>
            <Button size="lg" variant="secondary" onClick={onPause} className="gap-2">
              <Pause className="h-5 w-5" />
              Pause
            </Button>
            <Button size="lg" variant="destructive" onClick={onStop} className="gap-2">
              <Square className="h-4 w-4" />
              Arrêter
            </Button>
          </>
        )}

        {status === 'paused' && (
          <>
            <Button size="lg" onClick={onResume} className="gap-2">
              <Play className="h-5 w-5" />
              Reprendre
            </Button>
            <Button size="lg" variant="destructive" onClick={onStop} className="gap-2">
              <Square className="h-4 w-4" />
              Arrêter
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
