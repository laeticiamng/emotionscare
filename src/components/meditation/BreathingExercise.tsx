
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Waves, Heart, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  cycles: number;
  benefits: string[];
  icon: React.ReactNode;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: '478',
    name: 'Respiration 4-7-8',
    description: 'Technique relaxante pour réduire le stress et favoriser le sommeil',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    cycles: 8,
    benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Calme mental'],
    icon: <Heart className="h-5 w-5" />
  },
  {
    id: 'box',
    name: 'Respiration Carrée',
    description: 'Technique équilibrée pour la concentration et la stabilité',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    cycles: 10,
    benefits: ['Concentration', 'Équilibre', 'Stabilité émotionnelle'],
    icon: <Brain className="h-5 w-5" />
  },
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    description: 'Synchronisation du rythme cardiaque pour un bien-être optimal',
    inhale: 5,
    hold: 0,
    exhale: 5,
    pause: 0,
    cycles: 12,
    benefits: ['Régulation cardiaque', 'Réduction de l\'anxiété', 'Bien-être'],
    icon: <Waves className="h-5 w-5" />
  }
];

const BreathingExercise: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(selectedPattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = [
    { name: 'inhale', duration: selectedPattern.inhale, label: 'Inspirez', color: 'from-blue-400 to-cyan-400' },
    { name: 'hold', duration: selectedPattern.hold, label: 'Retenez', color: 'from-purple-400 to-pink-400' },
    { name: 'exhale', duration: selectedPattern.exhale, label: 'Expirez', color: 'from-green-400 to-emerald-400' },
    { name: 'pause', duration: selectedPattern.pause, label: 'Pause', color: 'from-gray-400 to-slate-400' }
  ].filter(phase => phase.duration > 0);

  const currentPhaseIndex = phases.findIndex(phase => phase.name === currentPhase);
  const currentPhaseData = phases[currentPhaseIndex];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Passer à la phase suivante
            const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
            const nextPhase = phases[nextPhaseIndex];
            
            if (nextPhaseIndex === 0) {
              // Nouveau cycle
              if (currentCycle >= selectedPattern.cycles) {
                setIsActive(false);
                return 0;
              } else {
                setCurrentCycle(c => c + 1);
              }
            }
            
            setCurrentPhase(nextPhase.name as any);
            return nextPhase.duration;
          }
          return prev - 1;
        });
        setTotalTime(t => t + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhaseIndex, phases, currentCycle, selectedPattern.cycles]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setCurrentCycle(1);
    setTotalTime(0);
  };

  const handlePatternChange = (patternId: string) => {
    const pattern = breathingPatterns.find(p => p.id === patternId);
    if (pattern) {
      setSelectedPattern(pattern);
      handleReset();
    }
  };

  const progress = currentPhaseData ? ((currentPhaseData.duration - timeLeft) / currentPhaseData.duration) * 100 : 0;
  const circleScale = currentPhase === 'inhale' ? 1.2 : currentPhase === 'exhale' ? 0.8 : 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sélection du pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Techniques de Respiration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedPattern.id} onValueChange={handlePatternChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {breathingPatterns.map(pattern => (
                <SelectItem key={pattern.id} value={pattern.id}>
                  <div className="flex items-center gap-2">
                    {pattern.icon}
                    {pattern.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-3">
            <h4 className="font-medium">{selectedPattern.name}</h4>
            <p className="text-sm text-muted-foreground">{selectedPattern.description}</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Inspiration: {selectedPattern.inhale}s</div>
              {selectedPattern.hold > 0 && <div>Rétention: {selectedPattern.hold}s</div>}
              <div>Expiration: {selectedPattern.exhale}s</div>
              {selectedPattern.pause > 0 && <div>Pause: {selectedPattern.pause}s</div>}
            </div>

            <div className="flex flex-wrap gap-1">
              {selectedPattern.benefits.map(benefit => (
                <Badge key={benefit} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualisation de l'exercice */}
      <Card>
        <CardHeader>
          <CardTitle>Exercice en Cours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cercle de respiration animé */}
          <div className="relative flex items-center justify-center h-64">
            <motion.div
              className={`w-48 h-48 rounded-full bg-gradient-to-br ${currentPhaseData?.color || 'from-blue-400 to-cyan-400'} opacity-20`}
              animate={{ scale: circleScale }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <motion.div
              className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${currentPhaseData?.color || 'from-blue-400 to-cyan-400'} opacity-60`}
              animate={{ scale: circleScale }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <div className="absolute text-center">
              <div className="text-2xl font-bold">{timeLeft}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {currentPhaseData?.label || 'Prêt'}
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cycle {currentCycle} / {selectedPattern.cycles}</span>
              <span>{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${currentPhaseData?.color || 'from-blue-400 to-cyan-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <Button onClick={handleStart} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Commencer
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExercise;
