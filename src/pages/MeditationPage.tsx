import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, Play, Pause, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function MeditationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const programs = [
    {
      id: 'calm',
      title: 'Méditation Calme',
      description: 'Apaiser votre esprit et réduire le stress',
      duration: [5, 10, 15, 20],
      icon: Brain,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      id: 'focus',
      title: 'Concentration',
      description: 'Améliorer votre focus et clarté mentale',
      duration: [5, 10, 15],
      icon: Sparkles,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      id: 'sleep',
      title: 'Sommeil Profond',
      description: 'Préparer votre corps et esprit au repos',
      duration: [10, 15, 20, 30],
      icon: Clock,
      color: 'bg-indigo-500/10 text-indigo-600',
    },
  ];

  const handleStart = () => {
    if (!selectedProgram) {
      toast({
        title: 'Programme requis',
        description: 'Veuillez sélectionner un programme de méditation',
        variant: 'destructive',
      });
      return;
    }
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Timer logic for meditation session
  useEffect(() => {
    if (isPlaying && currentTime < selectedDuration * 60) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Auto-complete when time is up
          if (newTime >= selectedDuration * 60) {
            setIsPlaying(false);
            toast({
              title: 'Méditation terminée! 🧘',
              description: `Vous avez complété votre session de ${selectedDuration} minutes.`,
            });
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, selectedDuration, currentTime]);

  const progress = (currentTime / (selectedDuration * 60)) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Méditation Guidée</h1>
              <p className="text-muted-foreground">
                Prenez un moment pour vous recentrer
              </p>
            </div>
          </div>
        </header>

        {/* Meditation Programs */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Programmes de méditation</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {programs.map((program) => {
              const Icon = program.icon;
              const isSelected = selectedProgram === program.id;
              return (
                <Card
                  key={program.id}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedProgram(program.id)}
                >
                  <CardHeader>
                    <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${program.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {program.duration.map((duration) => (
                        <Badge
                          key={duration}
                          variant={
                            isSelected && selectedDuration === duration
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProgram(program.id);
                            setSelectedDuration(duration);
                          }}
                        >
                          {duration} min
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Player */}
        {selectedProgram && (
          <Card>
            <CardHeader>
              <CardTitle>Session de méditation</CardTitle>
              <CardDescription>
                {selectedDuration} minutes - {programs.find((p) => p.id === selectedProgram)?.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {selectedDuration}:00
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  disabled={currentTime === 0}
                >
                  <RotateCcw className="h-5 w-5" />
                  <span className="sr-only">Réinitialiser</span>
                </Button>

                {!isPlaying ? (
                  <Button
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={handleStart}
                  >
                    <Play className="h-6 w-6" />
                    <span className="sr-only">Démarrer</span>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="h-16 w-16 rounded-full"
                    onClick={handlePause}
                    variant="secondary"
                  >
                    <Pause className="h-6 w-6" />
                    <span className="sr-only">Pause</span>
                  </Button>
                )}
              </div>

              {isPlaying && (
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Fermez les yeux, respirez profondément et laissez-vous guider...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Bienfaits de la méditation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              <li className="flex items-start gap-2">
                <Sparkles className="mt-1 h-4 w-4 text-primary" />
                <span className="text-sm">Réduction du stress et de l'anxiété</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-1 h-4 w-4 text-primary" />
                <span className="text-sm">Amélioration de la concentration</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-1 h-4 w-4 text-primary" />
                <span className="text-sm">Meilleure qualité de sommeil</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-1 h-4 w-4 text-primary" />
                <span className="text-sm">Augmentation du bien-être émotionnel</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
