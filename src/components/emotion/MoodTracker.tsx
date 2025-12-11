// @ts-nocheck

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, TrendingUp, TrendingDown, Download, Share2, Filter,
  ChevronLeft, ChevronRight, BarChart3, Info, Pencil, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  date: string;
  mood: number;
  emotion: string;
  note?: string;
  annotation?: string;
}

interface MoodTrackerProps {
  data: MoodEntry[];
  className?: string;
  onAnnotationAdd?: (date: string, annotation: string) => void;
}

const PERIOD_OPTIONS = [
  { value: '7', label: '7 jours' },
  { value: '14', label: '14 jours' },
  { value: '30', label: '30 jours' },
  { value: '90', label: '3 mois' },
];

// Simulated average for comparison
const COMMUNITY_AVERAGE = 6.5;

const MoodTracker: React.FC<MoodTrackerProps> = ({ data, className, onAnnotationAdd }) => {
  const [period, setPeriod] = useState('14');
  const [showComparison, setShowComparison] = useState(false);
  const [annotationDate, setAnnotationDate] = useState<string | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const { toast } = useToast();

  // Filter data by period
  const filteredData = useMemo(() => {
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return data.filter(entry => new Date(entry.date) >= cutoff);
  }, [data, period]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const moods = filteredData.map(e => e.mood);
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    const max = Math.max(...moods);
    const min = Math.min(...moods);
    const variance = moods.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) / moods.length;
    const stdDev = Math.sqrt(variance);
    
    // Trend calculation
    const recent = filteredData.slice(-7);
    const older = filteredData.slice(-14, -7);
    const recentAvg = recent.reduce((sum, e) => sum + e.mood, 0) / Math.max(1, recent.length);
    const olderAvg = older.length > 0 
      ? older.reduce((sum, e) => sum + e.mood, 0) / older.length 
      : recentAvg;
    const trend = recentAvg - olderAvg;
    
    // Best and worst days
    const bestEntry = filteredData.reduce((best, e) => e.mood > best.mood ? e : best, filteredData[0]);
    const worstEntry = filteredData.reduce((worst, e) => e.mood < worst.mood ? e : worst, filteredData[0]);
    
    // Emotion distribution
    const emotionCounts: Record<string, number> = {};
    filteredData.forEach(e => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });
    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    
    return { avg, max, min, stdDev, trend, bestEntry, worstEntry, topEmotion };
  }, [filteredData]);

  // Export data
  const exportData = () => {
    let csv = 'Date,Humeur,Emotion,Note,Annotation\n';
    filteredData.forEach(entry => {
      csv += `${entry.date},${entry.mood},${entry.emotion},"${entry.note || ''}","${entry.annotation || ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: '📊 Export réussi !',
      description: `${filteredData.length} entrées exportées en CSV.`,
    });
  };

  // Share stats
  const shareStats = async () => {
    if (!stats) return;
    
    const text = `📊 Mon suivi d'humeur EmotionsCare:\n• Moyenne: ${stats.avg.toFixed(1)}/10\n• Tendance: ${stats.trend > 0 ? '📈' : stats.trend < 0 ? '📉' : '➡️'} ${stats.trend > 0 ? '+' : ''}${stats.trend.toFixed(1)}\n• Émotion dominante: ${stats.topEmotion?.[0] || 'N/A'}\n\n#BienEtre #EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (e) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: '📋 Copié !',
        description: 'Les stats ont été copiées dans le presse-papier.',
      });
    }
  };

  // Add annotation
  const handleAddAnnotation = () => {
    if (!annotationDate || !annotationText.trim()) return;
    
    onAnnotationAdd?.(annotationDate, annotationText);
    setAnnotationDate(null);
    setAnnotationText('');
    
    toast({
      title: '📝 Annotation ajoutée !',
      description: `Note ajoutée pour le ${annotationDate}.`,
    });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-primary font-bold">Humeur: {entry.mood}/10</p>
          <p className="text-sm text-muted-foreground">Émotion: {entry.emotion}</p>
          {entry.note && (
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">{entry.note}</p>
          )}
          {entry.annotation && (
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <Pencil className="h-3 w-3" /> {entry.annotation}
            </p>
          )}
          {showComparison && (
            <p className="text-xs mt-1">
              vs Communauté: {entry.mood > COMMUNITY_AVERAGE ? '✅' : '⚠️'} 
              {(entry.mood - COMMUNITY_AVERAGE).toFixed(1)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Suivi de l'humeur
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* Period selector */}
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Comparison toggle */}
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showComparison ? 'default' : 'outline'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Comparer avec la communauté</TooltipContent>
              </UITooltip>
              
              {/* Export */}
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={exportData}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exporter en CSV</TooltipContent>
              </UITooltip>
              
              {/* Share */}
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={shareStats}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Partager mes stats</TooltipContent>
              </UITooltip>
            </div>
          </div>
          
          {/* Stats summary */}
          {stats && (
            <div className="flex items-center gap-3 flex-wrap mt-2">
              <Badge variant={stats.trend > 0 ? "default" : stats.trend < 0 ? "destructive" : "secondary"}>
                {stats.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stats.trend > 0 ? '+' : ''}{stats.trend.toFixed(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Moy: <strong>{stats.avg.toFixed(1)}</strong>/10
              </span>
              <span className="text-sm text-muted-foreground">
                Min: {stats.min} | Max: {stats.max}
              </span>
              {stats.topEmotion && (
                <Badge variant="outline">{stats.topEmotion[0]}</Badge>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[1, 10]} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Community average reference line */}
                {showComparison && (
                  <ReferenceLine 
                    y={COMMUNITY_AVERAGE} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="3 3"
                    label={{ value: 'Moy. communauté', position: 'right', fontSize: 10 }}
                  />
                )}
                
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))"
                  fill="url(#moodGradient)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const hasAnnotation = payload.annotation;
                    return (
                      <g>
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={hasAnnotation ? 6 : 4} 
                          fill={hasAnnotation ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                        {hasAnnotation && (
                          <Pencil x={cx - 4} y={cy - 4} className="h-2 w-2 text-primary-foreground" />
                        )}
                      </g>
                    );
                  }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Annotation panel */}
          <Popover open={!!annotationDate} onOpenChange={(open) => !open && setAnnotationDate(null)}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Pencil className="h-4 w-4 mr-2" />
                Ajouter une annotation
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium">Nouvelle annotation</h4>
                <Select 
                  value={annotationDate || ''} 
                  onValueChange={setAnnotationDate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une date" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredData.map(entry => (
                      <SelectItem key={entry.date} value={entry.date}>
                        {entry.date} - {entry.emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Votre annotation..."
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                />
                <Button onClick={handleAddAnnotation} className="w-full" size="sm">
                  Ajouter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Best/Worst days */}
          {stats && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs text-muted-foreground">Meilleur jour</p>
                <p className="font-semibold text-green-600">{stats.bestEntry.date}</p>
                <p className="text-sm">{stats.bestEntry.mood}/10 - {stats.bestEntry.emotion}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-xs text-muted-foreground">Jour difficile</p>
                <p className="font-semibold text-orange-600">{stats.worstEntry.date}</p>
                <p className="text-sm">{stats.worstEntry.mood}/10 - {stats.worstEntry.emotion}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default MoodTracker;
