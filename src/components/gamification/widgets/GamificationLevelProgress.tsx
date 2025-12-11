// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Crown, Gem, Sparkles } from 'lucide-react';

interface GamificationLevelProgressProps {
  level: number;
  points: number;
  nextMilestone: number;
  progressToNextLevel: number;
}

interface LevelMilestone {
  level: number;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 1, name: 'Débutant', icon: <Star className="w-4 h-4" />, color: 'text-emerald-500' },
  { level: 5, name: 'Explorateur', icon: <Zap className="w-4 h-4" />, color: 'text-blue-500' },
  { level: 10, name: 'Aventurier', icon: <Sparkles className="w-4 h-4" />, color: 'text-purple-500' },
  { level: 20, name: 'Expert', icon: <Gem className="w-4 h-4" />, color: 'text-pink-500' },
  { level: 50, name: 'Maître', icon: <Crown className="w-4 h-4" />, color: 'text-amber-500' },
];

const GamificationLevelProgress: React.FC<GamificationLevelProgressProps> = ({
  level,
  points,
  nextMilestone,
  progressToNextLevel
}) => {
  const [displayedPoints, setDisplayedPoints] = useState(points);
  const [showXpGain, setShowXpGain] = useState(false);
  const [xpGain, setXpGain] = useState(0);

  // Animate points change
  useEffect(() => {
    if (points !== displayedPoints) {
      const diff = points - displayedPoints;
      if (diff > 0) {
        setXpGain(diff);
        setShowXpGain(true);
        setTimeout(() => setShowXpGain(false), 2000);
      }
      
      // Smooth counter animation
      const steps = 20;
      const increment = diff / steps;
      let current = displayedPoints;
      const interval = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= points) || (increment < 0 && current <= points)) {
          setDisplayedPoints(points);
          clearInterval(interval);
        } else {
          setDisplayedPoints(Math.round(current));
        }
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [points, displayedPoints]);

  // Get level info
  const getLevelInfo = (level: number) => {
    const milestone = [...LEVEL_MILESTONES].reverse().find(m => level >= m.level);
    return milestone || LEVEL_MILESTONES[0];
  };

  const getCurrentMilestone = () => getLevelInfo(level);
  const getNextMilestone = () => {
    const next = LEVEL_MILESTONES.find(m => m.level > level);
    return next || LEVEL_MILESTONES[LEVEL_MILESTONES.length - 1];
  };

  const currentMilestone = getCurrentMilestone();
  const nextLevelMilestone = getNextMilestone();

  // Get level color for progress bar
  const getLevelColor = (level: number): string => {
    if (level < 5) return 'bg-emerald-500';
    if (level < 10) return 'bg-blue-500';
    if (level < 20) return 'bg-purple-500';
    if (level < 50) return 'bg-pink-500';
    return 'bg-amber-500';
  };

  const getLevelGradient = (level: number): string => {
    if (level < 5) return 'from-emerald-400 to-emerald-600';
    if (level < 10) return 'from-blue-400 to-blue-600';
    if (level < 20) return 'from-purple-400 to-purple-600';
    if (level < 50) return 'from-pink-400 to-pink-600';
    return 'from-amber-400 to-amber-600';
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Level Badge & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${getLevelGradient(level)} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl font-bold text-white">{level}</span>
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${currentMilestone.color}`}>
                  {currentMilestone.name}
                </span>
                <span className={currentMilestone.color}>{currentMilestone.icon}</span>
              </div>
              <p className="text-xs text-muted-foreground">Niveau {level}</p>
            </div>
          </div>

          {/* XP Counter with animation */}
          <div className="relative">
            <motion.div 
              className="text-right"
              animate={showXpGain ? { scale: [1, 1.1, 1] } : {}}
            >
              <p className="text-2xl font-bold tabular-nums">{displayedPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">XP total</p>
            </motion.div>
            
            <AnimatePresence>
              {showXpGain && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0, y: -40 }}
                  className="absolute -top-2 right-0 text-green-500 font-bold text-sm"
                >
                  +{xpGain} XP
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Niveau {level}</span>
            <span>Niveau {level + 1}</span>
          </div>
          
          <div className="relative">
            <Progress 
              value={progressToNextLevel} 
              className={`h-3 ${getLevelColor(level)}`} 
            />
            
            {/* Milestone markers on progress bar */}
            <div className="absolute inset-0 flex items-center justify-between px-1">
              {[25, 50, 75].map((marker) => (
                <Tooltip key={marker}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        progressToNextLevel >= marker 
                          ? 'bg-white' 
                          : 'bg-white/30'
                      }`}
                      style={{ marginLeft: `${marker - 2}%` }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{marker}% complété</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {nextMilestone - points} XP restants
            </p>
            <p className="text-xs font-medium">
              {Math.round(progressToNextLevel)}%
            </p>
          </div>
        </div>

        {/* Next Rank Preview */}
        {nextLevelMilestone.level > level && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-help">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${nextLevelMilestone.color}`}>
                  {nextLevelMilestone.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Prochain rang</p>
                  <p className="text-sm font-medium">{nextLevelMilestone.name}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Niv. {nextLevelMilestone.level}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Atteins le niveau {nextLevelMilestone.level} pour débloquer ce rang !
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Milestone Progress */}
        <div className="flex gap-1">
          {LEVEL_MILESTONES.map((milestone, index) => (
            <Tooltip key={milestone.level}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    level >= milestone.level 
                      ? getLevelColor(milestone.level)
                      : 'bg-muted'
                  }`}
                  whileHover={{ scale: 1.1 }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-2">
                  <span className={milestone.color}>{milestone.icon}</span>
                  <span>{milestone.name} (Niv. {milestone.level})</span>
                  {level >= milestone.level && (
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GamificationLevelProgress;
