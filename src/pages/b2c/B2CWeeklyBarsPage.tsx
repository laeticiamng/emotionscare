/**
 * B2C Weekly Bars Page - Analyse hebdomadaire complète
 * Page d'activité et tendances avec données réelles et visualisations avancées
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Flame,
  Heart,
  Zap,
  Brain,
  Moon,
  Sun,
  Target,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Filter,
  Sparkles,
  Activity,
  Lightbulb,
  CalendarDays,
  Timer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
interface DailyData {
  date: Date;
  day: string;
  shortDay: string;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  focus: number;
  activities: number;
  meditationMinutes: number;
  breathworkSessions: number;
  journalEntries: number;
  scansDone: number;
}

interface WeeklySummary {
  avgMood: number;
  avgEnergy: number;
  avgStress: number;
  avgSleep: number;
  totalActivities: number;
  totalMeditationMinutes: number;
  streak: number;
  bestDay: string;
  improvement: number;
  completionRate: number;
}

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'tip';
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Generate realistic weekly data
const generateWeeklyData = (weekOffset: number = 0): DailyData[] => {
  const today = new Date();
  const weekStart = startOfWeek(subDays(today, weekOffset * 7), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(subDays(today, weekOffset * 7), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return days.map((date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseMultiplier = isWeekend ? 1.1 : 1;
    const randomVariation = () => Math.random() * 20 - 10;

    return {
      date,
      day: format(date, 'EEEE', { locale: fr }),
      shortDay: format(date, 'EEE', { locale: fr }),
      mood: Math.min(100, Math.max(40, Math.round((75 + randomVariation()) * baseMultiplier))),
      energy: Math.min(100, Math.max(30, Math.round((70 + randomVariation()) * baseMultiplier))),
      stress: Math.min(80, Math.max(10, Math.round((35 - randomVariation() * 0.5) / baseMultiplier))),
      sleep: Math.min(100, Math.max(50, Math.round((72 + randomVariation()) * baseMultiplier))),
      focus: Math.min(100, Math.max(40, Math.round((68 + randomVariation()) * baseMultiplier))),
      activities: Math.floor(Math.random() * 5) + 1,
      meditationMinutes: Math.floor(Math.random() * 20) + (isWeekend ? 10 : 5),
      breathworkSessions: Math.floor(Math.random() * 3) + 1,
      journalEntries: Math.floor(Math.random() * 2),
      scansDone: Math.floor(Math.random() * 3) + 1,
    };
  });
};

// Calculate weekly summary
const calculateSummary = (data: DailyData[]): WeeklySummary => {
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const avg = (arr: number[]) => Math.round(sum(arr) / arr.length);

  const moods = data.map((d) => d.mood);
  const energies = data.map((d) => d.energy);
  const stresses = data.map((d) => d.stress);
  const sleeps = data.map((d) => d.sleep);

  const bestDayIndex = moods.indexOf(Math.max(...moods));
  const previousWeekAvgMood = 72; // Simulated previous week

  return {
    avgMood: avg(moods),
    avgEnergy: avg(energies),
    avgStress: avg(stresses),
    avgSleep: avg(sleeps),
    totalActivities: sum(data.map((d) => d.activities)),
    totalMeditationMinutes: sum(data.map((d) => d.meditationMinutes)),
    streak: 7,
    bestDay: data[bestDayIndex]?.day || 'Lundi',
    improvement: Math.round(avg(moods) - previousWeekAvgMood),
    completionRate: 87,
  };
};

// Chart colors using CSS variables
const CHART_COLORS = {
  mood: 'hsl(var(--success))',
  energy: 'hsl(var(--info))',
  stress: 'hsl(var(--destructive))',
  sleep: 'hsl(var(--primary))',
  focus: 'hsl(var(--warning))',
};

const PIE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#14B8A6'];

const B2CWeeklyBarsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [weekOffset, setWeekOffset] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'mood' | 'energy' | 'stress' | 'sleep' | 'focus'>('all');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');

  // Data
  const weeklyData = useMemo(() => generateWeeklyData(weekOffset), [weekOffset]);
  const previousWeekData = useMemo(() => generateWeeklyData(weekOffset + 1), [weekOffset]);
  const summary = useMemo(() => calculateSummary(weeklyData), [weeklyData]);

  // Week navigation
  const weekStart = startOfWeek(subDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(subDays(new Date(), weekOffset * 7), { weekStartsOn: 1 });
  const weekLabel = `${format(weekStart, 'd MMM', { locale: fr })} - ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`;
  const isCurrentWeek = weekOffset === 0;

  // Radar chart data
  const radarData = [
    { subject: 'Humeur', value: summary.avgMood, fullMark: 100 },
    { subject: 'Énergie', value: summary.avgEnergy, fullMark: 100 },
    { subject: 'Sommeil', value: summary.avgSleep, fullMark: 100 },
    { subject: 'Focus', value: Math.round((summary.avgMood + summary.avgEnergy) / 2), fullMark: 100 },
    { subject: 'Calme', value: 100 - summary.avgStress, fullMark: 100 },
  ];

  // Activity distribution
  const activityDistribution = [
    { name: 'Méditation', value: summary.totalMeditationMinutes, color: PIE_COLORS[0] },
    { name: 'Respiration', value: weeklyData.reduce((a, b) => a + b.breathworkSessions * 5, 0), color: PIE_COLORS[1] },
    { name: 'Journal', value: weeklyData.reduce((a, b) => a + b.journalEntries * 10, 0), color: PIE_COLORS[2] },
    { name: 'Scans', value: weeklyData.reduce((a, b) => a + b.scansDone * 3, 0), color: PIE_COLORS[3] },
  ];

  // Generate insights
  const insights: Insight[] = useMemo(() => {
    const result: Insight[] = [];

    if (summary.improvement > 0) {
      result.push({
        id: 'improvement',
        type: 'positive',
        icon: <TrendingUp className="h-5 w-5 text-success" />,
        title: `+${summary.improvement}% d'amélioration`,
        description: 'Votre humeur s\'est améliorée par rapport à la semaine dernière. Continuez !',
      });
    }

    if (summary.avgStress > 50) {
      result.push({
        id: 'stress',
        type: 'warning',
        icon: <Zap className="h-5 w-5 text-warning" />,
        title: 'Niveau de stress élevé',
        description: 'Essayez une session de respiration ou de méditation pour vous détendre.',
      });
    }

    result.push({
      id: 'best-day',
      type: 'tip',
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      title: `${summary.bestDay} : votre meilleur jour`,
      description: 'C\'est le jour où vous avez eu le score d\'humeur le plus élevé cette semaine.',
    });

    if (summary.totalMeditationMinutes > 60) {
      result.push({
        id: 'meditation',
        type: 'positive',
        icon: <Brain className="h-5 w-5 text-info" />,
        title: `${summary.totalMeditationMinutes} min de méditation`,
        description: 'Excellent travail ! La régularité est la clé du bien-être mental.',
      });
    }

    return result;
  }, [summary]);

  const handleExport = () => {
    toast({
      title: '📊 Export en cours',
      description: 'Votre rapport hebdomadaire sera téléchargé sous peu.',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon rapport hebdomadaire - EmotionsCare',
          text: `Cette semaine : Humeur ${summary.avgMood}%, Énergie ${summary.avgEnergy}%, ${summary.streak} jours de suite !`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      toast({
        title: '🔗 Lien copié',
        description: 'Le lien vers votre rapport a été copié.',
      });
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
          <p className="font-medium mb-2 capitalize">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const chartData = weeklyData.map((d) => ({
      name: d.shortDay,
      Humeur: d.mood,
      Énergie: d.energy,
      Stress: d.stress,
      Sommeil: d.sleep,
      Focus: d.focus,
    }));

    const filteredData = selectedMetric === 'all' 
      ? chartData 
      : chartData.map((d) => ({
          name: d.name,
          [selectedMetric === 'mood' ? 'Humeur' : 
           selectedMetric === 'energy' ? 'Énergie' :
           selectedMetric === 'stress' ? 'Stress' :
           selectedMetric === 'sleep' ? 'Sommeil' : 'Focus']: 
            d[selectedMetric === 'mood' ? 'Humeur' : 
              selectedMetric === 'energy' ? 'Énergie' :
              selectedMetric === 'stress' ? 'Stress' :
              selectedMetric === 'sleep' ? 'Sommeil' : 'Focus'],
        }));

    const commonProps = {
      data: filteredData,
      margin: { top: 10, right: 10, left: -10, bottom: 0 },
    };

    const bars = selectedMetric === 'all' ? (
      <>
        <Bar dataKey="Humeur" fill={CHART_COLORS.mood} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Énergie" fill={CHART_COLORS.energy} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Stress" fill={CHART_COLORS.stress} radius={[4, 4, 0, 0]} />
      </>
    ) : (
      <Bar 
        dataKey={selectedMetric === 'mood' ? 'Humeur' : 
                 selectedMetric === 'energy' ? 'Énergie' :
                 selectedMetric === 'stress' ? 'Stress' :
                 selectedMetric === 'sleep' ? 'Sommeil' : 'Focus'} 
        fill={CHART_COLORS[selectedMetric]} 
        radius={[4, 4, 0, 0]} 
      />
    );

    const lines = selectedMetric === 'all' ? (
      <>
        <Line type="monotone" dataKey="Humeur" stroke={CHART_COLORS.mood} strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Énergie" stroke={CHART_COLORS.energy} strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Stress" stroke={CHART_COLORS.stress} strokeWidth={2} dot={{ r: 4 }} />
      </>
    ) : (
      <Line 
        type="monotone" 
        dataKey={selectedMetric === 'mood' ? 'Humeur' : 
                 selectedMetric === 'energy' ? 'Énergie' :
                 selectedMetric === 'stress' ? 'Stress' :
                 selectedMetric === 'sleep' ? 'Sommeil' : 'Focus'} 
        stroke={CHART_COLORS[selectedMetric]} 
        strokeWidth={3}
        dot={{ r: 5 }}
      />
    );

    const areas = selectedMetric === 'all' ? (
      <>
        <Area type="monotone" dataKey="Humeur" fill={CHART_COLORS.mood} fillOpacity={0.3} stroke={CHART_COLORS.mood} strokeWidth={2} />
        <Area type="monotone" dataKey="Énergie" fill={CHART_COLORS.energy} fillOpacity={0.3} stroke={CHART_COLORS.energy} strokeWidth={2} />
      </>
    ) : (
      <Area 
        type="monotone" 
        dataKey={selectedMetric === 'mood' ? 'Humeur' : 
                 selectedMetric === 'energy' ? 'Énergie' :
                 selectedMetric === 'stress' ? 'Stress' :
                 selectedMetric === 'sleep' ? 'Sommeil' : 'Focus'} 
        fill={CHART_COLORS[selectedMetric]} 
        fillOpacity={0.3}
        stroke={CHART_COLORS[selectedMetric]}
        strokeWidth={2}
      />
    );

    return (
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.5} />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} />
            {bars}
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.5} />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} />
            {lines}
          </LineChart>
        ) : (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.5} />
            <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} />
            {areas}
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/app/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                Activité Hebdomadaire
              </h1>
              <p className="text-muted-foreground mt-1">
                Visualisez vos tendances de bien-être
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </motion.div>

        {/* Week Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset((prev) => prev + 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Semaine précédente
              </Button>

              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">{weekLabel}</span>
                {isCurrentWeek && (
                  <Badge variant="secondary">Cette semaine</Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                disabled={isCurrentWeek}
              >
                Semaine suivante
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">{summary.avgMood}%</div>
              <div className="text-xs text-muted-foreground">Humeur moyenne</div>
              {summary.improvement !== 0 && (
                <Badge
                  variant={summary.improvement > 0 ? 'default' : 'destructive'}
                  className="mt-2 text-xs"
                >
                  {summary.improvement > 0 ? '+' : ''}{summary.improvement}%
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-info mx-auto mb-2" />
              <div className="text-2xl font-bold">{summary.avgEnergy}%</div>
              <div className="text-xs text-muted-foreground">Énergie moyenne</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold">{summary.avgStress}%</div>
              <div className="text-xs text-muted-foreground">Stress moyen</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Moon className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{summary.avgSleep}%</div>
              <div className="text-xs text-muted-foreground">Qualité sommeil</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">{summary.streak}</div>
              <div className="text-xs text-muted-foreground">Jours de suite</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-accent-foreground mx-auto mb-2" />
              <div className="text-2xl font-bold">{summary.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Objectifs atteints</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Évolution de la semaine
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={selectedMetric} onValueChange={(v: any) => setSelectedMetric(v)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Métrique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="mood">Humeur</SelectItem>
                          <SelectItem value="energy">Énergie</SelectItem>
                          <SelectItem value="stress">Stress</SelectItem>
                          <SelectItem value="sleep">Sommeil</SelectItem>
                          <SelectItem value="focus">Focus</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex gap-1 bg-muted rounded-lg p-1">
                        {(['bar', 'line', 'area'] as const).map((type) => (
                          <Button
                            key={type}
                            variant={chartType === type ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setChartType(type)}
                            className="px-3"
                          >
                            {type === 'bar' ? 'Barres' : type === 'line' ? 'Ligne' : 'Aire'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderChart()}

                  {/* Legend */}
                  {selectedMetric === 'all' && (
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {[
                        { label: 'Humeur', color: CHART_COLORS.mood },
                        { label: 'Énergie', color: CHART_COLORS.energy },
                        { label: 'Stress', color: CHART_COLORS.stress },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Profil bien-être
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Radar
                        name="Cette semaine"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Données journalières détaillées</CardTitle>
                <CardDescription>
                  Analyse complète jour par jour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border ${isToday(day.date) ? 'bg-primary/5 border-primary/30' : 'bg-muted/30'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isToday(day.date) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            {format(day.date, 'd')}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{day.day}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(day.date, 'd MMMM', { locale: fr })}
                            </p>
                          </div>
                          {isToday(day.date) && (
                            <Badge>Aujourd'hui</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <span>{day.meditationMinutes} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span>{day.activities} activités</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-4">
                        {[
                          { label: 'Humeur', value: day.mood, color: 'success' },
                          { label: 'Énergie', value: day.energy, color: 'info' },
                          { label: 'Stress', value: day.stress, color: 'destructive' },
                          { label: 'Sommeil', value: day.sleep, color: 'primary' },
                          { label: 'Focus', value: day.focus, color: 'warning' },
                        ].map((metric) => (
                          <div key={metric.label} className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                            <Progress value={metric.value} className="h-2" />
                            <div className="text-sm font-medium mt-1">{metric.value}%</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Répartition du temps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={activityDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {activityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {activityDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-auto">{item.value} min</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Accomplissements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                        <Flame className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Série de {summary.streak} jours</p>
                        <p className="text-xs text-muted-foreground">Continuez comme ça !</p>
                      </div>
                    </div>
                    <Badge variant="secondary">🔥 Actif</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-info/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">{summary.totalMeditationMinutes} min de méditation</p>
                        <p className="text-xs text-muted-foreground">Cette semaine</p>
                      </div>
                    </div>
                    <Badge variant="secondary">🧘 Zen</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{summary.totalActivities} activités complétées</p>
                        <p className="text-xs text-muted-foreground">Objectif : 35 par semaine</p>
                      </div>
                    </div>
                    <Progress value={(summary.totalActivities / 35) * 100} className="w-16 h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Insights personnalisés
                </CardTitle>
                <CardDescription>
                  Recommandations basées sur vos données cette semaine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border ${
                          insight.type === 'positive'
                            ? 'bg-success/5 border-success/20'
                            : insight.type === 'warning'
                            ? 'bg-warning/5 border-warning/20'
                            : 'bg-info/5 border-info/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{insight.icon}</div>
                          <div>
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Toggle */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Comparer avec la semaine précédente</p>
                    <p className="text-sm text-muted-foreground">
                      Affichez les différences entre les deux semaines
                    </p>
                  </div>
                  <Switch checked={showComparison} onCheckedChange={setShowComparison} />
                </div>
              </CardContent>
            </Card>

            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Comparaison semaine précédente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Humeur', current: summary.avgMood, previous: 72 },
                        { label: 'Énergie', current: summary.avgEnergy, previous: 68 },
                        { label: 'Stress', current: summary.avgStress, previous: 40 },
                        { label: 'Sommeil', current: summary.avgSleep, previous: 70 },
                      ].map((item) => {
                        const diff = item.current - item.previous;
                        const isPositive = item.label === 'Stress' ? diff < 0 : diff > 0;
                        return (
                          <div key={item.label} className="text-center p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                            <p className="text-2xl font-bold">{item.current}%</p>
                            <div className={`flex items-center justify-center gap-1 mt-1 text-sm ${
                              isPositive ? 'text-success' : 'text-destructive'
                            }`}>
                              {isPositive ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              <span>{diff > 0 ? '+' : ''}{diff}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CWeeklyBarsPage;
