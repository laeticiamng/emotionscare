// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { HeartHandshake, TrendingUp, TrendingDown, Minus, Info, Sparkles, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmotionalBalanceIndicatorProps {
  emotionalBalance: number;
  previousBalance?: number;
  showHistory?: boolean;
  history?: number[];
  onImprove?: () => void;
}

const EmotionalBalanceIndicator: React.FC<EmotionalBalanceIndicatorProps> = ({ 
  emotionalBalance,
  previousBalance,
  showHistory = false,
  history = [],
  onImprove
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [showTip, setShowTip] = useState(false);

  // Animation de la valeur
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = emotionalBalance / steps;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setAnimatedValue(Math.min(Math.round(stepValue * current), emotionalBalance));
      if (current >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [emotionalBalance]);

  // Déterminer la couleur basée sur la valeur
  const getBalanceColor = (value: number): string => {
    if (value < 30) return 'bg-red-500';
    if (value < 50) return 'bg-orange-500';
    if (value < 70) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getBalanceGradient = (value: number): string => {
    if (value < 30) return 'from-red-500 to-red-600';
    if (value < 50) return 'from-orange-400 to-orange-500';
    if (value < 70) return 'from-blue-400 to-blue-500';
    return 'from-green-400 to-emerald-500';
  };
  
  // Déterminer le statut émotionnel
  const getBalanceStatus = (value: number): { label: string; emoji: string; tip: string } => {
    if (value < 30) return { 
      label: 'Déséquilibre négatif', 
      emoji: '😔',
      tip: 'Prends un moment pour respirer. Une session de respiration guidée pourrait t\'aider.'
    };
    if (value < 50) return { 
      label: 'Légèrement négatif', 
      emoji: '😐',
      tip: 'Tu traverses une phase difficile. Note tes émotions dans le journal.'
    };
    if (value < 70) return { 
      label: 'Légèrement positif', 
      emoji: '🙂',
      tip: 'Tu es sur la bonne voie ! Continue tes bonnes habitudes.'
    };
    return { 
      label: 'Équilibre positif', 
      emoji: '😊',
      tip: 'Excellent équilibre ! Maintiens cette dynamique positive.'
    };
  };

  const getTrend = () => {
    if (previousBalance === undefined) return null;
    const diff = emotionalBalance - previousBalance;
    if (diff > 5) return { icon: TrendingUp, color: 'text-green-500', label: `+${diff}%` };
    if (diff < -5) return { icon: TrendingDown, color: 'text-red-500', label: `${diff}%` };
    return { icon: Minus, color: 'text-muted-foreground', label: 'Stable' };
  };

  const status = getBalanceStatus(emotionalBalance);
  const trend = getTrend();

  // Mini graphique d'historique
  const HistoryChart = () => {
    if (!history.length) return null;
    const max = Math.max(...history, 100);
    
    return (
      <div className="flex items-end gap-0.5 h-8">
        {history.slice(-7).map((value, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-2 rounded-t",
              getBalanceColor(value)
            )}
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {/* Header avec statut et trend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <HeartHandshake className="h-4 w-4 text-purple-500" />
          </motion.div>
          <span className="text-sm font-medium">Équilibre émotionnel</span>
          <Popover open={showTip} onOpenChange={setShowTip}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Info className="h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Conseil du jour
                </p>
                <p className="text-xs text-muted-foreground">{status.tip}</p>
                {onImprove && (
                  <Button size="sm" className="w-full mt-2" onClick={onImprove}>
                    <Target className="h-3 w-3 mr-2" />
                    Améliorer mon équilibre
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <trend.icon className={cn("h-3 w-3", trend.color)} />
                    <span className={cn("text-xs", trend.color)}>{trend.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Évolution depuis hier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span>{status.emoji}</span>
            {status.label}
          </span>
        </div>
      </div>

      {/* Barre de progression animée */}
      <div className="relative">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", getBalanceGradient(emotionalBalance))}
            initial={{ width: 0 }}
            animate={{ width: `${animatedValue}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Marqueur de position */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-purple-500 shadow-md"
          initial={{ left: '0%' }}
          animate={{ left: `calc(${animatedValue}% - 8px)` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Zones de référence */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-[30%] border-r border-dashed border-muted-foreground/30" />
          <div className="w-[20%] border-r border-dashed border-muted-foreground/30" />
          <div className="w-[20%] border-r border-dashed border-muted-foreground/30" />
          <div className="w-[30%]" />
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Négatif</span>
        <span className="font-medium text-foreground">{animatedValue}%</span>
        <span>Positif</span>
      </div>

      {/* Historique */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-border"
          >
            <p className="text-xs text-muted-foreground mb-2">7 derniers jours</p>
            <HistoryChart />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmotionalBalanceIndicator;
