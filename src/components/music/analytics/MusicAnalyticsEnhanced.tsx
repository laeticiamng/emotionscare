/**
 * MusicAnalyticsEnhanced - Dashboard enrichi avec useMusicAnalytics
 * Vue alternative avec données temps réel depuis music_sessions
 */

import React, { useMemo } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Music, 
  Clock, 
  TrendingUp, 
  Activity, 
  Brain, 
  Download,
  Star,
  Zap
} from 'lucide-react';
import { useMusicAnalytics } from '@/hooks/useMusicAnalytics';

interface MusicAnalyticsEnhancedProps {
  period?: 'week' | 'month' | 'year' | 'all';
}

export const MusicAnalyticsEnhanced: React.FC<MusicAnalyticsEnhancedProps> = ({
  period = 'month'
}) => {
  const { stats, isLoading, error, exportToCSV } = useMusicAnalytics({ period });

  const formattedListeningTime = useMemo(() => {
    if (!stats) return '0h';
    const hours = Math.floor(stats.totalListeningTime / 60);
    const minutes = stats.totalListeningTime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, [stats]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Erreur de chargement des analytics</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-12 text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">Aucune donnée disponible</p>
          <p className="text-sm text-muted-foreground mt-2">
            Commencez à écouter de la musique pour voir vos statistiques
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <LazyMotionWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Analytics Enrichies</h3>
            <p className="text-muted-foreground">
              Basé sur vos sessions de musicothérapie
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Temps d'écoute</span>
                </div>
                <p className="text-3xl font-bold">{formattedListeningTime}</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <Music className="h-4 w-4" />
                  <span className="text-sm">Sessions</span>
                </div>
                <p className="text-3xl font-bold">{stats.totalSessions}</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Amélioration humeur</span>
                </div>
                <p className="text-3xl font-bold">+{stats.averageMoodImprovement}</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm">Efficacité</span>
                </div>
                <p className="text-3xl font-bold">{stats.therapeuticEffectiveness}%</p>
              </CardContent>
            </Card>
          </m.div>
        </div>

        {/* Activité hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité hebdomadaire
            </CardTitle>
            <CardDescription>
              Temps d'écoute par jour de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {stats.weeklyActivity.map((day, index) => {
                const maxMinutes = Math.max(...stats.weeklyActivity.map(d => d.minutes), 1);
                const heightPercent = (day.minutes / maxMinutes) * 100;
                
                return (
                  <m.div
                    key={day.day}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <div 
                      className="w-full bg-primary/20 rounded-t relative min-h-[100px]"
                      style={{ height: '100px' }}
                    >
                      <div 
                        className="absolute bottom-0 w-full bg-primary rounded-t transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs mt-2 text-muted-foreground">{day.day}</span>
                    <span className="text-xs font-medium">{day.minutes}m</span>
                  </m.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Genres favoris et tendances humeur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genres favoris */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Genres favoris
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.favoriteGenres.length > 0 ? (
                  stats.favoriteGenres.map((genre, index) => (
                    <m.div
                      key={genre}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Badge 
                        variant={index === 0 ? 'default' : 'secondary'}
                        className="min-w-[24px] justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <span className="flex-1">{genre}</span>
                      <Zap className={`h-4 w-4 ${index === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    </m.div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Pas encore assez de données
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parcours émotionnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Parcours émotionnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points enregistrés</span>
                <Badge variant="secondary">{stats.emotionalJourneyStats.totalPoints}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amélioration moyenne</span>
                <Badge variant={stats.emotionalJourneyStats.avgSessionImprovement > 0 ? 'default' : 'secondary'}>
                  {stats.emotionalJourneyStats.avgSessionImprovement > 0 ? '+' : ''}
                  {stats.emotionalJourneyStats.avgSessionImprovement}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Adaptations IA</span>
                <Badge variant="outline">{stats.emotionalJourneyStats.adaptationCount}</Badge>
              </div>

              {stats.emotionalJourneyStats.bestSession && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Meilleure session</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{stats.emotionalJourneyStats.bestSession.date}</span>
                    <Badge className="bg-green-500/20 text-green-700">
                      +{stats.emotionalJourneyStats.bestSession.improvement}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top tracks */}
        {stats.topTracks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Top morceaux
              </CardTitle>
              <CardDescription>Basé sur le nombre d'écoutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topTracks.slice(0, 5).map((track, index) => (
                  <m.div
                    key={track.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{track.playCount} écoutes</p>
                      {track.avgMoodImpact !== 0 && (
                        <p className={`text-xs ${track.avgMoodImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {track.avgMoodImpact > 0 ? '+' : ''}{track.avgMoodImpact} humeur
                        </p>
                      )}
                    </div>
                  </m.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LazyMotionWrapper>
  );
};

export default MusicAnalyticsEnhanced;
