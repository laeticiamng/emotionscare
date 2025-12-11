/**
 * Weekly Emotion Report - Rapport émotionnel hebdomadaire automatisé
 * Génère un résumé des patterns émotionnels de la semaine
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { format, startOfWeek, endOfWeek, subWeeks, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

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
}

interface EmotionDimension {
  dimension: string;
  score: number;
  fullMark: 100;
}

const MOCK_WEEKLY_DATA: DailyEmotion[] = [
  { day: 'Lun', valence: 65, arousal: 55, dominantEmotion: 'Calme', scansCount: 3 },
  { day: 'Mar', valence: 72, arousal: 68, dominantEmotion: 'Joie', scansCount: 4 },
  { day: 'Mer', valence: 58, arousal: 45, dominantEmotion: 'Fatigue', scansCount: 2 },
  { day: 'Jeu', valence: 80, arousal: 75, dominantEmotion: 'Enthousiasme', scansCount: 5 },
  { day: 'Ven', valence: 70, arousal: 60, dominantEmotion: 'Satisfaction', scansCount: 3 },
  { day: 'Sam', valence: 85, arousal: 70, dominantEmotion: 'Joie', scansCount: 2 },
  { day: 'Dim', valence: 75, arousal: 50, dominantEmotion: 'Sérénité', scansCount: 2 },
];

const EMOTION_DIMENSIONS: EmotionDimension[] = [
  { dimension: 'Joie', score: 78, fullMark: 100 },
  { dimension: 'Calme', score: 65, fullMark: 100 },
  { dimension: 'Énergie', score: 72, fullMark: 100 },
  { dimension: 'Focus', score: 58, fullMark: 100 },
  { dimension: 'Confiance', score: 70, fullMark: 100 },
  { dimension: 'Gratitude', score: 82, fullMark: 100 },
];

export const WeeklyEmotionReport: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState<DailyEmotion[]>(MOCK_WEEKLY_DATA);
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateStats();
  }, [weeklyData]);

  const generateStats = () => {
    const avgValence = weeklyData.reduce((acc, d) => acc + d.valence, 0) / weeklyData.length;
    const avgArousal = weeklyData.reduce((acc, d) => acc + d.arousal, 0) / weeklyData.length;
    const totalScans = weeklyData.reduce((acc, d) => acc + d.scansCount, 0);
    
    // Calculer la tendance
    const firstHalf = weeklyData.slice(0, 3).reduce((acc, d) => acc + d.valence, 0) / 3;
    const secondHalf = weeklyData.slice(4).reduce((acc, d) => acc + d.valence, 0) / 3;
    const trend = secondHalf > firstHalf + 5 ? 'up' : secondHalf < firstHalf - 5 ? 'down' : 'stable';
    
    // Top émotions
    const emotionCounts: Record<string, number> = {};
    weeklyData.forEach(d => {
      emotionCounts[d.dominantEmotion] = (emotionCounts[d.dominantEmotion] || 0) + d.scansCount;
    });
    const topEmotions = Object.entries(emotionCounts)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / totalScans) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
    
    // Jours remarquables
    const sortedByValence = [...weeklyData].sort((a, b) => b.valence - a.valence);
    
    setStats({
      averageValence: Math.round(avgValence),
      averageArousal: Math.round(avgArousal),
      trend,
      totalScans,
      streakDays: 7,
      topEmotions,
      peakDay: sortedByValence[0].day,
      lowDay: sortedByValence[sortedByValence.length - 1].day,
      insights: [
        'Votre humeur est généralement meilleure en fin de semaine.',
        'Les jours avec plus de scans montrent une meilleure conscience émotionnelle.',
        'Continuez à pratiquer la régulation émotionnelle, vos progrès sont visibles !'
      ]
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
    // En prod, charger les données de la nouvelle semaine
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const TrendIcon = stats?.trend === 'up' ? TrendingUp : stats?.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats?.trend === 'up' ? 'text-green-500' : stats?.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Rapport Hebdomadaire
          </h2>
          <p className="text-muted-foreground">
            Analyse de vos émotions cette semaine
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Stats principales */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
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

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scans effectués</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalScans}</p>
                </div>
                <div className="p-3 rounded-full bg-accent/10">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      )}

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
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
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
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
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={EMOTION_DIMENSIONS}>
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
      </div>

      {/* Émotions dominantes */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Émotions dominantes</CardTitle>
            <CardDescription>Les émotions les plus fréquentes cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topEmotions.map((emotion, index) => (
                <div key={emotion.name} className="space-y-2">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights IA */}
      {stats && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Insights de la semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {stats.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <p className="text-muted-foreground">{insight}</p>
                </li>
              ))}
            </ul>
            
            <Separator className="my-4" />
            
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyEmotionReport;
