// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Target, Zap, Trophy, Calendar, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface StatCardData {
  current: number;
  previous: number;
  label: string;
  unit: string;
}

interface GamificationStatsCardsProps {
  streakDays: number;
  totalScans: number;
  weeklyGoal?: number;
  energyPoints?: number;
  previousStreakDays?: number;
  previousTotalScans?: number;
}

const GamificationStatsCards: React.FC<GamificationStatsCardsProps> = ({ 
  streakDays, 
  totalScans,
  weeklyGoal = 7,
  energyPoints = 0,
  previousStreakDays = 0,
  previousTotalScans = 0
}) => {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [animatedScans, setAnimatedScans] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animation des compteurs
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const streakStep = streakDays / steps;
    const scansStep = totalScans / steps;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setAnimatedStreak(Math.min(Math.round(streakStep * current), streakDays));
      setAnimatedScans(Math.min(Math.round(scansStep * current), totalScans));
      if (current >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [streakDays, totalScans]);

  // Célébration pour les milestones
  useEffect(() => {
    if (streakDays > 0 && streakDays % 7 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [streakDays]);

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: ChevronUp, color: 'text-green-500', label: 'En hausse' };
    if (current < previous) return { icon: ChevronDown, color: 'text-red-500', label: 'En baisse' };
    return { icon: Minus, color: 'text-muted-foreground', label: 'Stable' };
  };

  const getStreakLevel = (days: number) => {
    if (days >= 30) return { level: 'Légendaire', color: 'from-amber-400 to-orange-500', icon: Trophy };
    if (days >= 14) return { level: 'Expert', color: 'from-purple-400 to-pink-500', icon: Zap };
    if (days >= 7) return { level: 'Régulier', color: 'from-blue-400 to-cyan-500', icon: Target };
    return { level: 'Débutant', color: 'from-green-400 to-emerald-500', icon: Flame };
  };

  const streakTrend = getTrend(streakDays, previousStreakDays);
  const scansTrend = getTrend(totalScans, previousTotalScans);
  const streakLevel = getStreakLevel(streakDays);
  const weekProgress = Math.min((streakDays % 7) / weeklyGoal * 100, 100);

  const StatCard = ({ 
    icon: Icon, 
    iconColor, 
    label, 
    value, 
    unit, 
    trend, 
    extra,
    gradient 
  }: { 
    icon: React.ElementType; 
    iconColor: string; 
    label: string; 
    value: number; 
    unit: string; 
    trend: { icon: React.ElementType; color: string; label: string };
    extra?: React.ReactNode;
    gradient?: string;
  }) => {
    const TrendIcon = trend.icon;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className={cn(
                "relative overflow-hidden p-3 rounded-lg transition-all cursor-pointer",
                gradient ? `bg-gradient-to-br ${gradient}` : "bg-muted/30 hover:bg-muted/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {gradient && (
                <div className="absolute inset-0 bg-black/10" />
              )}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-medium", gradient && "text-white")}>{label}</span>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={cn("h-3 w-3", trend.color)} />
                    <Icon className={cn("h-4 w-4", gradient ? "text-white" : iconColor)} />
                  </div>
                </div>
                <div className="mt-1">
                  <motion.span 
                    className={cn("text-2xl font-bold", gradient && "text-white")}
                    key={value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {value}
                  </motion.span>
                  <span className={cn("text-xs ml-1", gradient ? "text-white/80" : "text-muted-foreground")}>
                    {unit}
                  </span>
                </div>
                {extra}
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{trend.label} par rapport à hier</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-3">
      {/* Célébration milestone */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-3 text-center"
          >
            <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <p className="text-sm font-medium">🎉 Félicitations ! {streakDays} jours de série !</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats principales */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={streakLevel.icon}
          iconColor="text-orange-500"
          label="Séries"
          value={animatedStreak}
          unit="jours"
          trend={streakTrend}
          gradient={streakDays >= 7 ? streakLevel.color : undefined}
          extra={
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={streakDays >= 7 ? "text-white/80" : "text-muted-foreground"}>
                  {streakLevel.level}
                </span>
                <span className={streakDays >= 7 ? "text-white/80" : "text-muted-foreground"}>
                  {Math.round(weekProgress)}%
                </span>
              </div>
              <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${weekProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          }
        />
        
        <StatCard
          icon={TrendingUp}
          iconColor="text-blue-500"
          label="Scans"
          value={animatedScans}
          unit="total"
          trend={scansTrend}
          extra={
            <div className="mt-2 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                ~{Math.round(totalScans / Math.max(streakDays, 1))}/jour
              </span>
            </div>
          }
        />
      </div>

      {/* Barre d'énergie bonus */}
      {energyPoints > 0 && (
        <motion.div 
          className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg p-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium">Énergie bonus</span>
            </div>
            <span className="text-sm font-bold text-yellow-600">{energyPoints} pts</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GamificationStatsCards;
