import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Heart, 
  Brain, 
  Zap,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface EmotionalOverviewTabProps {
  className?: string;
}

interface EmotionData {
  date: string;
  valence: number;
  arousal: number;
  label: string;
}

interface EmotionSummary {
  averageValence: number;
  averageArousal: number;
  trend: 'up' | 'down' | 'stable';
  dominantEmotion: string;
  sessionsCount: number;
}

const EmotionalOverviewTab: React.FC<EmotionalOverviewTabProps> = ({ className }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [summary, setSummary] = useState<EmotionSummary | null>(null);
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    if (user) {
      fetchEmotionData();
    }
  }, [user, period]);

  const fetchEmotionData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const daysBack = period === 'week' ? 7 : 30;
      const startDate = subDays(new Date(), daysBack).toISOString();

      const { data: assessments, error } = await supabase
        .from('assessments')
        .select('score_json, submitted_at, instrument')
        .eq('user_id', user.id)
        .gte('submitted_at', startDate)
        .order('submitted_at', { ascending: true });

      if (error) throw error;

      // Transformer les données pour le graphique
      const chartData: EmotionData[] = assessments?.map(assessment => {
        const score = assessment.score_json as any;
        return {
          date: format(new Date(assessment.submitted_at), 'dd/MM', { locale: fr }),
          valence: score?.level ? (score.level / 4) * 100 : 50,
          arousal: score?.focus === 'high_energy' ? 75 : score?.focus === 'low_energy' ? 25 : 50,
          label: score?.summary || 'Non défini'
        };
      }) || [];

      setEmotionData(chartData);

      // Calculer le résumé
      if (chartData.length > 0) {
        const avgValence = chartData.reduce((acc, d) => acc + d.valence, 0) / chartData.length;
        const avgArousal = chartData.reduce((acc, d) => acc + d.arousal, 0) / chartData.length;
        
        // Calculer la tendance
        const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
        const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
        const firstAvg = firstHalf.reduce((acc, d) => acc + d.valence, 0) / (firstHalf.length || 1);
        const secondAvg = secondHalf.reduce((acc, d) => acc + d.valence, 0) / (secondHalf.length || 1);
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (secondAvg > firstAvg + 5) trend = 'up';
        else if (secondAvg < firstAvg - 5) trend = 'down';

        setSummary({
          averageValence: Math.round(avgValence),
          averageArousal: Math.round(avgArousal),
          trend,
          dominantEmotion: getDominantEmotion(avgValence, avgArousal),
          sessionsCount: chartData.length
        });
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error('Error fetching emotion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDominantEmotion = (valence: number, arousal: number): string => {
    if (valence > 60 && arousal > 60) return 'Enthousiaste';
    if (valence > 60 && arousal <= 60) return 'Serein';
    if (valence <= 40 && arousal > 60) return 'Tendu';
    if (valence <= 40 && arousal <= 40) return 'Fatigué';
    return 'Équilibré';
  };

  const getTrendIcon = () => {
    if (!summary) return <Minus className="h-4 w-4" />;
    switch (summary.trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendLabel = () => {
    if (!summary) return 'Stable';
    switch (summary.trend) {
      case 'up': return 'En amélioration';
      case 'down': return 'En baisse';
      default: return 'Stable';
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Période sélection */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Aperçu émotionnel</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            7 jours
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            30 jours
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchEmotionData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être moyen</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.averageValence ?? '--'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Niveau de positivité
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Énergie moyenne</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.averageArousal ?? '--'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Niveau d'activation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendance</CardTitle>
            {getTrendIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTrendLabel()}</div>
            <p className="text-xs text-muted-foreground">
              Évolution récente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.sessionsCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Cette période
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique principal */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution émotionnelle</CardTitle>
          <CardDescription>
            Suivi de votre bien-être et énergie sur la période
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emotionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={emotionData}>
                <defs>
                  <linearGradient id="colorValence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArousal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="valence" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorValence)"
                  name="Bien-être"
                />
                <Area 
                  type="monotone" 
                  dataKey="arousal" 
                  stroke="hsl(var(--secondary))" 
                  fillOpacity={1}
                  fill="url(#colorArousal)"
                  name="Énergie"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Brain className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-center">Aucune donnée émotionnelle pour cette période.</p>
              <p className="text-sm text-center mt-2">
                Utilisez le scan émotionnel pour commencer à suivre vos émotions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* État dominant */}
      {summary && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">État émotionnel dominant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {summary.dominantEmotion}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Basé sur {summary.sessionsCount} sessions cette {period === 'week' ? 'semaine' : 'période'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionalOverviewTab;
