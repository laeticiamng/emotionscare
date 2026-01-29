/**
 * ChallengeCard - Carte de défi Boss Grit
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Shield, Crown, Sword, Heart, Zap, Lock, Check, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'douce' | 'modérée' | 'épique' | 'boss';
  xp: number;
  duration: string;
  icon: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  theme?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (id: string) => void;
  onResume?: (id: string) => void;
  index?: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  target: Target,
  shield: Shield,
  crown: Crown,
  sword: Sword,
  heart: Heart,
  zap: Zap,
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'douce':
    case 'facile':
      return 'bg-success/10 text-success border-success/30';
    case 'modérée':
    case 'moyen':
      return 'bg-warning/10 text-warning border-warning/30';
    case 'épique':
    case 'difficile':
      return 'bg-info/10 text-info border-info/30';
    case 'boss':
      return 'bg-destructive/10 text-destructive border-destructive/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onStart,
  onResume,
  index = 0
}) => {
  const Icon = ICON_MAP[challenge.icon] || Target;
  const isLocked = challenge.status === 'locked';
  const isCompleted = challenge.status === 'completed';
  const isInProgress = challenge.status === 'in-progress';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
    >
      <Card className={`h-full transition-all duration-300 ${
        isLocked ? 'opacity-60 grayscale' : 
        isCompleted ? 'border-success/50 bg-success/5' :
        isInProgress ? 'border-info/50 bg-info/5 shadow-lg shadow-info/10' :
        'hover:shadow-lg hover:border-primary/30 cursor-pointer'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Icon className={`w-5 h-5 ${
                challenge.difficulty === 'boss' ? 'text-destructive' : 'text-primary'
              }`} />
            </div>
            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
          
          <CardTitle className="text-lg flex items-center gap-2">
            {challenge.title}
            {isInProgress && (
              <Zap className="w-4 h-4 text-info animate-pulse" />
            )}
            {isCompleted && (
              <Check className="w-4 h-4 text-success" />
            )}
            {isLocked && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {challenge.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              ⏱️ {challenge.duration}
            </span>
            <span className="flex items-center gap-1 font-semibold text-warning">
              ✨ {challenge.xp} XP
            </span>
          </div>
          
          <Button
            className="w-full gap-2"
            variant={isCompleted ? "outline" : isInProgress ? "secondary" : "default"}
            disabled={isLocked}
            onClick={() => {
              if (isInProgress && onResume) {
                onResume(challenge.id);
              } else if (!isLocked && !isCompleted) {
                onStart(challenge.id);
              }
            }}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4" />
                Terminé
              </>
            ) : isInProgress ? (
              <>
                <Play className="w-4 h-4" />
                Reprendre
              </>
            ) : isLocked ? (
              <>
                <Lock className="w-4 h-4" />
                Verrouillé
              </>
            ) : (
              <>
                <Sword className="w-4 h-4" />
                Commencer
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
