import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Timer, Play, Pause, RotateCcw, Heart } from 'lucide-react';

const InstantGlowPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [selectedSession, setSelectedSession] = useState<string>('energy');
  const [progress, setProgress] = useState(0);

  const sessions = [
    {
      id: 'energy',
      title: 'Boost d\'Énergie',
      description: 'Retrouvez votre vitalité en 5 minutes',
      duration: '5 min',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      benefits: ['Augmente la motivation', 'Réduit la fatigue', 'Améliore la concentration']
    },
    {
      id: 'calm',
      title: 'Sérénité Express',
      description: 'Apaisez votre esprit rapidement',
      duration: '3 min',
      color: 'bg-gradient-to-r from-blue-400 to-cyan-500',
      benefits: ['Réduit le stress', 'Calme l\'anxiété', 'Favorise la détente']
    },
    {
      id: 'focus',
      title: 'Focus Intense',
      description: 'Concentration maximale instantanée',
      duration: '7 min',
      color: 'bg-gradient-to-r from-purple-400 to-pink-500',
      benefits: ['Améliore la concentration', 'Clarifie les pensées', 'Boost la productivité']
    },
    {
      id: 'confidence',
      title: 'Confiance Éclair',
      description: 'Renforcez votre assurance',
      duration: '4 min',
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      benefits: ['Augmente la confiance', 'Réduit les doutes', 'Renforce l\'estime de soi']
    }
  ];

  const currentSession = sessions.find(s => s.id === selectedSession);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setProgress(((300 - timeLeft) / 300) * 100);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Session terminée
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsActive(true);
    if (timeLeft === 0) {
      setTimeLeft(300);
      setProgress(0);
    }
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(300);
    setProgress(0);
  };

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Instant Glow
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Transformez votre état d'esprit en quelques minutes avec nos sessions express
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sélection de session */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Choisissez votre session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <Card 
                      key={session.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedSession === session.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <CardHeader>
                        <div className={`h-12 w-12 rounded-full ${session.color} mx-auto mb-2 flex items-center justify-center`}>
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-center text-lg">{session.title}</CardTitle>
                        <p className="text-center text-sm text-muted-foreground">{session.description}</p>
                        <div className="text-center">
                          <Badge variant="secondary">{session.duration}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {session.benefits.map((benefit) => (
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
                <CardTitle>Comment ça marche ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-1">Choisissez</h3>
                    <p className="text-sm text-muted-foreground">Sélectionnez la session qui correspond à votre besoin</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-1">Détendez-vous</h3>
                    <p className="text-sm text-muted-foreground">Trouvez un endroit calme et fermez les yeux</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-1">Ressentez</h3>
                    <p className="text-sm text-muted-foreground">Laissez la transformation opérer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session active */}
          <div className="space-y-4">
            <Card className="sticky top-6">
              <CardHeader className="text-center">
                <div className={`h-16 w-16 rounded-full ${currentSession?.color} mx-auto mb-2 flex items-center justify-center`}>
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle>{currentSession?.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{currentSession?.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={progress} className="w-full mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {isActive ? 'Session en cours...' : 'Prêt à commencer'}
                  </p>
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

                {/* État de la session */}
                {isActive && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-primary mb-2">
                      Respirez profondément...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Concentrez-vous sur votre respiration et laissez les pensées négatives s'évaporer
                    </p>
                  </div>
                )}

                {progress === 100 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg text-center">
                    <Sparkles className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-600 mb-1">
                      Session terminée !
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vous devriez ressentir les effets bénéfiques maintenant
                    </p>
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

export default InstantGlowPage;