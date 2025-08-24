import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Play, Pause, RotateCcw, Heart, Settings, Timer, Target, TrendingUp, BarChart3 } from 'lucide-react';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

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
      gradient: 'from-blue-500 to-cyan-500',
      difficulty: 'Débutant'
    },
    {
      id: '478',
      name: 'Respiration 4-7-8',
      description: 'Technique de relaxation profonde',
      pattern: { inhale: 4, hold: 7, exhale: 8, pause: 0 },
      benefits: ['Favorise le sommeil', 'Calme l\'anxiété', 'Relaxation profonde'],
      gradient: 'from-purple-500 to-violet-500',
      difficulty: 'Intermédiaire'
    },
    {
      id: 'coherence',
      name: 'Cohérence Cardiaque',
      description: 'Synchronisation cœur-respiration',
      pattern: { inhale: 5, hold: 0, exhale: 5, pause: 0 },
      benefits: ['Régule le rythme cardiaque', 'Réduit la variabilité', 'Améliore la récupération'],
      gradient: 'from-green-500 to-emerald-500',
      difficulty: 'Débutant'
    },
    {
      id: 'energizing',
      name: 'Respiration Énergisante',
      description: 'Technique pour augmenter la vitalité',
      pattern: { inhale: 3, hold: 3, exhale: 3, pause: 1 },
      benefits: ['Augmente l\'énergie', 'Améliore la vigilance', 'Stimule le métabolisme'],
      gradient: 'from-orange-500 to-red-500',
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
      case 'pause': return 'text-muted-foreground';
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

  const startSession = () => setIsActive(true);
  const pauseSession = () => setIsActive(false);
  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setTimeInPhase(0);
  };

  return (
    <PageLayout
      header={{
        title: 'Breathwork',
        subtitle: 'Techniques de respiration guidées',
        description: 'Maîtrisez votre respiration pour améliorer votre bien-être physique et mental. Découvrez différentes techniques adaptées à vos besoins.',
        icon: Wind,
        gradient: 'from-cyan-500/20 to-blue-500/5',
        badge: 'Respiration Consciente',
        stats: [
          {
            label: 'Sessions',
            value: '47',
            icon: Timer,
            color: 'text-blue-500'
          },
          {
            label: 'Cycles totaux',
            value: '1.2K',
            icon: Target,
            color: 'text-green-500'
          },
          {
            label: 'Amélioration',
            value: '+32%',
            icon: TrendingUp,
            color: 'text-purple-500'
          },
          {
            label: 'Techniques',
            value: '4',
            icon: BarChart3,
            color: 'text-orange-500'
          }
        ],
        actions: [
          {
            label: isActive ? 'Pause' : 'Commencer',
            onClick: isActive ? pauseSession : startSession,
            variant: 'default',
            icon: isActive ? Pause : Play
          },
          {
            label: 'Reset',
            onClick: resetSession,
            variant: 'outline',
            icon: RotateCcw
          }
        ]
      }}
      tips={{
        title: 'Conseils pour une pratique optimale',
        items: [
          {
            title: 'Position',
            content: 'Asseyez-vous confortablement, dos droit, épaules détendues',
            icon: Settings
          },
          {
            title: 'Concentration',
            content: 'Focalisez-vous uniquement sur votre respiration',
            icon: Target
          },
          {
            title: 'Régularité',
            content: 'Pratiquez 5-10 minutes par jour pour de meilleurs résultats',
            icon: Timer
          }
        ],
        cta: {
          label: 'Guide des techniques de respiration',
          onClick: () => console.log('Breathing guide')
        }
      }}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sélection de technique */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Techniques Disponibles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {techniques.map((technique) => (
                <FeatureCard
                  key={technique.id}
                  title={technique.name}
                  description={technique.description}
                  icon={<Wind className="h-6 w-6" />}
                  gradient={technique.gradient}
                  category={technique.difficulty}
                  metadata={[
                    { 
                      label: 'Pattern', 
                      value: `${technique.pattern.inhale}s-${technique.pattern.hold}s-${technique.pattern.exhale}s${technique.pattern.pause > 0 ? `-${technique.pattern.pause}s` : ''}` 
                    }
                  ]}
                  action={{
                    label: selectedTechnique === technique.id ? 'Sélectionnée' : 'Sélectionner',
                    onClick: () => setSelectedTechnique(technique.id),
                    variant: selectedTechnique === technique.id ? 'default' : 'outline'
                  }}
                  className={`${selectedTechnique === technique.id ? 'ring-2 ring-primary' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions de Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Position', desc: 'Asseyez-vous confortablement, dos droit' },
                  { step: '2', title: 'Respiration', desc: 'Respirez par le nez, lentement et profondément' },
                  { step: '3', title: 'Concentration', desc: 'Suivez le guide visuel et sonore' }
                ].map((instruction) => (
                  <div key={instruction.step} className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-primary-foreground font-bold">{instruction.step}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{instruction.title}</h3>
                    <p className="text-sm text-muted-foreground">{instruction.desc}</p>
                  </div>
                ))}
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
              <Badge variant="secondary">{currentTechnique.difficulty}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cercle de respiration */}
              <div className="flex justify-center">
                <div className="relative">
                  <div 
                    className="w-32 h-32 rounded-full bg-primary/30 transition-transform duration-100 ease-in-out"
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
                <div className="bg-muted/50 p-4 rounded-lg text-center">
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
    </PageLayout>
  );
};

export default BreathworkPage;