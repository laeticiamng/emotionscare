import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Statistiques avancées d'écoute */
export interface AdvancedAnalytics {
  totalPlays: number;
  totalTracks: number;
  listeningTime: number;
  averageScore: number;
  uniqueArtists: number;
  favoriteGenre: string;
  peakListeningHour: number;
  weeklyGrowth: number;
  completionRate: number;
  skipRate: number;
}

/** Tendances d'écoute */
export interface ListeningTrend {
  date: string;
  plays: number;
  duration: number;
  averageMood: number;
}

/** Analyse par genre */
export interface GenreAnalysis {
  genre: string;
  playCount: number;
  totalDuration: number;
  averageRating: number;
}

/** Récupère les analytics avancés */
export const fetchAdvancedAnalytics = async (userId?: string): Promise<AdvancedAnalytics> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const targetUserId = userId || userData.user?.id;
    if (!targetUserId) return getDefaultAnalytics();

    const { data } = await supabase
      .from('music_analytics')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (!data) return getDefaultAnalytics();

    return {
      totalPlays: data.total_plays || 0,
      totalTracks: data.total_tracks || 0,
      listeningTime: data.listening_time || 0,
      averageScore: data.average_score || 0,
      uniqueArtists: data.unique_artists || 0,
      favoriteGenre: data.favorite_genre || 'Non défini',
      peakListeningHour: data.peak_hour || 20,
      weeklyGrowth: data.weekly_growth || 0,
      completionRate: data.completion_rate || 0,
      skipRate: data.skip_rate || 0
    };
  } catch (error) {
    logger.error('Error fetching analytics', error as Error, 'MUSIC');
    return getDefaultAnalytics();
  }
};

/** Récupère les tendances d'écoute */
export const fetchListeningTrends = async (days = 7): Promise<ListeningTrend[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('music_history')
      .select('played_at, duration, mood_score')
      .eq('user_id', userData.user.id)
      .gte('played_at', startDate.toISOString());

    if (!data) return [];

    const trendMap = new Map<string, ListeningTrend>();
    for (const entry of data) {
      const date = new Date(entry.played_at).toISOString().split('T')[0];
      const existing = trendMap.get(date) || { date, plays: 0, duration: 0, averageMood: 0 };
      existing.plays++;
      existing.duration += entry.duration || 0;
      trendMap.set(date, existing);
    }

    return Array.from(trendMap.values());
  } catch (error) {
    logger.error('Error fetching trends', error as Error, 'MUSIC');
    return [];
  }
};

/** Analyse par genre */
export const fetchGenreAnalysis = async (): Promise<GenreAnalysis[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data } = await supabase
      .from('music_genre_stats')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('play_count', { ascending: false })
      .limit(10);

    return (data || []).map(item => ({
      genre: item.genre,
      playCount: item.play_count,
      totalDuration: item.total_duration,
      averageRating: item.average_rating
    }));
  } catch (error) {
    logger.error('Error fetching genre analysis', error as Error, 'MUSIC');
    return [];
  }
};

/** Calcule l'efficacité de la musicothérapie */
export const calculateEffectiveness = async (): Promise<{ score: number; improvement: number }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return { score: 0, improvement: 0 };

    const { data } = await supabase
      .from('music_therapy_effectiveness')
      .select('score, mood_improvement')
      .eq('user_id', userData.user.id)
      .single();

    return { score: data?.score || 0, improvement: data?.mood_improvement || 0 };
  } catch (error) {
    return { score: 0, improvement: 0 };
  }
};

/** Récupère les heures de pointe */
export const fetchPeakHours = async (): Promise<{ hour: number; count: number }[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data } = await supabase
      .from('music_listening_hours')
      .select('hour, count')
      .eq('user_id', userData.user.id)
      .order('count', { ascending: false });

    return data || [];
  } catch (error) {
    return [];
  }
};

/** Exporte les analytics en CSV */
export const exportToCSV = async (): Promise<string> => {
  const analytics = await fetchAdvancedAnalytics();
  const trends = await fetchListeningTrends(30);

  let csv = 'Métrique,Valeur\n';
  csv += `Total lectures,${analytics.totalPlays}\n`;
  csv += `Total pistes,${analytics.totalTracks}\n`;
  csv += `Temps écoute (min),${Math.round(analytics.listeningTime / 60)}\n`;
  csv += `Score moyen,${analytics.averageScore.toFixed(2)}\n`;

  csv += '\nDate,Lectures,Durée\n';
  for (const t of trends) {
    csv += `${t.date},${t.plays},${t.duration}\n`;
  }

  return csv;
};

function getDefaultAnalytics(): AdvancedAnalytics {
  return {
    totalPlays: 0,
    totalTracks: 0,
    listeningTime: 0,
    averageScore: 0,
    uniqueArtists: 0,
    favoriteGenre: 'Non défini',
    peakListeningHour: 20,
    weeklyGrowth: 0,
    completionRate: 0,
    skipRate: 0
  };
}
