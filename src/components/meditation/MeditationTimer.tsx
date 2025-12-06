
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

const MeditationTimer: React.FC = () => {
  const [duration, setDuration] = useState(10); // en minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // en secondes
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const presetDurations = [5, 10, 15, 20, 25, 30, 45, 60];

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsFinished(false);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsFinished(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsFinished(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = duration * 60;
    const elapsed = totalSeconds - timeLeft;
    return (elapsed / totalSeconds) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Minuteur de Méditation
            {isFinished && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Bell className="h-3 w-3 mr-1" />
                Terminé !
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sélection de la durée */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Durée de méditation</label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {presetDurations.map((minutes) => (
                  <Button
                    key={minutes}
                    variant={duration === minutes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration(minutes)}
                    disabled={isActive}
                    className="text-xs"
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>
            </div>

            {/* Minuteur principal */}
            <div className="text-center space-y-6">
              <div className="relative w-64 h-64 mx-auto">
                {/* Cercle de progression */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-muted-foreground/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                    className="text-primary transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Temps affiché */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isActive ? 'En cours...' : isFinished ? 'Terminé !' : 'Prêt à commencer'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="min-w-[120px]"
                  variant={isActive ? "secondary" : "default"}
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      {timeLeft === duration * 60 ? 'Commencer' : 'Reprendre'}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Indicateurs d'état */}
              <div className="flex justify-center gap-2">
                {isActive && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Méditation active
                  </Badge>
                )}
                {!isActive && timeLeft > 0 && timeLeft < duration * 60 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    En pause
                  </Badge>
                )}
                {isFinished && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Session terminée
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationTimer;
