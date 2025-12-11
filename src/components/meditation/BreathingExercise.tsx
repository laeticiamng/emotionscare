import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Vibrate, 
  Volume2, 
  Trophy,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BreathingPattern {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale?: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: '478',
    name: "4-7-8 (Relaxation)",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Excellent pour réduire l'anxiété et favoriser l'endormissement",
    difficulty: 'intermediate',
    benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Calme nerveux']
  },
  {
    id: 'box',
    name: "Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    description: "Technique utilisée par les forces spéciales pour la concentration",
    difficulty: 'beginner',
    benefits: ['Focus', 'Contrôle émotionnel', 'Clarté mentale']
  },
  {
    id: 'triangle',
    name: "Triangle Breathing",
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: "Simple et efficace pour débutants",
    difficulty: 'beginner',
    benefits: ['Facile à apprendre', 'Relaxation rapide']
  },
  {
    id: 'energizing',
    name: "Respiration Énergisante",
    inhale: 2,
    hold: 0,
    exhale: 2,
    description: "Stimule l'énergie et la vigilance",
    difficulty: 'beginner',
    benefits: ['Boost d\'énergie', 'Réveil', 'Vivacité']
  },
  {
    id: 'coherence',
    name: "Cohérence Cardiaque",
    inhale: 5,
    hold: 0,
    exhale: 5,
    description: "5 respirations par minute pour l'équilibre",
    difficulty: 'intermediate',
    benefits: ['Équilibre nerveux', 'Régulation émotionnelle', 'HRV amélioré']
  }
];

const STATS_KEY = 'breathing-exercise-stats';

