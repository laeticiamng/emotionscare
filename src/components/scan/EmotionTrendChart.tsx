import React, { useState, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { Line, Bar, Area, ComposedChart } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, BarChart } from 'recharts';
import { EmotionResult } from '@/types/emotion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon, 
  Calendar, Download, Share2, Filter, Minus, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface EmotionTrendChartProps {
  data: EmotionResult[];
  height?: number;
  className?: string;
  showControls?: boolean;
}

type ChartType = 'line' | 'area' | 'bar';
type TimeRange = '7d' | '30d' | '90d' | 'all';

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({
  data,
  height = 300,
  className,
  showControls = true
}) => {
  const { toast } = useToast();
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Mapper les émotions à des couleurs
  const emotionColors: Record<string, string> = {
    happy: '#4ade80',
    sad: '#60a5fa',
    angry: '#ef4444',
    fear: '#a855f7',
    disgust: '#84cc16',
    surprise: '#f59e0b',
    neutral: '#94a3b8',
    calm: '#38bdf8',
    excited: '#fb923c',
    stressed: '#f87171',
    anxious: '#c084fc',
    content: '#34d399',
    frustrated: '#f472b6',
    hopeful: '#fbbf24'
  };

  // Filtrer par période
  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoff = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoff.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoff.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoff.setDate(now.getDate() - 90);
        break;
      case 'all':
      default:
        cutoff = new Date(0);
    }

    return data.filter(item => {
      const itemDate = new Date(item.timestamp || Date.now());
      return itemDate >= cutoff;
    });
  }, [data, timeRange]);

  // Transformer les données pour le graphique
  const chartData = useMemo(() => {
    const grouped: Record<string, { date: string; scores: Record<string, number[]>; count: number }> = {};

    filteredData.forEach(item => {
      const date = new Date(item.timestamp || Date.now()).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'short' 
      });
      
      if (!grouped[date]) {
        grouped[date] = { date, scores: {}, count: 0 };
      }
      
      const emotion = item.emotion?.toLowerCase() || 'neutral';
      if (!grouped[date].scores[emotion]) {
        grouped[date].scores[emotion] = [];
      }
      grouped[date].scores[emotion].push(item.confidence ?? 0.5);
      grouped[date].count++;
    });

    return Object.values(grouped).map(g => {
      const result: any = { date: g.date, count: g.count };
      Object.entries(g.scores).forEach(([emotion, scores]) => {
        result[emotion] = scores.reduce((a, b) => a + b, 0) / scores.length;
      });
      result.avgScore = Object.values(g.scores).flat().reduce((a, b) => a + b, 0) / 
        Object.values(g.scores).flat().length;
      // Ajouter un timestamp pour le tri
      result._sortKey = g.date;
      return result;
    }).sort((a, b) => {
      // Tri robuste par date en parsant le format français (ex: "15 janv.")
      const monthMap: Record<string, number> = {
        'janv': 0, 'févr': 1, 'mars': 2, 'avr': 3, 'mai': 4, 'juin': 5,
        'juil': 6, 'août': 7, 'sept': 8, 'oct': 9, 'nov': 10, 'déc': 11
      };
      
      const parseDate = (dateStr: string): number => {
        const parts = dateStr.trim().split(' ');
        if (parts.length >= 2) {
          const day = parseInt(parts[0], 10);
          const monthKey = parts[1].replace('.', '').toLowerCase();
          const month = monthMap[monthKey] ?? 0;
          const year = new Date().getFullYear();
          return new Date(year, month, day).getTime();
        }
        return 0;
      };
      
      return parseDate(a.date) - parseDate(b.date);
    });
  }, [filteredData]);

  // Statistiques calculées
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const scores = chartData.map(d => d.avgScore).filter(Boolean);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Trend calculation
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
    const trendDirection = secondAvg > firstAvg ? 'up' : secondAvg < firstAvg ? 'down' : 'stable';
    const trendPercent = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0;

    // Most frequent emotions
    const emotionCounts: Record<string, number> = {};
    filteredData.forEach(item => {
      const emotion = item.emotion?.toLowerCase() || 'neutral';
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      avgScore: Math.round(avgScore * 100),
      trendDirection,
      trendPercent: Math.abs(trendPercent).toFixed(1),
      totalEntries: filteredData.length,
      topEmotions,
      uniqueEmotions: Object.keys(emotionCounts).length
    };
  }, [chartData, filteredData]);

  // Get unique emotions for filter
  const uniqueEmotions = useMemo(() => {
    const emotions = new Set<string>();
    filteredData.forEach(item => {
      if (item.emotion) emotions.add(item.emotion.toLowerCase());
    });
    return Array.from(emotions);
  }, [filteredData]);

  // Export functionality
  const handleExport = () => {
    const exportData = {
      data: chartData,
      stats,
      timeRange,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion-trends-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exporté !', description: 'Vos données ont été téléchargées' });
  };

  // Share functionality
  const handleShare = async () => {
    if (!stats) return;
    const shareText = `Mes tendances émotionnelles: Score moyen ${stats.avgScore}%, ${stats.totalEntries} entrées sur ${timeRange} - EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mes Tendances Émotionnelles', text: shareText });
      } catch (err) { logger.warn('Navigator share failed', err instanceof Error ? err : undefined, 'UI'); }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !' });
    }
  };

  const renderChart = () => {
    const emotionsToShow = selectedEmotions.length > 0 ? selectedEmotions : uniqueEmotions.slice(0, 5);

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const xAxisProps = { dataKey: "date", tick: { fontSize: 12 } };
    const yAxisProps = { domain: [0, 1], tick: { fontSize: 12 } };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip 
            formatter={(value: number) => [(value * 100).toFixed(0) + '%']}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          {emotionsToShow.map(emotion => (
            <Bar
              key={emotion}
              dataKey={emotion}
              name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              fill={emotionColors[emotion] || '#8884d8'}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip 
            formatter={(value: number) => [(value * 100).toFixed(0) + '%']}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          {emotionsToShow.map(emotion => (
            <Area
              key={emotion}
              type="monotone"
              dataKey={emotion}
              name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              stroke={emotionColors[emotion] || '#8884d8'}
              fill={emotionColors[emotion] || '#8884d8'}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis {...xAxisProps} />
        <YAxis {...yAxisProps} />
        <Tooltip 
          formatter={(value: number) => [(value * 100).toFixed(0) + '%']}
          contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
        />
        <Legend />
        {emotionsToShow.map(emotion => (
          <Line
            key={emotion}
            type="monotone"
            dataKey={emotion}
            name={emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            stroke={emotionColors[emotion] || '#8884d8'}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        ))}
        {showComparison && (
          <Line
            type="monotone"
            dataKey="avgScore"
            name="Moyenne"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        )}
      </LineChart>
    );
  };

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune donnée émotionnelle disponible</p>
            <p className="text-sm">Commencez à tracker vos émotions pour voir les tendances</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Tendances Émotionnelles
          </CardTitle>
          
          {showControls && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Time range selector */}
              <Select value={timeRange} onValueChange={(v: TimeRange) => setTimeRange(v)}>
                <SelectTrigger className="w-24">
                  <Calendar className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">90 jours</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
                </SelectContent>
              </Select>

              {/* Chart type selector */}
              <div className="flex border rounded-md">
                <Button 
                  variant={chartType === 'line' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setChartType('line')}
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'area' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-none border-x"
                  onClick={() => setChartType('area')}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Stats summary */}
        {stats && (
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{stats.avgScore}%</span>
              <div className={cn(
                'flex items-center text-sm',
                stats.trendDirection === 'up' ? 'text-emerald-600' : 
                stats.trendDirection === 'down' ? 'text-red-500' : 'text-muted-foreground'
              )}>
                {stats.trendDirection === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                {stats.trendDirection === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
                {stats.trendDirection === 'stable' && <Minus className="h-4 w-4 mr-1" />}
                {stats.trendPercent}%
              </div>
            </div>
            <Badge variant="outline">{stats.totalEntries} entrées</Badge>
            <div className="flex gap-1">
              {stats.topEmotions.map(([emotion, count]) => (
                <Badge 
                  key={emotion} 
                  style={{ backgroundColor: emotionColors[emotion] + '30', color: emotionColors[emotion] }}
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Emotion filters */}
        {showControls && uniqueEmotions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {uniqueEmotions.map(emotion => (
              <Badge
                key={emotion}
                variant={selectedEmotions.includes(emotion) ? 'default' : 'outline'}
                className="cursor-pointer transition-all"
                style={selectedEmotions.includes(emotion) ? { 
                  backgroundColor: emotionColors[emotion], 
                  borderColor: emotionColors[emotion] 
                } : {}}
                onClick={() => {
                  setSelectedEmotions(prev => 
                    prev.includes(emotion) 
                      ? prev.filter(e => e !== emotion)
                      : [...prev, emotion]
                  );
                }}
              >
                {emotion}
              </Badge>
            ))}
            {selectedEmotions.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs"
                onClick={() => setSelectedEmotions([])}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmotionTrendChart;
