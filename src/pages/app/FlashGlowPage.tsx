/**
 * FlashGlowPage - Module Flash Glow (/app/flash-glow)
 * Boost énergétique rapide en 2 minutes
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw,
  Timer,
  TrendingUp,
  Heart,
  Sparkles,
  Battery,
  Sun,
  ArrowLeft,
  CheckCircle,
  Circle,
  Target,
  Activity,
  Flame,
  Lightning
} from 'lucide-react';

interface FlashSession {
  type: 'breathing' | 'movement' | 'mental' | 'energy';
  name: string;
  description: string;
  duration: number; // en secondes
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  steps: string[];
}

const FlashGlowPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<FlashSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(45);

  const sessions: FlashSession[] = [
    {
      type: 'breathing',
      name: 'Power Breath',
      description: 'Respiration énergisante pour un boost immédiat',
      duration: 120,
      icon: Battery,
      color: 'text-blue-600',
      steps: [
        'Inspirez profondément par le nez (4 sec)',
        'Retenez votre souffle (7 sec)',
        'Expirez lentement par la bouche (8 sec)',
        'Répétez ce cycle 6 fois',
        'Sentez l\'énergie circuler'
      ]
    },
    {
      type: 'movement',
      name: 'Energy Spark',
      description: 'Micro-mouvements dynamisants',
      duration: 90,
      icon: Lightning,
      color: 'text-orange-600',
      steps: [
        'Étirez vos bras vers le haut',
        'Faites 10 cercles avec vos épaules',
        'Secouez vos mains énergiquement',
        'Marchez sur place 30 secondes',
        'Terminez par 3 sauts légers'
      ]
    },
    {
      type: 'mental',
      name: 'Mind Boost',
      description: 'Activation mentale et focus',
      duration: 75,
      icon: Sparkles,
      color: 'text-purple-600',
      steps: [
        'Visualisez une lumière dorée',
        'Répétez: "Je suis plein d\'énergie"',
        'Comptez de 10 à 1 mentalement',
        'Imaginez votre succès d\'aujourd\'hui',
        'Souriez et ouvrez les yeux'
      ]
    },
    {
      type: 'energy',
      name: 'Fire Up',
      description: 'Réveil énergétique complet',
      duration: 150,
      icon: Flame,
      color: 'text-red-600',
      steps: [
        'Commencez par étirer tout votre corps',
        'Respirez profondément 5 fois',
        'Visualisez votre énergie qui s\'intensifie',
        'Faites quelques mouvements dynamiques',
        'Affirmez votre motivation du jour'
      ]
    }
  ];

  const startSession = (session: FlashSession) => {
    setCurrentSession(session);
    setTimeRemaining(session.duration);
    setCurrentStep(0);
    setIsActive(true);
    setSessionComplete(false);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentSession(null);
    setTimeRemaining(0);
    setCurrentStep(0);
    setSessionComplete(false);
  };

  // Minuteur
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setSessionComplete(true);
            setEnergyLevel(prev => Math.min(100, prev + 25));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Progression des étapes
  useEffect(() => {
    if (currentSession && isActive) {
      const stepDuration = currentSession.duration / currentSession.steps.length;
      const newStep = Math.floor((currentSession.duration - timeRemaining) / stepDuration);
      if (newStep !== currentStep && newStep < currentSession.steps.length) {
        setCurrentStep(newStep);
      }
    }
  }, [timeRemaining, currentSession, currentStep, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!currentSession) return 0;
    return ((currentSession.duration - timeRemaining) / currentSession.duration) * 100;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Flash Glow</h1>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                2 min max
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Énergie: {energyLevel}%</span>
                <Progress value={energyLevel} className="w-16 h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-950/50 dark:to-yellow-950/50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="h-8 w-8 text-orange-600" />
                  <Sparkles className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Boost Énergétique Express
                </h2>
                <p className="text-muted-foreground">
                  Retrouvez votre énergie en moins de 2 minutes avec nos techniques de Flash Glow
                </p>
              </div>
            </CardContent>
          </Card>

          {!currentSession ? (
            /* Sélection de session */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Choisissez votre type de boost</h3>
                <p className="text-muted-foreground">
                  Sélectionnez la technique qui correspond le mieux à vos besoins actuels
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {sessions.map(session => {
                  const Icon = session.icon;
                  return (
                    <Card key={session.type} className="hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-3 bg-muted rounded-lg">
                            <Icon className={`h-6 w-6 ${session.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{session.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Timer className="h-3 w-3" />
                              {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {session.description}
                        </p>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Étapes :</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {session.steps.slice(0, 3).map((step, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Circle className="h-2 w-2 mt-1 shrink-0" />
                                {step}
                              </li>
                            ))}
                            {session.steps.length > 3 && (
                              <li className="text-xs italic">... et {session.steps.length - 3} autres étapes</li>
                            )}
                          </ul>
                        </div>
                        
                        <Button 
                          className="w-full gap-2"
                          onClick={() => startSession(session)}
                        >
                          <Play className="h-4 w-4" />
                          Commencer
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Statistiques */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-muted-foreground">Sessions cette semaine</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">+15%</div>
                    <div className="text-sm text-muted-foreground">Énergie moyenne</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-purple-600">7</div>
                    <div className="text-sm text-muted-foreground">Jours de suite</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Session en cours */
            <div className="space-y-6">
              {!sessionComplete ? (
                <>
                  {/* Interface de session */}
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <currentSession.icon className={`h-8 w-8 ${currentSession.color}`} />
                        {currentSession.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Timer principal */}
                      <div className="text-center space-y-4">
                        <div className="relative w-32 h-32 mx-auto">
                          <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                          <div 
                            className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent transition-all duration-1000"
                            style={{
                              transform: `rotate(${(getProgressPercentage() / 100) * 360}deg)`
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-primary">
                                {formatTime(timeRemaining)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                restant
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Progress value={getProgressPercentage()} className="h-2" />
                      </div>

                      {/* Étape actuelle */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center space-y-3">
                            <div className="text-sm text-muted-foreground">
                              Étape {currentStep + 1} sur {currentSession.steps.length}
                            </div>
                            <h3 className="text-lg font-medium">
                              {currentSession.steps[currentStep]}
                            </h3>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Contrôles */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={resetSession}
                          className="gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset
                        </Button>
                        
                        <Button
                          size="lg"
                          onClick={isActive ? pauseSession : resumeSession}
                          className="gap-2 px-8"
                        >
                          {isActive ? (
                            <>
                              <Pause className="h-4 w-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Reprendre
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progression des étapes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Progression</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentSession.steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`flex items-center gap-3 p-2 rounded ${
                              index === currentStep ? 'bg-primary/10' : 
                              index < currentStep ? 'bg-green-50 dark:bg-green-950/50' : 'bg-muted/30'
                            }`}
                          >
                            {index < currentStep ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : index === currentStep ? (
                              <div className="h-4 w-4 border-2 border-primary rounded-full animate-pulse bg-primary/20"></div>
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={`text-sm ${
                              index === currentStep ? 'font-medium' : 
                              index < currentStep ? 'text-green-600' : 'text-muted-foreground'
                            }`}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                /* Session terminée */
                <Card className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 animate-scale-in">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="space-y-4">
                      <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                      <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">
                        Session terminée !
                      </h2>
                      <p className="text-green-700 dark:text-green-300">
                        Félicitations ! Vous avez terminé votre session {currentSession.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+25%</div>
                        <div className="text-sm text-muted-foreground">Boost énergie</div>
                      </div>
                      <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{formatTime(currentSession.duration)}</div>
                        <div className="text-sm text-muted-foreground">Temps investi</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={resetSession} className="gap-2">
                        <Zap className="h-4 w-4" />
                        Nouvelle session
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/app/home">
                          <Heart className="h-4 w-4 mr-2" />
                          Retour accueil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Conseils */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Conseils Flash Glow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">🌅 Matinée énergisante</h4>
                  <p className="text-muted-foreground">
                    Utilisez Power Breath ou Energy Spark au réveil pour démarrer la journée
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">🕐 Coup de mou</h4>
                  <p className="text-muted-foreground">
                    Mind Boost est parfait pour les baisses d'énergie en milieu de journée
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">💪 Motivation intense</h4>
                  <p className="text-muted-foreground">
                    Fire Up pour les moments où vous avez besoin d'un boost complet
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">🎯 Régularité</h4>
                  <p className="text-muted-foreground">
                    3-4 sessions par jour maximum pour un effet optimal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FlashGlowPage;