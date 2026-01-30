/**
 * B2CScreenSilkBreakPage - Module de pauses écran intelligentes
 * Fonctionnalités: Timer 20-20-20, exercices oculaires guidés, tracking, notifications
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Monitor, Eye, Clock, Pause, Play, Settings, TrendingDown, 
  AlertTriangle, CheckCircle, Timer, Bell, BellOff, RotateCcw,
  Target, Sparkles, ArrowLeft, Volume2, VolumeX, X, Trophy,
  Calendar, BarChart3, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import PageRoot from '@/components/common/PageRoot';
import { useAuth } from '@/contexts/AuthContext';

// Types
interface BreakSession {
  id: string;
  type: 'micro' | 'short' | 'long';
  name: string;
  duration: number;
  description: string;
  exercises: Exercise[];
  color: string;
  xp: number;
}

interface Exercise {
  id: string;
  name: string;
  duration: number;
  instruction: string;
  icon: string;
}

interface SessionHistory {
  id: string;
  type: string;
  completedAt: Date;
  duration: number;
  exercisesCompleted: number;
  xpEarned: number;
}

interface DailyStats {
  date: string;
  breaksCompleted: number;
  totalMinutes: number;
  xpEarned: number;
  eyeStrainReduction: number;
}

// Exercises data
const EXERCISES: Record<string, Exercise[]> = {
  micro: [
    { id: 'blink', name: 'Clignements rapides', duration: 5, instruction: 'Clignez des yeux rapidement 20 fois', icon: '👁️' },
    { id: 'far', name: 'Regard au loin', duration: 10, instruction: 'Regardez un objet à 6 mètres pendant 10 secondes', icon: '🏔️' },
    { id: 'stretch', name: 'Étirement léger', duration: 5, instruction: 'Étirez vos bras au-dessus de la tête', icon: '🙆' },
  ],
  short: [
    { id: 'palming', name: 'Palming', duration: 30, instruction: 'Couvrez vos yeux avec vos paumes et respirez', icon: '🙌' },
    { id: 'circles', name: 'Cercles oculaires', duration: 20, instruction: 'Faites des cercles avec vos yeux dans les deux sens', icon: '🔄' },
    { id: 'focus', name: 'Focus proche/loin', duration: 30, instruction: 'Alternez le regard entre votre doigt et un objet lointain', icon: '👆' },
    { id: 'neck', name: 'Rotation du cou', duration: 20, instruction: 'Faites des rotations lentes de la nuque', icon: '🔃' },
    { id: 'breathe', name: 'Respiration profonde', duration: 60, instruction: 'Inspirez 4s, retenez 4s, expirez 6s', icon: '🌬️' },
  ],
  long: [
    { id: 'walk', name: 'Marche légère', duration: 180, instruction: 'Levez-vous et marchez quelques minutes', icon: '🚶' },
    { id: 'yoga', name: 'Yoga des yeux', duration: 120, instruction: 'Série complète d\'exercices oculaires', icon: '🧘' },
    { id: 'meditation', name: 'Mini-méditation', duration: 180, instruction: 'Fermez les yeux et concentrez-vous sur votre respiration', icon: '🧠' },
    { id: 'hydration', name: 'Hydratation', duration: 30, instruction: 'Buvez un verre d\'eau complet', icon: '💧' },
    { id: 'stretch-full', name: 'Étirements complets', duration: 180, instruction: 'Étirez tout le corps: bras, dos, jambes', icon: '🏋️' },
    { id: 'nature', name: 'Regard nature', duration: 120, instruction: 'Regardez par la fenêtre ou des images de nature', icon: '🌿' },
  ],
};

const BREAK_SESSIONS: BreakSession[] = [
  {
    id: 'micro-break',
    type: 'micro',
    name: 'Micro-Pause',
    duration: 20,
    description: 'Pause ultra-rapide toutes les 20 minutes',
    exercises: EXERCISES.micro,
    color: 'from-emerald-400 to-teal-500',
    xp: 10,
  },
  {
    id: 'short-break',
    type: 'short',
    name: 'Pause Courte',
    duration: 300,
    description: 'Repos complet des yeux et du corps',
    exercises: EXERCISES.short,
    color: 'from-blue-400 to-cyan-500',
    xp: 30,
  },
  {
    id: 'long-break',
    type: 'long',
    name: 'Grande Pause',
    duration: 900,
    description: 'Récupération profonde et réénergisation',
    exercises: EXERCISES.long,
    color: 'from-purple-400 to-indigo-500',
    xp: 75,
  },
];

// Timer Component
const BreakTimer: React.FC<{
  session: BreakSession;
  onComplete: () => void;
  onCancel: () => void;
}> = ({ session, onComplete, onCancel }) => {
  const [timeRemaining, setTimeRemaining] = useState(session.duration);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseTimeRemaining, setExerciseTimeRemaining] = useState(session.exercises[0]?.duration || 0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const currentExercise = session.exercises[currentExerciseIndex];
  const totalExercises = session.exercises.length;
  const progress = ((session.duration - timeRemaining) / session.duration) * 100;

  // Play sound effect
  const playSound = useCallback((frequency: number, duration: number) => {
    if (isMuted) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const oscillator = audioRef.current.createOscillator();
      const gainNode = audioRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioRef.current.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioRef.current.currentTime + duration);
      oscillator.start();
      oscillator.stop(audioRef.current.currentTime + duration);
    } catch (e) {
      console.warn('Audio not supported');
    }
  }, [isMuted]);

  // Main timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playSound(880, 0.3);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onComplete, playSound]);

  // Exercise timer
  useEffect(() => {
    if (isPaused || !currentExercise) return;

    const interval = setInterval(() => {
      setExerciseTimeRemaining((prev) => {
        if (prev <= 1) {
          // Move to next exercise
          if (currentExerciseIndex < totalExercises - 1) {
            setCurrentExerciseIndex((i) => i + 1);
            setExerciseTimeRemaining(session.exercises[currentExerciseIndex + 1]?.duration || 0);
            playSound(660, 0.2);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, currentExercise, currentExerciseIndex, totalExercises, session.exercises, playSound]);

  // Update exercise time when index changes
  useEffect(() => {
    if (session.exercises[currentExerciseIndex]) {
      setExerciseTimeRemaining(session.exercises[currentExerciseIndex].duration);
    }
  }, [currentExerciseIndex, session.exercises]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <div className="w-full max-w-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1">
            <Timer className="w-3 h-3" />
            {session.name}
          </Badge>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Timer Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeRemaining)}</span>
              <span className="text-sm text-muted-foreground">restant</span>
            </div>
          </div>
        </div>

        {/* Current Exercise */}
        {currentExercise && (
          <Card className={`bg-gradient-to-br ${session.color} text-white border-0`}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{currentExercise.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{currentExercise.name}</h3>
              <p className="text-white/80 mb-4">{currentExercise.instruction}</p>
              <div className="flex items-center justify-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="font-mono">{formatTime(exerciseTimeRemaining)}</span>
              </div>
              <Progress 
                value={(1 - exerciseTimeRemaining / currentExercise.duration) * 100} 
                className="mt-3 h-2 bg-white/20"
              />
            </CardContent>
          </Card>
        )}

        {/* Exercise Progress */}
        <div className="flex justify-center gap-2">
          {session.exercises.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index < currentExerciseIndex
                  ? 'bg-primary'
                  : index === currentExerciseIndex
                  ? 'bg-primary animate-pulse'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsPaused(!isPaused)}
            className="gap-2"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Reprendre' : 'Pause'}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={onCancel}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const B2CScreenSilkBreakPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<BreakSession | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoReminder, setAutoReminder] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(20); // minutes
  const [nextReminderTime, setNextReminderTime] = useState<Date | null>(null);
  const [timeUntilReminder, setTimeUntilReminder] = useState<number>(0);
  
  // Stats state
  const [todayStats, setTodayStats] = useState({
    breaksCompleted: 0,
    totalMinutes: 0,
    xpEarned: 0,
    eyeStrainReduction: 0,
    screenTime: 0,
  });
  
  const [weeklyHistory, setWeeklyHistory] = useState<DailyStats[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  // Initialize stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('screen-silk-stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setTodayStats(parsed.todayStats || todayStats);
      setTotalXP(parsed.totalXP || 0);
      setLevel(Math.floor((parsed.totalXP || 0) / 200) + 1);
      setStreak(parsed.streak || 0);
      setSessionHistory(parsed.sessionHistory || []);
      setWeeklyHistory(parsed.weeklyHistory || []);
    }
  }, []);

  // Save stats to localStorage
  const saveStats = useCallback(() => {
    localStorage.setItem('screen-silk-stats', JSON.stringify({
      todayStats,
      totalXP,
      streak,
      sessionHistory: sessionHistory.slice(0, 50),
      weeklyHistory,
    }));
  }, [todayStats, totalXP, streak, sessionHistory, weeklyHistory]);

  useEffect(() => {
    saveStats();
  }, [saveStats]);

  // Reminder timer
  useEffect(() => {
    if (!autoReminder) {
      setNextReminderTime(null);
      return;
    }

    const now = new Date();
    const nextReminder = new Date(now.getTime() + reminderInterval * 60 * 1000);
    setNextReminderTime(nextReminder);

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((nextReminder.getTime() - Date.now()) / 1000));
      setTimeUntilReminder(remaining);

      if (remaining === 0) {
        if (notificationsEnabled) {
          toast.info('🧘 Temps pour une pause !', {
            description: 'Vos yeux ont besoin de repos',
            action: {
              label: 'Pause rapide',
              onClick: () => startSession(BREAK_SESSIONS[0]),
            },
          });
        }
        // Reset timer
        const newNextReminder = new Date(Date.now() + reminderInterval * 60 * 1000);
        setNextReminderTime(newNextReminder);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoReminder, reminderInterval, notificationsEnabled]);

  // Simulate screen time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayStats(prev => ({
        ...prev,
        screenTime: prev.screenTime + 1/60, // Add 1 second converted to minutes
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startSession = (session: BreakSession) => {
    setActiveSession(session);
  };

  const completeSession = () => {
    if (!activeSession) return;

    const xpEarned = activeSession.xp;
    const newTotalXP = totalXP + xpEarned;
    const newLevel = Math.floor(newTotalXP / 200) + 1;

    // Update stats
    setTodayStats(prev => ({
      ...prev,
      breaksCompleted: prev.breaksCompleted + 1,
      totalMinutes: prev.totalMinutes + Math.round(activeSession.duration / 60),
      xpEarned: prev.xpEarned + xpEarned,
      eyeStrainReduction: Math.min(100, prev.eyeStrainReduction + 5),
    }));

    setTotalXP(newTotalXP);

    // Check for level up
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`🎉 Niveau ${newLevel} atteint !`, {
        description: 'Continuez à prendre soin de vos yeux !',
      });
    }

    // Add to history
    const newSession: SessionHistory = {
      id: Date.now().toString(),
      type: activeSession.type,
      completedAt: new Date(),
      duration: activeSession.duration,
      exercisesCompleted: activeSession.exercises.length,
      xpEarned,
    };
    setSessionHistory(prev => [newSession, ...prev.slice(0, 49)]);

    // Update streak
    setStreak(prev => prev + 1);

    toast.success(`✨ ${activeSession.name} terminée !`, {
      description: `+${xpEarned} XP • ${Math.round(activeSession.duration / 60)} min`,
    });

    setActiveSession(null);
  };

  const cancelSession = () => {
    setActiveSession(null);
    toast.info('Session annulée');
  };

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStrainLevel = (reduction: number) => {
    const strain = 100 - reduction;
    if (strain < 30) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (strain < 50) return { text: 'Bon', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (strain < 70) return { text: 'Modéré', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Élevé', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const strainInfo = getStrainLevel(todayStats.eyeStrainReduction);

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/10 to-muted/20 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Active Session Overlay */}
          <AnimatePresence>
            {activeSession && (
              <BreakTimer
                session={activeSession}
                onComplete={completeSession}
                onCancel={cancelSession}
              />
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-4">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Screen-Silk Break
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Protégez vos yeux avec des pauses intelligentes et des exercices guidés
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            <Card className="col-span-1">
              <CardContent className="p-4 text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold">{100 - todayStats.eyeStrainReduction}%</div>
                <div className="text-xs text-muted-foreground">Fatigue Oculaire</div>
                <Badge className={`mt-1 text-[10px] ${strainInfo.bg} ${strainInfo.color}`}>
                  {strainInfo.text}
                </Badge>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="text-xl font-bold">{todayStats.breaksCompleted}</div>
                <div className="text-xs text-muted-foreground">Pauses Aujourd'hui</div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-4 text-center">
                <Monitor className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-xl font-bold">{todayStats.screenTime.toFixed(1)}h</div>
                <div className="text-xs text-muted-foreground">Temps d'Écran</div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-xl font-bold">{totalXP}</div>
                <div className="text-xs text-muted-foreground">XP Total</div>
                <Badge variant="outline" className="mt-1 text-[10px]">
                  Niv. {level}
                </Badge>
              </CardContent>
            </Card>

            <Card className="col-span-2 md:col-span-1">
              <CardContent className="p-4 text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <div className="text-xl font-bold">{streak}</div>
                <div className="text-xs text-muted-foreground">Streak 🔥</div>
              </CardContent>
            </Card>
          </div>

          {/* Next Reminder */}
          {autoReminder && nextReminderTime && (
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Prochaine pause recommandée</div>
                      <div className="text-sm text-muted-foreground">
                        dans {formatTimeRemaining(timeUntilReminder)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startSession(BREAK_SESSIONS[0])}
                  >
                    Pause maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="breaks" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="breaks">Pauses</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="breaks" className="space-y-6">
              {/* Break Sessions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {BREAK_SESSIONS.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className={`w-full h-20 bg-gradient-to-br ${session.color} rounded-lg mb-3 flex items-center justify-center group-hover:scale-[1.02] transition-transform`}>
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{session.name}</CardTitle>
                          <Badge variant="secondary">+{session.xp} XP</Badge>
                        </div>
                        <CardDescription>{session.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Durée:</span>
                          <Badge variant="outline">
                            {session.duration < 60 ? `${session.duration}s` : `${Math.floor(session.duration / 60)} min`}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Exercices ({session.exercises.length}):</span>
                          <div className="flex flex-wrap gap-1">
                            {session.exercises.slice(0, 3).map((exercise) => (
                              <Badge key={exercise.id} variant="secondary" className="text-xs gap-1">
                                <span>{exercise.icon}</span>
                                {exercise.name}
                              </Badge>
                            ))}
                            {session.exercises.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{session.exercises.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button 
                          className="w-full gap-2"
                          onClick={() => startSession(session)}
                        >
                          <Play className="w-4 h-4" />
                          Commencer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* 20-20-20 Rule Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Règle 20-20-20
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <span className="font-medium">Technique recommandée</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Toutes les <strong>20 minutes</strong>, regardez un objet à <strong>20 pieds (6m)</strong> pendant au moins <strong>20 secondes</strong>.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">20</div>
                        <div className="text-xs text-muted-foreground">minutes</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">20</div>
                        <div className="text-xs text-muted-foreground">pieds (6m)</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">20</div>
                        <div className="text-xs text-muted-foreground">secondes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conseils Santé</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm">Éclairage Optimal</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Évitez les reflets et assurez-vous d'un éclairage ambiant suffisant.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">Hydratation</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Clignez consciemment et utilisez des gouttes si nécessaire.
                      </p>
                    </div>

                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Monitor className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sm">Distance Écran</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Maintenez 50-70cm entre vos yeux et l'écran.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Historique des sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessionHistory.length > 0 ? (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-3">
                        {sessionHistory.map((session, index) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                session.type === 'micro' ? 'bg-emerald-500/20' :
                                session.type === 'short' ? 'bg-blue-500/20' :
                                'bg-purple-500/20'
                              }`}>
                                <CheckCircle className={`w-4 h-4 ${
                                  session.type === 'micro' ? 'text-emerald-600' :
                                  session.type === 'short' ? 'text-blue-600' :
                                  'text-purple-600'
                                }`} />
                              </div>
                              <div>
                                <div className="font-medium text-sm capitalize">
                                  {session.type === 'micro' ? 'Micro-Pause' :
                                   session.type === 'short' ? 'Pause Courte' :
                                   'Grande Pause'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(session.completedAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-xs">
                                +{session.xpEarned} XP
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                {session.exercisesCompleted} exercices
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune session complétée</p>
                      <p className="text-sm">Commencez une pause pour voir votre historique</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Paramètres des rappels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Recevoir des rappels de pause
                      </div>
                    </div>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Rappels automatiques</div>
                      <div className="text-sm text-muted-foreground">
                        Rappel toutes les {reminderInterval} minutes
                      </div>
                    </div>
                    <Switch
                      checked={autoReminder}
                      onCheckedChange={setAutoReminder}
                    />
                  </div>

                  {autoReminder && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Intervalle de rappel</span>
                        <Badge variant="outline">{reminderInterval} min</Badge>
                      </div>
                      <div className="flex gap-2">
                        {[15, 20, 30, 45, 60].map((interval) => (
                          <Button
                            key={interval}
                            variant={reminderInterval === interval ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setReminderInterval(interval)}
                          >
                            {interval}m
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        setTodayStats({
                          breaksCompleted: 0,
                          totalMinutes: 0,
                          xpEarned: 0,
                          eyeStrainReduction: 0,
                          screenTime: 0,
                        });
                        setStreak(0);
                        toast.info('Statistiques du jour réinitialisées');
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réinitialiser les stats du jour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CScreenSilkBreakPage;
