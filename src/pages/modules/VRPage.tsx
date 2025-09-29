import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, Settings, Headphones, Zap } from 'lucide-react';

const VRPage = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);

  const vrSessions = [
    {
      id: 1,
      title: 'Plage Relaxante',
      description: 'Méditation au bord de l\'océan avec sons apaisants',
      duration: '10 min',
      difficulty: 'Débutant',
      theme: 'Nature',
      image: '🏖️'
    },
    {
      id: 2,
      title: 'Forêt Enchantée',
      description: 'Promenade méditative dans une forêt mystique',
      duration: '15 min',
      difficulty: 'Intermédiaire',
      theme: 'Nature',
      image: '🌲'
    },
    {
      id: 3,
      title: 'Espace Cosmique',
      description: 'Voyage relaxant à travers les étoiles',
      duration: '20 min',
      difficulty: 'Avancé',
      theme: 'Espace',
      image: '🌌'
    },
    {
      id: 4,
      title: 'Jardin Zen',
      description: 'Méditation dans un jardin japonais traditionnel',
      duration: '12 min',
      difficulty: 'Débutant',
      theme: 'Zen',
      image: '🎋'
    }
  ];

  const handleStartSession = (session: typeof vrSessions[0]) => {
    setIsSessionActive(true);
    setSessionProgress(0);
    // Simulation de progression
    const interval = setInterval(() => {
      setSessionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSessionActive(false);
          return 100;
        }
        return prev + 2;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Skip Links pour l'accessibilité */}
      <div className="sr-only focus:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Aller au contenu principal
        </a>
        <a 
          href="#vr-sessions" 
          className="absolute top-4 left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        >
          Sessions VR
        </a>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Headphones className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Réalité Virtuelle Thérapeutique
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immergez-vous dans des environnements apaisants pour réduire le stress et améliorer votre bien-être
          </p>
        </header>

        <main id="main-content">
          {/* Session active */}
          {isSessionActive && (
            <section className="mb-8" aria-labelledby="active-session-title">
              <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardHeader>
                  <CardTitle id="active-session-title" className="flex items-center gap-2">
                    <Zap className="h-5 w-5" aria-hidden="true" />
                    Session en cours
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Plage Relaxante - Méditation guidée
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{sessionProgress}%</span>
                    </div>
                    <Progress 
                      value={sessionProgress} 
                      className="h-3 bg-white/20" 
                      aria-label={`Progression de la session: ${sessionProgress}%`}
                    />
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsSessionActive(false)}
                      aria-label="Mettre en pause la session"
                    >
                      <Pause className="h-4 w-4 mr-2" aria-hidden="true" />
                      Pause
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label="Régler le volume"
                    >
                      <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />
                      Volume
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label="Paramètres de la session"
                    >
                      <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                      Paramètres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Sessions disponibles */}
          <section id="vr-sessions" aria-labelledby="sessions-title">
            <h2 id="sessions-title" className="text-2xl font-bold mb-6 text-center">
              Sessions Disponibles
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {vrSessions.map((session) => (
                <Card 
                  key={session.id} 
                  className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl mb-2">{session.image}</div>
                      <Badge variant="secondary" className="text-xs">
                        {session.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{session.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {session.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">⏱️ {session.duration}</span>
                        <span className="text-muted-foreground">🎨 {session.theme}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => handleStartSession(session)}
                      disabled={isSessionActive}
                      aria-describedby={`session-${session.id}-description`}
                    >
                      <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                      {isSessionActive ? 'Session en cours...' : 'Commencer la session'}
                    </Button>
                    <p 
                      id={`session-${session.id}-description`} 
                      className="sr-only"
                    >
                      Commencer la session {session.title} d'une durée de {session.duration}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Statistiques */}
          <section className="mt-12" aria-labelledby="stats-title">
            <h2 id="stats-title" className="text-2xl font-bold mb-6 text-center">
              Vos Statistiques VR
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24</div>
                  <div className="text-sm text-muted-foreground">Sessions complétées</div>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-pink-600 mb-2">6h</div>
                  <div className="text-sm text-muted-foreground">Temps total</div>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">4.8</div>
                  <div className="text-sm text-muted-foreground">Satisfaction moyenne</div>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Jours consécutifs</div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VRPage;