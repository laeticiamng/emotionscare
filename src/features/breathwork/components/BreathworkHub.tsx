import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw,
  Waves,
  Heart,
  Timer,
  Target,
  TrendingUp
} from 'lucide-react';
import { useNavAction } from '@/hooks/useNavAction';

export function BreathworkHub() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const navAction = useNavAction();

  const breathworkExercises = [
    {
      id: 'box-breathing',
      title: 'Respiration Carrée',
      description: 'Technique 4-4-4-4 pour la relaxation profonde',
      duration: 10,
      difficulty: 'Débutant',
      benefits: ['Réduction stress', 'Concentration'],
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 }
    },
    {
      id: '478-breathing',
      title: 'Respiration 4-7-8',
      description: 'Technique pour l\'endormissement rapide',
      duration: 5,
      difficulty: 'Intermédiaire',
      benefits: ['Sommeil', 'Anxiété'],
      pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 }
    },
    {
      id: 'wim-hof',
      title: 'Méthode Wim Hof',
      description: 'Respiration énergisante et revitalisante',
      duration: 15,
      difficulty: 'Avancé',
      benefits: ['Énergie', 'Immunité'],
      pattern: { inhale: 2, hold: 0, exhale: 1, pause: 0 }
    },
    {
      id: 'coherence-cardiaque',
      title: 'Cohérence Cardiaque',
      description: 'Technique 5-5 pour l\'équilibre émotionnel',
      duration: 5,
      difficulty: 'Débutant',
      benefits: ['Équilibre', 'Focus'],
      pattern: { inhale: 5, hold: 0, exhale: 5, pause: 0 }
    }
  ];

  const currentExercise = breathworkExercises.find(ex => ex.id === activeExercise);

  const handleStart = (exerciseId: string) => {
    setActiveExercise(exerciseId);
    setIsRunning(true);
    setCycleCount(0);
    setProgress(0);
    setCurrentPhase('inhale');
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setActiveExercise(null);
    setIsRunning(false);
    setCycleCount(0);
    setProgress(0);
  };

  // Simulation du cycle respiratoire
  useEffect(() => {
    if (!isRunning || !currentExercise) return;

    const totalCycleTime = Object.values(currentExercise.pattern).reduce((a, b) => a + b, 0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCycleCount(count => count + 1);
          return 0;
        }
        return prev + (100 / (totalCycleTime * 10)); // 100ms intervals
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, currentExercise]);

  const getPhaseInstruction = () => {
    if (!currentExercise) return '';
    
    switch (currentPhase) {
      case 'inhale': return `Inspirez (${currentExercise.pattern.inhale}s)`;
      case 'hold': return `Retenez (${currentExercise.pattern.hold}s)`;
      case 'exhale': return `Expirez (${currentExercise.pattern.exhale}s)`;
      case 'pause': return `Pause (${currentExercise.pattern.pause}s)`;
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wind className="h-8 w-8 text-primary" />
            Respiration Guidée
          </h1>
          <p className="text-muted-foreground">
            Techniques de respiration pour votre bien-être
          </p>
        </div>
        {isRunning && (
          <Badge variant="secondary" className="px-3 py-2">
            <Waves className="w-4 h-4 mr-2" />
            En cours - Cycle {cycleCount + 1}
          </Badge>
        )}
      </div>

      {/* Active Exercise */}
      {activeExercise && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{currentExercise?.title}</h3>
                <p className="text-lg text-muted-foreground">{getPhaseInstruction()}</p>
              </div>

              {/* Breathing Circle */}
              <div className="relative w-48 h-48 mx-auto">
                <div 
                  className={`w-full h-full rounded-full border-4 border-primary transition-all duration-1000 ${
                    currentPhase === 'inhale' ? 'scale-125' : 'scale-75'
                  } ${isRunning ? 'animate-pulse' : ''}`}
                  style={{
                    background: `conic-gradient(from 0deg, hsl(var(--primary)) ${progress}%, transparent ${progress}%)`
                  }}
                >
                  <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center">
                    <Wind className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Cycle {cycleCount} / {Math.ceil((currentExercise?.duration || 0) * 60 / Object.values(currentExercise?.pattern || {}).reduce((a, b) => a + b, 0))}</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={handlePause}
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? 'Pause' : 'Reprendre'}
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleStop}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Arrêter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breathworkExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className={`hover:shadow-lg transition-all cursor-pointer ${
              activeExercise === exercise.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </div>
                <Badge 
                  variant={
                    exercise.difficulty === 'Débutant' ? 'secondary' :
                    exercise.difficulty === 'Intermédiaire' ? 'default' : 'destructive'
                  }
                  className="text-xs"
                >
                  {exercise.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                {exercise.duration} minutes
              </div>

              <div className="flex flex-wrap gap-1">
                {exercise.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Rythme: {exercise.pattern.inhale}-{exercise.pattern.hold}-{exercise.pattern.exhale}
                {exercise.pattern.pause > 0 && `-${exercise.pattern.pause}`}
              </div>

              <Button 
                className="w-full"
                onClick={() => handleStart(exercise.id)}
                disabled={isRunning && activeExercise !== exercise.id}
              >
                <Play className="w-4 h-4 mr-2" />
                Commencer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">72</div>
            <div className="text-sm text-muted-foreground">BPM moyen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Wind className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Sessions total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-muted-foreground">Jours de suite</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">+15%</div>
            <div className="text-sm text-muted-foreground">Amélioration</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'breathing-tutorial' })}
        >
          <Target className="w-4 h-4 mr-2" />
          Tutoriel respiration
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'breathing-stats' })}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Mes statistiques
        </Button>
        <Button 
          variant="outline"
          onClick={() => navAction({ type: 'modal', id: 'custom-breathing' })}
        >
          <Wind className="w-4 h-4 mr-2" />
          Exercice personnalisé
        </Button>
      </div>
    </div>
  );
}