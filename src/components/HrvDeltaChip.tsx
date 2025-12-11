import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Heart, History, Share2, Download, ChevronDown, Star, Target, Activity } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface HrvHistoryEntry {
  date: string;
  delta: number;
  status: string;
}

interface HrvDeltaChipProps {
  delta: number;
  previousDelta?: number;
  showTrend?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  userId?: string;
  onHistoryClick?: () => void;
}

const STORAGE_KEY = 'hrv-delta-history';
const FAVORITES_KEY = 'hrv-delta-favorites';

export const HrvDeltaChip: React.FC<HrvDeltaChipProps> = ({
  delta,
  previousDelta,
  showTrend = true,
  showTooltip = true,
  size = 'md',
  className,
  userId,
  onHistoryClick,
}) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [history, setHistory] = useState<HrvHistoryEntry[]>([]);
  const [personalBest, setPersonalBest] = useState<number | null>(null);
  const [weeklyAverage, setWeeklyAverage] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as HrvHistoryEntry[];
      setHistory(parsed);
      
      // Calculate personal best
      const best = Math.max(...parsed.map(h => h.delta));
      setPersonalBest(best);
      
      // Calculate weekly average
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyEntries = parsed.filter(h => new Date(h.date) >= weekAgo);
      if (weeklyEntries.length > 0) {
        const avg = weeklyEntries.reduce((sum, h) => sum + h.delta, 0) / weeklyEntries.length;
        setWeeklyAverage(Math.round(avg * 10) / 10);
      }
    }
    
    // Check favorite status
    const favorites = localStorage.getItem(FAVORITES_KEY);
    if (favorites) {
      const parsed = JSON.parse(favorites);
      setIsFavorite(parsed.includes(delta));
    }
  }, [delta]);

  // Save current reading to history
  useEffect(() => {
    if (delta !== undefined) {
      const newEntry: HrvHistoryEntry = {
        date: new Date().toISOString(),
        delta,
        status: getStatus(),
      };
      
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing = stored ? JSON.parse(stored) : [];
      
      // Only add if different from last entry (avoid duplicates)
      if (existing.length === 0 || existing[existing.length - 1].delta !== delta) {
        const updated = [...existing, newEntry].slice(-30); // Keep last 30 entries
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setHistory(updated);
      }
    }
  }, [delta]);

  // Determine status based on delta value
  const getStatus = () => {
    if (delta >= 10) return 'excellent';
    if (delta >= 5) return 'good';
    if (delta >= 0) return 'neutral';
    if (delta >= -5) return 'low';
    return 'critical';
  };

  const status = getStatus();

  // Color schemes based on status
  const colorSchemes = {
    excellent: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    good: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    low: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    critical: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Calculate trend from previous delta
  const getTrend = () => {
    if (previousDelta === undefined) return null;
    const diff = delta - previousDelta;
    if (diff > 2) return 'up';
    if (diff < -2) return 'down';
    return 'stable';
  };

  const trend = getTrend();

  // Trend icon component
  const TrendIcon = () => {
    if (!showTrend || !trend) return null;
    
    const icons = {
      up: <TrendingUp className={cn(iconSizes[size], 'text-emerald-500')} />,
      down: <TrendingDown className={cn(iconSizes[size], 'text-red-500')} />,
      stable: <Minus className={cn(iconSizes[size], 'text-slate-400')} />,
    };

    return icons[trend];
  };

  // Status labels for tooltip
  const statusLabels = {
    excellent: 'Excellent - Votre HRV est très élevé',
    good: 'Bon - Votre HRV est dans une bonne plage',
    neutral: 'Normal - Variabilité cardiaque stable',
    low: 'Attention - HRV légèrement bas',
    critical: 'Alerte - HRV significativement bas',
  };

  // Recommendations based on status
  const recommendations = {
    excellent: 'Continuez ainsi ! Votre récupération est optimale.',
    good: 'Bonne forme ! Maintenez vos habitudes actuelles.',
    neutral: 'État stable. Une session de respiration pourrait aider.',
    low: 'Pensez à vous reposer et faire une session de cohérence.',
    critical: 'Repos recommandé. Évitez les efforts intenses.',
  };

  const sign = delta >= 0 ? '+' : '';

  // Toggle favorite
  const toggleFavorite = () => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    
    if (isFavorite) {
      const updated = favorites.filter((f: number) => f !== delta);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } else {
      favorites.push(delta);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: `HRV ${sign}${delta} RMSSD`,
    });
  };

  // Share reading
  const handleShare = async () => {
    const shareText = `Mon HRV actuel: ${sign}${delta} RMSSD (${statusLabels[status]})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon HRV - EmotionsCare',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copié !',
        description: 'Les données HRV ont été copiées dans le presse-papier',
      });
    }
  };

  // Export history
  const handleExport = () => {
    const data = {
      currentReading: { delta, status, timestamp: new Date().toISOString() },
      history,
      personalBest,
      weeklyAverage,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hrv-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exporté !',
      description: 'Vos données HRV ont été téléchargées',
    });
  };

  // Calculate comparison with personal best
  const comparisonToBest = personalBest !== null ? delta - personalBest : null;
  const comparisonToAvg = weeklyAverage !== null ? delta - weeklyAverage : null;

  const chipContent = (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-all duration-200',
        colorSchemes[status],
        sizeClasses[size],
        isHovered && 'scale-105 shadow-sm',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Heart className={cn(iconSizes[size], 'animate-pulse')} />
      <span className="font-semibold">{sign}{delta}</span>
      <span className="opacity-70">RMSSD</span>
      <TrendIcon />
      {isFavorite && <Star className={cn(iconSizes[size], 'text-amber-500 fill-amber-500')} />}
    </span>
  );

  if (!showTooltip) {
    return chipContent;
  }

  return (
    <TooltipProvider>
      <Popover open={showDetails} onOpenChange={setShowDetails}>
        <PopoverTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                {chipContent}
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="max-w-xs p-3 space-y-2"
            >
              <div className="flex items-center gap-2 font-medium">
                <Info className="h-4 w-4 text-primary" />
                {statusLabels[status]}
              </div>
              <p className="text-xs text-muted-foreground">
                {recommendations[status]}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Cliquez pour plus de détails
              </p>
            </TooltipContent>
          </Tooltip>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4" align="center">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary animate-pulse" />
                <h4 className="font-semibold">Analyse HRV</h4>
              </div>
              <Badge variant="outline" className={colorSchemes[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>

            {/* Current reading with comparison */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lecture actuelle</span>
                <span className="text-2xl font-bold">{sign}{delta} <span className="text-sm font-normal">RMSSD</span></span>
              </div>
              
              {/* Comparisons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                {personalBest !== null && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Record
                    </div>
                    <div className="text-sm font-medium">
                      {personalBest}
                      {comparisonToBest !== null && comparisonToBest !== 0 && (
                        <span className={cn(
                          'ml-1 text-xs',
                          comparisonToBest > 0 ? 'text-emerald-500' : 'text-red-500'
                        )}>
                          ({comparisonToBest > 0 ? '+' : ''}{comparisonToBest})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {weeklyAverage !== null && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      Moy. 7j
                    </div>
                    <div className="text-sm font-medium">
                      {weeklyAverage}
                      {comparisonToAvg !== null && comparisonToAvg !== 0 && (
                        <span className={cn(
                          'ml-1 text-xs',
                          comparisonToAvg > 0 ? 'text-emerald-500' : 'text-red-500'
                        )}>
                          ({comparisonToAvg > 0 ? '+' : ''}{Math.round(comparisonToAvg * 10) / 10})
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress to optimal */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Vers optimal (10+ RMSSD)</span>
                <span className="font-medium">{Math.min(100, Math.max(0, (delta / 10) * 100)).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(100, Math.max(0, (delta / 10) * 100))} className="h-2" />
            </div>

            {/* Recommendation */}
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-sm">{recommendations[status]}</p>
            </div>

            {/* Recent history mini */}
            {history.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Historique récent</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={onHistoryClick}
                  >
                    <History className="h-3 w-3 mr-1" />
                    Voir tout
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  {history.slice(-7).map((entry, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 h-6 rounded text-xs flex items-center justify-center font-medium',
                        entry.status === 'excellent' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                        entry.status === 'good' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        entry.status === 'neutral' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                        entry.status === 'low' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        entry.status === 'critical' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                      )}
                      title={new Date(entry.date).toLocaleDateString()}
                    >
                      {entry.delta > 0 ? '+' : ''}{entry.delta}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={toggleFavorite}
              >
                <Star className={cn('h-4 w-4 mr-1', isFavorite && 'fill-amber-500 text-amber-500')} />
                {isFavorite ? 'Favori' : 'Ajouter'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default HrvDeltaChip;
