
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

const MeditationPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(300); // 5 minutes par défaut
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selectedSession, setSelectedSession] = useState('breathing');

  const sessions = {
    breathing: { name: 'Respiration Guidée', description: 'Exercices de respiration pour la relaxation' },
    mindfulness: { name: 'Pleine Conscience', description: 'Méditation de pleine conscience pour le présent' },
    body_scan: { name: 'Scan Corporel', description: 'Relaxation progressive de tout le corps' },
    loving_kindness: { name: 'Bienveillance', description: 'Cultiver la compassion envers soi et les autres' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(duration);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Méditation</h1>
        <p className="text-muted-foreground">
          Prenez un moment pour vous recentrer et cultiver la paix intérieure
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{sessions[selectedSession as keyof typeof sessions].name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">{formatTime(timeLeft)}</div>
                      <div className="text-sm text-muted-foreground">
                        {isPlaying ? 'En cours' : 'Prêt'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="lg" onClick={handlePlay} className="w-16 h-16 rounded-full">
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Durée de la séance</p>
                  <div className="flex justify-center gap-2">
                    {[300, 600, 900, 1200].map((dur) => (
                      <Button
                        key={dur}
                        variant={duration === dur ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDurationChange(dur)}
                      >
                        {dur / 60} min
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p><strong>1.</strong> Installez-vous confortablement dans un endroit calme</p>
                <p><strong>2.</strong> Fermez les yeux ou fixez un point devant vous</p>
                <p><strong>3.</strong> Suivez les instructions audio pour votre séance</p>
                <p><strong>4.</strong> Si votre esprit divague, ramenez doucement votre attention</p>
                <p><strong>5.</strong> Terminez en prenant quelques respirations profondes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Types de Méditation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(sessions).map(([key, session]) => (
                <Button
                  key={key}
                  variant={selectedSession === key ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedSession(key)}
                >
                  <div>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {session.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vos Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Séances cette semaine</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Temps total</span>
                  <span className="font-semibold">2h 45m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Série actuelle</span>
                  <span className="font-semibold">5 jours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Record personnel</span>
                  <span className="font-semibold">15 jours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Citation du Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-sm italic text-center">
                "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur."
                <footer className="text-xs text-muted-foreground mt-2">- Bouddha</footer>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
