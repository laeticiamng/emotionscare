/**
 * ChallengeCardEnhanced - Carte de défi améliorée avec animations
 */

import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Clock, 
  CheckCircle, 
  Flame,
  Zap,
  Trophy,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Challenge } from '@/features/challenges';

interface ChallengeCardEnhancedProps {
  challenge: Challenge;
  onComplete?: () => void;
  onClaim?: () => void;
  className?: string;
}

const typeIcons = {
  daily: <Flame className="h-4 w-4 text-orange-500" />,
  weekly: <Star className="h-4 w-4 text-yellow-500" />,
  custom: <Zap className="h-4 w-4 text-purple-500" />
};

const typeColors = {
  daily: 'border-orange-500/30 bg-orange-500/5',
  weekly: 'border-yellow-500/30 bg-yellow-500/5',
  custom: 'border-purple-500/30 bg-purple-500/5'
};

const ChallengeCardEnhanced: React.FC<ChallengeCardEnhancedProps> = memo(({
  challenge,
  onComplete,
  onClaim,
  className
}) => {
  const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);
  const isComplete = challenge.completed || progressPercent >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        typeColors[challenge.type],
        isComplete && "border-green-500/50 bg-green-500/5",
        className
      )}>
        {/* Glow effect when complete */}
        {isComplete && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse" />
        )}

        <CardContent className="p-4 relative">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "p-2 rounded-lg",
              isComplete ? "bg-green-500/20" : "bg-muted"
            )}>
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                typeIcons[challenge.type]
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{challenge.title}</h4>
                <Badge variant="outline" className="text-xs capitalize">
                  {challenge.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {challenge.description}
              </p>

              {/* Progress */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
                <Progress 
                  value={progressPercent} 
                  className="h-2" 
                  aria-label={`${Math.round(progressPercent)}% complété`}
                />
              </div>

              {/* Reward & Expiry */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                  <span className="font-medium">+{challenge.xp_reward} XP</span>
                </div>
                
                {challenge.expires_at && !isComplete && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {new Date(challenge.expires_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {isComplete && !challenge.completed ? (
                <Button 
                  size="sm" 
                  onClick={onClaim}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Réclamer
                </Button>
              ) : isComplete ? (
                <Badge className="bg-green-500/20 text-green-500">
                  Terminé
                </Badge>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onComplete}
                >
                  <Target className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ChallengeCardEnhanced.displayName = 'ChallengeCardEnhanced';

export default ChallengeCardEnhanced;
