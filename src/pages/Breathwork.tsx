import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause, RotateCcw, Settings, Heart, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale: number;
  cycles: number;
  benefits: string[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  emoji: string;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'Respiration Carrée',
    description: 'Technique utilisée par les Navy SEALs pour la gestion du stress',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    cycles: 8,
    benefits: ['Réduit le stress', 'Améliore la concentration', 'Calme le système nerveux'],
    difficulty: 'facile',
    emoji: '⬜',
  },
  {
    id: '478-breathing',
    name: 'Respiration 4-7-8',
    description: 'Technique de relaxation profonde pour favoriser le sommeil',
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfterExhale: 0,
    cycles: 4,
    benefits: ['Favorise le sommeil', 'Réduit l\'anxiété', 'Calme l\'esprit'],
    difficulty: 'moyen',
    emoji: '😴',
  },
  {
    id: 'coherence-cardiaque',
    name: 'Cohérence Cardiaque',
    description: 'Synchronisation de la respiration avec le rythme cardiaque',
    inhale: 5,
    hold: 0,
    exhale: 5,
    holdAfterExhale: 0,
    cycles: 18, // 3 minutes à 6 respirations/minute
    benefits: ['Équilibre le système nerveux', 'Améliore la variabilité cardiaque', 'Réduit la tension'],
    difficulty: 'facile',
    emoji: '💝',
  },
  {
    id: 'energizing-breath',
    name: 'Respiration Énergisante',
    description: 'Technique pour augmenter l\'énergie et la vitalité',
    inhale: 3,
    hold: 2,
    exhale: 3,
    holdAfterExhale: 1,
    cycles: 12,
    benefits: ['Augmente l\'énergie', 'Améliore l\'attention', 'Stimule le système nerveux'],
    difficulty: 'moyen',
    emoji: '⚡',
  },
  {
    id: 'triangle-breathing',
    name: 'Respiration Triangle',
    description: 'Respiration équilibrée sans rétention après expiration',
    inhale: 6,
    hold: 6,
    exhale: 6,
    holdAfterExhale: 0,
    cycles: 6,
    benefits: ['Équilibre émotionnel', 'Stabilise l\'humeur', 'Améliore la patience'],
    difficulty: 'difficile',
    emoji: '🔺',
  },
];

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale' | 'pause';

