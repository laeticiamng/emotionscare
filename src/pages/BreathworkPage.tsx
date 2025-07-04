import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Play, Pause, RotateCcw, Heart, Settings } from 'lucide-react';

const BreathworkPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeInPhase, setTimeInPhase] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState('box');

  const techniques = [
    {
      id: 'box',
      name: 'Respiration en Carré',
      description: 'Technique équilibrée pour la concentration',
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      benefits: ['Améliore la concentration', 'Réduit le stress', 'Stabilise les émotions'],
      color: 'bg-blue-500',
      difficulty: 'Débutant'
    },
    {
      id: '478',
      name: 'Respiration 4-7-8',
      description: 'Technique de relaxation profonde',
      pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
      benefits: ['Favorise le sommeil', 'Calme l\'anxiété', 'Relaxation profonde'],
      color: 'bg-purple-500',
      difficulty: 'Intermédiaire'
    },
    {
      id: 'coherence',
      name: 'Cohérence Cardiaque',
      description: 'Synchronisation cœur-respiration',
      pattern: { inhale: 5, hold: 0, exhale: 5, pause: 0 },
      benefits: ['Régule le rythme cardiaque', 'Réduit la variabilité', 'Améliore la récupération'],
      color: 'bg-green-500',
      difficulty: 'Débutant'
    },
    {
      id: 'energizing',
      name: 'Respiration Énergisante',
      description: 'Technique pour augmenter la vitalité',
      pattern: { inhale: 3, hold: 3, exhale: 3, pause: 1 },
      benefits: ['Augmente l\'énergie', 'Améliore la vigilance', 'Stimule le métabolisme'],
      color: 'bg-orange-500',
      difficulty: 'Avancé'
    }
  ];

  const currentTechnique = techniques.find(t => t.id === selectedTechnique)!;
  const pattern = currentTechnique.pattern;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeInPhase(prev => {
          const newTime = prev + 0.1;
          const currentLimit = pattern[currentPhase];
          
          if (newTime >= currentLimit) {
            // Passer à la phase suivante
            setCurrentPhase(current => {
              switch (current) {
                case 'inhale':
                  return pattern.hold > 0 ? 'hold' : (pattern.exhale > 0 ? 'exhale' : 'pause');
                case 'hold':
                  return pattern.exhale > 0 ? 'exhale' : (pattern.pause > 0 ? 'pause' : 'inhale');
                case 'exhale':
                  return pattern.pause > 0 ? 'pause' : 'inhale';
                case 'pause':
                  setCycleCount(count => count + 1);
                  return 'inhale';
                default:
                  return 'inhale';
              }
            });
            return 0;
          }
          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, pattern]);

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'pause': return 'Pause';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-500';
      case 'hold': return 'text-yellow-500';
      case 'exhale': return 'text-green-500';
      case 'pause': return 'text-gray-500';
    }
  };

  const getCircleScale = () => {
    const progress = timeInPhase / pattern[currentPhase];
    switch (currentPhase) {
      case 'inhale': return 0.5 + (progress * 0.5);
      case 'hold': return 1;
      case 'exhale': return 1 - (progress * 0.5);
      case 'pause': return 0.5;
    }
  };

  const startSession = () => {
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setTimeInPhase(0);
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wind className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-primary">Breathwork</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Techniques de respiration guidées pour votre bien-être
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sélection de technique */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Choisissez votre technique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {techniques.map((technique) => (
                    <Card 
                      key={technique.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedTechnique === technique.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedTechnique(technique.id)}
                    >
                      <CardHeader>
                        <div className={`h-12 w-12 rounded-full ${technique.color} mx-auto mb-2 flex items-center justify-center`}>
                          <Wind className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-center text-lg">{technique.name}</CardTitle>
                        <p className="text-center text-sm text-muted-foreground">{technique.description}</p>
                        <div className="text-center">
                          <Badge variant="secondary">{technique.difficulty}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="text-center text-xs">
                            <span className="font-mono">
                              {technique.pattern.inhale}s - {technique.pattern.hold}s - {technique.pattern.exhale}s
                              {technique.pattern.pause > 0 && ` - ${technique.pattern.pause}s`}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {technique.benefits.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-2">
                              <Heart className="h-3 w-3 text-red-500" />
                              <span className="text-xs">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-1">Position</h3>
                    <p className="text-sm text-muted-foreground">Asseyez-vous confortablement, dos droit</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-1">Respiration</h3>
                    <p className="text-sm text-muted-foreground">Respirez par le nez, lentement et profondément</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-1">Concentration</h3>
                    <p className="text-sm text-muted-foreground">Suivez le guide visuel et sonore</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guide de respiration */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="text-center">
                <CardTitle>{currentTechnique.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{currentTechnique.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cercle de respiration */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div 
                      className={`w-32 h-32 rounded-full ${currentTechnique.color} opacity-30 transition-transform duration-100 ease-in-out`}
                      style={{ transform: `scale(${getCircleScale()})` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className={`text-xl font-bold ${getPhaseColor()}`}>
                          {getPhaseLabel()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.ceil(pattern[currentPhase] - timeInPhase)}s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{cycleCount}</p>
                    <p className="text-sm text-muted-foreground">Cycles</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {Math.floor((cycleCount * (pattern.inhale + pattern.hold + pattern.exhale + pattern.pause)) / 60)}m
                    </p>
                    <p className="text-sm text-muted-foreground">Durée</p>
                  </div>
                </div>

                {/* Contrôles */}
                <div className="flex justify-center gap-2">
                  {!isActive ? (
                    <Button onClick={startSession} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Commencer
                    </Button>
                  ) : (
                    <Button onClick={pauseSession} variant="outline" className="flex items-center gap-2">
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={resetSession} variant="outline" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Guidance */}
                {isActive && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg text-center">
                    <div className="space-y-2">
                      <div className="flex justify-center space-x-2">
                        {['inhale', 'hold', 'exhale', 'pause'].map((phase) => (
                          pattern[phase as keyof typeof pattern] > 0 && (
                            <div
                              key={phase}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                currentPhase === phase ? 'bg-primary' : 'bg-muted'
                              }`}
                            />
                          )
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Concentrez-vous sur votre respiration et laissez votre corps se détendre
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BreathworkPage;