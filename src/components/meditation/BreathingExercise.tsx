
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "4-7-8 (Relaxation)",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Excellent pour réduire l'anxiété et favoriser l'endormissement"
  },
  {
    name: "Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: "Technique utilisée par les forces spéciales pour la concentration"
  },
  {
    name: "Triangle Breathing",
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: "Simple et efficace pour débutants"
  }
];

const BreathingExercise: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev + 1;
          
          if (phase === 'inhale' && newTimer >= selectedPattern.inhale) {
            setPhase('hold');
            return 0;
          } else if (phase === 'hold' && newTimer >= selectedPattern.hold) {
            setPhase('exhale');
            return 0;
          } else if (phase === 'exhale' && newTimer >= selectedPattern.exhale) {
            setPhase('inhale');
            setCycle(c => c + 1);
            return 0;
          }
          
          return newTimer;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, selectedPattern]);

  const toggleExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(0);
    setCycle(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      default: return '';
    }
  };

  const getCurrentDuration = () => {
    switch (phase) {
      case 'inhale': return selectedPattern.inhale;
      case 'hold': return selectedPattern.hold;
      case 'exhale': return selectedPattern.exhale;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Exercices de Respiration
            <Badge variant="secondary">{cycle} cycles</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Sélection du pattern */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {breathingPatterns.map((pattern) => (
                <Card
                  key={pattern.name}
                  className={`cursor-pointer transition-colors ${
                    selectedPattern.name === pattern.name
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPattern(pattern)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{pattern.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pattern.description}
                    </p>
                    <div className="text-xs text-primary">
                      {pattern.inhale}s - {pattern.hold}s - {pattern.exhale}s
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Visualisation de l'exercice */}
            <div className="text-center space-y-6">
              <div className="relative w-48 h-48 mx-auto">
                <div 
                  className={`w-full h-full rounded-full border-4 transition-all duration-1000 ${
                    phase === 'inhale' ? 'border-blue-500 scale-110' :
                    phase === 'hold' ? 'border-yellow-500 scale-110' :
                    'border-green-500 scale-90'
                  }`}
                  style={{
                    background: `conic-gradient(from 0deg, ${
                      phase === 'inhale' ? '#3b82f6' :
                      phase === 'hold' ? '#eab308' : '#22c55e'
                    } ${(timer / getCurrentDuration()) * 360}deg, transparent 0deg)`
                  }}
                />
                <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{getPhaseText()}</div>
                    <div className="text-lg text-muted-foreground">
                      {getCurrentDuration() - timer}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleExercise}
                  variant={isActive ? "secondary" : "default"}
                  size="lg"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Commencer'}
                </Button>
                
                <Button
                  onClick={resetExercise}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExercise;
