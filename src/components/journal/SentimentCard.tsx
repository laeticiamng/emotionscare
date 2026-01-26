// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Zap, TrendingUp, TrendingDown, Minus, Share2, History, ChevronDown, Sparkles, Heart, Copy, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MoodBucket } from '@/store/journal.store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SentimentCardProps {
  moodBucket: MoodBucket;
  summary: string;
  className?: string;
  showTrend?: boolean;
  previousMood?: MoodBucket;
  emotions?: { name: string; intensity: number }[];
  timestamp?: Date;
  onShare?: () => void;
}

interface MoodHistory {
  mood: MoodBucket;
  timestamp: Date;
}

const STORAGE_KEY = 'sentiment-card-history';

const moodConfig = {
  clear: {
    icon: Sun,
    label: 'Lucide',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    badgeVariant: 'default' as const,
    gradient: 'from-green-500/20 to-emerald-500/20',
    score: 85,
    advice: 'Excellent état émotionnel ! Continuez vos bonnes pratiques.',
  },
  mixed: {
    icon: CloudSun,
    label: 'Nuancé', 
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    badgeVariant: 'secondary' as const,
    gradient: 'from-yellow-500/20 to-amber-500/20',
    score: 55,
    advice: 'État émotionnel variable. Prenez un moment pour vous recentrer.',
  },
  pressured: {
    icon: Zap,
    label: 'Sous pression',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    badgeVariant: 'destructive' as const,
    gradient: 'from-red-500/20 to-orange-500/20',
    score: 25,
    advice: 'Vous semblez stressé. Une pause ou un exercice de respiration pourrait aider.',
  },
};

const moodOrder: MoodBucket[] = ['pressured', 'mixed', 'clear'];

export const SentimentCard: React.FC<SentimentCardProps> = ({
  moodBucket,
  summary,
  className,
  showTrend = true,
  previousMood,
  emotions = [],
  timestamp = new Date(),
  onShare,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodHistory[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  const config = moodConfig[moodBucket];
  const Icon = config.icon;

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
  }, []);

  // Save to history
  useEffect(() => {
    const newEntry = { mood: moodBucket, timestamp };
    setMoodHistory(prev => {
      const updated = [newEntry, ...prev.slice(0, 29)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    
    // Trigger animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  }, [moodBucket, timestamp]);

  // Calculate trend
  const getTrend = () => {
    if (previousMood) {
      const currentIndex = moodOrder.indexOf(moodBucket);
      const previousIndex = moodOrder.indexOf(previousMood);
      if (currentIndex > previousIndex) return 'up';
      if (currentIndex < previousIndex) return 'down';
    }
    return 'stable';
  };

  const trend = getTrend();
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
  const trendLabel = trend === 'up' ? 'En amélioration' : trend === 'down' ? 'En baisse' : 'Stable';

  // Calculate mood distribution
  const moodDistribution = moodHistory.reduce((acc, h) => {
    acc[h.mood] = (acc[h.mood] || 0) + 1;
    return acc;
  }, {} as Record<MoodBucket, number>);

  const handleShare = async () => {
    const shareText = `Mon état émotionnel: ${config.label}\n${summary}\n\n#EmotionsCare #BienÊtre`;
    
    if (navigator.share) {
      await navigator.share({
        title: 'Mon état émotionnel',
        text: shareText,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copié dans le presse-papier');
    }
    onShare?.();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    toast.success('Résumé copié');
  };

  const handleExport = () => {
    const data = {
      mood: moodBucket,
      label: config.label,
      summary,
      score: config.score,
      emotions,
      timestamp: timestamp.toISOString(),
      history: moodHistory.slice(0, 10),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Export téléchargé');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className={cn(config.bgColor, 'border-2 overflow-hidden', className)}
        role="status"
        aria-live="polite"
      >
        {/* Animated background */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className={cn('absolute inset-0 bg-gradient-to-br', config.gradient)}
            />
          )}
        </AnimatePresence>

        <CardContent className="pt-6 relative">
          <div className="flex items-start gap-4">
            {/* Icon with pulse animation */}
            <motion.div 
              className={cn("p-3 rounded-xl bg-white dark:bg-background shadow-lg", config.color)}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </motion.div>
            
            <div className="flex-1 space-y-3">
              {/* Header with badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={config.badgeVariant} className="text-sm">
                    {config.label}
                  </Badge>
                  {showTrend && (
                    <Badge variant="outline" className={cn('gap-1', trendColor)}>
                      <TrendIcon className="h-3 w-3" />
                      {trendLabel}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Score indicator */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Score bien-être</span>
                  <span className="text-lg font-bold">{config.score}/100</span>
                </div>
                <Progress 
                  value={config.score} 
                  className="h-2"
                />
              </div>
              
              {/* Summary */}
              <p className="text-sm text-foreground/80 leading-relaxed">
                {summary}
              </p>

              {/* Emotions breakdown */}
              {emotions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="text-xs"
                      style={{ opacity: 0.5 + (emotion.intensity / 200) }}
                    >
                      {emotion.name} ({emotion.intensity}%)
                    </Badge>
                  ))}
                </div>
              )}

              {/* Advice */}
              <div className="p-3 bg-background/50 dark:bg-background/20 rounded-lg border">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">{config.advice}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expandable section */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full mt-4 gap-2">
                <History className="h-4 w-4" />
                Voir l'historique
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-4"
              >
                {/* Mood distribution */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Distribution des humeurs</h4>
                  {Object.entries(moodDistribution).map(([mood, count]) => {
                    const moodData = moodConfig[mood as MoodBucket];
                    const percentage = moodHistory.length > 0 
                      ? (count / moodHistory.length) * 100 
                      : 0;
                    return (
                      <div key={mood} className="flex items-center gap-2">
                        <moodData.icon className={cn('h-4 w-4', moodData.color)} />
                        <span className="text-xs w-20">{moodData.label}</span>
                        <Progress value={percentage} className="flex-1 h-1.5" />
                        <span className="text-xs text-muted-foreground w-10">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Recent history */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Historique récent</h4>
                  <div className="flex gap-1">
                    {moodHistory.slice(0, 7).map((entry, i) => {
                      const entryConfig = moodConfig[entry.mood];
                      return (
                        <div
                          key={i}
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            entryConfig.bgColor
                          )}
                          title={new Date(entry.timestamp).toLocaleDateString()}
                        >
                          <entryConfig.icon className={cn('h-4 w-4', entryConfig.color)} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                    Copier
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Exporter
                  </Button>
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Timestamp */}
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Analysé le {timestamp.toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
