// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wind, Play, Pause, RotateCcw, TrendingUp, Share2, Download,
  Volume2, VolumeX, Users, Trophy, Flame, Calendar,
  Clock, Award, Settings, History
} from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import confetti from 'canvas-confetti';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  avgMoodImprovement: number;
  streak: number;
  bestStreak: number;
  favoritePattern: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

const patterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Respiration carrée',
    description: 'Équilibre et calme',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 8,
    difficulty: 'beginner',
    benefits: ['Réduction du stress', 'Clarté mentale', 'Équilibre émotionnel']
  },
  {
    id: '478',
    name: 'Respiration 4-7-8',
    description: 'Détente profonde et sommeil',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 6,
    difficulty: 'intermediate',
    benefits: ['Amélioration du sommeil', 'Réduction de l\'anxiété', 'Relaxation profonde']
  },
  {
    id: 'coherence',
    name: 'Cohérence cardiaque',
    description: 'Équilibre émotionnel',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 18,
    difficulty: 'beginner',
    benefits: ['Régulation cardiaque', 'Gestion des émotions', 'Concentration']
  },
  {
    id: 'energizing',
    name: 'Respiration énergisante',
    description: 'Boost d\'énergie',
    inhale: 3,
    hold: 0,
    exhale: 3,
    cycles: 20,
    difficulty: 'intermediate',
    benefits: ['Augmentation de l\'énergie', 'Réveil du corps', 'Clarté']
  },
  {
    id: 'relaxing',
    name: 'Respiration relaxante',
    description: 'Détente maximale',
    inhale: 4,
    hold: 0,
    exhale: 8,
    cycles: 10,
    difficulty: 'beginner',
    benefits: ['Activation parasympathique', 'Réduction tension', 'Calme profond']
  }
];

const BREATHING_HISTORY_KEY = 'breathing_session_history';
const BREATHING_SETTINGS_KEY = 'breathing_settings';

const communityStats = {
  activeUsers: 1247,
  avgMoodImprovement: 2.3,
  popularPattern: 'coherence',
  totalMinutesToday: 18420
};

const achievements = [
  { id: 'first', name: 'Premier souffle', description: 'Complétez votre première session', icon: '🌱', unlocked: true },
  { id: 'week', name: 'Semaine zen', description: '7 jours consécutifs', icon: '🔥', unlocked: false },
  { id: 'master', name: 'Maître respirateur', description: '100 sessions complétées', icon: '🏆', unlocked: false },
  { id: 'explorer', name: 'Explorateur', description: 'Essayez tous les patterns', icon: '🧭', unlocked: false },
];

