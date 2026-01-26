/**
 * Timer pour les quêtes Ambition Arcade
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useCompleteQuest } from '../hooks';

interface QuestTimerProps {
  questId: string;
  questTitle: string;
  estimatedMinutes: number;
  onComplete?: () => void;
  compact?: boolean;
}

export const QuestTimer: React.FC<QuestTimerProps> = ({
  questId,
  questTitle,
  estimatedMinutes,
  onComplete,
  compact = false
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const completeQuest = useCompleteQuest();

  const targetSeconds = estimatedMinutes * 60;
  const progressPercent = Math.min((elapsedSeconds / targetSeconds) * 100, 100);
  const isOvertime = elapsedSeconds > targetSeconds;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleToggle = () => {
    if (!isRunning && elapsedSeconds === 0) {
      // Starting fresh
      setIsRunning(true);
    } else if (isRunning) {
      setIsRunning(false);
      setShowComplete(true);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setShowComplete(false);
  };

  const handleComplete = async () => {
    await completeQuest.mutateAsync({
      questId,
      notes: `Temps: ${formatTime(elapsedSeconds)} (estimé: ${estimatedMinutes}min)`
    });
    onComplete?.();
    handleReset();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={isRunning ? 'default' : isOvertime ? 'destructive' : 'secondary'}
          className="font-mono"
        >
          {formatTime(elapsedSeconds)}
        </Badge>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6" 
          onClick={handleToggle}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
      </div>
    );
  }

  return (
    <Card className={`border-2 transition-colors ${
      isRunning ? 'border-primary bg-primary/5' : 
      isOvertime ? 'border-destructive bg-destructive/5' : 
      'border-muted'
    }`}>
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          {/* Title */}
          <p className="text-sm text-muted-foreground truncate">{questTitle}</p>
          
          {/* Timer Display */}
          <motion.div
            key={elapsedSeconds}
            initial={{ scale: 1 }}
            animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
            className="relative"
          >
            <div className={`text-4xl font-mono font-bold ${
              isOvertime ? 'text-destructive' : isRunning ? 'text-primary' : ''
            }`}>
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-xs text-muted-foreground">
              / {formatTime(targetSeconds)}
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 ${
                isOvertime ? 'bg-destructive' : 'bg-primary'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={isRunning ? 'secondary' : 'default'}
              size="sm"
              onClick={handleToggle}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {elapsedSeconds > 0 ? 'Reprendre' : 'Démarrer'}
                </>
              )}
            </Button>

            {elapsedSeconds > 0 && (
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Complete Button */}
          <AnimatePresence>
            {showComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Button
                  className="w-full gap-2"
                  onClick={handleComplete}
                  disabled={completeQuest.isPending}
                >
                  <CheckCircle className="w-4 h-4" />
                  Marquer comme terminée
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestTimer;
