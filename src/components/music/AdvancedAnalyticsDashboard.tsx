// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Music,
  Clock,
  TrendingUp,
  TrendingDown,
  Heart,
  Headphones,
  BarChart3,
  Calendar,
  Users,
  Star,
  Zap,
  Brain,
  Activity,
  Target,
  Award,
  Sparkles,
  Download,
  Share2,
  RefreshCw,
  ChevronRight,
  Play,
  Disc,
  Radio,
  Volume2,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ListeningStats {
  totalMinutes: number;
  totalTracks: number;
  uniqueArtists: number;
  uniqueGenres: number;
  avgSessionLength: number;
  longestStreak: number;
  currentStreak: number;
}

interface DailyListening {
  date: string;
  minutes: number;
  tracks: number;
  mood: number;
}

interface GenreData {
  name: string;
  value: number;
  color: string;
}

interface HourlyData {
  hour: string;
  listens: number;
}

interface TopTrack {
  id: string;
  title: string;
  artist: string;
  plays: number;
  duration: string;
  mood: string;
}

interface MoodCorrelation {
  mood: string;
  beforeListening: number;
  afterListening: number;
  improvement: number;
}

// Mock data
const mockStats: ListeningStats = {
  totalMinutes: 4280,
  totalTracks: 892,
  uniqueArtists: 156,
  uniqueGenres: 12,
  avgSessionLength: 32,
  longestStreak: 21,
  currentStreak: 7,
};

const mockDailyListening: DailyListening[] = [
  { date: 'Lun', minutes: 45, tracks: 12, mood: 72 },
  { date: 'Mar', minutes: 62, tracks: 18, mood: 78 },
  { date: 'Mer', minutes: 38, tracks: 10, mood: 65 },
  { date: 'Jeu', minutes: 75, tracks: 22, mood: 82 },
  { date: 'Ven', minutes: 90, tracks: 28, mood: 88 },
  { date: 'Sam', minutes: 120, tracks: 35, mood: 92 },
  { date: 'Dim', minutes: 85, tracks: 25, mood: 85 },
];

const mockGenres: GenreData[] = [
  { name: 'Lo-fi', value: 28, color: '#8b5cf6' },
  { name: 'Ambient', value: 22, color: '#06b6d4' },
  { name: 'Classical', value: 18, color: '#f59e0b' },
  { name: 'Jazz', value: 12, color: '#10b981' },
  { name: 'Electronic', value: 10, color: '#ec4899' },
  { name: 'Acoustic', value: 10, color: '#6366f1' },
];

const mockHourlyData: HourlyData[] = [
  { hour: '6h', listens: 5 },
  { hour: '8h', listens: 15 },
  { hour: '10h', listens: 35 },
  { hour: '12h', listens: 25 },
  { hour: '14h', listens: 40 },
  { hour: '16h', listens: 55 },
  { hour: '18h', listens: 45 },
  { hour: '20h', listens: 60 },
  { hour: '22h', listens: 30 },
  { hour: '0h', listens: 10 },
];

const mockTopTracks: TopTrack[] = [
  { id: '1', title: 'Peaceful Morning', artist: 'Calm Waves', plays: 45, duration: '3:24', mood: 'Calme' },
  { id: '2', title: 'Focus Flow', artist: 'Mind Studio', plays: 38, duration: '4:12', mood: 'Concentration' },
  { id: '3', title: 'Evening Serenity', artist: 'Night Dreams', plays: 32, duration: '5:01', mood: 'Relaxation' },
  { id: '4', title: 'Energy Boost', artist: 'Active Mind', plays: 28, duration: '3:45', mood: 'Énergie' },
  { id: '5', title: 'Deep Sleep', artist: 'Sleep Sounds', plays: 25, duration: '8:30', mood: 'Sommeil' },
];

