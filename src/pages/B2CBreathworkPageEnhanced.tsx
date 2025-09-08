import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wind, Play, Pause, RotateCcw, Heart, Timer, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  pattern: number[];
  duration: number;
  category: 'relaxation' | 'energy' | 'focus' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const techniques: BreathingTechnique[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Relaxation',
    description: 'Technique apaisante pour réduire le stress et favoriser le sommeil',
    pattern: [4, 7, 8],
    duration: 8,
    category: 'relaxation',
    difficulty: 'beginner'
  },
  {
    id: 'box',
    name: 'Respiration Carrée',
    description: 'Technique équilibrante pour la concentration et le calme',
    pattern: [4, 4, 4, 4],
    duration: 10,
    category: 'focus',
    difficulty: 'beginner'
  },
  {
    id: 'energizing',
    name: 'Respiration Énergisante',
    description: 'Technique stimulante pour augmenter l\'énergie',
    pattern: [2, 0, 4, 0],
    duration: 5,
    category: 'energy',
    difficulty: 'intermediate'
  },
  {
    id: 'coherence',
    name: 'Cohérence Cardiaque',
    description: 'Technique de régulation du système nerveux',
    pattern: [5, 0, 5, 0],
    duration: 5,
    category: 'relaxation',
    difficulty: 'beginner'
  }
];

const B2CBreathworkPageEnhanced: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(techniques[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [cycles, setCycles] = useState(0);

  const phaseNames = ['Inspiration', 'Rétention', 'Expiration', 'Pause'];

  const startSession = useCallback(() => {
    setIsPlaying(true);
    setCurrentPhase(0);
    setTimeLeft(selectedTechnique.pattern[0]);
    setTotalTime(selectedTechnique.duration * 60);
    setSessionTime(selectedTechnique.duration * 60);
    setCycles(0);
    toast.success(`Session ${selectedTechnique.name} démarrée`);
  }, [selectedTechnique]);

  const pauseSession = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const resetSession = useCallback(() => {
    setIsPlaying(false);
    setCurrentPhase(0);
    setTimeLeft(0);
    setTotalTime(0);
    setSessionTime(0);
    setCycles(0);
  }, []);

  useEffect(() => {
    if (!isPlaying || totalTime <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Passer à la phase suivante
          const nextPhase = (currentPhase + 1) % selectedTechnique.pattern.length;
          setCurrentPhase(nextPhase);
          
          if (nextPhase === 0) {
            setCycles(prev => prev + 1);
          }
          
          return selectedTechnique.pattern[nextPhase];
        }
        return prev - 1;
      });

      setTotalTime(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          toast.success('Session terminée !', {
            description: `${cycles + 1} cycles complétés`
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentPhase, selectedTechnique.pattern, totalTime, cycles]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relaxation': return <Wind className="w-4 h-4" />;
      case 'energy': return <Zap className="w-4 h-4" />;
      case 'focus': return <Heart className="w-4 h-4" />;
      case 'sleep': return <Timer className="w-4 h-4" />;
      default: return <Wind className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relaxation': return 'bg-blue-100 text-blue-800';
      case 'energy': return 'bg-orange-100 text-orange-800';
      case 'focus': return 'bg-green-100 text-green-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl" data-testid="page-root">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Wind className="w-8 h-8" />
          Respiration Guidée
        </h1>
        <p className="text-muted-foreground">
          Techniques de respiration pour améliorer votre bien-être
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection des techniques */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold">Techniques</h2>
          {techniques.map((technique) => (
            <Card 
              key={technique.id}
              className={`cursor-pointer transition-all ${
                selectedTechnique.id === technique.id 
                  ? 'ring-2 ring-primary shadow-md' 
                  : 'hover:shadow-sm'
              }`}
              onClick={() => !isPlaying && setSelectedTechnique(technique)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{technique.name}</h3>
                  {getCategoryIcon(technique.category)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {technique.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoryColor(technique.category)} variant="secondary">
                    {technique.category}
                  </Badge>
                  <Badge className={getDifficultyColor(technique.difficulty)} variant="secondary">
                    {technique.difficulty}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Durée: {technique.duration} min • Pattern: {technique.pattern.join('-')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Session active */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedTechnique.name}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  {formatTime(totalTime)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visualisation de la respiration */}
              <div className="flex flex-col items-center space-y-4">
                <div className={`
                  w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center
                  transition-all duration-1000 ease-in-out
                  ${isPlaying ? 'scale-110 bg-primary/10' : 'scale-100'}
                `}>
                  <div className={`
                    w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center
                    transition-all duration-1000 ease-in-out
                    ${isPlaying && currentPhase === 0 ? 'scale-150' : 'scale-100'}
                  `}>
                    <Wind className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {isPlaying && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {phaseNames[currentPhase]}
                    </div>
                    <div className="text-4xl font-mono font-bold">
                      {timeLeft}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cycle {cycles + 1}
                    </div>
                  </div>
                )}
              </div>

              {/* Progrès de la session */}
              {totalTime > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{Math.round(((sessionTime - totalTime) / sessionTime) * 100)}%</span>
                  </div>
                  <Progress value={((sessionTime - totalTime) / sessionTime) * 100} />
                </div>
              )}

              {/* Contrôles */}
              <div className="flex justify-center gap-4">
                {!isPlaying && totalTime === 0 ? (
                  <Button onClick={startSession} size="lg" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Commencer
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={pauseSession} 
                      variant="outline" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Reprendre
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={resetSession} 
                      variant="outline" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </Button>
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions:</h4>
                <div className="text-sm space-y-1">
                  {selectedTechnique.pattern.map((duration, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        currentPhase === index && isPlaying ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <span className={currentPhase === index && isPlaying ? 'font-semibold' : ''}>
                        {phaseNames[index]}: {duration} secondes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CBreathworkPageEnhanced;