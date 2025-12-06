// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Target, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ExperienceIndicatorProps {
  currentXP: number;
  currentLevel: number;
  nextLevelXP: number;
  title?: string;
  compact?: boolean;
}

const ExperienceIndicator: React.FC<ExperienceIndicatorProps> = ({
  currentXP,
  currentLevel,
  nextLevelXP,
  title,
  compact = false
}) => {
  const progressPercent = (currentXP / nextLevelXP) * 100;
  const remainingXP = nextLevelXP - currentXP;

  const getLevelIcon = () => {
    if (currentLevel >= 20) return <Trophy className="w-4 h-4" />;
    if (currentLevel >= 15) return <Award className="w-4 h-4" />;
    if (currentLevel >= 10) return <Target className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getLevelColor = () => {
    if (currentLevel >= 20) return 'from-yellow-400 to-orange-500';
    if (currentLevel >= 15) return 'from-purple-400 to-pink-500';
    if (currentLevel >= 10) return 'from-blue-400 to-indigo-500';
    return 'from-green-400 to-emerald-500';
  };

  const getLevelTitle = () => {
    if (currentLevel >= 25) return 'Maître Émotionnel';
    if (currentLevel >= 20) return 'Expert Bien-être';
    if (currentLevel >= 15) return 'Mentor Émotionnel';
    if (currentLevel >= 10) return 'Pratiquant Avancé';
    if (currentLevel >= 5) return 'Explorateur';
    return 'Débutant';
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`p-2 rounded-lg bg-gradient-to-r ${getLevelColor()} text-white shadow-lg`}
        >
          {getLevelIcon()}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs font-bold">
              Niv. {currentLevel}
            </Badge>
            <span className="text-sm font-medium text-yellow-600">
              {currentXP.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full mt-1">
            <Progress value={progressPercent} className="h-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-4 border shadow-lg"
    >
      {title && (
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-xl bg-gradient-to-r ${getLevelColor()} text-white shadow-lg`}
          >
            {getLevelIcon()}
          </motion.div>
          <div>
            <h4 className="text-xl font-bold">Niveau {currentLevel}</h4>
            <p className="text-sm text-muted-foreground">{getLevelTitle()}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1 text-yellow-600">
            <Star className="w-4 h-4" />
            <span className="text-lg font-bold">{currentXP.toLocaleString()}</span>
            <span className="text-sm">XP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {remainingXP.toLocaleString()} pour niveau suivant
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progression vers niveau {currentLevel + 1}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="relative">
          <Progress value={progressPercent} className="h-3" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent h-3 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-accent/50 rounded-lg"
      >
        <p className="text-xs text-muted-foreground text-center">
          💡 Continuez vos sessions quotidiennes pour débloquer des récompenses exclusives !
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ExperienceIndicator;