import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Headphones, 
  Volume2,
  ArrowLeft,
  Heart,
  Wind,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/music';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface BreathingSession {
  id: string;
  name: string;
  duration: number;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  cycles: number;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  benefits: string[];
}

const breathingSessions: BreathingSession[] = [
  {
    id: '4-7-8',
    name: 'Respiration 4-7-8',
    duration: 240,
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    cycles: 8,
    description: 'Technique de relaxation profonde pour réduire le stress et favoriser le sommeil',
    difficulty: 'facile',
    benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Calme mental']
  },
  {
    id: 'box-breathing',
    name: 'Respiration Carrée',
    duration: 480,
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    cycles: 15,
    description: 'Technique utilisée par les forces spéciales pour maintenir le calme sous pression',
    difficulty: 'moyen',
    benefits: ['Concentration', 'Gestion du stress', 'Équilibre émotionnel']
  },
  {
    id: 'wim-hof',
    name: 'Méthode Wim Hof',
    duration: 600,
    inhaleTime: 2,
    holdTime: 0,
    exhaleTime: 2,
    cycles: 30,
    description: 'Respiration énergisante pour stimuler le système immunitaire',
    difficulty: 'difficile',
    benefits: ['Énergie', 'Système immunitaire', 'Résistance au froid']
  }
];

const VRBreathPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentTrack, isPlaying, togglePlay } = useMusic();
  
  const [selectedSession, setSelectedSession] = useState<BreathingSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [volume, setVolume] = useState([0.7]);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && selectedSession) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            stopSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isActive, selectedSession]);

  useEffect(() => {
    if (isActive && selectedSession) {
      runBreathingCycle();
    }
  }, [isActive, selectedSession, currentCycle]);

  const startSession = (session: BreathingSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setIsActive(true);
    
    toast({
      title: "Session démarrée",
      description: `Début de la session ${session.name}`,
    });
  };

  const stopSession = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setCurrentPhase('inhale');
    setPhaseTimer(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    
    toast({
      title: "Session terminée",
      description: "Bravo ! Vous avez terminé votre session de respiration",
    });
  };

  const pauseSession = () => {
    setIsActive(!isActive);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
  };

  const runBreathingCycle = () => {
    if (!selectedSession || currentCycle >= selectedSession.cycles) {
      stopSession();
      return;
    }

    const phases = [
      { name: 'inhale' as const, duration: selectedSession.inhaleTime },
      { name: 'hold' as const, duration: selectedSession.holdTime },
      { name: 'exhale' as const, duration: selectedSession.exhaleTime }
    ];

    let phaseIndex = 0;
    setCurrentPhase(phases[phaseIndex].name);
    setPhaseTimer(phases[phaseIndex].duration);

    phaseIntervalRef.current = setInterval(() => {
      setPhaseTimer(prev => {
        if (prev <= 1) {
          phaseIndex++;
          if (phaseIndex >= phases.length) {
            setCurrentCycle(c => c + 1);
            return 0;
          } else {
            setCurrentPhase(phases[phaseIndex].name);
            return phases[phaseIndex].duration;
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500';
      case 'moyen': return 'bg-yellow-500';
      case 'difficile': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-300';
      case 'hold': return 'from-purple-400 to-pink-300';
      case 'exhale': return 'from-green-400 to-teal-300';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      default: return '';
    }
  };

  const progress = selectedSession && timeRemaining > 0 
    ? ((selectedSession.duration - timeRemaining) / selectedSession.duration) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/app" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Retour</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <Wind className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Respiration VR</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedSession ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Introduction */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Wind className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Exercices de Respiration</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Découvrez des techniques de respiration guidées pour réduire le stress, 
                  améliorer votre concentration et favoriser votre bien-être général.
                </p>
              </div>

              {/* Sessions Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {breathingSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => startSession(session)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{session.name}</CardTitle>
                          <Badge className={cn('text-white', getDifficultyColor(session.difficulty))}>
                            {session.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {session.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Durée:</span>
                            <p className="font-semibold">{Math.floor(session.duration / 60)}min</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Cycles:</span>
                            <p className="font-semibold">{session.cycles}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="font-medium text-muted-foreground text-sm">Bénéfices:</span>
                          <div className="flex flex-wrap gap-1">
                            {session.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full mt-4" onClick={() => startSession(session)}>
                          <Play className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              {/* Session Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">{selectedSession.name}</h2>
                <p className="text-muted-foreground">{selectedSession.description}</p>
              </div>

              {/* Breathing Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <motion.div
                    className={cn(
                      "w-64 h-64 rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center",
                      getPhaseColor(currentPhase)
                    )}
                    animate={{
                      scale: currentPhase === 'inhale' ? 1.2 : currentPhase === 'hold' ? 1.1 : 1,
                    }}
                    transition={{
                      duration: currentPhase === 'inhale' ? selectedSession.inhaleTime : 
                               currentPhase === 'hold' ? selectedSession.holdTime : selectedSession.exhaleTime,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold mb-2">{getPhaseText(currentPhase)}</div>
                      <div className="text-4xl font-mono">{phaseTimer}s</div>
                      <div className="text-sm opacity-80 mt-2">
                        Cycle {currentCycle + 1}/{selectedSession.cycles}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Pulse effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-white/30"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progression</span>
                  <span>{Math.floor((selectedSession.duration - timeRemaining) / 60)}:{(selectedSession.duration - timeRemaining) % 60 < 10 ? '0' : ''}{(selectedSession.duration - timeRemaining) % 60} / {Math.floor(selectedSession.duration / 60)}:{selectedSession.duration % 60 < 10 ? '0' : ''}{selectedSession.duration % 60}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4 mb-8">
                <Button
                  onClick={pauseSession}
                  size="lg"
                  className="min-w-32"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Reprendre'}
                </Button>
                <Button
                  onClick={stopSession}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Arrêter
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{currentCycle}</div>
                  <div className="text-sm text-muted-foreground">Cycles complétés</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{Math.floor(progress)}%</div>
                  <div className="text-sm text-muted-foreground">Progression</div>
                </div>
                <div className="bg-card p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">
                    {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
                  </div>
                  <div className="text-sm text-muted-foreground">Temps restant</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 w-80 bg-card border rounded-lg shadow-lg p-4 z-50"
            >
              <h3 className="font-semibold mb-4 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres Audio
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Volume</span>
                    <span className="text-sm text-muted-foreground">{Math.round(volume[0] * 100)}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={1}
                      step={0.1}
                      className="flex-1"
                    />
                  </div>
                </div>

                {currentTrack && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Musique d'ambiance</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VRBreathPage;