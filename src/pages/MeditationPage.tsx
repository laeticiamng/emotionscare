/**
 * Meditation Page - Module complet de méditation guidée
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles,
  Settings,
  History,
  TrendingUp,
  Target,
  Volume2,
  VolumeX,
  Heart,
  CheckCircle,
  BarChart3,
  Wind,
  Waves,
  TreePine,
  Flame,
  Cloud,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useMeditationStats, useMeditationHistory, useMeditationWeeklyProgress } from '@/hooks/useMeditationStats';
import { useMeditationSettings } from '@/hooks/useMeditationSettings';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Composants du module
import { MeditationCalendar } from '@/modules/meditation/ui/MeditationCalendar';
import { StreakWidget } from '@/modules/meditation/ui/StreakWidget';
import { AmbientSoundMixer } from '@/modules/meditation/ui/AmbientSoundMixer';
import { MeditationRecommendationWidget } from '@/components/meditation/MeditationRecommendationWidget';
import { MeditationExportButton } from '@/components/meditation/MeditationExportButton';

const TECHNIQUE_OPTIONS = [
  { 
    id: 'pause-soignant', 
    title: 'Pause Soignant', 
    description: 'Récupération rapide entre deux patients',
    icon: Heart,
    color: 'bg-primary/10 text-primary',
    durations: [3, 5, 10],
    isNew: true
  },
  { 
    id: 'mindfulness', 
    title: 'Pleine conscience', 
    description: 'Observer le moment présent sans jugement',
    icon: Brain,
    color: 'bg-info/10 text-info',
    durations: [5, 10, 15, 20]
  },
  { 
    id: 'breath-focus', 
    title: 'Focus respiration', 
    description: 'Se concentrer sur le souffle naturel',
    icon: Wind,
    color: 'bg-info/10 text-info',
    durations: [5, 10, 15]
  },
  { 
    id: 'body-scan', 
    title: 'Scan corporel', 
    description: 'Relâcher les tensions accumulées',
    icon: Heart,
    color: 'bg-accent/10 text-accent-foreground',
    durations: [10, 15, 20, 30]
  },
  { 
    id: 'decompression', 
    title: 'Décompression', 
    description: 'Après une situation difficile ou stressante',
    icon: Waves,
    color: 'bg-success/10 text-success',
    durations: [5, 10, 15],
    isNew: true
  },
  { 
    id: 'visualization', 
    title: 'Visualisation', 
    description: 'Créer des images mentales apaisantes',
    icon: Sparkles,
    color: 'bg-accent/10 text-accent-foreground',
    durations: [10, 15, 20]
  },
  { 
    id: 'loving-kindness', 
    title: 'Bienveillance', 
    description: 'Cultiver la compassion envers soi et les autres',
    icon: Heart,
    color: 'bg-destructive/10 text-destructive',
    durations: [10, 15, 20]
  },
  { 
    id: 'mantra', 
    title: 'Mantra', 
    description: 'Répéter un son calmant',
    icon: Volume2,
    color: 'bg-primary/10 text-primary',
    durations: [5, 10, 15, 20]
  },
];

const TECHNIQUE_LABELS: Record<string, string> = {
  'pause-soignant': 'Pause Soignant',
  'mindfulness': 'Pleine conscience',
  'breath-focus': 'Focus respiration',
  'body-scan': 'Scan corporel',
  'decompression': 'Décompression',
  'visualization': 'Visualisation',
  'loving-kindness': 'Bienveillance',
  'mantra': 'Mantra',
};

export default function MeditationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useMeditationStats();
  const { data: history, isLoading: historyLoading } = useMeditationHistory(10);
  const { data: weeklyProgress } = useMeditationWeeklyProgress();
  const { settings, saveSettings } = useMeditationSettings();
  
  // Session state
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [showMoodAfterPrompt, setShowMoodAfterPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAmbientMixer, setShowAmbientMixer] = useState(false);
  const [activeTab, setActiveTab] = useState<'practice' | 'history' | 'progress' | 'calendar'>('practice');
  const [breathScale, setBreathScale] = useState(1);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalDuration = selectedDuration * 60;
  const progress = (currentTime / totalDuration) * 100;
  
  // Breath animation améliorée
  useEffect(() => {
    if (!isPlaying) {
      setBreathScale(1);
      setBreathPhase('inhale');
      return;
    }
    
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let timer = 0;
    const cycleDuration = { inhale: 4000, hold: 2000, exhale: 4000 };
    
    breathRef.current = setInterval(() => {
      timer += 100;
      
      if (phase === 'inhale') {
        const progress = timer / cycleDuration.inhale;
        setBreathScale(1 + 0.3 * progress);
        if (timer >= cycleDuration.inhale) {
          phase = 'hold';
          timer = 0;
          setBreathPhase('hold');
        }
      } else if (phase === 'hold') {
        if (timer >= cycleDuration.hold) {
          phase = 'exhale';
          timer = 0;
          setBreathPhase('exhale');
        }
      } else {
        const progress = timer / cycleDuration.exhale;
        setBreathScale(1.3 - 0.3 * progress);
        if (timer >= cycleDuration.exhale) {
          phase = 'inhale';
          timer = 0;
          setBreathPhase('inhale');
        }
      }
    }, 100);
    
    return () => {
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, [isPlaying]);

  // Start session
  const startSession = useCallback(async () => {
    if (!selectedTechnique) {
      toast({
        title: 'Technique requise',
        description: 'Veuillez sélectionner une technique de méditation',
        variant: 'destructive',
      });
      return;
    }
    
    setShowMoodPrompt(true);
  }, [selectedTechnique, toast]);
  
  // Confirm start with mood
  const confirmStart = useCallback(async (mood: number | null) => {
    setMoodBefore(mood);
    setShowMoodPrompt(false);
    setIsPlaying(true);
    setCurrentTime(0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('meditation_sessions')
          .insert({
            user_id: user.id,
            technique: selectedTechnique,
            duration: selectedDuration * 60,
            mood_before: mood,
            with_guidance: settings.withGuidance,
            with_music: settings.withMusic,
            completed: false,
            completed_duration: 0,
            started_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        
        if (!error && data) {
          setSessionId(data.id);
        }
      }
    } catch (err) {
      logger.error('Error creating session:', err, 'SYSTEM');
    }
    
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(100);
    }
  }, [selectedTechnique, selectedDuration, settings]);

  // Complete session
  const completeSession = useCallback(async (moodAfter?: number) => {
    setIsPlaying(false);
    setShowMoodAfterPrompt(false);
    
    if (sessionId) {
      try {
        const moodDelta = (moodBefore !== null && moodAfter !== undefined) 
          ? moodAfter - moodBefore 
          : null;
        
        await supabase
          .from('meditation_sessions')
          .update({
            completed: true,
            completed_duration: currentTime,
            completed_at: new Date().toISOString(),
            mood_after: moodAfter,
            mood_delta: moodDelta,
          })
          .eq('id', sessionId);
        
        refetchStats();
        
        const moodText = moodDelta !== null && moodDelta > 0 
          ? ` (+${moodDelta} humeur)` 
          : '';
        
        toast({
          title: 'Méditation terminée ! 🧘',
          description: `${Math.round(currentTime / 60)} minutes de ${TECHNIQUE_LABELS[selectedTechnique || ''] || 'méditation'}${moodText}`,
        });
      } catch (err) {
        logger.error('Error completing session:', err, 'SYSTEM');
      }
    }
    
    setSessionId(null);
    setCurrentTime(0);
    setMoodBefore(null);
  }, [sessionId, currentTime, selectedTechnique, moodBefore, refetchStats, toast]);

  const handleCompleteClick = useCallback(() => {
    setIsPlaying(false);
    setShowMoodAfterPrompt(true);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isPlaying) return;
    
    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= totalDuration) {
          handleCompleteClick();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalDuration, handleCompleteClick]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [settings.hapticFeedback]);

  // Reset
  const resetSession = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setSessionId(null);
    setMoodBefore(null);
  }, []);

  // Format time
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Handle recommendation selection
  const handleRecommendationSelect = useCallback((technique: string, duration: number) => {
    setSelectedTechnique(technique);
    setSelectedDuration(duration);
  }, []);
  
  const weeklyGoalProgress = stats 
    ? Math.min(100, Math.round((stats.total_minutes / settings.weeklyGoalMinutes) * 100))
    : 0;

  const breathInstructions = {
    inhale: 'Inspirez...',
    hold: 'Retenez...',
    exhale: 'Expirez...',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/app')}
                aria-label="Retour"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Méditation</h1>
                <p className="text-sm text-muted-foreground">Recentrez-vous en pleine conscience</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MeditationExportButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAmbientMixer(true)}
                aria-label="Sons ambiants"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                aria-label="Paramètres"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-12" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.completed_sessions || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.total_minutes || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      <p className="text-xl font-bold">{stats?.current_streak || 0} j</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Δ Humeur</p>
                    {statsLoading ? (
                      <Skeleton className="h-6 w-12" />
                    ) : (
                      <p className="text-xl font-bold">
                        {stats?.avg_mood_delta != null 
                          ? `${stats.avg_mood_delta > 0 ? '+' : ''}${stats.avg_mood_delta}`
                          : '—'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isPlaying || currentTime > 0 ? (
            // Active Session View
            <motion.div
              key="session"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Meditation Circle */}
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <motion.div
                    animate={{ scale: breathScale }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    className="w-56 h-56 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shadow-2xl"
                  >
                    <div className="w-44 h-44 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">
                          {formatTime(totalDuration - currentTime)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {TECHNIQUE_LABELS[selectedTechnique || ''] || 'Méditation'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Progress ring */}
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 224 224"
                  >
                    <circle
                      cx="112"
                      cy="112"
                      r="108"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted/20"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="108"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={2 * Math.PI * 108}
                      strokeDashoffset={2 * Math.PI * 108 * (1 - progress / 100)}
                      className="text-primary transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Session Info */}
              <Card className="bg-card/50">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-medium text-primary mb-1">
                    {breathInstructions[breathPhase]}
                  </p>
                  <p className="text-muted-foreground">
                    {isPlaying 
                      ? 'Laissez vos pensées passer comme des nuages.'
                      : 'Session en pause. Appuyez pour reprendre.'}
                  </p>
                </CardContent>
              </Card>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetSession}
                  aria-label="Réinitialiser"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  onClick={togglePause}
                  aria-label={isPlaying ? 'Pause' : 'Reprendre'}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCompleteClick}
                  aria-label="Terminer"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            // Selection View
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="practice" className="flex-1">
                    <Brain className="h-4 w-4 mr-2" />
                    Pratiquer
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">
                    <History className="h-4 w-4 mr-2" />
                    Historique
                  </TabsTrigger>
                  <TabsTrigger value="progress" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Progrès
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendrier
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="practice" className="space-y-6">
                  {/* Recommendations Widget */}
                  <MeditationRecommendationWidget 
                    onSelectTechnique={handleRecommendationSelect}
                    currentTechnique={selectedTechnique}
                  />

                  {/* Streak Widget compact */}
                  <StreakWidget compact />

                  {/* Technique Selection */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Choisissez votre technique</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {TECHNIQUE_OPTIONS.map((technique) => {
                        const Icon = technique.icon;
                        const isSelected = selectedTechnique === technique.id;
                        return (
                          <Card
                            key={technique.id}
                            className={`cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'hover:border-primary/50'
                            }`}
                            onClick={() => {
                              setSelectedTechnique(technique.id);
                              if (!technique.durations.includes(selectedDuration)) {
                                setSelectedDuration(technique.durations[0]);
                              }
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${technique.color}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium">{technique.title}</h3>
                                  <p className="text-sm text-muted-foreground">{technique.description}</p>
                                  {isSelected && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {technique.durations.map((d) => (
                                        <Badge
                                          key={d}
                                          variant={selectedDuration === d ? 'default' : 'outline'}
                                          className="cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDuration(d);
                                          }}
                                        >
                                          {d} min
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Start Button */}
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg"
                    onClick={startSession}
                    disabled={!selectedTechnique}
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Commencer ({selectedDuration} min)
                  </Button>

                  {/* Weekly Goal */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Objectif hebdomadaire
                        </CardTitle>
                        <Badge variant={weeklyGoalProgress >= 100 ? 'default' : 'secondary'}>
                          {weeklyGoalProgress}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={weeklyGoalProgress} className="h-3 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {stats?.total_minutes ?? 0} / {settings.weeklyGoalMinutes} minutes
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-3">
                  {historyLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))
                  ) : history && history.length > 0 ? (
                    history.map((session) => (
                      <Card key={session.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {TECHNIQUE_LABELS[session.technique] || session.technique}
                                </span>
                                <Badge variant={session.completed ? 'default' : 'secondary'} className="text-xs">
                                  {session.completed ? 'Terminée' : 'Incomplète'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(session.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                                {' • '}{Math.round((session.completed_duration || session.duration) / 60)} min
                              </p>
                            </div>
                            {session.mood_delta !== null && (
                              <div className="text-right">
                                <p className={`text-lg font-bold ${
                                  session.mood_delta > 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : session.mood_delta < 0 
                                      ? 'text-red-600 dark:text-red-400' 
                                      : 'text-muted-foreground'
                                }`}>
                                  {session.mood_delta > 0 ? '+' : ''}{session.mood_delta}
                                </p>
                                <p className="text-xs text-muted-foreground">Δ Humeur</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="border-dashed">
                      <CardContent className="p-8 text-center">
                        <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">Aucune session</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Commencez votre première méditation
                        </p>
                        <Button onClick={() => setActiveTab('practice')}>
                          <Play className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  {/* Streak Widget full */}
                  <StreakWidget />

                  {/* Weekly Chart */}
                  {weeklyProgress && weeklyProgress.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Cette semaine</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end gap-2 h-32">
                          {weeklyProgress.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div 
                                className="w-full bg-primary/20 rounded-t transition-all"
                                style={{ 
                                  height: `${Math.max(4, (day.minutes / Math.max(...weeklyProgress.map(d => d.minutes), 1)) * 100)}%`,
                                  minHeight: day.minutes > 0 ? 8 : 4,
                                }}
                              />
                              <span className="text-xs text-muted-foreground">{day.day}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Stats Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Statistiques</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sessions cette semaine</span>
                          <span className="font-medium">{stats?.sessions_this_week || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Taux de complétion</span>
                          <span className="font-medium">{stats?.completion_rate || 0}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Durée moyenne</span>
                          <span className="font-medium">{stats?.average_duration_minutes || 0} min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Plus longue session</span>
                          <span className="font-medium">{stats?.longest_session_minutes || 0} min</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Préférences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Technique favorite</span>
                          <Badge variant="outline">
                            {stats?.favorite_technique 
                              ? TECHNIQUE_LABELS[stats.favorite_technique] || stats.favorite_technique
                              : 'Aucune'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Record streak</span>
                          <span className="font-medium">{stats?.longest_streak || 0} jours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Amélioration humeur</span>
                          <span className="font-medium">
                            {stats?.avg_mood_delta != null 
                              ? `${stats.avg_mood_delta > 0 ? '+' : ''}${stats.avg_mood_delta}`
                              : 'N/A'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="calendar">
                  <MeditationCalendar />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Before Dialog */}
        <Dialog open={showMoodPrompt} onOpenChange={setShowMoodPrompt}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Comment vous sentez-vous ?</DialogTitle>
              <DialogDescription>
                Évaluez votre humeur avant la méditation (optionnel)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => confirmStart(mood * 20)}
                    className="w-12 h-12 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-lg font-medium transition-colors"
                  >
                    {mood === 1 ? '😔' : mood === 2 ? '😕' : mood === 3 ? '😐' : mood === 4 ? '🙂' : '😊'}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => confirmStart(null)}
              >
                Passer cette étape
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mood After Dialog */}
        <Dialog open={showMoodAfterPrompt} onOpenChange={setShowMoodAfterPrompt}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Comment vous sentez-vous maintenant ?</DialogTitle>
              <DialogDescription>
                Évaluez votre humeur après la méditation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => completeSession(mood * 20)}
                    className="w-12 h-12 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-lg font-medium transition-colors"
                  >
                    {mood === 1 ? '😔' : mood === 2 ? '😕' : mood === 3 ? '😐' : mood === 4 ? '🙂' : '😊'}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => completeSession(undefined)}
              >
                Passer cette étape
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ambient Sound Mixer Dialog */}
        <Dialog open={showAmbientMixer} onOpenChange={setShowAmbientMixer}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Sons ambiants
              </DialogTitle>
              <DialogDescription>
                Créez votre ambiance sonore idéale
              </DialogDescription>
            </DialogHeader>
            <AmbientSoundMixer />
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres
              </DialogTitle>
              <DialogDescription>
                Personnalisez votre expérience de méditation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <Label>Guidance vocale</Label>
                <Switch
                  checked={settings.withGuidance}
                  onCheckedChange={(v) => saveSettings({ withGuidance: v })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Musique ambiante</Label>
                <Switch
                  checked={settings.withMusic}
                  onCheckedChange={(v) => saveSettings({ withMusic: v })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Retour haptique</Label>
                <Switch
                  checked={settings.hapticFeedback}
                  onCheckedChange={(v) => saveSettings({ hapticFeedback: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Animations réduites</Label>
                <Switch
                  checked={settings.reducedAnimations}
                  onCheckedChange={(v) => saveSettings({ reducedAnimations: v })}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Objectif hebdomadaire</Label>
                  <span className="text-sm font-medium">{settings.weeklyGoalMinutes} min</span>
                </div>
                <Slider
                  value={[settings.weeklyGoalMinutes]}
                  onValueChange={([v]) => saveSettings({ weeklyGoalMinutes: v })}
                  min={15}
                  max={180}
                  step={15}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Volume par défaut</Label>
                  <span className="text-sm font-medium">{settings.volume}%</span>
                </div>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([v]) => saveSettings({ volume: v })}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
