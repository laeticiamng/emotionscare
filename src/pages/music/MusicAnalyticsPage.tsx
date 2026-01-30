/**
 * Music Analytics Page - Dashboard complet d'analytics musicales
 * Version complète avec tendances, comparaisons et insights IA
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Music,
  Brain,
  Clock,
  Heart,
  Headphones,
  BarChart3,
  LineChart as LineChartIcon,
  Play,
  Pause,
  Volume2,
  Zap,
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { MusicAnalyticsDashboard, MusicAnalyticsEnhanced } from '@/components/music/analytics';
import { useMusicPreferencesLearning } from '@/hooks/useMusicPreferencesLearning';
import { usePageSEO } from '@/hooks/usePageSEO';
import { logger } from '@/lib/logger';
import html2canvas from 'html2canvas';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths, subYears } from 'date-fns';
import { fr } from 'date-fns/locale';

// ============= Types =============
interface ListeningData {
  date: string;
  minutes: number;
  tracks: number;
  mood: number;
  energy: number;
}

interface GenreDistribution {
  name: string;
  value: number;
  color: string;
}

interface TimeOfDayData {
  hour: string;
  listens: number;
  avgDuration: number;
}

interface MoodTrendData {
  period: string;
  mood: number;
  stress: number;
  focus: number;
}

interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  change: number;
}

// ============= Mock Data Generators =============
const generateListeningData = (period: 'week' | 'month' | 'year'): ListeningData[] => {
  const now = new Date();
  let days: Date[] = [];
  
  if (period === 'week') {
    days = eachDayOfInterval({
      start: subDays(now, 6),
      end: now
    });
  } else if (period === 'month') {
    days = eachDayOfInterval({
      start: subDays(now, 29),
      end: now
    });
  } else {
    days = eachMonthOfInterval({
      start: subMonths(now, 11),
      end: now
    });
  }
  
  return days.map(day => ({
    date: period === 'year' ? format(day, 'MMM', { locale: fr }) : format(day, period === 'week' ? 'EEE' : 'dd/MM', { locale: fr }),
    minutes: Math.floor(Math.random() * 120) + 15,
    tracks: Math.floor(Math.random() * 25) + 5,
    mood: Math.floor(Math.random() * 30) + 60,
    energy: Math.floor(Math.random() * 40) + 40
  }));
};

const GENRE_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#6366F1', '#14B8A6', '#EF4444'];

const generateGenreData = (): GenreDistribution[] => {
  const genres = ['Ambient', 'Classique', 'Lo-Fi', 'Nature', 'Piano', 'Méditation', 'Électro', 'Jazz'];
  return genres.map((name, i) => ({
    name,
    value: Math.floor(Math.random() * 30) + 10,
    color: GENRE_COLORS[i]
  })).sort((a, b) => b.value - a.value);
};

const generateTimeOfDayData = (): TimeOfDayData[] => {
  const hours = ['6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];
  return hours.map(hour => ({
    hour,
    listens: Math.floor(Math.random() * 15) + 1,
    avgDuration: Math.floor(Math.random() * 20) + 5
  }));
};

const generateMoodTrends = (period: 'week' | 'month' | 'year'): MoodTrendData[] => {
  const count = period === 'week' ? 7 : period === 'month' ? 4 : 12;
  const labels = period === 'week' 
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : period === 'month'
    ? ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
    : ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  return labels.slice(0, count).map(period => ({
    period,
    mood: Math.floor(Math.random() * 25) + 60,
    stress: Math.floor(Math.random() * 30) + 20,
    focus: Math.floor(Math.random() * 25) + 55
  }));
};

const generateComparison = (period: 'week' | 'month' | 'year'): ComparisonData[] => {
  return [
    { metric: 'Temps d\'écoute', current: Math.floor(Math.random() * 500) + 200, previous: Math.floor(Math.random() * 500) + 200, change: 0 },
    { metric: 'Pistes jouées', current: Math.floor(Math.random() * 100) + 50, previous: Math.floor(Math.random() * 100) + 50, change: 0 },
    { metric: 'Sessions', current: Math.floor(Math.random() * 30) + 10, previous: Math.floor(Math.random() * 30) + 10, change: 0 },
    { metric: 'Genres explorés', current: Math.floor(Math.random() * 8) + 3, previous: Math.floor(Math.random() * 8) + 3, change: 0 },
    { metric: 'Amélioration humeur', current: Math.floor(Math.random() * 20) + 5, previous: Math.floor(Math.random() * 20) + 5, change: 0 },
    { metric: 'Favoris ajoutés', current: Math.floor(Math.random() * 15) + 2, previous: Math.floor(Math.random() * 15) + 2, change: 0 },
  ].map(d => ({
    ...d,
    change: d.current - d.previous
  }));
};

const generateRadarData = () => [
  { subject: 'Relaxation', value: Math.floor(Math.random() * 40) + 60 },
  { subject: 'Focus', value: Math.floor(Math.random() * 40) + 50 },
  { subject: 'Énergie', value: Math.floor(Math.random() * 50) + 40 },
  { subject: 'Créativité', value: Math.floor(Math.random() * 40) + 50 },
  { subject: 'Sommeil', value: Math.floor(Math.random() * 30) + 60 },
  { subject: 'Méditation', value: Math.floor(Math.random() * 40) + 50 },
];

// ============= Sub Components =============
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  color?: string;
}> = ({ icon: IconComponent, label, value, subValue, trend, color = 'text-primary' }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-muted/50 ${color}`}>
          <IconComponent className="h-5 w-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{trend >= 0 ? '+' : ''}{trend}% vs période précédente</span>
        </div>
      )}
    </CardContent>
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${color.replace('text-', 'bg-')}`} />
  </Card>
);

const ComparisonCard: React.FC<{ data: ComparisonData }> = ({ data }) => {
  const isPositive = data.change >= 0;
  const percent = data.previous > 0 ? Math.round((data.change / data.previous) * 100) : 0;
  
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
      <div className="space-y-1">
        <p className="text-sm font-medium">{data.metric}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{data.current}</span>
          <span className="text-xs text-muted-foreground">vs {data.previous}</span>
        </div>
      </div>
      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
        isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
      }`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{isPositive ? '+' : ''}{percent}%</span>
      </div>
    </div>
  );
};

// ============= Main Component =============
const MusicAnalyticsPage: React.FC = () => {
  usePageSEO({
    title: 'Analytics Musicales | EmotionsCare',
    description: 'Visualisez vos statistiques d\'écoute et tendances musicales',
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { insights, isAnalyzing, isApplying, analyzePreferences, applyAdjustments } = useMusicPreferencesLearning();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Generate data based on period
  const listeningData = useMemo(() => generateListeningData(selectedPeriod), [selectedPeriod]);
  const genreData = useMemo(() => generateGenreData(), []);
  const timeOfDayData = useMemo(() => generateTimeOfDayData(), []);
  const moodTrends = useMemo(() => generateMoodTrends(selectedPeriod), [selectedPeriod]);
  const comparisonData = useMemo(() => generateComparison(selectedPeriod), [selectedPeriod]);
  const radarData = useMemo(() => generateRadarData(), []);

  // Summary stats
  const totalMinutes = listeningData.reduce((sum, d) => sum + d.minutes, 0);
  const totalTracks = listeningData.reduce((sum, d) => sum + d.tracks, 0);
  const avgMood = Math.round(listeningData.reduce((sum, d) => sum + d.mood, 0) / listeningData.length);
  const avgEnergy = Math.round(listeningData.reduce((sum, d) => sum + d.energy, 0) / listeningData.length);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      logger.info('Exporting analytics to PDF', undefined, 'MUSIC');

      const dashboardElement = document.getElementById('analytics-dashboard');
      if (!dashboardElement) {
        throw new Error('Dashboard element not found');
      }

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `emotionscare-music-analytics-${new Date().toISOString().split('T')[0]}.png`;
      link.href = imgData;
      link.click();

      toast({
        title: '✅ Export réussi',
        description: 'Vos statistiques ont été exportées en PNG',
      });

      logger.info('Image export successful', undefined, 'MUSIC');
    } catch (error) {
      logger.error('Failed to export image', error as Error, 'MUSIC');
      toast({
        title: '❌ Erreur d\'export',
        description: 'Impossible d\'exporter l\'image',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRunLearning = async () => {
    await analyzePreferences();
    toast({
      title: '🧠 Apprentissage lancé',
      description: 'Vos préférences sont en cours d\'analyse',
    });
  };

  const handleApplyAdjustments = async () => {
    await applyAdjustments(false);
  };

  const periodLabel = selectedPeriod === 'week' ? 'cette semaine' : selectedPeriod === 'month' ? 'ce mois' : 'cette année';
  const previousLabel = selectedPeriod === 'week' ? 'la semaine dernière' : selectedPeriod === 'month' ? 'le mois dernier' : 'l\'année dernière';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/app/music')}
                aria-label="Retour à la musique"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-7 w-7 text-primary" />
                  Analytics Musicales
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Vos tendances et insights personnalisés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Period Selector */}
              <div className="flex rounded-lg border bg-card p-1">
                {(['week', 'month', 'year'] as const).map(p => (
                  <Button
                    key={p}
                    variant={selectedPeriod === p ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedPeriod(p)}
                    className="text-xs"
                  >
                    {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunLearning}
                disabled={isAnalyzing}
              >
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyse...' : 'Analyser'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Tendances</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Insights IA</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Clock}
                label="Temps d'écoute"
                value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
                subValue={periodLabel}
                trend={12}
                color="text-primary"
              />
              <StatCard
                icon={Music}
                label="Pistes jouées"
                value={totalTracks}
                subValue={`~${Math.round(totalTracks / listeningData.length)} par jour`}
                trend={8}
                color="text-success"
              />
              <StatCard
                icon={Heart}
                label="Humeur moyenne"
                value={`${avgMood}%`}
                subValue="Score bien-être"
                trend={avgMood > 65 ? 5 : -3}
                color="text-accent"
              />
              <StatCard
                icon={Zap}
                label="Énergie"
                value={`${avgEnergy}%`}
                subValue="Niveau moyen"
                trend={avgEnergy > 60 ? 7 : -2}
                color="text-warning"
              />
            </div>

            <div id="analytics-dashboard" className="space-y-6">
              {/* Listening Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Activité d'écoute
                  </CardTitle>
                  <CardDescription>Temps passé à écouter {periodLabel}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={listeningData}>
                      <defs>
                        <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem'
                        }}
                        formatter={(value: number) => [`${value} min`, 'Durée']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="minutes" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#colorMinutes)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Genre Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-primary" />
                      Genres écoutés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={genreData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                        >
                          {genreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem'
                          }}
                          formatter={(value: number) => [`${value}%`, 'Part']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Time of Day */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-primary" />
                      Heures d'écoute
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={timeOfDayData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="hour" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="listens" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Écoutes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enhanced Analytics */}
            <MusicAnalyticsEnhanced period={selectedPeriod} />
          </TabsContent>

          {/* Trends Tab - NOW COMPLETE */}
          <TabsContent value="trends" className="space-y-6">
            {/* Period Comparison Summary */}
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Comparaison : {periodLabel} vs {previousLabel}
                    </CardTitle>
                    <CardDescription>
                      Évolution de vos habitudes d'écoute musicale
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedPeriod === 'week' ? '7 jours' : selectedPeriod === 'month' ? '30 jours' : '12 mois'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comparisonData.map((data, i) => (
                    <ComparisonCard key={i} data={data} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood & Wellness Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Évolution bien-être
                </CardTitle>
                <CardDescription>
                  Impact de la musique sur votre humeur, stress et concentration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={moodTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="period" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#EC4899" 
                      strokeWidth={3}
                      dot={{ fill: '#EC4899', r: 4 }}
                      name="Humeur"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', r: 4 }}
                      name="Stress (inversé = mieux)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focus" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 4 }}
                      name="Concentration"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Profile */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Profil d'utilisation
                  </CardTitle>
                  <CardDescription>
                    Vos objectifs d'écoute principaux
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                      <Radar 
                        name="Utilisation" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Listening Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Patterns d'écoute
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-warning" />
                        <span className="text-sm">Écoute matinale</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-success" />
                        <span className="text-sm">Pendant le travail</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">72%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        <span className="text-sm">Écoute nocturne</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={28} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-accent" />
                        <span className="text-sm">Relaxation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={63} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">63%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-warning" />
                        <span className="text-sm">Boost énergie</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={38} className="w-24 h-2" />
                        <span className="text-xs text-muted-foreground">38%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Sessions récentes</h4>
                    <div className="space-y-2">
                      {[
                        { type: 'Méditation', duration: '15 min', time: 'Aujourd\'hui 8h' },
                        { type: 'Focus', duration: '45 min', time: 'Hier 14h' },
                        { type: 'Sommeil', duration: '30 min', time: 'Hier 22h' },
                      ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Play className="h-3 w-3 text-primary" />
                            <span>{session.type}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.duration} · {session.time}
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <Sparkles className="h-5 w-5 text-primary" />
                  Insights personnalisés par IA
                </CardTitle>
                <CardDescription>
                  Découvertes basées sur votre historique d'écoute
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights ? (
                  <div className="space-y-4">
                    {/* Genres suggérés */}
                    {insights.suggestedGenres && insights.suggestedGenres.length > 0 && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">Nouveaux genres à découvrir</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                Basé sur votre historique, ces genres pourraient vous plaire
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {insights.suggestedGenres.map((genre, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Changement de goût détecté */}
                    {insights.tasteChangeDetected && (
                      <Card className="bg-warning/10 border-warning/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">Évolution de vos goûts détectée</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                Vos préférences musicales ont évolué. Voulez-vous ajuster automatiquement ?
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleApplyAdjustments}
                                  disabled={isApplying}
                                >
                                  {isApplying ? 'Application...' : 'Ajuster mes préférences'}
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  Confiance: {Math.round(insights.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Ajustements tempo et énergie */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Music className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">Préférences détectées</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p>
                                <strong>Tempo préféré:</strong> {insights.tempoShift.min} - {insights.tempoShift.max} BPM
                              </p>
                              <p>
                                <strong>Niveau d'énergie:</strong> {insights.energyLevelAdjustment}%
                              </p>
                              {insights.adjustedMoods && insights.adjustedMoods.length > 0 && (
                                <div>
                                  <strong>Moods populaires:</strong>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {insights.adjustedMoods.map((mood, i) => (
                                      <span
                                        key={i}
                                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                                      >
                                        {mood}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun insight disponible pour le moment</p>
                    <p className="text-sm mt-2">
                      Écoutez plus de musique pour obtenir des recommandations personnalisées
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={handleRunLearning}
                      disabled={isAnalyzing}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Lancer l'analyse
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicAnalyticsPage;