const BreathingExercise: React.FC = () => {
  const { toast } = useToast();
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  // Settings
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalCycles: 0,
    totalMinutes: 0,
    longestSession: 0,
  });

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  // Save stats
  const saveStats = useCallback((newStats: typeof stats) => {
    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  }, []);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [hapticEnabled]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
        setTimer((prev) => {
          const newTimer = prev + 1;
          
          const getCurrentPhaseDuration = () => {
            switch (phase) {
              case 'inhale': return selectedPattern.inhale;
              case 'hold': return selectedPattern.hold;
              case 'exhale': return selectedPattern.exhale;
              case 'holdAfterExhale': return selectedPattern.holdAfterExhale || 0;
              default: return 0;
            }
          };

          const currentDuration = getCurrentPhaseDuration();
          
          if (newTimer >= currentDuration) {
            triggerHaptic();
            
            // Determine next phase
            if (phase === 'inhale') {
              if (selectedPattern.hold > 0) {
                setPhase('hold');
              } else {
                setPhase('exhale');
              }
            } else if (phase === 'hold') {
              setPhase('exhale');
            } else if (phase === 'exhale') {
              if (selectedPattern.holdAfterExhale && selectedPattern.holdAfterExhale > 0) {
                setPhase('holdAfterExhale');
              } else {
                setPhase('inhale');
                setCycle(c => c + 1);
              }
            } else if (phase === 'holdAfterExhale') {
              setPhase('inhale');
              setCycle(c => c + 1);
            }
            return 0;
          }
          
          return newTimer;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, selectedPattern, triggerHaptic]);

  const toggleExercise = () => {
    if (!isActive) {
      // Starting
      setIsActive(true);
    } else {
      // Pausing
      setIsActive(false);
    }
  };

  const resetExercise = () => {
    // Save stats before reset
    if (cycle > 0 || totalTime > 0) {
      const newStats = {
        totalSessions: stats.totalSessions + 1,
        totalCycles: stats.totalCycles + cycle,
        totalMinutes: stats.totalMinutes + Math.floor(totalTime / 60),
        longestSession: Math.max(stats.longestSession, totalTime),
      };
      saveStats(newStats);
      
      if (cycle >= 3) {
        toast({
          title: 'Session terminée !',
          description: `${cycle} cycles en ${Math.floor(totalTime / 60)}min`,
        });
      }
    }
    
    setIsActive(false);
    setPhase('inhale');
    setTimer(0);
    setCycle(0);
    setTotalTime(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'holdAfterExhale': return 'Pause';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-blue-500 border-blue-500';
      case 'hold': return 'text-amber-500 border-amber-500';
      case 'exhale': return 'text-emerald-500 border-emerald-500';
      case 'holdAfterExhale': return 'text-purple-500 border-purple-500';
      default: return '';
    }
  };

  const getCurrentDuration = () => {
    switch (phase) {
      case 'inhale': return selectedPattern.inhale;
      case 'hold': return selectedPattern.hold;
      case 'exhale': return selectedPattern.exhale;
      case 'holdAfterExhale': return selectedPattern.holdAfterExhale || 0;
      default: return 0;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate scale for breathing animation
  const getScale = () => {
    const progress = timer / getCurrentDuration();
    if (phase === 'inhale') return 0.9 + (0.2 * progress);
    if (phase === 'exhale') return 1.1 - (0.2 * progress);
    return 1.1;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Exercices de Respiration
                <Badge variant="secondary">{cycle} cycles</Badge>
              </CardTitle>
              <CardDescription>
                {isActive ? formatTime(totalTime) : 'Choisissez un pattern et commencez'}
              </CardDescription>
            </div>
            
            {/* Quick stats */}
            {stats.totalSessions > 0 && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {stats.totalSessions} sessions
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {stats.totalMinutes}min total
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Pattern selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {breathingPatterns.map((pattern) => (
                <Card
                  key={pattern.id}
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedPattern.id === pattern.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => !isActive && setSelectedPattern(pattern)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{pattern.name}</h3>
                      <Badge className={getDifficultyColor(pattern.difficulty)} variant="secondary">
                        {pattern.difficulty === 'beginner' ? 'Débutant' : 
                         pattern.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {pattern.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">
                        {pattern.inhale}s - {pattern.hold}s - {pattern.exhale}s
                        {pattern.holdAfterExhale ? ` - ${pattern.holdAfterExhale}s` : ''}
                      </Badge>
                    </div>
                    {selectedPattern.id === pattern.id && pattern.benefits.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pattern.benefits.map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Zap className="h-2 w-2 mr-1" />
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Settings */}
            <div className="flex items-center justify-center gap-6 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Vibrate className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="haptic" className="text-sm">Vibration</Label>
                <Switch
                  id="haptic"
                  checked={hapticEnabled}
                  onCheckedChange={setHapticEnabled}
                />
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sound" className="text-sm">Son</Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>

            {/* Exercise visualization */}
            <div className="text-center space-y-6">
              <div className="relative w-48 h-48 mx-auto">
                <div 
                  className={cn(
                    'w-full h-full rounded-full border-4 transition-all duration-1000 flex items-center justify-center',
                    getPhaseColor()
                  )}
                  style={{
                    transform: `scale(${getScale()})`,
                    background: `conic-gradient(from 0deg, currentColor ${(timer / getCurrentDuration()) * 360}deg, transparent 0deg)`
                  }}
                >
                  <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className={cn('text-2xl font-bold mb-1', getPhaseColor().split(' ')[0])}>
                        {getPhaseText()}
                      </div>
                      <div className="text-3xl font-mono font-bold">
                        {getCurrentDuration() - timer}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        secondes
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase progress */}
              <div className="max-w-xs mx-auto space-y-1">
                <Progress value={(timer / getCurrentDuration()) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{timer}s</span>
                  <span>{getCurrentDuration()}s</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleExercise}
                  variant={isActive ? "secondary" : "default"}
                  size="lg"
                  className="min-w-[140px]"
                >
                  {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isActive ? 'Pause' : 'Commencer'}
                </Button>
                
                <Button
                  onClick={resetExercise}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExercise;
