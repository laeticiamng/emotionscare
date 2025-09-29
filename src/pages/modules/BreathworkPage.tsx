import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Wind, Heart, Zap } from 'lucide-react';

const BreathworkPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(0);

  const techniques = [
    {
      name: '4-7-8 Relaxation',
      description: 'Technique apaisante pour réduire le stress et favoriser le sommeil',
      pattern: { inhale: 4, hold: 7, exhale: 8, rest: 0 },
      icon: '😴',
      benefits: ['Réduit l\'anxiété', 'Améliore le sommeil', 'Calme le système nerveux']
    },
    {
      name: 'Box Breathing',
      description: 'Respiration carrée utilisée par les forces spéciales pour la concentration',
      pattern: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
      icon: '⚡',
      benefits: ['Améliore la concentration', 'Réduit le stress', 'Équilibre le système nerveux']
    },
    {
      name: 'Wim Hof Method',
      description: 'Technique énergisante pour booster l\'énergie et le système immunitaire',
      pattern: { inhale: 2, hold: 0, exhale: 1, rest: 0 },
      icon: '🔥',
      benefits: ['Augmente l\'énergie', 'Renforce l\'immunité', 'Améliore la tolérance au froid']
    }
  ];

  const currentTechnique = techniques[selectedTechnique];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Passer à la phase suivante
            setCurrentPhase(currentPhase => {
              switch (currentPhase) {
                case 'inhale':
                  return currentTechnique.pattern.hold > 0 ? 'hold' : 'exhale';
                case 'hold':
                  return 'exhale';
                case 'exhale':
                  if (currentTechnique.pattern.rest > 0) {
                    return 'rest';
                  } else {
                    setCycleCount(count => count + 1);
                    return 'inhale';
                  }
                case 'rest':
                  setCycleCount(count => count + 1);
                  return 'inhale';
                default:
                  return 'inhale';
              }
            });
            
            // Définir le nouveau countdown
            return currentPhase === 'inhale' ? currentTechnique.pattern.inhale :
                   currentPhase === 'hold' ? currentTechnique.pattern.hold :
                   currentPhase === 'exhale' ? currentTechnique.pattern.exhale :
                   currentTechnique.pattern.rest;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, currentPhase, currentTechnique]);

  const startSession = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setCountdown(currentTechnique.pattern.inhale);
    setCycleCount(0);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCountdown(currentTechnique.pattern.inhale);
    setCycleCount(0);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'rest': return 'Pause';
      default: return 'Inspirez';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-orange-500';
      case 'exhale': return 'from-green-400 to-green-600';
      case 'rest': return 'from-purple-400 to-purple-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6">
      {/* Skip Links pour l'accessibilité */}
      <div className="sr-only focus:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Aller au contenu principal
        </a>
        <a 
          href="#breathing-circle" 
          className="absolute top-4 left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Cercle de respiration
        </a>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
              <Wind className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Exercices de Respiration
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Maîtrisez votre respiration pour améliorer votre bien-être mental et physique
          </p>
        </header>

        <main id="main-content" className="grid lg:grid-cols-3 gap-8">
          {/* Visualiseur principal */}
          <section id="breathing-circle" className="lg:col-span-2" aria-labelledby="session-title">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm h-full">
              <CardHeader className="text-center">
                <CardTitle id="session-title" className="text-2xl">
                  {currentTechnique.name}
                </CardTitle>
                <CardDescription>
                  {currentTechnique.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-8 py-12">
                {/* Cercle de respiration */}
                <div className="relative">
                  <div 
                    className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl transition-all duration-1000 ${
                      isActive 
                        ? currentPhase === 'inhale' 
                          ? 'scale-125' 
                          : currentPhase === 'exhale' 
                            ? 'scale-75' 
                            : 'scale-100'
                        : 'scale-100'
                    } flex items-center justify-center`}
                    role="timer"
                    aria-live="polite"
                    aria-label={`Phase: ${getPhaseText()}, ${countdown} secondes restantes`}
                  >
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold mb-2">{countdown}</div>
                      <div className="text-xl font-medium">{getPhaseText()}</div>
                    </div>
                  </div>
                  
                  {/* Indicateur de phase */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      Cycle {cycleCount}
                    </Badge>
                  </div>
                </div>

                {/* Contrôles */}
                <div className="flex items-center gap-4">
                  {!isActive ? (
                    <Button
                      onClick={startSession}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      aria-label="Commencer la session de respiration"
                    >
                      <Play className="h-5 w-5 mr-2" aria-hidden="true" />
                      Commencer
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseSession}
                      size="lg"
                      variant="outline"
                      aria-label="Mettre en pause la session"
                    >
                      <Pause className="h-5 w-5 mr-2" aria-hidden="true" />
                      Pause
                    </Button>
                  )}
                  
                  <Button
                    onClick={resetSession}
                    size="lg"
                    variant="outline"
                    aria-label="Redémarrer la session"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" aria-hidden="true" />
                    Reset
                  </Button>
                </div>

                {/* Progression */}
                {cycleCount > 0 && (
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cycles complétés</span>
                      <span>{cycleCount}/10</span>
                    </div>
                    <Progress 
                      value={(cycleCount / 10) * 100} 
                      className="h-2" 
                      aria-label={`Progression: ${cycleCount} cycles sur 10`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Sidebar - Techniques */}
          <aside className="space-y-6" aria-labelledby="techniques-title">
            <h2 id="techniques-title" className="text-2xl font-bold">
              Techniques disponibles
            </h2>
            
            {techniques.map((technique, index) => (
              <Card 
                key={index}
                className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm cursor-pointer transition-all hover:shadow-2xl ${
                  selectedTechnique === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => !isActive && setSelectedTechnique(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isActive) {
                    e.preventDefault();
                    setSelectedTechnique(index);
                  }
                }}
                aria-pressed={selectedTechnique === index}
                aria-label={`Sélectionner la technique ${technique.name}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{technique.icon}</span>
                    {technique.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {technique.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Pattern */}
                  <div className="text-sm">
                    <span className="font-medium">Pattern: </span>
                    <span className="font-mono">
                      {technique.pattern.inhale}s-{technique.pattern.hold}s-{technique.pattern.exhale}s
                      {technique.pattern.rest > 0 && `-${technique.pattern.rest}s`}
                    </span>
                  </div>

                  {/* Bénéfices */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Bénéfices :</span>
                    <div className="flex flex-wrap gap-1">
                      {technique.benefits.map((benefit, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Statistiques */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
                  Vos statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">47</div>
                    <div className="text-xs text-blue-700">Sessions totales</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-green-700">Jours consécutifs</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3h 24m</div>
                  <div className="text-xs text-purple-700">Temps total</div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default BreathworkPage;