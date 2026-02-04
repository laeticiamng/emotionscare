/**
 * Dashboard de tendances émotionnelles long-terme
 * Affiche les patterns et évolutions sur le temps
 */

import { memo, useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface EmotionDataPoint {
  date: string;
  valence: number; // -1 to 1
  arousal: number; // 0 to 1
  dominantEmotion: string;
  emotions: Record<string, number>;
}

interface ScanTrendsDashboardProps {
  data?: EmotionDataPoint[];
  className?: string;
}

const EMOTIONS_COLORS: Record<string, string> = {
  joie: 'bg-yellow-500',
  sérénité: 'bg-green-500',
  tristesse: 'bg-blue-500',
  anxiété: 'bg-purple-500',
  colère: 'bg-red-500',
  surprise: 'bg-pink-500',
  dégoût: 'bg-amber-700',
  peur: 'bg-slate-500',
};

// Demo data
const DEMO_DATA: EmotionDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const valence = Math.sin(i / 5) * 0.3 + 0.2 + Math.random() * 0.2;
  const arousal = Math.cos(i / 7) * 0.2 + 0.5 + Math.random() * 0.1;
  
  const emotions = ['joie', 'sérénité', 'anxiété', 'tristesse'];
  const dominantIdx = Math.floor(Math.random() * emotions.length);
  
  return {
    date: date.toISOString().split('T')[0],
    valence: Math.max(-1, Math.min(1, valence)),
    arousal: Math.max(0, Math.min(1, arousal)),
    dominantEmotion: emotions[dominantIdx],
    emotions: {
      joie: Math.random() * 0.4 + (dominantIdx === 0 ? 0.5 : 0.1),
      sérénité: Math.random() * 0.3 + (dominantIdx === 1 ? 0.4 : 0.1),
      anxiété: Math.random() * 0.2 + (dominantIdx === 2 ? 0.3 : 0.05),
      tristesse: Math.random() * 0.15 + (dominantIdx === 3 ? 0.2 : 0.03),
    },
  };
});

export const ScanTrendsDashboard = memo(function ScanTrendsDashboard({
  data = DEMO_DATA,
  className
}: ScanTrendsDashboardProps) {
  const [period, setPeriod] = useState<'7' | '14' | '30'>('30');
  const [selectedWeek, setSelectedWeek] = useState(0);

  const filteredData = useMemo(() => {
    return data.slice(-parseInt(period));
  }, [data, period]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const avgValence = filteredData.reduce((sum, d) => sum + d.valence, 0) / filteredData.length;
    const avgArousal = filteredData.reduce((sum, d) => sum + d.arousal, 0) / filteredData.length;
    
    // Trend calculation
    const halfPoint = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, halfPoint);
    const secondHalf = filteredData.slice(halfPoint);
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.valence, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.valence, 0) / secondHalf.length;
    
    const trendDiff = secondAvg - firstAvg;
    const trend = trendDiff > 0.1 ? 'improving' : trendDiff < -0.1 ? 'declining' : 'stable';

    // Emotion counts
    const emotionCounts: Record<string, number> = {};
    filteredData.forEach(d => {
      emotionCounts[d.dominantEmotion] = (emotionCounts[d.dominantEmotion] || 0) + 1;
    });

    return {
      avgValence,
      avgArousal,
      trend,
      trendDiff,
      emotionCounts,
      totalScans: filteredData.length,
      bestDay: filteredData.reduce((best, d) => d.valence > best.valence ? d : best, filteredData[0]),
    };
  }, [filteredData]);

  const weeklyData = useMemo(() => {
    const weeks: EmotionDataPoint[][] = [];
    for (let i = 0; i < filteredData.length; i += 7) {
      weeks.push(filteredData.slice(i, i + 7));
    }
    return weeks;
  }, [filteredData]);

  const TrendIcon = stats?.trend === 'improving' ? TrendingUp : 
                    stats?.trend === 'declining' ? TrendingDown : Minus;
  const trendColor = stats?.trend === 'improving' ? 'text-green-500' : 
                     stats?.trend === 'declining' ? 'text-red-500' : 'text-yellow-500';

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Tendances Émotionnelles</CardTitle>
          </div>
          <div className="flex gap-1">
            {(['7', '14', '30'] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'default' : 'outline'}
                onClick={() => setPeriod(p)}
                className="text-xs"
              >
                {p}j
              </Button>
            ))}
          </div>
        </div>
        <CardDescription>
          Évolution de votre bien-être sur {period} jours
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-2xl font-bold text-primary">
                {(stats.avgValence * 50 + 50).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Bien-être moyen</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className={cn("text-2xl font-bold flex items-center justify-center gap-1", trendColor)}>
                <TrendIcon className="h-5 w-5" />
                {stats.trend === 'improving' ? '+' : stats.trend === 'declining' ? '-' : ''}
                {Math.abs(stats.trendDiff * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Tendance</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-2xl font-bold text-amber-500">
                {stats.totalScans}
              </div>
              <div className="text-xs text-muted-foreground">Scans</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <div className="text-2xl font-bold text-green-500">
                {new Date(stats.bestDay.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
              <div className="text-xs text-muted-foreground">Meilleur jour</div>
            </div>
          </div>
        )}

        {/* Emotion Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Distribution des émotions
          </h4>
          <div className="space-y-2">
            {stats && Object.entries(stats.emotionCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([emotion, count]) => {
                const percentage = (count / stats.totalScans) * 100;
                return (
                  <div key={emotion} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize font-medium">{emotion}</span>
                      <span className="text-muted-foreground">{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Weekly View */}
        <Tabs defaultValue="heatmap" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-4">
            <div className="grid grid-cols-7 gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} className="text-center text-[10px] text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
              {filteredData.slice(-28).map((day, i) => {
                const intensity = (day.valence + 1) / 2; // 0-1
                const hue = intensity * 120; // 0=red, 60=yellow, 120=green
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-sm flex items-center justify-center text-[10px] font-medium cursor-pointer hover:ring-2 ring-primary/50 transition-all"
                    style={{ 
                      backgroundColor: `hsl(${hue}, 70%, ${50 + intensity * 20}%)`,
                      color: intensity > 0.5 ? '#000' : '#fff'
                    }}
                    title={`${new Date(day.date).toLocaleDateString('fr-FR')} - ${day.dominantEmotion}`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
              <span>Négatif</span>
              <div className="flex gap-0.5">
                {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                  <div
                    key={v}
                    className="w-4 h-3 rounded-sm"
                    style={{ backgroundColor: `hsl(${v * 120}, 70%, ${50 + v * 20}%)` }}
                  />
                ))}
              </div>
              <span>Positif</span>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Semaine {weeklyData.length - selectedWeek}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWeek(Math.min(weeklyData.length - 1, selectedWeek + 1))}
                disabled={selectedWeek >= weeklyData.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {weeklyData[weeklyData.length - 1 - selectedWeek]?.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium w-16">
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={(day.valence + 1) * 50} 
                      className="h-3"
                    />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="capitalize text-xs"
                  >
                    {day.dominantEmotion}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        {stats && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Insight IA</h4>
                <p className="text-xs text-muted-foreground">
                  {stats.trend === 'improving' 
                    ? "Votre bien-être s'améliore ! Continuez vos pratiques actuelles de gestion du stress."
                    : stats.trend === 'declining'
                      ? "Une légère baisse est observée. Pensez à intégrer plus d'activités qui vous font du bien."
                      : "Votre état émotionnel est stable. C'est une bonne base pour explorer de nouvelles pratiques."}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
