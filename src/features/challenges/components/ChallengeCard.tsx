/**
 * ChallengeCard - Carte d'affichage d'un défi
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Zap, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'custom';
  category: string;
  xpReward: number;
  target: number;
  progress: number;
  completed: boolean;
  expiresAt?: string;
  icon?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: () => void;
  onClaim?: () => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  breath: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  meditation: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  journal: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  scan: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
  social: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
};

const typeLabels: Record<string, string> = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  custom: 'Personnalisé'
};

export const ChallengeCard = memo(function ChallengeCard({
  challenge,
  onStart,
  onClaim,
  className
}: ChallengeCardProps) {
  const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);
  const isClaimable = challenge.completed && onClaim;
  const timeRemaining = challenge.expiresAt 
    ? getTimeRemaining(new Date(challenge.expiresAt))
    : null;

  return (
    <Card 
      className={cn(
        'transition-all hover:shadow-md',
        challenge.completed && 'border-green-500/50 bg-green-50/30 dark:bg-green-950/10',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span 
              className="text-2xl"
              role="img"
              aria-label={`Icône ${challenge.category}`}
            >
              {challenge.icon || getCategoryIcon(challenge.category)}
            </span>
            <div>
              <CardTitle className="text-base">{challenge.title}</CardTitle>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {challenge.description}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge 
              variant="outline"
              className={categoryColors[challenge.category] || categoryColors.default}
            >
              {typeLabels[challenge.type]}
            </Badge>
            {challenge.completed && (
              <CheckCircle2 
                className="w-5 h-5 text-green-500" 
                aria-label="Défi complété"
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">
              {challenge.progress}/{challenge.target}
            </span>
          </div>
          <Progress 
            value={progressPercent} 
            className={cn('h-2', challenge.completed && 'bg-green-100')}
            aria-label={`Progression: ${challenge.progress} sur ${challenge.target}`}
          />
        </div>

        {/* Footer avec récompense et actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {/* Récompense XP */}
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              <span className="font-medium text-foreground">
                {challenge.xpReward} XP
              </span>
            </div>

            {/* Temps restant */}
            {timeRemaining && !challenge.completed && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{timeRemaining}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            {isClaimable ? (
              <Button 
                size="sm" 
                onClick={onClaim}
                className="bg-green-500 hover:bg-green-600"
                aria-label={`Réclamer ${challenge.xpReward} XP`}
              >
                <Trophy className="w-4 h-4 mr-1" aria-hidden="true" />
                Réclamer
              </Button>
            ) : !challenge.completed && challenge.progress === 0 && onStart ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={onStart}
                aria-label={`Commencer le défi ${challenge.title}`}
              >
                <Target className="w-4 h-4 mr-1" aria-hidden="true" />
                Commencer
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    breath: '🌬️',
    meditation: '🧘',
    journal: '📓',
    scan: '💖',
    social: '🤝',
    music: '🎵',
    vr: '🌌'
  };
  return icons[category] || '🎯';
}

function getTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expiré';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}j restants`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default ChallengeCard;
