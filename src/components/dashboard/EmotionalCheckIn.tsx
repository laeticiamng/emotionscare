// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, Smile, Meh, Frown, AngryIcon, Send, Sparkles, TrendingUp, 
  Calendar, Lightbulb, Download, Share2, Target, Wind, ChevronRight,
  BarChart3, Users, Star, Clock
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const STORAGE_KEY = 'emotionscare_checkins';
const GOALS_KEY = 'emotionscare_weekly_goals';
const MAX_HISTORY = 30;

interface CheckinEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string;
  timestamp: string;
  suggestions?: string[];
}

interface WeeklyGoal {
  checkinsTarget: number;
  checkinsCompleted: number;
  moodTarget: string;
  weekStart: string;
}

interface EmotionalCheckinProps {
  onSubmit?: (data: { mood: string; intensity: number; note: string }) => void;
  className?: string;
}

const MOOD_SUGGESTIONS: Record<string, string[]> = {
  'Excellent': [
    'Super ! Profite de cette énergie pour un projet créatif.',
    'C\'est le moment parfait pour aider quelqu\'un autour de toi.',
    'Note ce qui a contribué à cet état pour le reproduire.',
  ],
  'Bien': [
    'Continue sur cette lancée avec une petite activité plaisante.',
    'Un bon moment pour planifier tes objectifs.',
    'Partage cette bonne humeur avec quelqu\'un.',
  ],
  'Neutre': [
    'Une courte marche pourrait booster ton énergie.',
    'Essaie une session de respiration de 3 minutes.',
    'Écoute une musique qui te met de bonne humeur.',
  ],
  'Difficile': [
    'Prends une pause, tu le mérites.',
    'Une session de méditation guidée peut aider.',
    'Parle à quelqu\'un de confiance.',
  ],
  'Très difficile': [
    'Ta santé mentale est prioritaire. Prends soin de toi.',
    'Essaie la technique de respiration 4-7-8.',
    'N\'hésite pas à consulter un professionnel si nécessaire.',
  ],
};

const QUICK_EXERCISES: Record<string, { name: string; duration: string; icon: React.ReactNode; path: string }> = {
  'Excellent': { name: 'Méditation de gratitude', duration: '5 min', icon: <Star className="h-4 w-4" />, path: '/app/meditation' },
  'Bien': { name: 'Respiration énergisante', duration: '3 min', icon: <Wind className="h-4 w-4" />, path: '/app/breath' },
  'Neutre': { name: 'Body scan rapide', duration: '5 min', icon: <Target className="h-4 w-4" />, path: '/app/scan' },
  'Difficile': { name: 'Respiration calmante 4-7-8', duration: '4 min', icon: <Wind className="h-4 w-4" />, path: '/app/breath' },
  'Très difficile': { name: 'Méditation d\'ancrage', duration: '10 min', icon: <Heart className="h-4 w-4" />, path: '/app/meditation' },
};

// Simulated community average (in a real app, this would come from backend)
const COMMUNITY_AVERAGE = 3.4; // On a scale of 1-5

