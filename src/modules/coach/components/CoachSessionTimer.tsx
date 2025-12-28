/**
 * CoachSessionTimer - Affichage durée session en temps réel
 */

import { memo, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachSessionTimerProps {
  startedAt: number | null;
  isActive: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const CoachSessionTimer = memo(function CoachSessionTimer({
  startedAt,
  isActive,
}: CoachSessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt || !isActive) {
      setElapsed(0);
      return;
    }

    const tick = () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt, isActive]);

  if (!startedAt || !isActive) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary',
      )}
    >
      <Clock className="h-3 w-3" />
      <span>{formatDuration(elapsed)}</span>
    </div>
  );
});
