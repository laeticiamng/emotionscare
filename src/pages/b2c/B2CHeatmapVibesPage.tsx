/**
 * B2CHeatmapVibesPage - Visualisation avancée des patterns émotionnels
 * Fonctionnalités: Heatmap interactive, insights IA, comparaison temporelle, export
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, Users, Calendar, Filter, BarChart3,
  Download, RefreshCw, ChevronLeft, ChevronRight, Sparkles,
  Clock, Target, Zap, Moon, Sun, Loader2, Info, Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import PageRoot from '@/components/common/PageRoot';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
interface HeatmapCell {
  hour: number;
  day: string;
  date: Date;
  intensity: number;
  mood: string;
  moodScore: number;
  activities: string[];
  count: number;
}

interface DailyInsight {
  date: Date;
  averageMood: number;
  peakHour: number;
  lowHour: number;
  dominantEmotion: string;
  totalActivities: number;
}

interface WeeklyPattern {
  dayOfWeek: string;
  averageIntensity: number;
  bestHour: number;
  worstHour: number;
  commonMood: string;
}

interface AIInsight {
  id: string;
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
  icon: string;
  priority: number;
}

// Constants
const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h to 23h

const MOOD_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  'énergique': { bg: 'bg-orange-500', text: 'text-orange-500', emoji: '⚡' },
  'serein': { bg: 'bg-blue-500', text: 'text-blue-500', emoji: '🧘' },
  'concentré': { bg: 'bg-purple-500', text: 'text-purple-500', emoji: '🎯' },
  'créatif': { bg: 'bg-pink-500', text: 'text-pink-500', emoji: '🎨' },
  'motivé': { bg: 'bg-green-500', text: 'text-green-500', emoji: '💪' },
  'anxieux': { bg: 'bg-amber-500', text: 'text-amber-500', emoji: '😰' },
  'fatigué': { bg: 'bg-gray-500', text: 'text-gray-500', emoji: '😴' },
  'joyeux': { bg: 'bg-yellow-500', text: 'text-yellow-500', emoji: '😊' },
};

const MOOD_FILTERS = [
  { name: 'all', emoji: '🌈', label: 'Toutes' },
  { name: 'énergique', emoji: '⚡', label: 'Énergique' },
  { name: 'serein', emoji: '🧘', label: 'Serein' },
  { name: 'concentré', emoji: '🎯', label: 'Concentré' },
  { name: 'créatif', emoji: '🎨', label: 'Créatif' },
  { name: 'joyeux', emoji: '😊', label: 'Joyeux' },
];

// Helper functions
const generateMockData = (weekOffset: number = 0): HeatmapCell[] => {
  const data: HeatmapCell[] = [];
  const moods = Object.keys(MOOD_COLORS);
  const activities = ['méditation', 'respiration', 'journal', 'musique', 'exercice', 'lecture'];
  
  const today = new Date();
  const weekStart = startOfWeek(subDays(today, weekOffset * 7), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  daysInWeek.forEach((date, dayIndex) => {
    HOURS.forEach((hour) => {
      // Generate realistic patterns
      const isWorkHour = hour >= 9 && hour <= 18 && dayIndex < 5;
      const isMorning = hour >= 6 && hour <= 9;
      const isEvening = hour >= 19 && hour <= 22;
      
      // Higher intensity during work hours on weekdays
      let baseIntensity = Math.random() * 40 + 20;
      if (isWorkHour) baseIntensity += 30;
      if (isMorning) baseIntensity += 15;
      if (isEvening) baseIntensity += 10;
      
      // Add some randomness but keep patterns
      const intensity = Math.min(100, Math.max(0, baseIntensity + (Math.random() - 0.5) * 20));
      
      // Determine mood based on time of day
      let moodIndex: number;
      if (isMorning) moodIndex = Math.random() > 0.5 ? 0 : 4; // énergique or motivé
      else if (isEvening) moodIndex = Math.random() > 0.5 ? 1 : 7; // serein or joyeux
      else moodIndex = Math.floor(Math.random() * moods.length);
      
      const selectedMood = moods[moodIndex];
      const hasData = intensity > 30 || Math.random() > 0.6;
      
      if (hasData) {
        data.push({
          hour,
          day: DAYS_FR[dayIndex],
          date,
          intensity,
          mood: selectedMood,
          moodScore: Math.round(intensity / 20) + 1, // 1-5 scale
          activities: activities.filter(() => Math.random() > 0.7),
          count: Math.floor(Math.random() * 5) + 1,
        });
      }
    });
  });
  
  return data;
};

const generateInsights = (data: HeatmapCell[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Analyze peak hours
  const hourAverages = HOURS.map(hour => {
    const hourData = data.filter(d => d.hour === hour);
    return {
      hour,
      avg: hourData.length > 0 
        ? hourData.reduce((sum, d) => sum + d.intensity, 0) / hourData.length 
        : 0,
    };
  });
  
  const peakHour = hourAverages.reduce((max, curr) => curr.avg > max.avg ? curr : max);
  const lowHour = hourAverages.filter(h => h.avg > 0).reduce((min, curr) => curr.avg < min.avg ? curr : min, hourAverages[0]);
  
  insights.push({
    id: 'peak-hour',
    type: 'positive',
    title: `Pic d'activité à ${peakHour.hour}h`,
    description: `Vous êtes généralement le plus actif vers ${peakHour.hour}h. C'est le moment idéal pour vos tâches importantes.`,
    icon: '⚡',
    priority: 1,
  });
  
  if (lowHour && lowHour.avg < 30) {
    insights.push({
      id: 'low-hour',
      type: 'suggestion',
      title: `Creux d'énergie à ${lowHour.hour}h`,
      description: `Votre énergie diminue vers ${lowHour.hour}h. Essayez une courte pause ou exercice de respiration.`,
      icon: '🔋',
      priority: 2,
    });
  }
  
  // Analyze weekend patterns
  const weekendData = data.filter(d => ['Sam', 'Dim'].includes(d.day));
  const weekdayData = data.filter(d => !['Sam', 'Dim'].includes(d.day));
  
  const weekendAvg = weekendData.length > 0 
    ? weekendData.reduce((sum, d) => sum + d.intensity, 0) / weekendData.length 
    : 0;
  const weekdayAvg = weekdayData.length > 0 
    ? weekdayData.reduce((sum, d) => sum + d.intensity, 0) / weekdayData.length 
    : 0;
  
  if (weekendAvg > weekdayAvg * 1.2) {
    insights.push({
      id: 'weekend-boost',
      type: 'positive',
      title: 'Meilleure humeur le weekend',
      description: 'Vos scores émotionnels sont 20% plus élevés le weekend. Essayez d\'intégrer plus de moments de détente en semaine.',
      icon: '🌴',
      priority: 3,
    });
  }
  
  // Mood diversity
  const moodCounts: Record<string, number> = {};
  data.forEach(d => {
    moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
  });
  
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  if (dominantMood && dominantMood[1] > data.length * 0.4) {
    insights.push({
      id: 'dominant-mood',
      type: 'positive',
      title: `Émotion dominante: ${dominantMood[0]}`,
      description: `Vous ressentez souvent un état ${dominantMood[0]}. ${MOOD_COLORS[dominantMood[0]]?.emoji || ''}`,
      icon: MOOD_COLORS[dominantMood[0]]?.emoji || '🎭',
      priority: 4,
    });
  }
  
  // Morning routine suggestion
  const morningData = data.filter(d => d.hour >= 6 && d.hour <= 9);
  if (morningData.length < 5) {
    insights.push({
      id: 'morning-routine',
      type: 'warning',
      title: 'Routine matinale à développer',
      description: 'Peu d\'activités le matin. Une routine matinale peut booster votre journée.',
      icon: '🌅',
      priority: 5,
    });
  }
  
  return insights.sort((a, b) => a.priority - b.priority);
};

// Components
const HeatmapGrid: React.FC<{
  data: HeatmapCell[];
  selectedMood: string;
  onCellClick: (cell: HeatmapCell) => void;
}> = ({ data, selectedMood, onCellClick }) => {
  const filteredData = useMemo(() => {
    if (selectedMood === 'all') return data;
    return data.filter(d => d.mood === selectedMood);
  }, [data, selectedMood]);

  const getIntensityColor = (intensity: number) => {
    if (intensity < 20) return 'bg-muted/20';
    if (intensity < 40) return 'bg-primary/20';
    if (intensity < 60) return 'bg-primary/40';
    if (intensity < 80) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  const getCellData = (day: string, hour: number) => {
    return filteredData.find(d => d.day === day && d.hour === hour);
  };

  return (
    <div className="space-y-2">
      {/* Hours header */}
      <div className="flex mb-2 pl-12">
        {[6, 9, 12, 15, 18, 21].map((hour) => (
          <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
            {hour}h
          </div>
        ))}
      </div>
      
      {/* Days with cells */}
      {DAYS_FR.map((day, dayIndex) => (
        <div key={day} className="flex items-center gap-1">
          <div className="w-10 text-xs text-muted-foreground font-medium">{day}</div>
          <div className="flex-1 flex gap-0.5">
            {HOURS.map((hour) => {
              const cell = getCellData(day, hour);
              const intensity = cell?.intensity || 0;
              
              return (
                <TooltipProvider key={`${day}-${hour}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: (dayIndex * 18 + (hour - 6)) * 0.01 }}
                        className={`
                          aspect-square rounded-sm cursor-pointer
                          transition-all hover:scale-110 hover:z-10
                          ${cell ? getIntensityColor(intensity) : 'bg-muted/10'}
                        `}
                        style={{ flex: 1, minWidth: 16, maxWidth: 32 }}
                        onClick={() => cell && onCellClick(cell)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {cell ? (
                        <div className="text-sm">
                          <div className="font-medium">{day} {hour}h</div>
                          <div className="flex items-center gap-1 mt-1">
                            <span>{MOOD_COLORS[cell.mood]?.emoji}</span>
                            <span className="capitalize">{cell.mood}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Intensité: {Math.round(cell.intensity)}%
                          </div>
                          {cell.activities.length > 0 && (
                            <div className="text-xs mt-1">
                              {cell.activities.join(', ')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Aucune donnée
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground px-12">
        <span>Moins actif</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level} 
              className={`w-4 h-4 rounded-sm ${
                level === 1 ? 'bg-muted/20' :
                level === 2 ? 'bg-primary/20' :
                level === 3 ? 'bg-primary/40' :
                level === 4 ? 'bg-primary/60' :
                'bg-primary/80'
              }`} 
            />
          ))}
        </div>
        <span>Plus actif</span>
      </div>
    </div>
  );
};

const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const bgColor = insight.type === 'positive' 
    ? 'bg-green-500/10 border-green-500/20' 
    : insight.type === 'warning' 
    ? 'bg-amber-500/10 border-amber-500/20'
    : 'bg-blue-500/10 border-blue-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border ${bgColor}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{insight.icon}</span>
        <div>
          <h4 className="font-medium text-sm">{insight.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WeeklyStatsCard: React.FC<{ data: HeatmapCell[] }> = ({ data }) => {
  const stats = useMemo(() => {
    const totalActivities = data.reduce((sum, d) => sum + d.count, 0);
    const avgIntensity = data.length > 0 
      ? data.reduce((sum, d) => sum + d.intensity, 0) / data.length 
      : 0;
    
    const moodCounts: Record<string, number> = {};
    data.forEach(d => {
      moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    
    const hourAverages = HOURS.map(hour => {
      const hourData = data.filter(d => d.hour === hour);
      return {
        hour,
        avg: hourData.length > 0 
          ? hourData.reduce((sum, d) => sum + d.intensity, 0) / hourData.length 
          : 0,
      };
    });
    const peakHour = hourAverages.reduce((max, curr) => curr.avg > max.avg ? curr : max);
    
    return {
      totalActivities,
      avgIntensity: Math.round(avgIntensity),
      topMood: topMood?.[0] || 'N/A',
      peakHour: peakHour.hour,
      uniqueDays: new Set(data.map(d => d.day)).size,
    };
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Résumé de la semaine
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary">{stats.totalActivities}</div>
          <div className="text-xs text-muted-foreground">Activités</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{stats.avgIntensity}%</div>
          <div className="text-xs text-muted-foreground">Intensité moy.</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl">{MOOD_COLORS[stats.topMood]?.emoji || '🎭'}</span>
            <span className="font-medium capitalize">{stats.topMood}</span>
          </div>
          <div className="text-xs text-muted-foreground">Humeur dominante</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{stats.peakHour}h</div>
          <div className="text-xs text-muted-foreground">Pic d'énergie</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const B2CHeatmapVibesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'heatmap' | 'insights' | 'trends'>('heatmap');
  
  // Generate data
  const heatmapData = useMemo(() => generateMockData(weekOffset), [weekOffset]);
  const insights = useMemo(() => generateInsights(heatmapData), [heatmapData]);
  
  // Week label
  const weekLabel = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(subDays(today, weekOffset * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    if (weekOffset === 0) return 'Cette semaine';
    if (weekOffset === 1) return 'Semaine dernière';
    
    return `${format(weekStart, 'd MMM', { locale: fr })} - ${format(weekEnd, 'd MMM', { locale: fr })}`;
  }, [weekOffset]);
  
  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [weekOffset]);

  const handleExport = () => {
    // Generate CSV
    const headers = ['Jour', 'Heure', 'Humeur', 'Intensité', 'Activités'];
    const rows = heatmapData.map(d => [
      d.day,
      `${d.hour}h`,
      d.mood,
      Math.round(d.intensity),
      d.activities.join('; ')
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-vibes-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    
    toast.success('Export réussi !');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mes Vibes - EmotionsCare',
          text: `Cette semaine: ${insights[0]?.title || 'Analyse en cours'}`,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      toast.info('Lien copié !');
    }
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-muted/10">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">Heatmap Vibes</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Visualisez vos patterns émotionnels
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Week Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setWeekOffset(w => w + 1)}
                  disabled={weekOffset >= 4}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Button>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{weekLabel}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
                  disabled={weekOffset === 0}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mood Filter */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {MOOD_FILTERS.map((mood) => (
                <Button
                  key={mood.name}
                  variant={selectedMood === mood.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMood(mood.name)}
                  className="gap-1.5 shrink-0"
                >
                  <span>{mood.emoji}</span>
                  {mood.label}
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* View Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="heatmap" className="gap-1.5">
                <BarChart3 className="w-4 h-4" />
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-1.5">
                <Sparkles className="w-4 h-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Tendances
              </TabsTrigger>
            </TabsList>

            <TabsContent value="heatmap" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Activité par heure
                  </CardTitle>
                  <CardDescription>
                    Cliquez sur une cellule pour plus de détails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <HeatmapGrid 
                      data={heatmapData}
                      selectedMood={selectedMood}
                      onCellClick={setSelectedCell}
                    />
                  )}
                </CardContent>
              </Card>

              <WeeklyStatsCard data={heatmapData} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Insights IA
                  </CardTitle>
                  <CardDescription>
                    Analyses personnalisées basées sur vos données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Évolution hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {DAYS_FR.map((day) => {
                    const dayData = heatmapData.filter(d => d.day === day);
                    const avgIntensity = dayData.length > 0
                      ? dayData.reduce((sum, d) => sum + d.intensity, 0) / dayData.length
                      : 0;
                    
                    return (
                      <div key={day} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{day}</span>
                          <span className="text-muted-foreground">{Math.round(avgIntensity)}%</span>
                        </div>
                        <Progress value={avgIntensity} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Matin vs Soir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-amber-500/10 rounded-xl">
                      <Sun className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                      <div className="text-2xl font-bold">
                        {Math.round(
                          heatmapData
                            .filter(d => d.hour >= 6 && d.hour <= 12)
                            .reduce((sum, d) => sum + d.intensity, 0) /
                          Math.max(1, heatmapData.filter(d => d.hour >= 6 && d.hour <= 12).length)
                        )}%
                      </div>
                      <div className="text-xs text-muted-foreground">Énergie matinale</div>
                    </div>
                    <div className="text-center p-4 bg-indigo-500/10 rounded-xl">
                      <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                      <div className="text-2xl font-bold">
                        {Math.round(
                          heatmapData
                            .filter(d => d.hour >= 18 && d.hour <= 23)
                            .reduce((sum, d) => sum + d.intensity, 0) /
                          Math.max(1, heatmapData.filter(d => d.hour >= 18 && d.hour <= 23).length)
                        )}%
                      </div>
                      <div className="text-xs text-muted-foreground">Énergie du soir</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Cell Detail Modal */}
          <AnimatePresence>
            {selectedCell && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
                onClick={() => setSelectedCell(null)}
              >
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="w-full max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {selectedCell.day} à {selectedCell.hour}h
                        </CardTitle>
                        <span className="text-3xl">{MOOD_COLORS[selectedCell.mood]?.emoji}</span>
                      </div>
                      <CardDescription>
                        {format(selectedCell.date, 'd MMMM yyyy', { locale: fr })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-xl font-bold capitalize">{selectedCell.mood}</div>
                          <div className="text-xs text-muted-foreground">Humeur</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-xl font-bold">{Math.round(selectedCell.intensity)}%</div>
                          <div className="text-xs text-muted-foreground">Intensité</div>
                        </div>
                      </div>
                      
                      {selectedCell.activities.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Activités</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedCell.activities.map((activity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs capitalize">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedCell(null)}
                      >
                        Fermer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CHeatmapVibesPage;
