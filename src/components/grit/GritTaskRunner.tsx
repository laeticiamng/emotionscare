// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Flag, AlertCircle } from 'lucide-react';
import { useGritQuest } from '@/hooks/useGritQuest';
import { useHumeFaces } from '@/hooks/useHumeFaces';
import { logger } from '@/lib/logger';

interface GritQuest {
  quest_id: string;
  title: string;
  est_minutes: number;
  copy: string;
}

interface GritTaskRunnerProps {
  quest: GritQuest;
  onComplete: (success: boolean) => void;
  onBack: () => void;
  humeFacesEnabled?: boolean;
}

export const GritTaskRunner: React.FC<GritTaskRunnerProps> = ({
  quest,
  onComplete,
  onBack,
  humeFacesEnabled = false
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  
  const {
    status,
    pauseCount,
    pauseQuest,
    resumeQuest,
    abortQuest,
    updateElapsedTime,
    setHumeSummary
  } = useGritQuest();

  const humeConfig = {
    enabled: humeFacesEnabled,
    frameRate: 1,
    onEmotionDetected: (emotion: string, confidence: number) => {
      logger.debug('Emotion detected', { emotion, confidence }, 'UI');
    },
    onSummaryUpdate: (summary) => {
      setHumeSummary(summary);
    }
  };

  const {
    isActive: humeActive,
    error: humeError,
    currentEmotion,
    startCapture: startHume,
    stopCapture: stopHume,
    videoRef,
    canvasRef
  } = useHumeFaces(humeConfig);

  const totalDurationMs = quest.est_minutes * 60 * 1000;
  const progressPercentage = Math.min((currentTime / totalDurationMs) * 100, 100);
  const remainingMs = Math.max(totalDurationMs - currentTime, 0);
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

  // Timer logic
  useEffect(() => {
    if (status === 'active') {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current - pauseTimeRef.current;
        setCurrentTime(elapsed);
        updateElapsedTime(elapsed);
        
        // Auto-complete when time is up
        if (elapsed >= totalDurationMs) {
          handleComplete(true);
        }
      }, 100);
    } else if (status === 'paused') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, totalDurationMs, updateElapsedTime]);

  // Start Hume when task starts
  useEffect(() => {
    if (status === 'active' && humeFacesEnabled && !humeActive) {
      startHume();
    } else if (status !== 'active' && humeActive) {
      stopHume();
    }
  }, [status, humeFacesEnabled, humeActive, startHume, stopHume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (humeActive) {
        stopHume();
      }
    };
  }, [humeActive, stopHume]);

  const handlePause = () => {
    if (pauseCount >= 1) {
      setShowAlert(true);
      return;
    }
    
    pauseQuest();
    
    // Record pause time for accurate timing
    const now = Date.now();
    pauseTimeRef.current += now - (startTimeRef.current + currentTime);
  };

  const handleResume = () => {
    resumeQuest();
    
    // Reset start time accounting for pause
    startTimeRef.current = Date.now() - currentTime;
  };

  const handleAbort = () => {
    abortQuest('user_stopped');
    if (humeActive) {
      stopHume();
    }
    onBack();
  };

  const handleComplete = (success: boolean) => {
    if (humeActive) {
      stopHume();
    }
    onComplete(success);
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (status === 'idle') {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Prêt à commencer ?</p>
          <Button onClick={onBack} variant="outline" className="mt-4">
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden video/canvas for Hume */}
      {humeFacesEnabled && (
        <div className="hidden">
          <video ref={videoRef} autoPlay muted playsInline />
          <canvas ref={canvasRef} />
        </div>
      )}

      {/* Main Timer Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
        
        <CardHeader className="relative text-center">
          <CardTitle className="text-2xl">{quest.title}</CardTitle>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status === 'active' ? 'En cours' : 'En pause'}
            </Badge>
            {pauseCount > 0 && (
              <Badge variant="outline">
                {pauseCount}/1 pause utilisée
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Circular Progress */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  className="text-primary"
                  initial={{ strokeDasharray: '0 339' }}
                  animate={{
                    strokeDasharray: `${(progressPercentage / 100) * 339} 339`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              
              {/* Time display in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {formatTime(remainingMinutes, remainingSeconds)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    restant
                  </div>
                </div>
              </div>
            </div>

            {/* Emotion indicator */}
            {currentEmotion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Badge variant="outline" className="text-xs">
                  Émotion: {currentEmotion}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            {status === 'active' ? (
              <Button
                onClick={handlePause}
                variant="outline"
                size="lg"
                className="h-12 px-6"
                disabled={pauseCount >= 1}
                aria-label="Mettre en pause"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause {pauseCount >= 1 && '(indisponible)'}
              </Button>
            ) : (
              <Button
                onClick={handleResume}
                size="lg"
                className="h-12 px-6"
                aria-label="Reprendre"
              >
                <Play className="h-5 w-5 mr-2" />
                Reprendre
              </Button>
            )}

            <Button
              onClick={() => handleComplete(true)}
              variant="default"
              size="lg"
              className="h-12 px-6 bg-green-600 hover:bg-green-700"
              aria-label="Terminer le défi"
            >
              <Flag className="h-5 w-5 mr-2" />
              Terminer
            </Button>

            <Button
              onClick={handleAbort}
              variant="destructive"
              size="lg"
              className="h-12 px-6"
              aria-label="Abandonner le défi"
            >
              <Square className="h-5 w-5 mr-2" />
              Abandonner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hume Error Alert */}
      {humeError && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{humeError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pause limit alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAlert(false)}
          >
            <Card className="max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-lg">Limite de pause atteinte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vous avez déjà utilisé votre pause. Continuez jusqu'au bout pour développer votre persévérance !
                </p>
                <Button
                  onClick={() => setShowAlert(false)}
                  className="w-full"
                >
                  Continuer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GritTaskRunner;