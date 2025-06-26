
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wind, Play, Pause, RotateCcw, Timer, Sparkles, Heart, Brain } from 'lucide-react';
import { toast } from 'sonner';

const BreathworkPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState('4-7-8');
  const [totalTime, setTotalTime] = useState(0);

  const breathingPatterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 0, name: 'Relaxation 4-7-8', description: 'Idéal pour réduire le stress et favoriser le sommeil' },
    '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 4, name: 'Box Breathing', description: 'Technique utilisée par les forces spéciales pour le calme' },
    '6-2-6-2': { inhale: 6, hold: 2, exhale: 6, pause: 2, name: 'Cohérence Cardiaque', description: 'Équilibre le système nerveux autonome' },
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 0, name: 'Triangle', description: 'Simple et efficace pour commencer' }
  };

  const currentPattern = breathingPatterns[selectedPattern as keyof typeof breathingPatterns];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
        setTotalTime(time => time + 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Passer à la phase suivante
      switch (phase) {
        case 'inhale':
          if (currentPattern.hold > 0) {
            setPhase('hold');
            setTimeLeft(currentPattern.hold);
          } else {
            setPhase('exhale');
            setTimeLeft(currentPattern.exhale);
          }
          break;
        case 'hold':
          setPhase('exhale');
          setTimeLeft(currentPattern.exhale);
          break;
        case 'exhale':
          if (currentPattern.pause > 0) {
            setPhase('pause');
            setTimeLeft(currentPattern.pause);
          } else {
            setPhase('inhale');
            setTimeLeft(currentPattern.inhale);
            setCycle(c => c + 1);
          }
          break;
        case 'pause':
          setPhase('inhale');
          setTimeLeft(currentPattern.inhale);
          setCycle(c => c + 1);
          break;
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, currentPattern]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(currentPattern.inhale);
    toast.success('Session de respiration commencée');
  };

  const pauseBreathing = () => {
    setIsActive(false);
    toast.info('Session mise en pause');
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(currentPattern.inhale);
    setCycle(0);
    setTotalTime(0);
    toast.info('Session réinitialisée');
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez profondément';
      case 'hold': return 'Retenez votre souffle';
      case 'exhale': return 'Expirez lentement';
      case 'pause': return 'Pause naturelle';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-purple-400 to-purple-600';
      case 'exhale': return 'from-green-400 to-green-600';
      case 'pause': return 'from-gray-400 to-gray-600';
    }
  };

  const getCircleScale = () => {
    const maxTime = Math.max(currentPattern.inhale, currentPattern.hold, currentPattern.exhale, currentPattern.pause || 0);
    const progress = 1 - (timeLeft / maxTime);
    
    switch (phase) {
      case 'inhale': return 0.5 + (progress * 0.5);
      case 'hold': return 1;
      case 'exhale': return 1 - (progress * 0.5);
      case 'pause': return 0.5;
      default: return 0.5;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Wind className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Exercices de Respiration
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Maîtrisez votre respiration pour réduire le stress et améliorer votre bien-être
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Visualisation principale */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <CardContent className="flex flex-col items-center space-y-8">
                  {/* Cercle de respiration */}
                  <div className="relative w-80 h-80 flex items-center justify-center">
                    <motion.div
                      className={`w-full h-full rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl flex items-center justify-center`}
                      animate={{ 
                        scale: getCircleScale(),
                        opacity: isActive ? [0.7, 1, 0.7] : 0.8
                      }}
                      transition={{ 
                        scale: { duration: 1, ease: "easeInOut" },
                        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <div className="text-center text-white">
                        <div className="text-6xl font-bold mb-2">{timeLeft}</div>
                        <div className="text-xl font-medium">{getPhaseInstruction()}</div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Informations de session */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{cycle}</div>
                        <div className="text-sm text-muted-foreground">Cycles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
                        <div className="text-sm text-muted-foreground">Temps total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{selectedPattern}</div>
                        <div className="text-sm text-muted-foreground">Modèle</div>
                      </div>
                    </div>

                    {/* Contrôles */}
                    <div className="flex items-center justify-center gap-3">
                      {!isActive ? (
                        <Button onClick={startBreathing} size="lg" className="px-8">
                          <Play className="h-5 w-5 mr-2" />
                          Commencer
                        </Button>
                      ) : (
                        <Button onClick={pauseBreathing} size="lg" variant="outline" className="px-8">
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetBreathing} size="lg" variant="outline">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec les modèles */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Modèles de Respiration
                  </CardTitle>
                  <CardDescription>
                    Choisissez un modèle adapté à vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(breathingPatterns).map(([key, pattern]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${selectedPattern === key ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'}`}
                        onClick={() => {
                          if (!isActive) {
                            setSelectedPattern(key);
                            setTimeLeft(pattern.inhale);
                            toast.success(`Modèle ${pattern.name} sélectionné`);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{pattern.name}</h3>
                            <Badge variant={selectedPattern === key ? 'default' : 'outline'}>
                              {key}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{pattern.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Bienfaits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Réduction du stress</p>
                      <p className="text-sm text-muted-foreground">Calme l'esprit et détend le corps</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Timer className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Améliore le sommeil</p>
                      <p className="text-sm text-muted-foreground">Favorise l'endormissement naturel</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Régule le rythme cardiaque</p>
                      <p className="text-sm text-muted-foreground">Équilibre le système nerveux</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {totalTime > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progression</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Objectif: 10 cycles</span>
                        <span className="text-sm font-medium">{cycle}/10</span>
                      </div>
                      <Progress value={(cycle / 10) * 100} className="h-2" />
                      {cycle >= 10 && (
                        <Badge className="w-full justify-center">
                          Objectif atteint ! 🎉
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BreathworkPage;
