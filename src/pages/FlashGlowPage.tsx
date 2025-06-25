
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMood } from '@/hooks/useMood';
import { Play, Pause, Sparkles, Zap, Heart } from 'lucide-react';

const FlashGlowPage: React.FC = () => {
  const { mood, isLoading } = useMood();
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);

  // Adapter les exercices selon l'humeur
  const getExercisesByMood = () => {
    if (!mood) return defaultExercises;
    
    const { valence, arousal } = mood;
    
    if (valence < 30) {
      return exercises.filter(ex => ex.category === 'energizing');
    } else if (arousal > 70) {
      return exercises.filter(ex => ex.category === 'calming');
    } else {
      return exercises.filter(ex => ex.category === 'balanced');
    }
  };

  const exercises = [
    {
      id: 'breath-rainbow',
      name: 'Respiration Arc-en-ciel',
      category: 'calming',
      duration: 180,
      color: 'from-pink-400 to-purple-500',
      description: 'Respirez en suivant les couleurs de l\'arc-en-ciel',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 'micro-dance',
      name: 'Micro-Danse Énergisante',
      category: 'energizing', 
      duration: 120,
      color: 'from-orange-400 to-red-500',
      description: 'Mouvements rapides pour booster votre énergie',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 'glow-meditation',
      name: 'Méditation Lumineuse',
      category: 'balanced',
      duration: 300,
      color: 'from-blue-400 to-cyan-500',
      description: 'Visualisation de lumière apaisante',
      icon: <Sparkles className="h-5 w-5" />
    }
  ];

  const defaultExercises = exercises;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  const startExercise = (exercise: any) => {
    setCurrentExercise(exercise.id);
    setTimer(exercise.duration);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const availableExercises = getExercisesByMood();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Flash Glow
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exercices flash personnalisés pour illuminer votre journée en quelques minutes
          </p>
          
          {mood && (
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="outline" className="bg-white/50">
                Humeur adaptée
              </Badge>
              <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100">
                {availableExercises.length} exercices disponibles
              </Badge>
            </div>
          )}
        </div>

        {/* Exercice en cours */}
        {currentExercise && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {formatTime(timer)}
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    {isPlaying ? 'Pause' : 'Reprendre'}
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentExercise(null);
                      setIsPlaying(false);
                      setTimer(0);
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Arrêter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grille d'exercices */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableExercises.map((exercise) => (
            <Card 
              key={exercise.id}
              className="group hover:scale-105 transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-r ${exercise.color} text-white relative`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {exercise.icon}
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {Math.floor(exercise.duration / 60)}min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  {exercise.description}
                </p>
                <Button
                  onClick={() => startExercise(exercise)}
                  disabled={currentExercise === exercise.id}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {currentExercise === exercise.id ? 'En cours...' : 'Commencer'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Adaptation à votre humeur...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashGlowPage;