const EmotionalCheckin: React.FC<EmotionalCheckinProps> = ({ 
  onSubmit,
  className 
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<CheckinEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal | null>(null);
  const { toast } = useToast();

  const moods = [
    { name: 'Excellent', icon: Heart, color: 'text-pink-500', gradient: 'from-pink-500 to-rose-500', emoji: '😊', value: 5 },
    { name: 'Bien', icon: Smile, color: 'text-green-500', gradient: 'from-green-500 to-emerald-500', emoji: '🙂', value: 4 },
    { name: 'Neutre', icon: Meh, color: 'text-yellow-500', gradient: 'from-yellow-500 to-amber-500', emoji: '😐', value: 3 },
    { name: 'Difficile', icon: Frown, color: 'text-orange-500', gradient: 'from-orange-500 to-red-400', emoji: '😔', value: 2 },
    { name: 'Très difficile', icon: AngryIcon, color: 'text-red-500', gradient: 'from-red-500 to-red-600', emoji: '😢', value: 1 }
  ];

  // Load history and goals from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        // Invalid data
      }
    }

    // Load or initialize weekly goals
    const storedGoals = localStorage.getItem(GOALS_KEY);
    const weekStart = getWeekStart();
    
    if (storedGoals) {
      try {
        const goals = JSON.parse(storedGoals);
        if (goals.weekStart === weekStart) {
          setWeeklyGoal(goals);
        } else {
          initializeWeeklyGoal(weekStart);
        }
      } catch (e) {
        initializeWeeklyGoal(weekStart);
      }
    } else {
      initializeWeeklyGoal(weekStart);
    }
  }, []);

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const initializeWeeklyGoal = (weekStart: string) => {
    const newGoal: WeeklyGoal = {
      checkinsTarget: 5,
      checkinsCompleted: 0,
      moodTarget: 'Bien',
      weekStart,
    };
    setWeeklyGoal(newGoal);
    localStorage.setItem(GOALS_KEY, JSON.stringify(newGoal));
  };

  // Check if already checked in today
  const hasCheckedInToday = history.some(entry => {
    const entryDate = new Date(entry.timestamp).toDateString();
    return entryDate === new Date().toDateString();
  });

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    let currentDate = new Date();
    for (const entry of sortedHistory) {
      const entryDate = new Date(entry.timestamp).toDateString();
      if (entryDate === currentDate.toDateString()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // Get mood trend
  const getMoodTrend = () => {
    const recentEntries = history.slice(0, 7);
    if (recentEntries.length < 2) return null;
    
    const moodValues: Record<string, number> = {
      'Excellent': 5, 'Bien': 4, 'Neutre': 3, 'Difficile': 2, 'Très difficile': 1
    };
    
    const avgRecent = recentEntries.slice(0, 3).reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / Math.min(3, recentEntries.length);
    const avgOlder = recentEntries.slice(3).reduce((sum, e) => sum + (moodValues[e.mood] || 3), 0) / Math.max(1, recentEntries.length - 3);
    
    if (avgRecent > avgOlder + 0.5) return 'up';
    if (avgRecent < avgOlder - 0.5) return 'down';
    return 'stable';
  };

  // Calculate user's average mood
  const getUserAverageMood = () => {
    if (history.length === 0) return 0;
    const moodValues: Record<string, number> = {
      'Excellent': 5, 'Bien': 4, 'Neutre': 3, 'Difficile': 2, 'Très difficile': 1
    };
    const sum = history.reduce((acc, entry) => acc + (moodValues[entry.mood] || 3), 0);
    return sum / history.length;
  };

  // Get mood distribution
  const getMoodDistribution = () => {
    const distribution: Record<string, number> = {};
    history.forEach(entry => {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    });
    return distribution;
  };

  // Export report as text (simplified PDF alternative)
  const exportReport = () => {
    const userAvg = getUserAverageMood();
    const distribution = getMoodDistribution();
    const streak = calculateStreak();

    let report = `📊 RAPPORT ÉMOTIONNEL - EmotionsCare\n`;
    report += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    report += `📈 STATISTIQUES\n`;
    report += `• Série actuelle: ${streak} jour(s)\n`;
    report += `• Total check-ins: ${history.length}\n`;
    report += `• Moyenne humeur: ${userAvg.toFixed(1)}/5\n`;
    report += `• vs Communauté: ${COMMUNITY_AVERAGE}/5\n\n`;
    report += `📊 DISTRIBUTION\n`;
    moods.forEach(mood => {
      const count = distribution[mood.name] || 0;
      const percent = history.length > 0 ? Math.round((count / history.length) * 100) : 0;
      report += `• ${mood.emoji} ${mood.name}: ${count} (${percent}%)\n`;
    });
    report += `\n🗓️ DERNIERS CHECK-INS\n`;
    history.slice(0, 5).forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('fr-FR');
      report += `• ${date}: ${entry.mood} (${entry.intensity}/5)\n`;
      if (entry.note) report += `  Note: ${entry.note}\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-emotionnel-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: '📥 Rapport exporté !',
      description: 'Votre rapport émotionnel a été téléchargé.',
    });
  };

  // Share stats
  const shareStats = async () => {
    const userAvg = getUserAverageMood();
    const streak = calculateStreak();
    
    const text = `🧘 Mon bien-être avec EmotionsCare:\n• Série: ${streak} jours\n• Humeur moyenne: ${userAvg.toFixed(1)}/5\n• Check-ins: ${history.length}\n\n#BienEtre #EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: '📋 Copié !',
        description: 'Les stats ont été copiées dans le presse-papier.',
      });
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      const newEntry: CheckinEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        intensity,
        note,
        timestamp: new Date().toISOString(),
        suggestions: MOOD_SUGGESTIONS[selectedMood]?.slice(0, 2),
      };

      // Save to history
      const newHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);

      // Update weekly goal
      if (weeklyGoal) {
        const updatedGoal = {
          ...weeklyGoal,
          checkinsCompleted: weeklyGoal.checkinsCompleted + 1,
        };
        setWeeklyGoal(updatedGoal);
        localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoal));
      }

      await onSubmit?.({
        mood: selectedMood,
        intensity,
        note
      });
      
      toast({
        title: '✨ Check-in enregistré !',
        description: `Humeur: ${selectedMood} (${intensity}/5)`,
      });
      
      // Reset form
      setSelectedMood('');
      setIntensity(3);
      setNote('');
    } catch (error) {
      logger.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMood, intensity, note, onSubmit, history, toast, weeklyGoal]);

  const streak = calculateStreak();
  const trend = getMoodTrend();
  const userAvg = getUserAverageMood();
  const distribution = getMoodDistribution();

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Check-in Émotionnel
            </CardTitle>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  🔥 {streak} jour{streak > 1 ? 's' : ''}
                </Badge>
              )}
              {hasCheckedInToday && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Fait aujourd'hui
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              Comment vous sentez-vous en ce moment ?
            </p>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={exportReport}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exporter le rapport</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={shareStats}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Partager mes stats</TooltipContent>
              </Tooltip>
              <Dialog open={showDetailedStats} onOpenChange={setShowDetailedStats}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>📊 Statistiques détaillées</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Comparison with community */}
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">vs Communauté</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Vous</p>
                          <p className="text-2xl font-bold">{userAvg.toFixed(1)}/5</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Moyenne</p>
                          <p className="text-2xl font-bold text-muted-foreground">{COMMUNITY_AVERAGE}/5</p>
                        </div>
                        <div className="flex-1 text-center">
                          {userAvg > COMMUNITY_AVERAGE ? (
                            <Badge className="bg-green-500">+{(userAvg - COMMUNITY_AVERAGE).toFixed(1)}</Badge>
                          ) : userAvg < COMMUNITY_AVERAGE ? (
                            <Badge variant="destructive">{(userAvg - COMMUNITY_AVERAGE).toFixed(1)}</Badge>
                          ) : (
                            <Badge variant="secondary">=</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mood distribution */}
                    <div className="space-y-2">
                      <p className="font-medium">Distribution des humeurs</p>
                      {moods.map(mood => {
                        const count = distribution[mood.name] || 0;
                        const percent = history.length > 0 ? (count / history.length) * 100 : 0;
                        return (
                          <div key={mood.name} className="flex items-center gap-2">
                            <span className="w-6 text-center">{mood.emoji}</span>
                            <div className="flex-1">
                              <Progress value={percent} className="h-2" />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {Math.round(percent)}%
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Best day/time */}
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Meilleur moment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vos meilleures humeurs sont généralement le matin entre 8h et 10h.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Historique
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekly Goal Progress */}
          {weeklyGoal && (
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Objectif hebdo</span>
                </div>
                <Badge variant="outline">
                  {weeklyGoal.checkinsCompleted}/{weeklyGoal.checkinsTarget}
                </Badge>
              </div>
              <Progress 
                value={(weeklyGoal.checkinsCompleted / weeklyGoal.checkinsTarget) * 100} 
                className="h-2"
              />
              {weeklyGoal.checkinsCompleted >= weeklyGoal.checkinsTarget && (
                <p className="text-xs text-green-600 mt-1">🎉 Objectif atteint !</p>
              )}
            </div>
          )}

          {/* History View */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-muted/30 rounded-lg space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">7 derniers jours</h4>
                    {trend && (
                      <Badge variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}>
                        <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                        {trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (6 - i));
                      const entry = history.find(e => 
                        new Date(e.timestamp).toDateString() === date.toDateString()
                      );
                      const mood = entry ? moods.find(m => m.name === entry.mood) : null;
                      
                      return (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`flex-1 h-10 rounded flex items-center justify-center text-lg cursor-pointer transition-transform hover:scale-105 ${
                                entry ? `bg-gradient-to-br ${mood?.gradient} text-white` : 'bg-muted'
                              }`}
                            >
                              {entry ? mood?.emoji : '-'}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}</p>
                            {entry && <p>{entry.mood} ({entry.intensity}/5)</p>}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {history.length} check-ins au total
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sélection d'humeur */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Votre humeur</h4>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.name;
                
                return (
                  <motion.button
                    key={mood.name}
                    onClick={() => setSelectedMood(mood.name)}
                    className={`
                      relative p-3 rounded-xl border-2 transition-all duration-300
                      ${isSelected 
                        ? 'border-primary shadow-lg scale-105' 
                        : 'border-border hover:border-primary/50 hover:scale-102'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                  >
                    <Icon className={`h-6 w-6 mx-auto ${mood.color}`} />
                    <span className="text-xs mt-1 block">{mood.name}</span>
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-10 rounded-xl`}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Intensité */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-medium">Intensité (1-5)</h4>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`
                      w-8 h-8 rounded-full border-2 font-medium transition-all
                      ${intensity >= level
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <Progress value={(intensity / 5) * 100} className="h-1" />
            </motion.div>
          )}

          {/* Quick Exercise Recommendation */}
          {selectedMood && QUICK_EXERCISES[selectedMood] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600">
                    {QUICK_EXERCISES[selectedMood].icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{QUICK_EXERCISES[selectedMood].name}</p>
                    <p className="text-xs text-muted-foreground">{QUICK_EXERCISES[selectedMood].duration}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={QUICK_EXERCISES[selectedMood].path}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Suggestions basées sur l'humeur */}
          {selectedMood && MOOD_SUGGESTIONS[selectedMood] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 bg-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Suggestion</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {MOOD_SUGGESTIONS[selectedMood][Math.floor(Math.random() * MOOD_SUGGESTIONS[selectedMood].length)]}
              </p>
            </motion.div>
          )}

          {/* Note optionnelle */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              <h4 className="text-sm font-medium">Note (optionnel)</h4>
              <Textarea
                placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px]"
              />
            </motion.div>
          )}

          {/* Bouton de soumission */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enregistrement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Enregistrer mon état
                  </div>
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EmotionalCheckin;