export const Breathwork: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(breathingExercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('pause');
  const [countdown, setCountdown] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Nettoyer les timers à la destruction du composant
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Gestion du cycle de respiration
  useEffect(() => {
    if (!isActive) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Passer à la phase suivante
          setCurrentPhase((currentPhase) => {
            const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale'];
            if (selectedExercise.holdAfterExhale > 0) {
              phases.push('holdAfterExhale');
            }
            
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            
            if (nextIndex === 0) {
              // Fin d'un cycle complet
              setCurrentCycle((cycle) => {
                const newCycle = cycle + 1;
                if (newCycle >= selectedExercise.cycles) {
                  // Fin de l'exercice
                  setIsActive(false);
                  setCurrentPhase('pause');
                  toast.success('Exercice terminé ! Félicitations ! 🎉');
                  playCompletionSound();
                  return 0;
                }
                return newCycle;
              });
            }
            
            return phases[nextIndex];
          });
          
          // Retourner la durée de la nouvelle phase
          return getPhasesDuration(getNextPhase());
        }
        return prev - 1;
      });
      
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, selectedExercise, currentPhase]);

  const getNextPhase = (): BreathingPhase => {
    const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale'];
    if (selectedExercise.holdAfterExhale > 0) {
      phases.push('holdAfterExhale');
    }
    
    const currentIndex = phases.indexOf(currentPhase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const getPhasesDuration = (phase: BreathingPhase): number => {
    switch (phase) {
      case 'inhale': return selectedExercise.inhale;
      case 'hold': return selectedExercise.hold;
      case 'exhale': return selectedExercise.exhale;
      case 'holdAfterExhale': return selectedExercise.holdAfterExhale;
      default: return 0;
    }
  };

  const getPhaseText = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'holdAfterExhale': return 'Pause';
      case 'pause': return 'Prêt à commencer';
      default: return '';
    }
  };

  const getPhaseColor = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale': return 'text-blue-500';
      case 'hold': return 'text-yellow-500';
      case 'exhale': return 'text-green-500';
      case 'holdAfterExhale': return 'text-purple-500';
      default: return 'text-muted-foreground';
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setCountdown(selectedExercise.inhale);
    setCurrentCycle(0);
    setTotalTime(0);
    toast.success('Exercice de respiration démarré !');
    playStartSound();
  };

  const pauseExercise = () => {
    setIsActive(false);
    toast.info('Exercice mis en pause');
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('pause');
    setCountdown(0);
    setCurrentCycle(0);
    setTotalTime(0);
    toast.info('Exercice réinitialisé');
  };

  const playStartSound = () => {
    // Son de démarrage simple avec Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(520, audioContextRef.current.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.3);
  };

  const playCompletionSound = () => {
    if (!audioContextRef.current) return;
    
    // Séquence de notes pour la fin
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current!.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContextRef.current!.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContextRef.current!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(audioContextRef.current!.currentTime + 0.4);
      }, index * 200);
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleScale = (): number => {
    const progress = countdown / getPhasesDuration(currentPhase);
    
    if (currentPhase === 'inhale') {
      return 1 + (1 - progress) * 0.5; // Grossit pendant l'inspiration
    } else if (currentPhase === 'exhale') {
      return 1.5 - (1 - progress) * 0.5; // Rétrécit pendant l'expiration
    }
    return 1.5; // Taille fixe pendant les pauses
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
            <p className="text-muted-foreground">
              Vous devez être connecté pour accéder aux exercices de respiration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Wind className="h-10 w-10 text-primary" />
            Exercices de Respiration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Techniques de respiration guidées pour la relaxation et le bien-être
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sélection d'exercices */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choisissez un exercice</CardTitle>
                  <CardDescription>
                    Sélectionnez la technique qui correspond à vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {breathingExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => {
                        setSelectedExercise(exercise);
                        resetExercise();
                      }}
                      className={cn(
                        "w-full p-4 rounded-lg text-left transition-all duration-300",
                        selectedExercise.id === exercise.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                      disabled={isActive}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{exercise.emoji}</span>
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className={cn(
                            "text-xs px-2 py-1 rounded-full inline-block mt-1",
                            exercise.difficulty === 'facile' ? "bg-green-500/20 text-green-700" :
                            exercise.difficulty === 'moyen' ? "bg-yellow-500/20 text-yellow-700" :
                            "bg-red-500/20 text-red-700"
                          )}>
                            {exercise.difficulty}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs opacity-80 mb-2">
                        {exercise.description}
                      </p>
                      <div className="text-xs opacity-70">
                        {exercise.inhale}-{exercise.hold}-{exercise.exhale}
                        {exercise.holdAfterExhale > 0 && `-${exercise.holdAfterExhale}`} 
                        × {exercise.cycles} cycles
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Bénéfices de l'exercice sélectionné */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Bénéfices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedExercise.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-green-500">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Zone d'exercice principale */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-3">
                    <span className="text-2xl">{selectedExercise.emoji}</span>
                    {selectedExercise.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedExercise.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center justify-center flex-1 space-y-8">
                  {/* Cercle de respiration animé */}
                  <div className="relative">
                    <div
                      className={cn(
                        "w-48 h-48 rounded-full border-4 transition-all duration-1000 ease-in-out flex items-center justify-center",
                        currentPhase === 'inhale' ? "border-blue-500 bg-blue-500/10" :
                        currentPhase === 'hold' ? "border-yellow-500 bg-yellow-500/10" :
                        currentPhase === 'exhale' ? "border-green-500 bg-green-500/10" :
                        currentPhase === 'holdAfterExhale' ? "border-purple-500 bg-purple-500/10" :
                        "border-muted bg-muted/10"
                      )}
                      style={{
                        transform: `scale(${isActive ? getCircleScale() : 1})`,
                      }}
                    >
                      {/* Compte à rebours au centre */}
                      <div className="text-center">
                        <div className={cn(
                          "text-6xl font-bold mb-2",
                          getPhaseColor(currentPhase)
                        )}>
                          {countdown || (isActive ? '0' : '●')}
                        </div>
                        <div className={cn(
                          "text-lg font-medium",
                          getPhaseColor(currentPhase)
                        )}>
                          {getPhaseText(currentPhase)}
                        </div>
                      </div>
                    </div>

                    {/* Indicateur de progression circulaire */}
                    <svg className="absolute top-0 left-0 w-48 h-48 -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="92"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="92"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className={getPhaseColor(currentPhase)}
                        strokeDasharray={`${2 * Math.PI * 92}`}
                        strokeDashoffset={`${2 * Math.PI * 92 * (countdown / getPhasesDuration(currentPhase))}`}
                        style={{
                          transition: 'stroke-dashoffset 1s linear',
                        }}
                      />
                    </svg>
                  </div>

                  {/* Informations de progression */}
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold">
                      Cycle {currentCycle + 1} / {selectedExercise.cycles}
                    </div>
                    <div className="text-muted-foreground">
                      Temps écoulé: {formatTime(totalTime)}
                    </div>
                  </div>

                  {/* Contrôles */}
                  <div className="flex items-center gap-4">
                    {!isActive ? (
                      <Button
                        onClick={startExercise}
                        size="lg"
                        className="px-8"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Commencer
                      </Button>
                    ) : (
                      <Button
                        onClick={pauseExercise}
                        variant="outline"
                        size="lg"
                        className="px-8"
                      >
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </Button>
                    )}

                    <Button
                      onClick={resetExercise}
                      variant="outline"
                      size="lg"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};