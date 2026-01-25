import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Pause, Play, Square, ArrowLeft } from 'lucide-react';

interface GritChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'novice' | 'warrior' | 'master' | 'legend';
  duration: number;
  xpReward: number;
}

interface ActiveSessionProps {
  challenge: GritChallenge | null;
  onComplete: (score: number, insights?: string[]) => void;
  onBack: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ 
  challenge, 
  onComplete, 
  onBack 
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [insights, setInsights] = useState('');
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.duration * 60); // Convert to seconds
      setCurrentScore(0);
      setInsights('');
    }
  }, [challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            // Auto complete when time is up
            handleComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startSession = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseSession = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeSession = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const stopSession = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
  };

  const handleComplete = () => {
    const completionPercentage = challenge ? 
      ((challenge.duration * 60 - timeLeft) / (challenge.duration * 60)) * 100 : 0;
    
    const score = Math.min(100, Math.max(0, completionPercentage + currentScore));
    const insightsList = insights ? insights.split('\n').filter(i => i.trim()) : [];
    
    onComplete(score, insightsList);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = challenge ? 
    ((challenge.duration * 60 - timeLeft) / (challenge.duration * 60)) * 100 : 0;

  if (!challenge) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Aucun défi sélectionné
          </p>
          <Button onClick={onBack}>
            Retour aux défis
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux défis
      </Button>

      <Card className="bg-gradient-to-br from-primary/10 to-secondary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{challenge.title}</CardTitle>
            <Badge variant="secondary">{challenge.difficulty}</Badge>
          </div>
          <p className="text-muted-foreground">{challenge.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer Display */}
          <motion.div 
            className="text-center"
            animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          >
            <div className="text-6xl font-mono font-bold text-primary mb-2">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progressPercentage} className="h-3 mb-4" />
          </motion.div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isRunning && !isPaused && (
              <Button 
                onClick={startSession} 
                size="lg"
                className="flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Commencer
              </Button>
            )}
            
            {isRunning && (
              <Button 
                onClick={pauseSession} 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Pause className="h-5 w-5" />
                Pause
              </Button>
            )}
            
            {isPaused && (
              <Button 
                onClick={resumeSession} 
                size="lg"
                className="flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Reprendre
              </Button>
            )}
            
            {(isRunning || isPaused) && (
              <Button 
                onClick={stopSession} 
                variant="destructive" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Square className="h-5 w-5" />
                Arrêter
              </Button>
            )}
          </div>

          {/* Session Progress */}
          {(isRunning || isPaused || timeLeft === 0) && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progression</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {challenge.xpReward}
                    </div>
                    <div className="text-sm text-muted-foreground">XP Potentiel</div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Réflexions et apprentissages (optionnel)
                </label>
                <Textarea 
                  value={insights}
                  onChange={(e) => setInsights(e.target.value)}
                  placeholder="Notez vos réflexions, difficultés rencontrées, ou apprentissages..."
                  rows={3}
                />
              </div>

              {/* Complete Button */}
              {timeLeft === 0 || (isRunning && progressPercentage > 50) ? (
                <Button 
                  onClick={handleComplete} 
                  size="lg" 
                  className="w-full"
                >
                  Terminer le défi
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveSession;