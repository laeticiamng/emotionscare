// @ts-nocheck
/**
 * Weekly Emotion Report - Rapport émotionnel hebdomadaire automatisé
 * Génère un résumé des patterns émotionnels de la semaine
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Sun,
  Moon,
  Cloud,
  Sparkles,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Zap,
  Brain,
  Target,
  BarChart3,
  History,
  Star,
  Award,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, startOfWeek, endOfWeek, subWeeks, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useScanSettings, WeekSnapshot } from '@/hooks/useScanSettings';
import { supabase } from '@/integrations/supabase/client';

interface DailyEmotion {
  day: string;
  valence: number;
  arousal: number;
  dominantEmotion: string;
  scansCount: number;
}

interface WeeklyStats {
  averageValence: number;
  averageArousal: number;
  trend: 'up' | 'down' | 'stable';
  totalScans: number;
  streakDays: number;
  topEmotions: { name: string; count: number; percentage: number }[];
  peakDay: string;
  lowDay: string;
  insights: string[];
  weeklyGoalProgress: number;
}

interface EmotionDimension {
  dimension: string;
  score: number;
  fullMark: 100;
}

// Empty default used when no data is available
const EMPTY_WEEKLY_DATA: DailyEmotion[] = [
  { day: 'Lun', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
  { day: 'Mar', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
  { day: 'Mer', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
  { day: 'Jeu', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
  { day: 'Ven', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
  { day: 'Sam', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
  { day: 'Dim', valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 },
];

// Dimensions par défaut (utilisées si aucune donnée réelle)
const DEFAULT_EMOTION_DIMENSIONS: EmotionDimension[] = [
  { dimension: 'Joie', score: 50, fullMark: 100 },
  { dimension: 'Calme', score: 50, fullMark: 100 },
  { dimension: 'Énergie', score: 50, fullMark: 100 },
  { dimension: 'Focus', score: 50, fullMark: 100 },
  { dimension: 'Confiance', score: 50, fullMark: 100 },
  { dimension: 'Gratitude', score: 50, fullMark: 100 },
];

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'];

export const WeeklyEmotionReport: React.FC = () => {
  const { toast } = useToast();
  const { weeklyReports, weeklyGoal, saveWeeklyReport, setWeeklyGoal } = useScanSettings();
  
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState<DailyEmotion[]>([]);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [reportHistory, setReportHistory] = useState<WeekSnapshot[]>(weeklyReports);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Sync from hook
  useEffect(() => {
    setReportHistory(weeklyReports);
  }, [weeklyReports]);

  // Charger les vraies données depuis clinical_signals
  useEffect(() => {
    const loadWeeklyData = async () => {
      setIsLoadingData(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setWeeklyData(EMPTY_WEEKLY_DATA);
          setIsLoadingData(false);
          return;
        }

        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

        const { data: signals, error } = await supabase
          .from('clinical_signals')
          .select('metadata, created_at, source_instrument')
          .eq('user_id', user.id)
          .gte('created_at', weekStart.toISOString())
          .lte('created_at', weekEnd.toISOString())
          .order('created_at', { ascending: true });

        if (error || !signals || signals.length === 0) {
          setWeeklyData(EMPTY_WEEKLY_DATA);
          setIsLoadingData(false);
          return;
        }

        // Grouper par jour
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const dailyGroups: Record<string, { valences: number[]; arousals: number[]; emotions: string[] }> = {};

        signals.forEach((signal: any) => {
          const date = new Date(signal.created_at);
          const dayName = dayNames[date.getDay()];
          const metadata = signal.metadata as any;

          if (!dailyGroups[dayName]) {
            dailyGroups[dayName] = { valences: [], arousals: [], emotions: [] };
          }

          const valence = metadata?.valence ?? 50;
          const arousal = metadata?.arousal ?? 50;
          const emotion = metadata?.summary || metadata?.emotion || 'Neutre';

          dailyGroups[dayName].valences.push(valence);
          dailyGroups[dayName].arousals.push(arousal);
          dailyGroups[dayName].emotions.push(emotion);
        });

        // Convertir en format DailyEmotion
        const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const realData: DailyEmotion[] = weekDays.map(day => {
          const group = dailyGroups[day];
          if (!group || group.valences.length === 0) {
            return { day, valence: 0, arousal: 0, dominantEmotion: '-', scansCount: 0 };
          }

          const avgValence = group.valences.reduce((a, b) => a + b, 0) / group.valences.length;
          const avgArousal = group.arousals.reduce((a, b) => a + b, 0) / group.arousals.length;
          
          // Trouver l'émotion dominante
          const emotionCounts: Record<string, number> = {};
          group.emotions.forEach(e => { emotionCounts[e] = (emotionCounts[e] || 0) + 1; });
          const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutre';

          return {
            day,
            valence: Math.round(avgValence),
            arousal: Math.round(avgArousal),
            dominantEmotion,
            scansCount: group.valences.length
          };
        });

        setWeeklyData(realData);
      } catch (err) {
        logger.error('[WeeklyEmotionReport] Error loading data:', err, 'SCAN');
        setWeeklyData(EMPTY_WEEKLY_DATA);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadWeeklyData();
  }, [currentWeek]);

  useEffect(() => {
    if (weeklyData.length > 0) {
      generateStats();
    }
  }, [weeklyData, weeklyGoal]);

  const generateStats = () => {
    // Protection contre les données vides
    const validData = weeklyData.filter(d => d.scansCount > 0);
    if (validData.length === 0) {
      setStats(null);
      return;
    }

    const dataLength = weeklyData.length || 1;
    const avgValence = weeklyData.reduce((acc, d) => acc + d.valence, 0) / dataLength;
    const avgArousal = weeklyData.reduce((acc, d) => acc + d.arousal, 0) / dataLength;
    const totalScans = weeklyData.reduce((acc, d) => acc + d.scansCount, 0);
    
    const firstHalfData = weeklyData.slice(0, 3);
    const secondHalfData = weeklyData.slice(4);
    const firstHalf = firstHalfData.length > 0 
      ? firstHalfData.reduce((acc, d) => acc + d.valence, 0) / firstHalfData.length 
      : 0;
    const secondHalf = secondHalfData.length > 0 
      ? secondHalfData.reduce((acc, d) => acc + d.valence, 0) / secondHalfData.length 
      : 0;
    const trend = secondHalf > firstHalf + 5 ? 'up' : secondHalf < firstHalf - 5 ? 'down' : 'stable';
    
    const emotionCounts: Record<string, number> = {};
    weeklyData.forEach(d => {
      if (d.dominantEmotion && d.dominantEmotion !== '-') {
        emotionCounts[d.dominantEmotion] = (emotionCounts[d.dominantEmotion] || 0) + d.scansCount;
      }
    });
    const topEmotions = Object.entries(emotionCounts)
      .map(([name, count]) => ({ 
        name, 
        count, 
        percentage: totalScans > 0 ? Math.round((count / totalScans) * 100) : 0 
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    
    const sortedByValence = [...weeklyData].filter(d => d.valence > 0).sort((a, b) => b.valence - a.valence);
    
    const newStats: WeeklyStats = {
      averageValence: Math.round(avgValence) || 0,
      averageArousal: Math.round(avgArousal) || 0,
      trend,
      totalScans,
      streakDays: validData.length,
      topEmotions,
      peakDay: sortedByValence[0]?.day || '-',
      lowDay: sortedByValence[sortedByValence.length - 1]?.day || '-',
      weeklyGoalProgress: weeklyGoal > 0 ? Math.min(100, (totalScans / weeklyGoal) * 100) : 0,
      insights: [
        avgValence > 70 ? 'Votre bien-être émotionnel est excellent cette semaine !' : 'Votre humeur montre des opportunités d\'amélioration.',
        totalScans >= weeklyGoal ? '🎯 Objectif hebdomadaire atteint !' : `Encore ${Math.max(0, weeklyGoal - totalScans)} scans pour atteindre votre objectif.`,
        trend === 'up' ? 'Tendance positive : votre humeur s\'améliore au fil de la semaine.' : 
        trend === 'down' ? 'Prenez soin de vous - votre énergie semble diminuer.' : 
        'Votre humeur est stable cette semaine.',
        topEmotions[0]?.name === 'Joie' || topEmotions[0]?.name === 'Sérénité' 
          ? 'Les émotions positives dominent votre semaine.' 
          : 'Essayez des activités qui vous apportent de la joie.'
      ]
    };
    
    setStats(newStats);
  };

  // Calculer les dimensions dynamiquement à partir des données réelles
  const emotionDimensions = useMemo((): EmotionDimension[] => {
    if (!stats || weeklyData.length === 0) {
      return DEFAULT_EMOTION_DIMENSIONS;
    }

    // Calculer les scores basés sur les données réelles
    const joyScore = Math.min(100, Math.round(stats.averageValence * 1.1));
    const calmScore = Math.min(100, Math.round(100 - stats.averageArousal * 0.5));
    const energyScore = Math.min(100, Math.round(stats.averageArousal));
    const focusScore = Math.min(100, Math.round((stats.totalScans / 7) * 15 + 40));
    const confidenceScore = Math.min(100, Math.round(stats.averageValence * 0.9 + 10));
    const gratitudeScore = Math.min(100, Math.round(stats.streakDays * 12 + 30));

    return [
      { dimension: 'Joie', score: joyScore, fullMark: 100 },
      { dimension: 'Calme', score: calmScore, fullMark: 100 },
      { dimension: 'Énergie', score: energyScore, fullMark: 100 },
      { dimension: 'Focus', score: focusScore, fullMark: 100 },
      { dimension: 'Confiance', score: confidenceScore, fullMark: 100 },
      { dimension: 'Gratitude', score: gratitudeScore, fullMark: 100 },
    ];
  }, [stats, weeklyData]);

  const handleSaveReport = useCallback(() => {
    if (!stats) return;
    
    const weekStartDate = startOfWeek(currentWeek, { weekStartsOn: 1 }).toISOString();
    const snapshot: WeekSnapshot = { weekStart: weekStartDate, stats };
    
    saveWeeklyReport(snapshot);
    setReportHistory(prev => {
      const filtered = prev.filter(r => r.weekStart !== weekStartDate);
      return [snapshot, ...filtered].slice(0, 12);
    });
    
    toast({ title: 'Rapport sauvegardé', description: 'Consultez l\'historique.' });
  }, [stats, currentWeek, toast, saveWeeklyReport]);

  const updateWeeklyGoal = (goal: string) => {
    const newGoal = parseInt(goal, 10);
    setWeeklyGoal(newGoal);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const TrendIcon = stats?.trend === 'up' ? TrendingUp : stats?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats?.trend === 'up' ? 'text-green-500' : stats?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  const handleExportJSON = () => {
    const data = {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      dailyData: weeklyData,
      stats,
      dimensions: emotionDimensions,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion-report-${format(weekStart, 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export réussi' });
  };

  const handleShare = async () => {
    const text = `📊 Mon rapport émotionnel (${format(weekStart, 'd MMM', { locale: fr })} - ${format(weekEnd, 'd MMM', { locale: fr })}):\n` +
      `• Bien-être: ${stats?.averageValence}%\n` +
      `• Énergie: ${stats?.averageArousal}%\n` +
      `• Scans: ${stats?.totalScans}\n` +
      `• Tendance: ${stats?.trend === 'up' ? '📈 En hausse' : stats?.trend === 'down' ? '📉 En baisse' : '→ Stable'}`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Mon rapport émotionnel', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !' });
    }
  };

  const emotionPieData = stats?.topEmotions.map(e => ({
    name: e.name,
    value: e.percentage
  })) || [];

  // Affichage de chargement
  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Chargement des données...</span>
        </div>
      </div>
    );
  }

  // Détecter si on a des données réelles
  const isUsingRealData = weeklyData.some(d => d.scansCount > 0);

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Rapport Hebdomadaire
            </h2>
            {/* Indicateur données réelles vs démo */}
            <Badge variant={isUsingRealData ? "default" : "secondary"} className="text-xs">
              {isUsingRealData ? "Données réelles" : "Aucune donnée"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {isUsingRealData
              ? "Analyse de vos émotions cette semaine"
              : "Effectuez des scans pour générer votre rapport"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">
            {format(weekStart, 'd MMM', { locale: fr })} - {format(weekEnd, 'd MMM yyyy', { locale: fr })}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateWeek('next')}
            disabled={weekEnd >= new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExportJSON}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveReport}>
            <Star className="h-4 w-4 mr-1" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="charts" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Graphiques
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Weekly Goal */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium">Objectif hebdomadaire</span>
                </div>
                <Select value={weeklyGoal.toString()} onValueChange={updateWeeklyGoal}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[7, 14, 21, 28].map(g => (
                      <SelectItem key={g} value={g.toString()}>{g} scans</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <Progress value={stats?.weeklyGoalProgress || 0} className="flex-1" />
                <span className="text-sm font-medium">
                  {stats?.totalScans || 0}/{weeklyGoal}
                </span>
              </div>
              {stats?.weeklyGoalProgress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center gap-2 text-green-600"
                >
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Objectif atteint !</span>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Stats principales */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Bien-être moyen</p>
                        <p className="text-2xl font-bold text-foreground">{stats.averageValence}%</p>
                      </div>
                      <div className={`p-3 rounded-full ${stats.averageValence > 60 ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                        <Heart className={`h-5 w-5 ${stats.averageValence > 60 ? 'text-green-500' : 'text-amber-500'}`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                      <span className={`text-xs ${trendColor}`}>
                        {stats.trend === 'up' ? 'En hausse' : stats.trend === 'down' ? 'En baisse' : 'Stable'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Énergie moyenne</p>
                        <p className="text-2xl font-bold text-foreground">{stats.averageArousal}%</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Scans effectués</p>
                        <p className="text-2xl font-bold text-foreground">{stats.totalScans}</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-500/10">
                        <Brain className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Série actuelle</p>
                        <p className="text-2xl font-bold text-foreground">{stats.streakDays} jours</p>
                      </div>
                      <div className="p-3 rounded-full bg-orange-500/10">
                        <Target className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Émotions dominantes */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Émotions dominantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {stats.topEmotions.map((emotion, index) => (
                      <motion.div 
                        key={emotion.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={index === 0 ? 'default' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                            <span className="font-medium">{emotion.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {emotion.count} fois ({emotion.percentage}%)
                          </span>
                        </div>
                        <Progress value={emotion.percentage} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={emotionPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {emotionPieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="mt-4 space-y-6">
          {/* Évolution journalière */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Évolution quotidienne</CardTitle>
              <CardDescription>Valence et arousal jour par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="valence" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      name="Bien-être"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="arousal" 
                      stroke="hsl(142 76% 36%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(142 76% 36%)' }}
                      name="Énergie"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Radar émotionnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profil émotionnel</CardTitle>
              <CardDescription>Dimensions émotionnelles de la semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={emotionDimensions}>
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis dataKey="dimension" className="text-xs" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Nombre de scans par jour */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activité quotidienne</CardTitle>
              <CardDescription>Nombre de scans par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="scansCount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Scans" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          {stats && (
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Insights de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {stats.insights.map((insight, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                      <p className="text-muted-foreground">{insight}</p>
                    </motion.li>
                  ))}
                </ul>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Sun className="h-4 w-4 text-amber-500" />
                      <span>Meilleur jour: <strong>{stats.peakDay}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cloud className="h-4 w-4 text-slate-400" />
                      <span>À améliorer: <strong>{stats.lowDay}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 p-4 rounded-lg bg-background/50 border">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Recommandations personnalisées
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {stats.averageValence < 60 && (
                      <div className="p-3 rounded bg-amber-50 dark:bg-amber-900/20 text-sm">
                        💡 Essayez une séance de méditation guidée pour améliorer votre bien-être.
                      </div>
                    )}
                    {stats.averageArousal < 50 && (
                      <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-sm">
                        ⚡ Une activité physique modérée peut booster votre énergie.
                      </div>
                    )}
                    {stats.totalScans < weeklyGoal && (
                      <div className="p-3 rounded bg-purple-50 dark:bg-purple-900/20 text-sm">
                        📊 Augmentez la fréquence de vos scans pour mieux suivre vos émotions.
                      </div>
                    )}
                    <div className="p-3 rounded bg-green-50 dark:bg-green-900/20 text-sm">
                      🌟 Continuez à pratiquer la conscience émotionnelle quotidienne !
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des rapports
              </CardTitle>
              <CardDescription>
                Vos 12 dernières semaines sauvegardées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportHistory.length > 0 ? (
                <div className="space-y-3">
                  {reportHistory.map((report, idx) => (
                    <motion.div
                      key={report.weekStart}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-medium">
                          Semaine du {format(new Date(report.weekStart), 'd MMMM yyyy', { locale: fr })}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>Bien-être: {report.stats.averageValence}%</span>
                          <span>Énergie: {report.stats.averageArousal}%</span>
                          <span>{report.stats.totalScans} scans</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          report.stats.trend === 'up' ? 'default' : 
                          report.stats.trend === 'down' ? 'destructive' : 
                          'secondary'
                        }>
                          {report.stats.trend === 'up' ? '↑' : report.stats.trend === 'down' ? '↓' : '→'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun rapport sauvegardé</p>
                  <p className="text-sm">Cliquez sur "Sauvegarder" pour conserver vos rapports.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyEmotionReport;