const mockMoodCorrelations: MoodCorrelation[] = [
  { mood: 'Stress', beforeListening: 68, afterListening: 35, improvement: 33 },
  { mood: 'Anxiété', beforeListening: 55, afterListening: 28, improvement: 27 },
  { mood: 'Fatigue', beforeListening: 72, afterListening: 45, improvement: 27 },
  { mood: 'Tristesse', beforeListening: 48, afterListening: 25, improvement: 23 },
  { mood: 'Agitation', beforeListening: 62, afterListening: 38, improvement: 24 },
];

const mockTherapyEffectiveness = [
  { category: 'Relaxation', score: 92 },
  { category: 'Focus', score: 85 },
  { category: 'Sommeil', score: 78 },
  { category: 'Énergie', score: 72 },
  { category: 'Créativité', score: 68 },
  { category: 'Méditation', score: 88 },
];

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [activeTab, setActiveTab] = useState('overview');

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return `${hours}h ${mins}min`;
  };

  const weeklyTotal = useMemo(() => {
    return mockDailyListening.reduce((sum, day) => sum + day.minutes, 0);
  }, []);

  const avgMoodImprovement = useMemo(() => {
    return Math.round(
      mockMoodCorrelations.reduce((sum, m) => sum + m.improvement, 0) / mockMoodCorrelations.length
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analyses Musicales Avancées
          </h1>
          <p className="text-muted-foreground mt-1">
            Découvrez vos habitudes d'écoute et l'impact sur votre bien-être
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Temps total</span>
              </div>
              <p className="text-2xl font-bold">{formatMinutes(mockStats.totalMinutes)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% vs période précédente</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Music className="h-4 w-4" />
                <span className="text-xs font-medium">Morceaux</span>
              </div>
              <p className="text-2xl font-bold">{mockStats.totalTracks}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+8% vs période précédente</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">Artistes</span>
              </div>
              <p className="text-2xl font-bold">{mockStats.uniqueArtists}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>artistes différents</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Disc className="h-4 w-4" />
                <span className="text-xs font-medium">Genres</span>
              </div>
              <p className="text-2xl font-bold">{mockStats.uniqueGenres}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>genres explorés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-pink-600 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-medium">Série actuelle</span>
              </div>
              <p className="text-2xl font-bold">{mockStats.currentStreak}j</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>Record: {mockStats.longestStreak}j</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-cyan-600 mb-2">
                <Heart className="h-4 w-4" />
                <span className="text-xs font-medium">Amélioration humeur</span>
              </div>
              <p className="text-2xl font-bold">+{avgMoodImprovement}%</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>effet thérapeutique</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="listening">
            <Headphones className="h-4 w-4 mr-2" />
            Habitudes
          </TabsTrigger>
          <TabsTrigger value="therapy">
            <Brain className="h-4 w-4 mr-2" />
            Thérapie
          </TabsTrigger>
          <TabsTrigger value="discovery">
            <Sparkles className="h-4 w-4 mr-2" />
            Découvertes
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Listening Evolution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Évolution de l'écoute
                </CardTitle>
                <CardDescription>Minutes d'écoute et impact sur l'humeur</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockDailyListening}>
                    <defs>
                      <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="minutes"
                      name="Minutes"
                      stroke="#8b5cf6"
                      fill="url(#colorMinutes)"
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="mood"
                      name="Humeur"
                      stroke="#22c55e"
                      fill="url(#colorMood)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Genre Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  Distribution par genre
                </CardTitle>
                <CardDescription>Vos genres musicaux préférés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={mockGenres}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {mockGenres.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {mockGenres.map((genre) => (
                    <div
                      key={genre.name}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: genre.color }}
                        />
                        <span className="text-sm">{genre.name}</span>
                      </div>
                      <span className="text-sm font-medium">{genre.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Tracks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Top morceaux
                  </CardTitle>
                  <CardDescription>Vos titres les plus écoutés</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTopTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{track.mood}</Badge>
                      <div className="text-right">
                        <p className="font-medium">{track.plays} écoutes</p>
                        <p className="text-xs text-muted-foreground">{track.duration}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Listening Habits Tab */}
        <TabsContent value="listening" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Heures d'écoute
                </CardTitle>
                <CardDescription>Vos moments préférés pour écouter</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockHourlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="listens" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Pic d'activité:</span> 20h - Vous écoutez le plus de musique en soirée
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Statistiques de session
                </CardTitle>
                <CardDescription>Durée et fréquence de vos sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Durée moyenne de session</span>
                      <span className="font-medium">{mockStats.avgSessionLength} min</span>
                    </div>
                    <Progress value={mockStats.avgSessionLength / 60 * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Sessions cette semaine</span>
                      <span className="font-medium">24 sessions</span>
                    </div>
                    <Progress value={24 / 30 * 100} className="bg-blue-100" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Temps total cette semaine</span>
                      <span className="font-medium">{formatMinutes(weeklyTotal)}</span>
                    </div>
                    <Progress value={weeklyTotal / 600 * 100} className="bg-green-100" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{mockStats.currentStreak}</p>
                    <p className="text-xs text-muted-foreground">Jours consécutifs</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{mockStats.longestStreak}</p>
                    <p className="text-xs text-muted-foreground">Record personnel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Résumé hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {mockDailyListening.map((day, index) => (
                  <div
                    key={day.date}
                    className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 text-center"
                  >
                    <p className="text-xs font-medium text-muted-foreground mb-1">{day.date}</p>
                    <p className="text-lg font-bold">{day.minutes}</p>
                    <p className="text-xs text-muted-foreground">min</p>
                    <div className="mt-2 flex justify-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: day.mood >= 80 ? '#22c55e' : day.mood >= 60 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Therapy Tab */}
        <TabsContent value="therapy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Correlation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Corrélation musique-humeur
                </CardTitle>
                <CardDescription>Impact de la musique sur vos émotions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockMoodCorrelations} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="mood" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="beforeListening" name="Avant" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="afterListening" name="Après" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Therapy Effectiveness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Efficacité thérapeutique
                </CardTitle>
                <CardDescription>Score par objectif de bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={mockTherapyEffectiveness}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Efficacité"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Mood Improvement Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Amélioration par catégorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {mockMoodCorrelations.map((item) => (
                  <div
                    key={item.mood}
                    className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 text-center"
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-2">{item.mood}</p>
                    <p className="text-3xl font-bold text-green-600">-{item.improvement}%</p>
                    <p className="text-xs text-muted-foreground mt-1">réduction</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Excellente réduction du stress</p>
                    <p className="text-sm text-muted-foreground">
                      Votre écoute de musique Lo-fi montre une réduction de 33% du stress. Continuez ainsi!
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Suggestion: Sessions matinales</p>
                    <p className="text-sm text-muted-foreground">
                      Essayez d'écouter de la musique énergisante le matin pour améliorer votre productivité.
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Nouveau: Playlists de méditation</p>
                    <p className="text-sm text-muted-foreground">
                      Découvrez nos nouvelles playlists de méditation guidée pour améliorer votre score de relaxation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discovery Tab */}
        <TabsContent value="discovery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nouveaux genres explorés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Ambient électronique', 'Jazz fusion', 'World music'].map((genre, i) => (
                    <div
                      key={genre}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm">{genre}</span>
                      <Badge variant="secondary">Nouveau</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Artistes découverts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Calm Waters', 'Mind Flow', 'Serenity Now'].map((artist, i) => (
                    <div
                      key={artist}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Music className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{artist}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Playlists suggérées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Focus profond', 'Sommeil réparateur', 'Motivation matinale'].map((playlist, i) => (
                    <div
                      key={playlist}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-sm">{playlist}</span>
                      <Button variant="outline" size="sm">
                        Explorer
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Discovery Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Votre aventure musicale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 text-center">
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Nouveaux genres</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-center">
                  <p className="text-3xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Artistes découverts</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-center">
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Morceaux ajoutés</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 text-center">
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Playlists créées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
