// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Trophy, Zap, Target, Award } from 'lucide-react';
import { useWebAudio } from '@/hooks/useWebAudio';
import { useWebBluetooth } from '@/hooks/useWebBluetooth';
import { supabase } from '@/integrations/supabase/client';
import { triggerConfetti } from '@/lib/confetti';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: { inhale: number; hold1: number; exhale: number; hold2: number };
  difficulty: 'débutant' | 'intermédiaire' | 'avancé';
  points: number;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'classic_478',
    name: 'Classique 4-7-8',
    description: 'Pattern de base pour la relaxation',
    phases: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    difficulty: 'débutant',
    points: 10,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'energizing_456',
    name: 'Énergisant 4-5-6',
    description: 'Booste votre énergie naturellement',
    phases: { inhale: 4, hold1: 5, exhale: 6, hold2: 0 },
    difficulty: 'débutant',
    points: 15,
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'box_breathing',
    name: 'Respiration Box 4-4-4-4',
    description: 'Utilisé par les forces spéciales',
    phases: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    difficulty: 'intermédiaire',
    points: 20,
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'advanced_6810',
    name: 'Avancé 6-8-10',
    description: 'Pour les experts en méditation',
    phases: { inhale: 6, hold1: 8, exhale: 10, hold2: 0 },
    difficulty: 'avancé',
    points: 30,
    color: 'from-purple-400 to-indigo-600'
  }
];

interface EnhancedFlashGlowProps {
  selectedDuration?: 2 | 5 | 10;
  onSessionComplete?: (duration: number, score: number, pattern: string) => void;
}

