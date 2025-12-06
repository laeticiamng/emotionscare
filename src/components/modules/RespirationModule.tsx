// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Wind, Play, Pause, RotateCcw, Settings, 
  Timer, Heart, Zap, Leaf, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  benefits: string[];
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'basic',
    name: '4-4-4 Basique',
    description: 'Respiration équilibrée pour débutants',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 10,
    icon: Wind,
    color: 'bg-blue-500',
    benefits: ['Réduction du stress', 'Calme mental', 'Équilibre']
  },
  {
    id: 'calming',
    name: '4-7-8 Calmant',
    description: 'Technique pour l\'endormissement et la relaxation',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 8,
    icon: Moon,
    color: 'bg-indigo-500',
    benefits: ['Améliore le sommeil', 'Réduit l\'anxiété', 'Relaxation profonde']
  },
  {
    id: 'energizing',
    name: '6-2-6 Énergisant',
    description: 'Boost d\'énergie naturel',
    inhale: 6,
    hold: 2,
    exhale: 6,
    cycles: 12,
    icon: Zap,
    color: 'bg-orange-500',
    benefits: ['Augmente l\'énergie', 'Améliore la concentration', 'Revitalise']
  },
  {
    id: 'coherence',
    name: '5-5 Cohérence',
    description: 'Cohérence cardiaque pour l\'équilibre',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 15,
    icon: Heart,
    color: 'bg-pink-500',
    benefits: ['Équilibre du système nerveux', 'Régule le rythme cardiaque', 'Gestion du stress']
  },
  {
    id: 'meditation',
    name: '8-4-8 Méditation',
    description: 'Respiration profonde pour méditer',
    inhale: 8,
    hold: 4,
    exhale: 8,
    cycles: 12,
    icon: Leaf,
    color: 'bg-green-500',
    benefits: ['Méditation profonde', 'Paix intérieure', 'Clarté mentale']
  }
];

type SessionPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export const RespirationModule: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('inhale');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [customPattern, setCustomPattern] = useState({ inhale: 4, hold: 4, exhale: 4, cycles: 10 });
  const [showSettings, setShowSettings] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const startSession = useCallback(() => {
    setIsActive(true);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setSessionProgress(0);
    startTimeRef.current = Date.now();
    
    toast.info(`Session ${selectedPattern.name} démarrée`);
  }, [selectedPattern]);

  const pauseSession = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetSession = useCallback(() => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setSessionProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const completeSession = useCallback(() => {
    setIsActive(false);
    setTotalSessions(prev => prev + 1);
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    toast.success(`Session terminée ! Durée: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`);
    resetSession();
  }, [resetSession]);

  // Logique de respiration
  useEffect(() => {
    if (!isActive) return;

    const pattern = selectedPattern;
    const phaseDurations = {
      inhale: pattern.inhale,
      hold: pattern.hold,
      exhale: pattern.exhale,
      rest: 1
    };

    intervalRef.current = setInterval(() => {
      setPhaseProgress(prev => {
        const increment = 100 / (phaseDurations[currentPhase] * 10); // 100ms intervals
        const newProgress = prev + increment;

        if (newProgress >= 100) {
          // Phase terminée, passer à la suivante
          setCurrentPhase(prevPhase => {
            let nextPhase: SessionPhase;
            
            switch (prevPhase) {
              case 'inhale':
                nextPhase = pattern.hold > 0 ? 'hold' : 'exhale';
                break;
              case 'hold':
                nextPhase = 'exhale';
                break;
              case 'exhale':
                setCurrentCycle(prevCycle => {
                  const newCycle = prevCycle + 1;
                  if (newCycle >= pattern.cycles) {
                    completeSession();
                    return prevCycle;
                  }
                  setSessionProgress((newCycle / pattern.cycles) * 100);
                  return newCycle;
                });
                nextPhase = 'rest';
                break;
              case 'rest':
                nextPhase = 'inhale';
                break;
              default:
                nextPhase = 'inhale';
            }
            
            return nextPhase;
          });
          return 0;
        }
        
        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedPattern, completeSession]);

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'rest': return 'Pause';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-600';
      case 'hold': return 'text-purple-600';
      case 'exhale': return 'text-green-600';
      case 'rest': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getBreathingCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 1 + (phaseProgress / 100) * 0.5;
      case 'hold': return 1.5;
      case 'exhale': return 1.5 - (phaseProgress / 100) * 0.5;
      case 'rest': return 1;
      default: return 1;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Wind className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Respiration Guidée</h1>
          <p className="text-muted-foreground">
            Exercices de respiration pour gérer le stress et améliorer votre bien-être
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interface principale */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedPattern.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cercle de respiration */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Cercle extérieur */}
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                  
                  {/* Cercle de respiration */}
                  <motion.div
                    className={`w-48 h-48 rounded-full ${selectedPattern.color} opacity-30`}
                    animate={{ 
                      scale: isActive ? getBreathingCircleScale() : 1
                    }}
                    transition={{ 
                      duration: isActive ? 0.1 : 1,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Contenu central */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <selectedPattern.icon className="h-12 w-12 mb-2 text-primary" />
                    <p className={`text-2xl font-bold ${getPhaseColor()}`}>
                      {isActive ? getPhaseText() : 'Prêt'}
                    </p>
                    {isActive && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Cycle {currentCycle + 1} / {selectedPattern.cycles}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bars */}
                {isActive && (
                  <div className="w-full max-w-md space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Phase actuelle</span>
                        <span>{Math.round(phaseProgress)}%</span>
                      </div>
                      <Progress value={phaseProgress} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression totale</span>
                        <span>{Math.round(sessionProgress)}%</span>
                      </div>
                      <Progress value={sessionProgress} className="h-2" />
                    </div>
                  </div>
                )}

                {/* Contrôles */}
                <div className="flex gap-3">
                  {!isActive ? (
                    <Button onClick={startSession} size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Commencer
                    </Button>
                  ) : (
                    <Button onClick={pauseSession} size="lg" variant="outline">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={resetSession} size="lg" variant="outline">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Réinitialiser
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPattern.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div>Inspiration: <strong>{selectedPattern.inhale}s</strong></div>
                  {selectedPattern.hold > 0 && (
                    <div>Rétention: <strong>{selectedPattern.hold}s</strong></div>
                  )}
                  <div>Expiration: <strong>{selectedPattern.exhale}s</strong></div>
                  <div>Cycles: <strong>{selectedPattern.cycles}</strong></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau de droite */}
        <div className="space-y-4">
          {/* Sélection de pattern */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {breathingPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPattern.id === pattern.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => !isActive && setSelectedPattern(pattern)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded ${pattern.color} flex items-center justify-center`}>
                      <pattern.icon className="h-3 w-3 text-white" />
                    </div>
                    <h4 className="font-medium text-sm">{pattern.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Bénéfices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bénéfices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedPattern.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded bg-primary" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sessions totales:</span>
                <Badge variant="secondary">{totalSessions}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pattern favori:</span>
                <Badge variant="outline">{selectedPattern.name}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Statut:</span>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? 'En cours' : 'Prêt'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Durée estimée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.ceil((selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale + 1) * selectedPattern.cycles / 60)} min
                </div>
                <div className="text-sm text-muted-foreground">
                  {(selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale + 1) * selectedPattern.cycles} secondes
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};