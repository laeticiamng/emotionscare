/**
 * XP PROGRESS WIDGET - EMOTIONSCARE
 * Affiche la progression XP, le niveau et le streak de l'utilisateur
 * Gamification visible pour encourager l'engagement
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Star,
  TrendingUp
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface XPProgressWidgetProps {
  totalPoints: number;
  level: number;
  streakDays: number;
  rank: string;
  loading?: boolean;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 20000];
const RANK_COLORS: Record<string, string> = {
  bronze: 'bg-amber-700/10 text-amber-700 border-amber-700/30',
  silver: 'bg-slate-400/10 text-slate-500 border-slate-400/30',
  gold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  platinum: 'bg-cyan-400/10 text-cyan-500 border-cyan-400/30',
  diamond: 'bg-purple-400/10 text-purple-500 border-purple-400/30',
  legend: 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-purple-600 border-purple-500/30',
};

const XPProgressWidget: React.FC<XPProgressWidgetProps> = ({
  totalPoints,
  level,
  streakDays,
  rank,
  loading = false,
}) => {
  // Calculer la progression vers le niveau suivant
  const currentThreshold = LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] || currentThreshold + 500;
  const pointsInLevel = totalPoints - currentThreshold;
  const pointsNeeded = nextThreshold - currentThreshold;
  const progressPercent = Math.min((pointsInLevel / pointsNeeded) * 100, 100);
  
  const rankColor = RANK_COLORS[rank.toLowerCase()] || RANK_COLORS.bronze;

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Effet de brillance pour niveau élevé */}
      {level >= 5 && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" aria-hidden="true" />
            Progression
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={`${rankColor} cursor-help`}>
                  <Trophy className="w-3 h-3 mr-1" aria-hidden="true" />
                  {rank}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Votre rang actuel basé sur votre progression</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Niveau et XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center"
              >
                <span className="text-lg font-bold text-white">{level}</span>
              </motion.div>
              <div>
                <p className="text-sm font-medium">Niveau {level}</p>
                <p className="text-xs text-muted-foreground">
                  {totalPoints.toLocaleString('fr-FR')} XP total
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-accent">
                +{pointsInLevel} XP
              </p>
              <p className="text-xs text-muted-foreground">
                /{pointsNeeded} pour niveau {level + 1}
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="relative">
            <Progress value={progressPercent} className="h-3" />
            <AnimatePresence>
              {progressPercent >= 80 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -right-1 -top-1"
                >
                  <Star className="w-4 h-4 text-warning fill-warning" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          {/* Streak */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-help">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    streakDays >= 7 ? 'bg-warning/20' : 'bg-muted'
                  }`}>
                    <Flame className={`w-4 h-4 ${
                      streakDays >= 7 ? 'text-warning' : 'text-muted-foreground'
                    }`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{streakDays}</p>
                    <p className="text-xs text-muted-foreground">jours</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Série de {streakDays} jour{streakDays > 1 ? 's' : ''} consécutif{streakDays > 1 ? 's' : ''}</p>
                {streakDays >= 7 && <p className="text-warning">🔥 Bonus streak actif !</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Prochaine récompense */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-help">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{Math.round(progressPercent)}%</p>
                    <p className="text-xs text-muted-foreground">prochain</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Progression vers le niveau {level + 1}</p>
                <p className="text-muted-foreground">{pointsNeeded - pointsInLevel} XP restants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Message motivationnel */}
        {streakDays === 0 && (
          <p className="text-xs text-center text-muted-foreground pt-2 border-t">
            Commencez une activité pour démarrer votre série ! 🚀
          </p>
        )}
        {streakDays >= 7 && (
          <p className="text-xs text-center text-warning pt-2 border-t font-medium">
            🔥 Incroyable ! {streakDays} jours de suite - continuez ainsi !
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default XPProgressWidget;
