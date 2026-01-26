/**
 * Dashboard Analytics des Préférences Musicales
 * Visualise les statistiques et tendances des préférences utilisateur
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Music, Target, BarChart3, Clock } from '@/components/music/icons';
import { GenreDistributionChart } from './GenreDistributionChart';
import { MoodPopularityChart } from './MoodPopularityChart';
import { TempoTrendsChart } from './TempoTrendsChart';
import { CompletionRateChart } from './CompletionRateChart';
import { getUserHistory, getUserListeningStats } from '@/services/music/history-service';
import { getUserPreferences } from '@/services/music/preferences-service';
import { logger } from '@/lib/logger';

interface AnalyticsStats {
  totalListens: number;
  avgCompletionRate: number;
  topGenre: string;
  topMood: string;
  avgTempo: number;
  listeningHours: number;
}

export const MusicAnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const [history, listeningStats, preferences] = await Promise.all([
        getUserHistory(100),
        getUserListeningStats(),
        getUserPreferences(),
      ]);

      // Calculer les statistiques
      const genreCounts = history.reduce((acc, entry) => {
        const genre = entry.metadata?.genre || 'unknown';
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const moodCounts = history.reduce((acc, entry) => {
        if (entry.mood) {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      
      const avgTempo = preferences?.preferred_tempos 
        ? (preferences.preferred_tempos.min + preferences.preferred_tempos.max) / 2 
        : 120;

      setStats({
        totalListens: listeningStats?.total_listens || history.length,
        avgCompletionRate: listeningStats?.avg_completion_rate || 0,
        topGenre,
        topMood,
        avgTempo,
        listeningHours: Math.round((listeningStats?.total_duration_seconds || 0) / 3600 * 10) / 10,
      });

      logger.info('Analytics loaded successfully', { historyCount: history.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load analytics', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LazyMotionWrapper>
      <div className="space-y-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analytics Musicales
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualisez vos préférences et habitudes d'écoute
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Clock className="w-3 h-3 mr-1" />
          Mis à jour maintenant
        </Badge>
      </m.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatsCard
            icon={<Music className="w-5 h-5" />}
            label="Écoutes"
            value={stats.totalListens}
            color="text-blue-500"
          />
          <StatsCard
            icon={<Target className="w-5 h-5" />}
            label="Taux complétion"
            value={`${Math.round(stats.avgCompletionRate)}%`}
            color="text-green-500"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Genre préféré"
            value={stats.topGenre}
            color="text-purple-500"
            isText
          />
          <StatsCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Mood dominant"
            value={stats.topMood}
            color="text-orange-500"
            isText
          />
          <StatsCard
            icon={<Music className="w-5 h-5" />}
            label="Tempo moyen"
            value={`${Math.round(stats.avgTempo)} BPM`}
            color="text-pink-500"
          />
          <StatsCard
            icon={<Clock className="w-5 h-5" />}
            label="Heures d'écoute"
            value={`${stats.listeningHours}h`}
            color="text-cyan-500"
          />
        </div>
      )}

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="moods">Moods</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GenreDistributionChart />
            <MoodPopularityChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TempoTrendsChart />
            <CompletionRateChart />
          </div>
        </TabsContent>

        <TabsContent value="genres">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des Genres</CardTitle>
              <CardDescription>
                Analyse détaillée de vos genres musicaux préférés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenreDistributionChart height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moods">
          <Card>
            <CardHeader>
              <CardTitle>Moods Populaires</CardTitle>
              <CardDescription>
                Vos états émotionnels musicaux les plus fréquents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodPopularityChart height={400} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Tempos</CardTitle>
                <CardDescription>
                  Tendance de vos préférences de tempo dans le temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TempoTrendsChart height={300} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Taux de Complétion</CardTitle>
                <CardDescription>
                  Évolution du taux de complétion de vos écoutes par cohorte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompletionRateChart height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </LazyMotionWrapper>
  );
};

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  isText?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color, isText }) => (
  <m.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className={`${color} mb-2`}>{icon}</div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-2xl font-bold ${isText ? 'text-lg' : ''}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  </m.div>
);
