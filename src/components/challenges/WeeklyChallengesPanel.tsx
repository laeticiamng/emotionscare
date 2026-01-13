/**
 * WeeklyChallengesPanel - Panneau des défis hebdomadaires
 * TOP 20 #5 - Composant pour les weekly_challenges
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Clock, Gift, CheckCircle2, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_value: number;
  xp_reward: number;
  badge_reward: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface UserProgress {
  challenge_id: string;
  current_value: number;
  completed: boolean;
  completed_at: string | null;
}

interface WeeklyChallengesPanelProps {
  challenges: WeeklyChallenge[];
  userProgress: Map<string, UserProgress>;
  isLoading: boolean;
  onClaimReward: (challengeId: string) => Promise<void>;
}

const ChallengeTypeIcon: Record<string, React.ReactNode> = {
  sessions: <Target className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />,
  xp: <Trophy className="w-5 h-5" />,
  time: <Clock className="w-5 h-5" />
};

const ChallengeCard = memo(({ 
  challenge, 
  progress,
  onClaim
}: { 
  challenge: WeeklyChallenge;
  progress?: UserProgress;
  onClaim: () => void;
}) => {
  const currentValue = progress?.current_value || 0;
  const progressPercent = Math.min((currentValue / challenge.target_value) * 100, 100);
  const isCompleted = progress?.completed || false;
  const endsAt = new Date(challenge.ends_at);
  const timeRemaining = endsAt.getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all",
        isCompleted && "bg-green-500/5 border-green-500/50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "p-3 rounded-lg",
              isCompleted ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
            )}>
              {ChallengeTypeIcon[challenge.challenge_type] || <Target className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{challenge.title}</h4>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {challenge.description}
              </p>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">
                    {currentValue} / {challenge.target_value}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {/* Time remaining */}
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {daysRemaining}j restants
                  </Badge>
                  
                  {/* Rewards */}
                  <Badge className="bg-yellow-500/20 text-yellow-500 text-xs">
                    <Gift className="w-3 h-3 mr-1" />
                    {challenge.xp_reward} XP
                  </Badge>
                  
                  {challenge.badge_reward && (
                    <Badge variant="secondary" className="text-xs">
                      🏅 Badge
                    </Badge>
                  )}
                </div>

                {isCompleted && !progress?.completed_at && (
                  <Button size="sm" onClick={onClaim}>
                    Réclamer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

export const WeeklyChallengesPanel = memo(({
  challenges,
  userProgress,
  isLoading,
  onClaimReward
}: WeeklyChallengesPanelProps) => {
  const activeChallenges = challenges.filter(c => c.is_active);
  const completedCount = activeChallenges.filter(c => 
    userProgress.get(c.id)?.completed
  ).length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Défis de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Défis de la semaine
          </CardTitle>
          <Badge variant="secondary">
            {completedCount}/{activeChallenges.length} complétés
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeChallenges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun défi actif cette semaine</p>
            <p className="text-sm">Revenez bientôt !</p>
          </div>
        ) : (
          activeChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              progress={userProgress.get(challenge.id)}
              onClaim={() => onClaimReward(challenge.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
});

WeeklyChallengesPanel.displayName = 'WeeklyChallengesPanel';

export default WeeklyChallengesPanel;
