/**
 * ScoresV2Panel - Panel complet de visualisation des scores et vibes
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Minus, Activity, Flame, 
  Brain, Heart, Zap, Target, Calendar, Download, 
  RefreshCw, BarChart3, Grid3X3, LineChart, Award,
  Sun, Sparkles, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useScores } from './useScores';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface VibeDisplayConfig {
  emoji: string;
  color: string;
  bgColor: string;
  label: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const VIBE_CONFIG: Record<string, VibeDisplayConfig> = {
  energized: { emoji: '⚡', color: 'text-amber-500', bgColor: 'bg-amber-500/10', label: 'Énergique' },
  calm: { emoji: '😌', color: 'text-teal-500', bgColor: 'bg-teal-500/10', label: 'Calme' },
  creative: { emoji: '🎨', color: 'text-purple-500', bgColor: 'bg-purple-500/10', label: 'Créatif' },
  focused: { emoji: '🎯', color: 'text-blue-500', bgColor: 'bg-blue-500/10', label: 'Concentré' },
  social: { emoji: '👥', color: 'text-pink-500', bgColor: 'bg-pink-500/10', label: 'Social' },
  reflective: { emoji: '🤔', color: 'text-slate-500', bgColor: 'bg-slate-500/10', label: 'Réflexif' },
  playful: { emoji: '🎮', color: 'text-orange-500', bgColor: 'bg-orange-500/10', label: 'Joueur' },
  determined: { emoji: '💪', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', label: 'Déterminé' },
  peaceful: { emoji: '☮️', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', label: 'Paisible' },
  anxious: { emoji: '😰', color: 'text-amber-600', bgColor: 'bg-amber-600/10', label: 'Anxieux' },
  tired: { emoji: '😴', color: 'text-gray-500', bgColor: 'bg-gray-500/10', label: 'Fatigué' },
  overwhelmed: { emoji: '😵', color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'Débordé' },
  neutral: { emoji: '😐', color: 'text-gray-400', bgColor: 'bg-gray-400/10', label: 'Neutre' },
  joyful: { emoji: '😊', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', label: 'Joyeux' },
  melancholic: { emoji: '😔', color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', label: 'Mélancolique' }
};

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/** Score Card with trend indicator */
const ScoreCard: React.FC<{
  title: string;
  score: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  color: string;
}> = ({ title, score, icon: IconComponent, trend = 'stable', change = 0, color }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <div className={cn("absolute inset-0 opacity-5", color)} />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-2 rounded-lg", color.replace('bg-', 'bg-').replace('-500', '-500/20'))}>
              <IconComponent className={cn("h-5 w-5", color.replace('bg-', 'text-'))} />
            </div>
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{change > 0 ? '+' : ''}{change}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-muted-foreground text-sm mb-1">/100</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/** Mood Heatmap visualization */
const MoodHeatmap: React.FC<{
  data: Array<{ date: string; hour: number; mood_score: number }>;
}> = ({ data }) => {
  // Group by date and hour
  const heatmapGrid = useMemo(() => {
    const grid: Record<string, Record<number, number>> = {};
    
    data.forEach(d => {
      if (!grid[d.date]) grid[d.date] = {};
      grid[d.date][d.hour] = d.mood_score;
    });
    
    // Get last 7 days
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return { grid, dates };
  }, [data]);

  const getColor = (score: number | undefined) => {
    if (score === undefined) return 'bg-muted/30';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-teal-400';
    if (score >= 40) return 'bg-amber-400';
    if (score >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Heatmap Humeur (7 derniers jours)</h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Faible</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-red-400" />
            <div className="w-3 h-3 rounded-sm bg-orange-400" />
            <div className="w-3 h-3 rounded-sm bg-amber-400" />
            <div className="w-3 h-3 rounded-sm bg-teal-400" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          </div>
          <span className="text-muted-foreground">Élevé</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: 'auto repeat(24, 1fr)' }}>
          {/* Header row with hours */}
          <div className="text-xs text-muted-foreground" />
          {HOURS.filter((_, i) => i % 4 === 0).map(hour => (
            <div key={hour} className="text-xs text-muted-foreground text-center col-span-4">
              {hour}h
            </div>
          ))}
          
          {/* Data rows */}
          {heatmapGrid.dates.map((date, dayIdx) => (
            <React.Fragment key={date}>
              <div className="text-xs text-muted-foreground pr-2">{DAYS[dayIdx % 7]}</div>
              {HOURS.map(hour => (
                <TooltipProvider key={`${date}-${hour}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "w-full h-4 rounded-sm transition-all hover:ring-2 ring-primary/50 cursor-pointer",
                          getColor(heatmapGrid.grid[date]?.[hour])
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{date} à {hour}h</p>
                      <p className="font-semibold">
                        Score: {heatmapGrid.grid[date]?.[hour] ?? 'N/A'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Mood Trend Chart (simplified) */
const MoodTrendChart: React.FC<{
  data: Array<{ date: string; emotional: number; wellbeing: number; engagement: number; overall: number }>;
}> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <LineChart className="h-12 w-12 mb-4 opacity-50" />
        <p>Pas encore de données de tendance</p>
        <p className="text-sm">Les scores hebdomadaires apparaîtront ici</p>
      </div>
    );
  }

  const maxValue = 100;
  const chartHeight = 200;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Émotionnel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span>Bien-être</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span>Engagement</span>
        </div>
      </div>
      
      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-muted-foreground">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        
        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-0">
          <svg className="w-full h-full" viewBox={`0 0 ${data.length * 60} ${chartHeight}`} preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 50, 100].map(v => (
              <line 
                key={v}
                x1="0" 
                y1={chartHeight - (v / maxValue) * chartHeight} 
                x2={data.length * 60} 
                y2={chartHeight - (v / maxValue) * chartHeight}
                stroke="currentColor"
                strokeOpacity="0.1"
              />
            ))}
            
            {/* Lines */}
            {['emotional', 'wellbeing', 'engagement'].map((key, lineIdx) => {
              const colors = ['#f43f5e', '#14b8a6', '#8b5cf6'];
              const points = data.map((d, i) => 
                `${i * 60 + 30},${chartHeight - (d[key as keyof typeof d] as number / maxValue) * chartHeight}`
              ).join(' ');
              
              return (
                <polyline
                  key={key}
                  points={points}
                  fill="none"
                  stroke={colors[lineIdx]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            
            {/* Data points */}
            {data.map((d, i) => (
              <React.Fragment key={i}>
                <circle 
                  cx={i * 60 + 30} 
                  cy={chartHeight - (d.emotional / maxValue) * chartHeight}
                  r="4"
                  fill="#f43f5e"
                />
                <circle 
                  cx={i * 60 + 30} 
                  cy={chartHeight - (d.wellbeing / maxValue) * chartHeight}
                  r="4"
                  fill="#14b8a6"
                />
                <circle 
                  cx={i * 60 + 30} 
                  cy={chartHeight - (d.engagement / maxValue) * chartHeight}
                  r="4"
                  fill="#8b5cf6"
                />
              </React.Fragment>
            ))}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-around text-xs text-muted-foreground mt-2">
            {data.map((d, i) => (
              <span key={i} className="truncate max-w-[50px]">{d.date}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Current Vibe Display */
const VibeDisplay: React.FC<{
  vibe: string;
  intensity: number;
}> = ({ vibe, intensity }) => {
  const config = VIBE_CONFIG[vibe] || VIBE_CONFIG.neutral;
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("rounded-xl p-6 text-center", config.bgColor)}
    >
      <motion.div 
        className="text-6xl mb-4"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        {config.emoji}
      </motion.div>
      <h3 className={cn("text-xl font-semibold mb-2", config.color)}>
        {config.label}
      </h3>
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">Intensité:</span>
        <span className="font-bold">{intensity}%</span>
      </div>
      <Progress value={intensity} className="h-2" />
    </motion.div>
  );
};

/** Statistics Overview */
const StatisticsOverview: React.FC<{
  statistics: {
    total_score_entries: number;
    highest_emotional_score: number;
    average_emotional_score: number;
    average_wellbeing_score: number;
    average_engagement_score: number;
    improvement_rate: number;
    consistency_rating: number;
    best_week: { week_number: number; year: number; score: number };
  } | null;
  streakDays: number;
}> = ({ statistics, streakDays }) => {
  if (!statistics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Pas encore de statistiques</p>
        <p className="text-sm">Utilisez l'app pour générer des données</p>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Semaines de données', 
      value: statistics.total_score_entries, 
      icon: Calendar,
      color: 'text-blue-500'
    },
    { 
      label: 'Meilleur score émotionnel', 
      value: statistics.highest_emotional_score, 
      icon: Award,
      color: 'text-amber-500'
    },
    { 
      label: 'Streak actuelle', 
      value: `${streakDays} jours`, 
      icon: Flame,
      color: 'text-orange-500'
    },
    { 
      label: 'Consistance', 
      value: `${statistics.consistency_rating}%`, 
      icon: Target,
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-muted/30 rounded-lg p-4 text-center"
        >
          <stat.icon className={cn("h-6 w-6 mx-auto mb-2", stat.color)} />
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

/** Insights Panel */
const InsightsPanel: React.FC<{
  insights: {
    insights: Array<{
      type: string;
      category: string;
      title: string;
      message: string;
      priority: string;
      recommendations: string[];
    }>;
    key_strengths: string[];
    areas_for_improvement: string[];
    next_steps: string[];
  } | null;
}> = ({ insights }) => {
  if (!insights || insights.insights.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Pas encore d'insights</p>
        <p className="text-sm">Continuez à utiliser l'app pour générer des analyses</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key insights */}
      <div className="space-y-3">
        {insights.insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-4 rounded-lg border-l-4",
              insight.type === 'positive' && 'bg-emerald-500/10 border-emerald-500',
              insight.type === 'improvement' && 'bg-blue-500/10 border-blue-500',
              insight.type === 'concern' && 'bg-amber-500/10 border-amber-500',
              insight.type === 'negative' && 'bg-red-500/10 border-red-500'
            )}
          >
            <h4 className="font-semibold mb-1">{insight.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{insight.message}</p>
            {insight.recommendations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {insight.recommendations.map((rec, j) => (
                  <Badge key={j} variant="outline" className="text-xs">
                    {rec}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Strengths & Areas */}
      <div className="grid grid-cols-2 gap-4">
        {insights.key_strengths.length > 0 && (
          <div className="bg-emerald-500/10 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-600 mb-2 flex items-center gap-2">
              <Sun className="h-4 w-4" /> Points forts
            </h4>
            <ul className="text-sm space-y-1">
              {insights.key_strengths.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}
        
        {insights.areas_for_improvement.length > 0 && (
          <div className="bg-amber-500/10 rounded-lg p-4">
            <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" /> À améliorer
            </h4>
            <ul className="text-sm space-y-1">
              {insights.areas_for_improvement.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ScoresV2Panel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('12');
  
  const {
    currentVibe,
    heatmapData,
    moodTrends,
    statistics,
    insights,
    isLoading,
    isError,
    refreshScores,
    calculateCurrentWeekScore,
    exportData,
    latestScore,
    scoreChange,
    trend,
    streakDays
  } = useScores({ weeks: parseInt(timeRange) });

  const handleRefresh = async () => {
    try {
      await calculateCurrentWeekScore();
      await refreshScores();
      toast({ title: 'Scores actualisés', description: 'Vos scores ont été recalculés.' });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'actualiser les scores.', variant: 'destructive' });
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = await exportData(format);
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scores-export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Export réussi', description: `Fichier ${format.toUpperCase()} téléchargé.` });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'exporter les données.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p>Erreur lors du chargement des scores</p>
        <Button variant="outline" onClick={handleRefresh} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mes Scores & Vibes</h2>
          <p className="text-muted-foreground">Visualisez votre progression émotionnelle</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 semaines</SelectItem>
              <SelectItem value="8">8 semaines</SelectItem>
              <SelectItem value="12">12 semaines</SelectItem>
              <SelectItem value="24">24 semaines</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Score Émotionnel"
          score={latestScore?.emotional_score ?? 50}
          icon={Heart}
          trend={trend}
          change={scoreChange}
          color="bg-rose-500"
        />
        <ScoreCard
          title="Bien-être"
          score={latestScore?.wellbeing_score ?? 50}
          icon={Brain}
          trend={trend}
          change={Math.round(scoreChange * 0.8)}
          color="bg-teal-500"
        />
        <ScoreCard
          title="Engagement"
          score={latestScore?.engagement_score ?? 50}
          icon={Zap}
          trend={trend}
          change={Math.round(scoreChange * 0.6)}
          color="bg-violet-500"
        />
        <ScoreCard
          title="Score Global"
          score={latestScore 
            ? Math.round((latestScore.emotional_score + latestScore.wellbeing_score + latestScore.engagement_score) / 3)
            : 50
          }
          icon={Activity}
          trend={trend}
          change={scoreChange}
          color="bg-primary"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Heatmap</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Tendances</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Vibe */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vibe Actuel</CardTitle>
                  <CardDescription>Votre état émotionnel du moment</CardDescription>
                </CardHeader>
                <CardContent>
                  <VibeDisplay 
                    vibe={currentVibe?.current_vibe || 'neutral'}
                    intensity={currentVibe?.vibe_intensity || 50}
                  />
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                  <CardDescription>Aperçu de votre progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <StatisticsOverview statistics={statistics} streakDays={streakDays} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Heatmap Quotidienne</CardTitle>
                <CardDescription>Visualisez vos humeurs par jour et heure</CardDescription>
              </CardHeader>
              <CardContent>
                <MoodHeatmap data={heatmapData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Courbes d'Humeur</CardTitle>
                <CardDescription>Évolution de vos scores sur {timeRange} semaines</CardDescription>
              </CardHeader>
              <CardContent>
                <MoodTrendChart data={moodTrends} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyses & Recommandations</CardTitle>
                <CardDescription>Insights personnalisés basés sur vos données</CardDescription>
              </CardHeader>
              <CardContent>
                <InsightsPanel insights={insights} />
              </CardContent>
            </Card>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
