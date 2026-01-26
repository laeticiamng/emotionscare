/**
 * Tableau de bord d'insights hebdomadaires - Données réelles depuis Supabase
 */

import React, { useState, useEffect, useCallback } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Music, Clock, Sparkles, Share2, Download, Loader2 } from '@/components/music/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';

interface WeeklyInsight {
  totalListeningTime: number; // minutes
  topGenres: Array<{ genre: string; count: number }>;
  newGenresDiscovered: string[];
  tasteProgression: string;
  streakDays: number;
  mostPlayedTrack: {
    title: string;
    artist: string;
    plays: number;
  };
  weeklyChange: number; // percentage change from last week
}

interface WeeklyInsightsDashboardProps {
  listeningHistory?: any[];
}

export const WeeklyInsightsDashboard: React.FC<WeeklyInsightsDashboardProps> = () => {
  const [insights, setInsights] = useState<WeeklyInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchWeeklyInsights = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Récupérer l'historique de cette semaine
      const { data: thisWeekHistory, error: thisWeekError } = await supabase
        .from('music_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('played_at', oneWeekAgo.toISOString())
        .order('played_at', { ascending: false });

      if (thisWeekError) throw thisWeekError;

      // Récupérer l'historique de la semaine dernière pour comparaison
      const { data: lastWeekHistory } = await supabase
        .from('music_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('played_at', twoWeeksAgo.toISOString())
        .lt('played_at', oneWeekAgo.toISOString());

      const history = thisWeekHistory || [];
      const lastWeek = lastWeekHistory || [];

      if (history.length === 0) {
        setInsights(null);
        setIsLoading(false);
        return;
      }

      // Calculer le temps d'écoute total (en minutes)
      const totalListeningTime = Math.round(
        history.reduce((sum, entry) => sum + (entry.listen_duration_seconds || 0), 0) / 60
      );

      const lastWeekTime = Math.round(
        lastWeek.reduce((sum, entry) => sum + (entry.listen_duration_seconds || 0), 0) / 60
      );

      // Calculer le changement hebdomadaire
      const weeklyChange = lastWeekTime > 0 
        ? Math.round(((totalListeningTime - lastWeekTime) / lastWeekTime) * 100)
        : 100;

      // Analyser les genres
      const genreCounts: Record<string, number> = {};
      const lastWeekGenres = new Set<string>();
      
      lastWeek.forEach(entry => {
        if (entry.genre) lastWeekGenres.add(entry.genre);
      });

      history.forEach(entry => {
        const genre = entry.genre || 'Unknown';
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });

      const topGenres = Object.entries(genreCounts)
        .map(([genre, count]) => ({
          genre,
          count: Math.round((count / history.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Nouveaux genres découverts
      const newGenresDiscovered = Object.keys(genreCounts)
        .filter(genre => !lastWeekGenres.has(genre))
        .slice(0, 3);

      // Track le plus joué
      const trackCounts: Record<string, { title: string; artist: string; count: number }> = {};
      history.forEach(entry => {
        const key = entry.track_id;
        if (!trackCounts[key]) {
          trackCounts[key] = {
            title: entry.track_title || 'Unknown',
            artist: entry.artist || 'Unknown',
            count: 0
          };
        }
        trackCounts[key].count++;
      });

      const mostPlayedTrack = Object.values(trackCounts)
        .sort((a, b) => b.count - a.count)[0] || { title: 'N/A', artist: 'N/A', plays: 0 };

      // Calculer le streak (jours consécutifs d'écoute)
      const uniqueDays = new Set(
        history.map(entry => new Date(entry.played_at).toDateString())
      );
      const streakDays = uniqueDays.size;

      // Progression des goûts
      const tasteProgression = topGenres.length > 0
        ? `Votre goût évolue vers ${topGenres[0].genre}`
        : 'Continuez à explorer !';

      setInsights({
        totalListeningTime,
        topGenres,
        newGenresDiscovered,
        tasteProgression,
        streakDays,
        mostPlayedTrack: {
          title: mostPlayedTrack.title,
          artist: mostPlayedTrack.artist,
          plays: mostPlayedTrack.count
        },
        weeklyChange
      });

    } catch (error) {
      console.error('Error fetching weekly insights:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les insights',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchWeeklyInsights();
  }, [fetchWeeklyInsights]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mes insights musicaux de la semaine',
          text: `J'ai écouté ${insights?.totalListeningTime} minutes de musique cette semaine ! 🎵`,
          url: window.location.href
        });
      } catch {
        toast({
          title: 'Partage annulé',
          variant: 'default'
        });
      }
    } else {
      toast({
        title: 'Lien copié',
        description: 'Le lien a été copié dans le presse-papier'
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleExport = async () => {
    const element = document.getElementById('weekly-insights');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `weekly-insights-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast({
        title: 'Exporté',
        description: 'Vos insights ont été téléchargés'
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exporter les insights',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!insights) {
    return (
      <Card className="p-6 text-center">
        <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Pas encore de données</h3>
        <p className="text-muted-foreground">
          Écoutez de la musique cette semaine pour voir vos insights !
        </p>
      </Card>
    );
  }

  return (
    <LazyMotionWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Votre semaine musicale
            </h2>
            <p className="text-muted-foreground">
              Résumé de vos écoutes du {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} au {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        <div id="weekly-insights" className="space-y-4">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                  <Badge variant="secondary">
                    {insights.weeklyChange >= 0 ? '+' : ''}{insights.weeklyChange}%
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {insights.totalListeningTime}min
                </p>
                <p className="text-sm text-muted-foreground">Temps d'écoute</p>
              </Card>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="flex items-center justify-between mb-2">
                  <Music className="h-8 w-8 text-secondary" />
                  <Badge variant="secondary">{insights.topGenres.length} genres</Badge>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {insights.topGenres[0]?.genre || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Genre favori</p>
              </Card>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-accent" />
                  <Badge variant="secondary">🔥 {insights.streakDays}j</Badge>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {insights.newGenresDiscovered.length}
                </p>
                <p className="text-sm text-muted-foreground">Nouveaux genres</p>
              </Card>
            </m.div>
          </div>

          {/* Distribution des genres */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
              <Music className="h-5 w-5 mr-2 text-primary" />
              Top Genres
            </h3>
            <div className="space-y-3">
              {insights.topGenres.map((genre, index) => (
                <div key={genre.genre}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {genre.genre}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {genre.count}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genre.count}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Découvertes et progression */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-accent" />
                Nouvelles découvertes
              </h3>
              <div className="space-y-2">
                {insights.newGenresDiscovered.map(genre => (
                  <Badge key={genre} variant="secondary" className="mr-2">
                    {genre}
                  </Badge>
                ))}
                {insights.newGenresDiscovered.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune nouvelle découverte cette semaine
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-secondary" />
                Progression des goûts
              </h3>
              <p className="text-foreground mb-2">{insights.tasteProgression}</p>
              <p className="text-sm text-muted-foreground">
                Votre palette musicale s'enrichit semaine après semaine
              </p>
            </Card>
          </div>

          {/* Titre le plus écouté */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
            <h3 className="font-semibold text-lg text-foreground mb-4">
              🎵 Votre titre de la semaine
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {insights.mostPlayedTrack.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {insights.mostPlayedTrack.artist}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg">
                {insights.mostPlayedTrack.plays} écoutes
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </LazyMotionWrapper>
  );
};
