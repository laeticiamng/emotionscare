
import React, { useState, useEffect } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wind, Play, Pause, RotateCcw, Timer, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  pattern: { inhale: number; hold: number; exhale: number; rest: number };
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  benefits: string[];
}

const BreathworkPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<BreathingSession | null>(null);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cycles, setCycles] = useState(0);

  const sessions: BreathingSession[] = [
    {
      id: '1',
      name: '4-7-8 Relaxation',
      description: 'Technique calmante pour réduire le stress et favoriser le sommeil',
      duration: 5,
      pattern: { inhale: 4, hold: 7, exhale: 8, rest: 0 },
      level: 'Débutant',
      benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Calme mental']
    },
    {
      id: '2',
      name: 'Respiration en Carré',
      description: 'Équilibrer le système nerveux avec un rythme régulier',
      duration: 8,
      pattern: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
      level: 'Intermédiaire',
      benefits: ['Équilibre nerveux', 'Concentration', 'Stabilité émotionnelle']
    },
    {
      id: '3',
      name: 'Respiration Énergisante',
      description: 'Stimuler l\'énergie et la vitalité',
      duration: 6,
      pattern: { inhale: 3, hold: 2, exhale: 3, rest: 1 },
      level: 'Avancé',
      benefits: ['Augmentation d\'énergie', 'Clarté mentale', 'Vitalité']
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentSession) {
      interval = setInterval(() => {
        setPhaseTime(prev => {
          const currentPhaseMax = currentSession.pattern[phase];
          
          if (prev >= currentPhaseMax) {
            // Passer à la phase suivante
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                break;
              case 'hold':
                setPhase('exhale');
                break;
              case 'exhale':
                if (currentSession.pattern.rest > 0) {
                  setPhase('rest');
                } else {
                  setPhase('inhale');
                  setCycles(c => c + 1);
                }
                break;
              case 'rest':
                setPhase('inhale');
                setCycles(c => c + 1);
                break;
            }
            return 0;
          }
          return prev + 0.1;
        });
        
        setTotalTime(prev => prev + 0.1);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, currentSession]);

  const startSession = (session: BreathingSession) => {
    setCurrentSession(session);
    setIsActive(true);
    setPhase('inhale');
    setPhaseTime(0);
    setTotalTime(0);
    setCycles(0);
  };

  const pauseSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setPhase('inhale');
    setPhaseTime(0);
    setTotalTime(0);
    setCycles(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez...';
      case 'hold': return 'Retenez...';
      case 'exhale': return 'Expirez...';
      case 'rest': return 'Pause...';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-purple-400 to-purple-600';
      case 'exhale': return 'from-green-400 to-green-600';
      case 'rest': return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
              <Wind className="w-8 h-8 text-primary" />
              Exercices de Respiration
            </h1>
            <p className="text-muted-foreground">
              Maîtrisez votre souffle pour réguler vos émotions et réduire le stress
            </p>
          </div>

          {!currentSession ? (
            // Sélection de session
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="glass-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{session.name}</CardTitle>
                      <Badge className={getLevelColor(session.level)}>
                        {session.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {session.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="w-4 h-4" />
                      <span>{session.duration} minutes</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Rythme :</h4>
                      <div className="text-sm text-muted-foreground">
                        {session.pattern.inhale}s inspiration - {session.pattern.hold}s rétention - {session.pattern.exhale}s expiration
                        {session.pattern.rest > 0 && ` - ${session.pattern.rest}s pause`}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Bienfaits :</h4>
                      <div className="flex flex-wrap gap-1">
                        {session.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startSession(session)}
                      className="w-full flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Session active
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <CardTitle>{currentSession.name}</CardTitle>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      {Math.floor(totalTime / 60)}:{String(Math.floor(totalTime % 60)).padStart(2, '0')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {cycles} cycles
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Cercle de respiration animé */}
                  <div className="flex justify-center">
                    <div className="relative w-64 h-64">
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()}`}
                        animate={{
                          scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1,
                        }}
                        transition={{
                          duration: currentSession.pattern[phase],
                          ease: "easeInOut"
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <p className="text-2xl font-bold">{getPhaseInstruction()}</p>
                          <p className="text-lg">
                            {Math.ceil(currentSession.pattern[phase] - phaseTime)}s
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression de la phase */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{phase}</span>
                      <span>{Math.ceil(currentSession.pattern[phase] - phaseTime)}s</span>
                    </div>
                    <Progress 
                      value={(phaseTime / currentSession.pattern[phase]) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Contrôles */}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={pauseSession}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      {isActive ? 'Pause' : 'Reprendre'}
                    </Button>
                    
                    <Button
                      onClick={resetSession}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Arrêter
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setCurrentSession(null)}
                    variant="ghost"
                    className="w-full"
                  >
                    Choisir un autre exercice
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </UnifiedShell>
    </div>
  );
};

export default BreathworkPage;
