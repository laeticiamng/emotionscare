/**
 * Timer de session avec modes prédéfinis
 */
import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Bell,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerPreset {
  id: string;
  label: string;
  minutes: number;
  color: string;
}

interface SessionTimerProps {
  isSessionActive: boolean;
  sessionDuration: number;
  onTimerComplete?: () => void;
  className?: string;
}

const TIMER_PRESETS: TimerPreset[] = [
  { id: '5min', label: '5 min', minutes: 5, color: 'bg-green-500' },
  { id: '10min', label: '10 min', minutes: 10, color: 'bg-blue-500' },
  { id: '15min', label: '15 min', minutes: 15, color: 'bg-purple-500' },
  { id: '30min', label: '30 min', minutes: 30, color: 'bg-orange-500' },
];

export const SessionTimer: React.FC<SessionTimerProps> = memo(({
  isSessionActive,
  sessionDuration,
  onTimerComplete,
  className,
}) => {
  const [targetMinutes, setTargetMinutes] = useState<number | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Calculer le temps restant
  useEffect(() => {
    if (targetMinutes !== null && isSessionActive && !isTimerPaused) {
      const targetSeconds = targetMinutes * 60;
      const remaining = Math.max(0, targetSeconds - sessionDuration);
      setRemainingSeconds(remaining);

      if (remaining === 0 && sessionDuration > 0) {
        onTimerComplete?.();
      }
    }
  }, [targetMinutes, sessionDuration, isSessionActive, isTimerPaused, onTimerComplete]);

  const selectPreset = useCallback((minutes: number) => {
    setTargetMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsTimerPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTargetMinutes(null);
    setRemainingSeconds(0);
    setIsTimerPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsTimerPaused(prev => !prev);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = targetMinutes 
    ? ((targetMinutes * 60 - remainingSeconds) / (targetMinutes * 60)) * 100
    : 0;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Timer de session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            {targetMinutes !== null ? (
              <motion.div
                key="timer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-3"
              >
                <div className="relative inline-flex items-center justify-center">
                  <div 
                    className="text-4xl font-mono font-bold tracking-wider"
                    role="timer"
                    aria-label={`Temps restant: ${formatTime(remainingSeconds)}`}
                  >
                    {formatTime(remainingSeconds)}
                  </div>
                  {remainingSeconds === 0 && (
                    <Bell className="absolute -right-6 h-5 w-5 text-primary animate-bounce" />
                  )}
                </div>
                
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary">
                    {targetMinutes} min
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    • {Math.round(progress)}% complété
                  </span>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                    disabled={!isSessionActive}
                  >
                    {isTimerPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Reprendre
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="presets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Choisissez une durée</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {TIMER_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => selectPreset(preset.minutes)}
                      className="relative overflow-hidden"
                    >
                      <span className={cn(
                        "absolute inset-y-0 left-0 w-1",
                        preset.color
                      )} />
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Session Info */}
        {isSessionActive && (
          <div className="flex items-center justify-between pt-3 border-t text-sm">
            <span className="text-muted-foreground">Session en cours</span>
            <span className="font-mono font-medium">
              {formatTime(sessionDuration)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

SessionTimer.displayName = 'SessionTimer';

export default SessionTimer;