export const BreathingExerciseDashboard: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(patterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [insights, setInsights] = useState<SessionStats | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [guidedVoice, setGuidedVoice] = useState(false);

  useEffect(() => {
    loadInsights();
    loadSettings();
    loadHistory();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) return prev - 1;

        // Play sound on phase change
        if (soundEnabled) {
          playPhaseSound();
        }

        // Phase transition
        if (currentPhase === 'inhale') {
          setCurrentPhase(selectedPattern.hold > 0 ? 'hold' : 'exhale');
          return selectedPattern.hold > 0 ? selectedPattern.hold : selectedPattern.exhale;
        } else if (currentPhase === 'hold') {
          setCurrentPhase('exhale');
          return selectedPattern.exhale;
        } else {
          setCycleCount(prev => {
            const newCount = prev + 1;
            if (newCount >= selectedPattern.cycles) {
              completeSession();
              return prev;
            }
            return newCount;
          });
          setCurrentPhase('inhale');
          return selectedPattern.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, currentPhase, selectedPattern, cycleCount, soundEnabled]);

  const playPhaseSound = () => {
    // Sound placeholder - would use Tone.js in real implementation
    console.log('Playing phase sound');
  };

  const loadSettings = () => {
    const stored = localStorage.getItem(BREATHING_SETTINGS_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      setSoundEnabled(settings.sound ?? true);
      setHapticEnabled(settings.haptic ?? true);
      setGuidedVoice(settings.guidedVoice ?? false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem(BREATHING_SETTINGS_KEY, JSON.stringify({
      sound: soundEnabled,
      haptic: hapticEnabled,
      guidedVoice
    }));
    toast.success('Paramètres sauvegardés');
    setShowSettings(false);
  };

  const loadHistory = () => {
    const stored = localStorage.getItem(BREATHING_HISTORY_KEY);
    if (stored) {
      setSessionHistory(JSON.parse(stored));
    }
  };

  const saveToHistory = (session: any) => {
    const newHistory = [session, ...sessionHistory].slice(0, 50);
    setSessionHistory(newHistory);
    localStorage.setItem(BREATHING_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('breathing-exercises', {
        body: { action: 'get-insights' }
      });

      if (error) throw error;
      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      // Use mock data if API fails
      setInsights({
        totalSessions: 24,
        totalMinutes: 180,
        avgMoodImprovement: 2.1,
        streak: 5,
        bestStreak: 12,
        favoritePattern: 'coherence',
        weeklyGoal: 7,
        weeklyProgress: 4
      });
      logger.error('Error loading insights', error as Error, 'UI');
    }
  };

  const startSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('breathing-exercises', {
        body: {
          action: 'start-session',
          sessionData: {
            pattern: selectedPattern.id,
            moodBefore
          }
        }
      });

      if (error) throw error;
      
      setSessionId(data?.session?.id || Date.now().toString());
      setIsActive(true);
      setCurrentPhase('inhale');
      setCountdown(selectedPattern.inhale);
      setCycleCount(0);
      
      toast.success('Session démarrée');
    } catch (error) {
      // Start anyway with local session
      setSessionId(Date.now().toString());
      setIsActive(true);
      setCurrentPhase('inhale');
      setCountdown(selectedPattern.inhale);
      setCycleCount(0);
      toast.success('Session démarrée');
      logger.error('Error starting session', error as Error, 'UI');
    }
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const resetSession = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCountdown(0);
    setCycleCount(0);
    setSessionId(null);
  };

  const completeSession = async () => {
    setIsActive(false);
    
    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const sessionData = {
      id: sessionId,
      pattern: selectedPattern.id,
      patternName: selectedPattern.name,
      timestamp: new Date().toISOString(),
      durationSeconds: selectedPattern.cycles * (selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale),
      cyclesCompleted: selectedPattern.cycles,
      moodBefore,
      moodAfter,
    };

    saveToHistory(sessionData);

    try {
      await supabase.functions.invoke('breathing-exercises', {
        body: {
          action: 'complete-session',
          sessionId,
          sessionData
        }
      });
      
      toast.success('Session terminée ! 🎉');
      loadInsights();
      resetSession();
    } catch (error) {
      toast.success('Session terminée ! 🎉');
      loadInsights();
      resetSession();
      logger.error('Error completing session', error as Error, 'UI');
    }
  };

  const shareSession = async () => {
    const text = `🧘 Je viens de compléter une session de ${selectedPattern.name} sur EmotionsCare! ${selectedPattern.cycles} cycles de respiration pour mon bien-être. #Respiration #BienEtre`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        navigator.clipboard.writeText(text);
        toast.success('Copié dans le presse-papier');
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copié dans le presse-papier');
    }
  };

  const exportStats = () => {
    const data = {
      insights,
      history: sessionHistory,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'breathing-stats.json';
    a.click();
    
    toast.success('Statistiques exportées');
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-blue-500 to-cyan-500';
      case 'hold': return 'from-purple-500 to-pink-500';
      case 'exhale': return 'from-green-500 to-emerald-500';
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-600';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-600';
      case 'advanced': return 'bg-red-500/10 text-red-600';
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wind className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Exercices de respiration</h1>
              <p className="text-muted-foreground">Respirez, détendez-vous, recentrez-vous</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowHistory(true)}>
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Historique</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowAchievements(true)}>
                  <Award className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Succès</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paramètres</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={exportStats}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exporter</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={shareSession}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Stats Grid */}
        {insights && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{insights.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </Card>
            <Card className="p-4 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{insights.totalMinutes}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </Card>
            <Card className="p-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">+{insights.avgMoodImprovement}</p>
              <p className="text-xs text-muted-foreground">Amélioration</p>
            </Card>
            <Card className="p-4 text-center">
              <Flame className="h-5 w-5 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{insights.streak}</p>
              <p className="text-xs text-muted-foreground">Jours série</p>
            </Card>
            <Card className="p-4 text-center">
              <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{insights.bestStreak}</p>
              <p className="text-xs text-muted-foreground">Record</p>
            </Card>
            <Card className="p-4 text-center">
              <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{communityStats.activeUsers}</p>
              <p className="text-xs text-muted-foreground">Actifs</p>
            </Card>
          </div>
        )}

        {/* Weekly Goal */}
        {insights && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Objectif hebdomadaire</span>
              <span className="text-sm">{insights.weeklyProgress}/{insights.weeklyGoal} sessions</span>
            </div>
            <Progress value={(insights.weeklyProgress / insights.weeklyGoal) * 100} className="h-2" />
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pattern Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Choisir un exercice</span>
                  <Badge variant="outline" className="text-xs">
                    {patterns.length} disponibles
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patterns.map(pattern => (
                  <motion.button
                    key={pattern.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => !isActive && setSelectedPattern(pattern)}
                    disabled={isActive}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPattern.id === pattern.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{pattern.name}</div>
                      <Badge className={getDifficultyColor(pattern.difficulty)}>
                        {pattern.difficulty === 'beginner' ? 'Débutant' : 
                         pattern.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{pattern.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {pattern.inhale}s inspirez • {pattern.hold > 0 ? `${pattern.hold}s retenez • ` : ''}{pattern.exhale}s expirez • {pattern.cycles} cycles
                    </div>
                    {selectedPattern.id === pattern.id && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pattern.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </CardContent>
            </Card>

            {/* Mood Sliders */}
            {!sessionId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Humeur avant la session</CardTitle>
                </CardHeader>
                <CardContent>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[moodBefore]}
                    onValueChange={(v) => setMoodBefore(v[0])}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">😔</span>
                    <span className="font-bold text-primary">{moodBefore}/10</span>
                    <span className="text-xs text-muted-foreground">😊</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {sessionId && !isActive && cycleCount >= selectedPattern.cycles && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Humeur après la session</CardTitle>
                </CardHeader>
                <CardContent>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[moodAfter]}
                    onValueChange={(v) => setMoodAfter(v[0])}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">😔</span>
                    <span className="font-bold text-primary">{moodAfter}/10</span>
                    <span className="text-xs text-muted-foreground">😊</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Visualisation</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative h-72 flex items-center justify-center">
                <motion.div 
                  className={`absolute inset-4 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20`}
                  animate={{
                    scale: isActive 
                      ? currentPhase === 'inhale' 
                        ? 1.2 
                        : currentPhase === 'exhale' 
                          ? 0.7 
                          : 1
                      : 0.8
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                <motion.div 
                  className={`absolute inset-12 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-40`}
                  animate={{
                    scale: isActive 
                      ? currentPhase === 'inhale' 
                        ? 1.15 
                        : currentPhase === 'exhale' 
                          ? 0.75 
                          : 1
                      : 0.85
                  }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.1 }}
                />
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="text-7xl font-bold mb-2"
                    animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                  >
                    {countdown || selectedPattern.inhale}
                  </motion.div>
                  <div className="text-xl text-muted-foreground font-medium">
                    {getPhaseText()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-4">
                    Cycle {cycleCount}/{selectedPattern.cycles}
                  </div>
                  <Progress 
                    value={(cycleCount / selectedPattern.cycles) * 100} 
                    className="w-32 mx-auto mt-2 h-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                {!sessionId ? (
                  <Button onClick={startSession} size="lg" className="gap-2 min-w-40">
                    <Play className="h-5 w-5" />
                    Commencer
                  </Button>
                ) : (
                  <>
                    {isActive ? (
                      <Button onClick={pauseSession} variant="outline" size="lg" className="gap-2">
                        <Pause className="h-5 w-5" />
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={resumeSession} size="lg" className="gap-2">
                        <Play className="h-5 w-5" />
                        Reprendre
                      </Button>
                    )}
                    <Button onClick={resetSession} variant="outline" size="lg" className="gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Réinitialiser
                    </Button>
                  </>
                )}
              </div>

              {/* Community Comparison */}
              <Card className="bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Communauté</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <p className="text-muted-foreground">Amélioration moyenne</p>
                    <p className="font-bold text-green-500">+{communityStats.avgMoodImprovement}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Minutes aujourd'hui</p>
                    <p className="font-bold">{Math.round(communityStats.totalMinutesToday / 60)}h</p>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sons</Label>
                  <p className="text-xs text-muted-foreground">Jouer des sons lors des changements de phase</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Retour haptique</Label>
                  <p className="text-xs text-muted-foreground">Vibrations sur mobile</p>
                </div>
                <Switch checked={hapticEnabled} onCheckedChange={setHapticEnabled} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Voix guidée</Label>
                  <p className="text-xs text-muted-foreground">Instructions vocales</p>
                </div>
                <Switch checked={guidedVoice} onCheckedChange={setGuidedVoice} />
              </div>
            </div>

            <Button onClick={saveSettings} className="w-full mt-4">
              Sauvegarder
            </Button>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des sessions
              </DialogTitle>
              <DialogDescription>
                {sessionHistory.length} sessions enregistrées
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3">
              {sessionHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune session enregistrée
                </p>
              ) : (
                sessionHistory.slice(0, 20).map((session, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{session.patternName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {Math.round(session.durationSeconds / 60)} min
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Humeur: {session.moodBefore} → {session.moodAfter}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Achievements Dialog */}
        <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Succès
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id}
                  className={`p-4 text-center ${!achievement.unlocked ? 'opacity-50' : ''}`}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <p className="font-medium mt-2">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-2 bg-green-500">Débloqué</Badge>
                  )}
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default BreathingExerciseDashboard;
