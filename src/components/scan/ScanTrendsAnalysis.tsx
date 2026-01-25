import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle, Sparkles, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TrendPoint {
  date: string;
  valence: number;
  arousal: number;
  label?: string;
}

interface EmotionTrend {
  emotion: string;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

interface Props {
  onCrisisDetected?: (score: number) => void;
}

export default function ScanTrendsAnalysis({ onCrisisDetected }: Props) {
  const { user } = useAuth();
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([]);
  const [period, setPeriod] = useState<'7' | '14' | '30'>('7');
  const [loading, setLoading] = useState(true);
  const [avgValence, setAvgValence] = useState(0);
  const [avgArousal, setAvgArousal] = useState(0);
  const [overallTrend, setOverallTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (user) loadTrends();
  }, [user, period]);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const { data: signals, error } = await supabase
        .from('clinical_signals')
        .select('valence, arousal, created_at, metadata')
        .eq('user_id', user?.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (!error && signals && signals.length > 0) {
        // Process trend data
        const processed: TrendPoint[] = signals.map(s => ({
          date: new Date(s.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          valence: Math.round(s.valence),
          arousal: Math.round(s.arousal),
          label: (s.metadata as any)?.summary,
        }));

        setTrendData(processed);

        // Calculate averages
        const totalValence = signals.reduce((sum, s) => sum + s.valence, 0);
        const totalArousal = signals.reduce((sum, s) => sum + s.arousal, 0);
        const avgV = Math.round(totalValence / signals.length);
        const avgA = Math.round(totalArousal / signals.length);
        setAvgValence(avgV);
        setAvgArousal(avgA);

        // Calculate overall trend (compare first half to second half)
        const midpoint = Math.floor(signals.length / 2);
        const firstHalf = signals.slice(0, midpoint);
        const secondHalf = signals.slice(midpoint);
        
        if (firstHalf.length > 0 && secondHalf.length > 0) {
          const firstAvg = firstHalf.reduce((sum, s) => sum + s.valence, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, s) => sum + s.valence, 0) / secondHalf.length;
          const diff = secondAvg - firstAvg;
          
          if (diff > 5) setOverallTrend('up');
          else if (diff < -5) setOverallTrend('down');
          else setOverallTrend('stable');
        }

        // Emotion distribution
        const emotionCounts: Record<string, number> = {};
        signals.forEach(s => {
          const label = (s.metadata as any)?.summary || 'Neutre';
          emotionCounts[label] = (emotionCounts[label] || 0) + 1;
        });

        const sortedEmotions = Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([emotion, count]) => ({
            emotion,
            percentage: Math.round((count / signals.length) * 100),
            trend: 'stable' as const,
            changePercent: 0,
          }));

        setEmotionTrends(sortedEmotions);

        // Check for crisis patterns (low valence trend)
        if (avgV < 30 && signals.length >= 3) {
          const recentLow = signals.slice(-3).every(s => s.valence < 35);
          if (recentLow && onCrisisDetected) {
            onCrisisDetected(100 - avgV);
          }
        }
      } else {
        setTrendData([]);
        setEmotionTrends([]);
      }
    } catch (err) {
      console.error('Failed to load trends:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getValenceLabel = (value: number) => {
    if (value >= 70) return { label: 'Positif', color: 'text-green-500' };
    if (value >= 40) return { label: 'Neutre', color: 'text-amber-500' };
    return { label: 'Négatif', color: 'text-red-500' };
  };

  const valenceLabel = getValenceLabel(avgValence);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Analyse des tendances
            </CardTitle>
            <CardDescription>
              Évolution de votre état émotionnel
            </CardDescription>
          </div>
          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="14">14 jours</SelectItem>
              <SelectItem value="30">30 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {trendData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Pas encore de données</p>
            <p className="text-sm">Faites un scan pour commencer le suivi</p>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`text-2xl font-bold ${valenceLabel.color}`}>
                    {avgValence}%
                  </span>
                  {getTrendIcon(overallTrend)}
                </div>
                <p className="text-xs text-muted-foreground">Valence moy.</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {valenceLabel.label}
                </Badge>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold">{avgArousal}%</p>
                <p className="text-xs text-muted-foreground">Activation moy.</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold">{trendData.length}</p>
                <p className="text-xs text-muted-foreground">Scans</p>
              </div>
            </div>

            {/* Trend chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="valenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border rounded-lg p-2 shadow-lg">
                            <p className="text-sm font-medium">{payload[0].payload.date}</p>
                            <p className="text-xs">Valence: {payload[0].value}%</p>
                            {payload[0].payload.label && (
                              <p className="text-xs text-muted-foreground">{payload[0].payload.label}</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valence" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#valenceGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Emotion distribution */}
            {emotionTrends.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Émotions fréquentes
                </h4>
                <div className="space-y-2">
                  {emotionTrends.map((emotion, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-24 text-sm truncate">{emotion.emotion}</span>
                      <Progress value={emotion.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {emotion.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Low mood alert */}
            {avgValence < 40 && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Tendance à surveiller
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Votre valence moyenne est basse. N'hésitez pas à consulter les ressources d'aide.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
