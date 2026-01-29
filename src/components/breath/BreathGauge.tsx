import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Heart, Activity, TrendingUp, TrendingDown, Minus, 
  History, Share2, Download, Star, Zap, Wind
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

interface BreathGaugeHistoryEntry {
  date: string;
  coherence: boolean;
  duration: number;
  score: number;
}

interface BreathGaugeProps {
  coherence: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'rest';
  progress?: number;
  score?: number;
  sessionDuration?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  onHistoryClick?: () => void;
}

const STORAGE_KEY = 'breath-gauge-history';
const FAVORITES_KEY = 'breath-gauge-favorites';

export const BreathGauge: React.FC<BreathGaugeProps> = ({ 
  coherence,
  breathPhase = 'rest',
  progress = 0,
  score = 0,
  sessionDuration = 0,
  showDetails = true,
  size = 'md',
  animated = true,
  className,
  onHistoryClick
}) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [history, setHistory] = useState<BreathGaugeHistoryEntry[]>([]);
  const [personalBest, setPersonalBest] = useState<number>(0);
  const [weeklyAverage, setWeeklyAverage] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [streak, setStreak] = useState(0);

  // Size configurations
  const sizeConfig = {
    sm: { outer: 'w-12 h-12', inner: 'w-8 h-8', border: 'border-4', icon: 'h-3 w-3' },
    md: { outer: 'w-16 h-16', inner: 'w-12 h-12', border: 'border-8', icon: 'h-4 w-4' },
    lg: { outer: 'w-24 h-24', inner: 'w-18 h-18', border: 'border-8', icon: 'h-5 w-5' },
    xl: { outer: 'w-32 h-32', inner: 'w-24 h-24', border: 'border-[12px]', icon: 'h-6 w-6' },
  };

  // Phase colors and icons
  const phaseConfig = {
    inhale: { 
      color: 'border-sky-400 dark:border-sky-500',
      bgColor: 'bg-sky-100 dark:bg-sky-900/30',
      icon: Wind,
      label: 'Inspiration',
      animation: { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }
    },
    hold: { 
      color: 'border-amber-400 dark:border-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      icon: Zap,
      label: 'Rétention',
      animation: { scale: 1.15, opacity: 1 }
    },
    exhale: { 
      color: 'border-violet-400 dark:border-violet-500',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      icon: Wind,
      label: 'Expiration',
      animation: { scale: [1.15, 1, 1.15], opacity: [1, 0.8, 1] }
    },
    rest: { 
      color: coherence ? 'border-emerald-400 dark:border-emerald-500' : 'border-slate-300 dark:border-slate-600',
      bgColor: coherence ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800/30',
      icon: Heart,
      label: 'Repos',
      animation: { scale: 1, opacity: 0.7 }
    }
  };

  const currentPhase = phaseConfig[breathPhase];
  const PhaseIcon = currentPhase.icon;

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as BreathGaugeHistoryEntry[];
      setHistory(parsed);
      setTotalSessions(parsed.length);
      
      // Calculate personal best
      const best = Math.max(...parsed.map(h => h.score), 0);
      setPersonalBest(best);
      
      // Calculate weekly average
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyEntries = parsed.filter(h => new Date(h.date) >= weekAgo);
      if (weeklyEntries.length > 0) {
        const avg = weeklyEntries.reduce((sum, h) => sum + h.score, 0) / weeklyEntries.length;
        setWeeklyAverage(Math.round(avg));
      }

      // Calculate streak
      let currentStreak = 0;
      const today = new Date().toDateString();
      const sortedDates = [...new Set(parsed.map(h => new Date(h.date).toDateString()))].sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      
      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - i);
        if (sortedDates[i] === expectedDate.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }
      setStreak(currentStreak);
    }

    // Check favorites
    const favorites = localStorage.getItem(FAVORITES_KEY);
    if (favorites) {
      const parsed = JSON.parse(favorites);
      setIsFavorite(parsed.includes(score));
    }
  }, [score]);

  // Coherence level calculation
  const coherenceLevel = useMemo(() => {
    if (score >= 90) return { label: 'Optimal', color: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800' };
    if (score >= 70) return { label: 'Excellent', color: 'text-green-600', badge: 'bg-green-100 text-green-800' };
    if (score >= 50) return { label: 'Bon', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' };
    if (score >= 30) return { label: 'Moyen', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' };
    return { label: 'Débutant', color: 'text-slate-600', badge: 'bg-slate-100 text-slate-800' };
  }, [score]);

  // Trend calculation
  const trend = useMemo(() => {
    if (history.length < 2) return null;
    const recent = history.slice(-5);
    const avgRecent = recent.reduce((sum, h) => sum + h.score, 0) / recent.length;
    const older = history.slice(-10, -5);
    if (older.length === 0) return null;
    const avgOlder = older.reduce((sum, h) => sum + h.score, 0) / older.length;
    
    const diff = avgRecent - avgOlder;
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  }, [history]);

  // Share functionality
  const handleShare = async () => {
    const shareText = `Ma cohérence cardiaque: ${score}% (${coherenceLevel.label}) - EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma Cohérence Cardiaque',
          text: shareText,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copié !',
        description: 'Vos données ont été copiées',
      });
    }
  };

  // Export functionality
  const handleExport = () => {
    const data = {
      currentSession: { coherence, score, phase: breathPhase, duration: sessionDuration },
      history,
      stats: { personalBest, weeklyAverage, totalSessions, streak }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breath-gauge-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exporté !',
      description: 'Vos données ont été téléchargées',
    });
  };

  // Toggle favorite
  const toggleFavorite = () => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    
    if (isFavorite) {
      const updated = favorites.filter((f: number) => f !== score);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } else {
      favorites.push(score);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
    });
  };

  const gaugeContent = (
    <motion.div
      className={cn(
        'relative rounded-full flex items-center justify-center',
        sizeConfig[size].outer,
        sizeConfig[size].border,
        currentPhase.color,
        currentPhase.bgColor,
        'transition-colors duration-500',
        isHovered && 'shadow-lg',
        className
      )}
      animate={animated ? currentPhase.animation : undefined}
      transition={{ duration: breathPhase === 'hold' ? 0 : 4, repeat: Infinity, ease: 'easeInOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Cohérence cardiaque: ${score}%`}
    >
      {/* Inner content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={breathPhase}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <PhaseIcon className={cn(sizeConfig[size].icon, coherence ? 'text-emerald-600' : 'text-slate-500')} />
            {size !== 'sm' && (
              <span className="text-xs font-medium mt-1">{score}%</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress ring */}
      {progress > 0 && (
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary/20"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.5 }}
            style={{ pathLength: progress / 100 }}
          />
        </svg>
      )}

      {/* Favorite star */}
      {isFavorite && (
        <Star className="absolute -top-1 -right-1 h-4 w-4 text-amber-500 fill-amber-500" />
      )}

      {/* Streak badge */}
      {streak > 0 && size !== 'sm' && (
        <Badge 
          variant="secondary" 
          className="absolute -bottom-2 text-[10px] px-1.5 py-0 bg-orange-100 text-orange-700"
        >
          🔥 {streak}j
        </Badge>
      )}
    </motion.div>
  );

  if (!showDetails) {
    return gaugeContent;
  }

  return (
    <TooltipProvider>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                {gaugeContent}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs p-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-medium">
                  <Heart className="h-4 w-4 text-primary" />
                  {coherenceLevel.label} - {score}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Phase: {currentPhase.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cliquez pour plus de détails
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4" align="center">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary animate-pulse" />
                <h4 className="font-semibold">Cohérence Cardiaque</h4>
              </div>
              <Badge className={coherenceLevel.badge}>
                {coherenceLevel.label}
              </Badge>
            </div>

            {/* Current score */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score actuel</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{score}%</span>
                  {trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                  {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                  {trend === 'stable' && <Minus className="h-4 w-4 text-slate-400" />}
                </div>
              </div>
              <Progress value={score} className="h-2" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary/5 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{personalBest}%</div>
                <div className="text-xs text-muted-foreground">Record</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{weeklyAverage}%</div>
                <div className="text-xs text-muted-foreground">Moy. 7j</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{totalSessions}</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
            </div>

            {/* Session info */}
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Phase actuelle</span>
                <Badge variant="outline" className={currentPhase.bgColor}>
                  {currentPhase.label}
                </Badge>
              </div>
              {sessionDuration > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Durée session</span>
                  <span className="font-medium">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              {streak > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Série en cours</span>
                  <span className="font-medium text-orange-600">🔥 {streak} jours</span>
                </div>
              )}
            </div>

            {/* Mini history */}
            {history.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Historique récent</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onHistoryClick}>
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
                        entry.coherence 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      )}
                      title={new Date(entry.date).toLocaleDateString()}
                    >
                      {entry.score}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="flex-1" onClick={toggleFavorite}>
                <Star className={cn('h-4 w-4 mr-1', isFavorite && 'fill-amber-500 text-amber-500')} />
                {isFavorite ? 'Favori' : 'Ajouter'}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Partager
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={handleExport}>
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

export default BreathGauge;
