import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wind, Heart, Timer, Play, Pause, RotateCcw,
  Sparkles, Target, Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  benefits: string[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
}

const breathingExercises: BreathingExercise[] = [
  {
    id: '4-7-8',
    name: 'Respiration 4-7-8',
    description: 'Technique de relaxation profonde pour réduire le stress',
    duration: 240,
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    cycles: 8,
    benefits: ['Réduit l\'anxiété', 'Améliore le sommeil', 'Calme le système nerveux'],
    difficulty: 'Débutant'
  },
  {
    id: 'box-breathing',
    name: 'Respiration Carrée',
    description: 'Technique militaire pour la concentration et le calme',
    duration: 320,
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 10,
    benefits: ['Améliore la concentration', 'Réduit le stress', 'Équilibre le système nerveux'],
    difficulty: 'Intermédiaire'
  },
  {
    id: 'coherence-cardiac',
    name: 'Cohérence Cardiaque',
    description: 'Synchronisation cœur-cerveau pour l\'équilibre émotionnel',
    duration: 300,
    inhaleTime: 5,
    holdTime: 0,
    exhaleTime: 5,
    cycles: 30,
    benefits: ['Équilibre émotionnel', 'Améliore la variabilité cardiaque', 'Réduit l\'inflammation'],
    difficulty: 'Débutant'
  }
];

const BreathworkPage: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && selectedExercise) {
      interval = setInterval(() => {
        setPhaseTimer((prev) => {
          const newTime = prev + 1;
          const currentPhaseTime = getCurrentPhaseTime();
          
          if (newTime >= currentPhaseTime) {
            moveToNextPhase();
            return 0;
          }
          
          updateProgress(newTime, currentPhaseTime);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, selectedExercise]);

  const getCurrentPhaseTime = () => {
    if (!selectedExercise) return 0;
    switch (currentPhase) {
      case 'inhale': return selectedExercise.inhaleTime;
      case 'hold': return selectedExercise.holdTime;
      case 'exhale': return selectedExercise.exhaleTime;
      default: return 0;
    }
  };

  const moveToNextPhase = () => {
    if (!selectedExercise) return;

    if (currentPhase === 'inhale') {
      if (selectedExercise.holdTime > 0) {
        setCurrentPhase('hold');
      } else {
        setCurrentPhase('exhale');
      }
    } else if (currentPhase === 'hold') {
      setCurrentPhase('exhale');
    } else if (currentPhase === 'exhale') {
      const newCycle = currentCycle + 1;
      if (newCycle >= selectedExercise.cycles) {
        completeExercise();
        return;
      }
      setCurrentCycle(newCycle);
      setCurrentPhase('inhale');
    }
  };

  const updateProgress = (currentTime: number, phaseTime: number) => {
    if (!selectedExercise) return;
    
    const cycleProgress = (currentCycle / selectedExercise.cycles) * 100;
    const phaseProgress = (currentTime / phaseTime) * (100 / selectedExercise.cycles);
    setProgress(Math.min(cycleProgress + phaseProgress, 100));
  };

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setCurrentPhase('inhale');
    setPhaseTimer(0);
    setCurrentCycle(0);
    setProgress(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resumeExercise = () => {
    setIsActive(true);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setPhaseTimer(0);
    setCurrentCycle(0);
    setProgress(0);
  };

  const completeExercise = () => {
    setIsActive(false);
    setProgress(100);
    toast({
      title: "Exercice terminé !",
      description: "Félicitations, vous avez complété votre séance de respiration.",
    });
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-500';
      case 'Intermédiaire': return 'bg-yellow-500';
      case 'Avancé': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (selectedExercise) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{selectedExercise.name}</h1>
            <p className="text-muted-foreground">{selectedExercise.description}</p>
          </div>

          <div className="w-64 h-64 mx-auto relative">
            <div className="w-full h-full rounded-full border-4 border-primary/20 flex items-center justify-center relative overflow-hidden">
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  currentPhase === 'inhale' ? 'bg-blue-500/20 scale-110' :
                  currentPhase === 'hold' ? 'bg-purple-500/20 scale-105' :
                  'bg-green-500/20 scale-90'
                }`}
              />
              <div className="relative z-10 text-center space-y-2">
                <div className="text-4xl font-bold text-foreground">
                  {getCurrentPhaseTime() - phaseTimer}
                </div>
                <div className="text-lg font-medium text-muted-foreground">
                  {getPhaseInstruction()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cycle {currentCycle + 1}/{selectedExercise.cycles}
                </div>
              </div>
            </div>
          </div>

          <Progress value={progress} className="w-full max-w-md mx-auto" />

          <div className="flex justify-center gap-4">
            {!isActive ? (
              <Button onClick={resumeExercise} size="lg">
                <Play className="w-5 h-5 mr-2" />
                {progress === 0 ? 'Commencer' : 'Reprendre'}
              </Button>
            ) : (
              <Button onClick={pauseExercise} variant="outline" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetExercise} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={() => setSelectedExercise(null)} 
              variant="ghost" 
              size="lg"
            >
              Retour
            </Button>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Bienfaits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedExercise.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Exercices de Respiration
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez des techniques de respiration guidées pour réduire le stress, 
          améliorer votre concentration et équilibrer vos émotions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breathingExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-primary" />
                    {exercise.name}
                  </CardTitle>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <CardDescription className="text-sm">
                {exercise.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <span>{Math.floor(exercise.duration / 60)} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>{exercise.cycles} cycles</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Bienfaits :</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {exercise.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>

              <Button 
                onClick={() => startExercise(exercise)}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Conseils pour une pratique optimale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-left">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Préparation :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Trouvez un endroit calme</li>
                  <li>• Adoptez une posture confortable</li>
                  <li>• Détendez vos épaules</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pendant l'exercice :</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Respirez par le nez</li>
                  <li>• Restez concentré sur votre souffle</li>
                  <li>• N'forcez pas le rythme</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BreathworkPage;