export default function EnhancedFlashGlow({ 
  selectedDuration = 2, 
  onSessionComplete 
}: EnhancedFlashGlowProps) {
  const { playTone, stopAll } = useWebAudio();
  const { isConnected: hrConnected, heartRate } = useWebBluetooth();
  
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  // Calculate cycles based on selected duration (approx 15s per cycle for 4-7-8 pattern)
  const durationCyclesMap: Record<number, number> = { 2: 6, 5: 15, 10: 30 };
  const [totalCycles, setTotalCycles] = useState(durationCyclesMap[selectedDuration] || 8);
  const [isActive, setIsActive] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [perfectBreaths, setPerfectBreaths] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const initialAchievements: Achievement[] = [
    {
      id: 'first_session',
      title: 'Premier Souffle',
      description: 'Complétez votre première session',
      icon: '🌟',
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'streak_master',
      title: 'Maître de la Régularité',
      description: 'Maintenez un rythme parfait pendant 5 cycles',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'pattern_explorer',
      title: 'Explorateur de Patterns',
      description: 'Essayez tous les patterns de respiration',
      icon: '🧭',
      unlocked: false,
      progress: 0,
      maxProgress: 4
    },
    {
      id: 'zen_master',
      title: 'Maître Zen',
      description: 'Atteignez 1000 points au total',
      icon: '🧘',
      unlocked: false,
      progress: 0,
      maxProgress: 1000
    }
  ];

  useEffect(() => {
    setAchievements(initialAchievements);
  }, []);

  // Update cycles when duration changes
  useEffect(() => {
    const newCycles = durationCyclesMap[selectedDuration] || 8;
    setTotalCycles(newCycles);
  }, [selectedDuration]);

  // Animation de la sphère
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const phaseProgress = phaseTime / selectedPattern.phases[currentPhase];
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Taille de la sphère basée sur la phase
      let targetSize = 100;
      if (currentPhase === 'inhale') {
        targetSize = 100 + (phaseProgress * 80);
      } else if (currentPhase === 'exhale') {
        targetSize = 180 - (phaseProgress * 80);
      } else {
        targetSize = 180;
      }

      // Couleur dynamique
      const colors = selectedPattern.color.match(/from-(\w+)-\d+ to-(\w+)-\d+/);
      const intensity = Math.sin(phaseTime * 0.5) * 0.3 + 0.7;
      
      // Dessiner la sphère avec effet glow
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Effet glow
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, targetSize + i * 20, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(200, 70%, 60%, ${0.1 - i * 0.02})`;
        ctx.fill();
      }
      
      // Sphère principale
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, targetSize);
      gradient.addColorStop(0, `hsla(${currentPhase === 'inhale' ? 200 : currentPhase === 'exhale' ? 280 : 240}, 70%, 70%, ${intensity})`);
      gradient.addColorStop(1, `hsla(${currentPhase === 'inhale' ? 200 : currentPhase === 'exhale' ? 280 : 240}, 70%, 40%, 0.3)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, targetSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Particules flottantes
      for (let i = 0; i < 20; i++) {
        const angle = (Date.now() * 0.001 + i * 0.3) % (Math.PI * 2);
        const radius = targetSize + 30 + Math.sin(angle * 3) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${200 + i * 10}, 70%, 60%, 0.6)`;
        ctx.fill();
      }

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    canvas.width = 400;
    canvas.height = 400;
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, currentPhase, phaseTime, selectedPattern]);

  // Logique de progression des phases
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setPhaseTime(prev => {
          const newTime = prev + 0.1;
          const phaseDuration = selectedPattern.phases[currentPhase];
          
          if (newTime >= phaseDuration) {
            // Passage à la phase suivante
            const phases: Array<'inhale' | 'hold1' | 'exhale' | 'hold2'> = ['inhale', 'hold1', 'exhale', 'hold2'];
            const currentIndex = phases.indexOf(currentPhase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            
            setCurrentPhase(nextPhase);
            
            // Si on revient à 'inhale', c'est un nouveau cycle
            if (nextPhase === 'inhale' && currentPhase === 'hold2') {
              const newCycleCount = cycleCount + 1;
              setCycleCount(newCycleCount);
              checkPerfectBreath();
              
              if (newCycleCount >= totalCycles) {
                completeSession();
              }
            }
            
            // Jouer le son de guidage
            playGuidanceSound(nextPhase);
            
            return 0;
          }
          
          return newTime;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isActive, currentPhase, cycleCount, totalCycles, selectedPattern]);

  const playGuidanceSound = (phase: string) => {
    const frequencies = {
      inhale: 440,    // A4 - montant
      hold1: 523,     // C5 - stable aigu
      exhale: 349,    // F4 - descendant
      hold2: 294      // D4 - stable grave
    };
    
    playTone(frequencies[phase], 0.3, 0.3);
  };

  const checkPerfectBreath = () => {
    // Logique pour détecter un souffle "parfait"
    // Basé sur la régularité du rythme cardiaque si connecté
    if (hrConnected && heartRate) {
      setPerfectBreaths(prev => prev + 1);
      updateAchievement('streak_master', perfectBreaths + 1);
    }
  };

  const updateAchievement = (id: string, progress: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === id) {
        const newProgress = Math.min(progress, achievement.maxProgress);
        const wasUnlocked = achievement.unlocked;
        const isUnlocked = newProgress >= achievement.maxProgress;
        
        if (!wasUnlocked && isUnlocked) {
          triggerConfetti();
          toast({
            title: "🏆 Achievement Débloqué!",
            description: `${achievement.title}: ${achievement.description}`,
          });
        }
        
        return { ...achievement, progress: newProgress, unlocked: isUnlocked };
      }
      return achievement;
    }));
  };

  const completeSession = async () => {
    setIsActive(false);
    
    const sessionScore = calculateScore();
    const newTotalScore = totalScore + sessionScore;
    const sessionDurationSec = totalCycles * Object.values(selectedPattern.phases).reduce((a, b) => a + b, 0);
    
    setTotalScore(newTotalScore);
    setSessionStreak(prev => prev + 1);
    
    // Mise à jour des achievements
    updateAchievement('first_session', 1);
    updateAchievement('zen_master', newTotalScore);
    
    // Callback pour la page parent
    if (onSessionComplete) {
      onSessionComplete(sessionDurationSec, sessionScore, selectedPattern.id);
    }
    
    // Sauvegarder en base
    try {
      await supabase.functions.invoke('flash-glow-metrics', {
        body: {
          pattern: selectedPattern.id,
          duration_sec: sessionDurationSec,
          cycles_completed: cycleCount,
          perfect_breaths: perfectBreaths,
          score: sessionScore,
          hr_data: hrConnected ? { avg: heartRate, connected: true } : null
        }
      });
    } catch (error) {
      logger.error('Erreur sauvegarde', error as Error, 'UI');
    }

    triggerConfetti();
    toast({
      title: "🌟 Session Terminée!",
      description: `+${sessionScore} points • Série: ${sessionStreak}`,
    });
  };

  const calculateScore = (): number => {
    let score = selectedPattern.points * cycleCount;
    score += perfectBreaths * 5; // Bonus perfect breath
    if (hrConnected) score *= 1.2; // Bonus capteur
    return Math.round(score);
  };

  const startSession = () => {
    setIsActive(true);
    setCycleCount(0);
    setPerfectBreaths(0);
    setPhaseTime(0);
    setCurrentPhase('inhale');
  };

  const pauseSession = () => {
    setIsActive(false);
    stopAll();
  };

  const resetSession = () => {
    setIsActive(false);
    setCycleCount(0);
    setPerfectBreaths(0);
    setPhaseTime(0);
    setCurrentPhase('inhale');
    stopAll();
  };

  const phaseProgress = (phaseTime / selectedPattern.phases[currentPhase]) * 100;
  const overallProgress = (cycleCount / totalCycles) * 100;

  const phaseInstructions = {
    inhale: 'Inspirez profondément',
    hold1: 'Retenez votre souffle',
    exhale: 'Expirez lentement',
    hold2: 'Pause naturelle'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header avec stats */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Flash Glow Pro
            </h1>
            <p className="text-muted-foreground">Respiration guidée avec gamification</p>
          </div>
          
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-bold text-lg">{totalScore}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-bold text-lg">{sessionStreak}</div>
                  <div className="text-xs text-muted-foreground">Série</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Zone principale */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Target className="h-6 w-6" />
                  {selectedPattern.name}
                </CardTitle>
                <div className="flex justify-center gap-2">
                  <Badge variant={selectedPattern.difficulty === 'débutant' ? 'default' : 
                                selectedPattern.difficulty === 'intermédiaire' ? 'secondary' : 'destructive'}>
                    {selectedPattern.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedPattern.points} pts/cycle</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Visualisation canvas */}
                <div className="flex justify-center">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      className="rounded-full shadow-2xl"
                      style={{ maxWidth: '300px', maxHeight: '300px' }}
                    />
                    
                    {/* Instructions au centre */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center pointer-events-none">
                      <div className="text-2xl font-bold mb-2">
                        {phaseInstructions[currentPhase]}
                      </div>
                      <div className="text-lg">
                        {Math.ceil(selectedPattern.phases[currentPhase] - phaseTime)}s
                      </div>
                      {perfectBreaths > 0 && (
                        <div className="text-sm text-yellow-300 mt-2">
                          ✨ {perfectBreaths} parfaits
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barres de progression */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Phase: {currentPhase}</span>
                      <span>{Math.round(phaseProgress)}%</span>
                    </div>
                    <Progress value={phaseProgress} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Session</span>
                      <span>{cycleCount}/{totalCycles} cycles</span>
                    </div>
                    <Progress value={overallProgress} className="h-3" />
                  </div>
                </div>

                {/* Données biométriques */}
                {hrConnected && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">{heartRate}</div>
                    <div className="text-sm text-muted-foreground">BPM • Connecté</div>
                  </div>
                )}

                {/* Contrôles */}
                <div className="flex justify-center gap-4">
                  {!isActive ? (
                    <Button onClick={startSession} size="lg" className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Démarrer
                    </Button>
                  ) : (
                    <Button onClick={pauseSession} size="lg" variant="outline" className="flex items-center gap-2">
                      <Pause className="h-5 w-5" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetSession} size="lg" variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sélection de pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patterns de Respiration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {breathingPatterns.map(pattern => (
                  <div
                    key={pattern.id}
                    className={`p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedPattern.id === pattern.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => !isActive && setSelectedPattern(pattern)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-xs text-muted-foreground">{pattern.description}</div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">{pattern.difficulty}</Badge>
                          <Badge variant="outline" className="text-xs">{pattern.points}pts</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.unlocked ? 'text-yellow-600' : ''}`}>
                          {achievement.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1 mt-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}/{achievement.maxProgress}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}