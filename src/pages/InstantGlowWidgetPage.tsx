import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Heart, Sun, Star, Flame, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InstantGlowWidgetPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentGlow, setCurrentGlow] = useState(0);
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(7);
  const { toast } = useToast();

  const glowBoosts = [
    {
      id: 'energy',
      name: 'Énergie Instantanée',
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      duration: 60,
      description: 'Boost d\'énergie rapide',
      benefits: ['Vitalité', 'Motivation', 'Dynamisme']
    },
    {
      id: 'calm',
      name: 'Calme Profond',
      icon: Heart,
      color: 'from-blue-400 to-purple-500',
      duration: 90,
      description: 'Apaisement immédiat',
      benefits: ['Sérénité', 'Relaxation', 'Paix intérieure']
    },
    {
      id: 'focus',
      name: 'Focus Laser',
      icon: Star,
      color: 'from-green-400 to-teal-500',
      duration: 120,
      description: 'Concentration maximale',
      benefits: ['Clarté', 'Productivité', 'Attention']
    },
    {
      id: 'joy',
      name: 'Joie Éclatante',
      icon: Sun,
      color: 'from-pink-400 to-rose-500',
      duration: 75,
      description: 'Bonheur instantané',
      benefits: ['Optimisme', 'Sourire', 'Légèreté']
    },
    {
      id: 'confidence',
      name: 'Confiance Totale',
      icon: Flame,
      color: 'from-red-400 to-pink-500',
      duration: 100,
      description: 'Boost de confiance',
      benefits: ['Assurance', 'Courage', 'Charisme']
    },
    {
      id: 'creativity',
      name: 'Créativité Explosive',
      icon: Sparkles,
      color: 'from-purple-400 to-indigo-500',
      duration: 110,
      description: 'Inspiration créative',
      benefits: ['Innovation', 'Imagination', 'Originalité']
    }
  ];

  const startGlowSession = (boostId: string) => {
    setSelectedBoost(boostId);
    setIsActive(true);
    setCurrentGlow(0);
    setSessionTime(0);
    
    const boost = glowBoosts.find(b => b.id === boostId);
    toast({
      title: "Session démarrée",
      description: `${boost?.name} activé - Durée: ${boost?.duration}s`,
    });
  };

  const stopGlowSession = () => {
    setIsActive(false);
    setSelectedBoost(null);
    setCurrentGlow(0);
    setSessionTime(0);
    
    toast({
      title: "Session terminée",
      description: "Votre éclat a été restauré !",
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && selectedBoost) {
      const boost = glowBoosts.find(b => b.id === selectedBoost);
      const duration = boost?.duration || 60;
      
      interval = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          setCurrentGlow((newTime / duration) * 100);
          
          if (newTime >= duration) {
            setIsActive(false);
            setSelectedBoost(null);
            toast({
              title: "Éclat complet !",
              description: "Vous rayonnez de bien-être !",
            });
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, selectedBoost, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentBoost = selectedBoost ? glowBoosts.find(b => b.id === selectedBoost) : null;

  return (
    <main data-testid="page-root" className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            Widget Éclat Instantané
          </h1>
          <p className="text-muted-foreground">
            Boost de bien-être immédiat en quelques secondes
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dailyStreak}</div>
                <p className="text-sm text-muted-foreground">Jours consécutifs</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(currentGlow)}%
                </div>
                <p className="text-sm text-muted-foreground">Éclat actuel</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {isActive ? formatTime(sessionTime) : '0:00'}
                </div>
                <p className="text-sm text-muted-foreground">Session active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session active */}
        {isActive && currentBoost && (
          <Card className="mb-8 border-2 border-primary bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <currentBoost.icon className="h-6 w-6" />
                {currentBoost.name} en cours
              </CardTitle>
              <CardDescription>
                Session de {currentBoost.duration} secondes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visualisation de l'éclat */}
              <div className="relative">
                <div className={`h-24 rounded-lg bg-gradient-to-r ${currentBoost.color} flex items-center justify-center relative overflow-hidden`}>
                  <div 
                    className="absolute inset-0 bg-white/20 animate-pulse"
                    style={{ 
                      opacity: currentGlow / 100,
                      animation: `pulse ${2 - (currentGlow / 100)}s infinite`
                    }}
                  />
                  <Sparkles className="h-12 w-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <Progress value={currentGlow} className="mt-4" />
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  {Math.round(currentGlow)}% - {currentBoost.duration - sessionTime}s restantes
                </div>
              </div>

              {/* Bénéfices actifs */}
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Bénéfices actifs:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentBoost.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="animate-pulse">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={stopGlowSession} variant="destructive">
                  <Pause className="mr-2 h-4 w-4" />
                  Arrêter la session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sélection des boosts */}
        {!isActive && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Choisissez votre éclat</h2>
              <p className="text-muted-foreground">
                Sélectionnez le type de bien-être dont vous avez besoin maintenant
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {glowBoosts.map((boost) => {
                const Icon = boost.icon;
                return (
                  <Card 
                    key={boost.id} 
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => startGlowSession(boost.id)}
                  >
                    <CardHeader className="text-center pb-2">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${boost.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{boost.name}</CardTitle>
                      <CardDescription>{boost.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-3">
                          {boost.duration}s
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {boost.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full" size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Démarrer l'éclat
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Historique rapide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
            <CardDescription>Vos dernières sessions d'éclat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Énergie Instantanée', time: 'Il y a 2h', duration: '60s', result: 'Excellent' },
                { name: 'Calme Profond', time: 'Hier', duration: '90s', result: 'Parfait' },
                { name: 'Focus Laser', time: 'Hier', duration: '120s', result: 'Très bien' },
                { name: 'Joie Éclatante', time: '2 jours', duration: '75s', result: 'Excellent' }
              ].map((session, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">{session.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.duration}</p>
                    <Badge variant="secondary" className="text-xs">
                      {session.result}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default InstantGlowWidgetPage;