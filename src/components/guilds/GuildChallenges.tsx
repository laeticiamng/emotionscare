/**
 * GuildChallenges - Défis collaboratifs de guilde
 * Permet aux membres de participer ensemble
 */

import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Users, Clock, Zap, CheckCircle2, 
  ChevronRight, Trophy, Flame, Gift 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface GuildChallenge {
  id: string;
  guild_id: string;
  title: string;
  description: string;
  challenge_type: 'collective' | 'competitive' | 'relay';
  target_value: number;
  current_value: number;
  xp_reward: number;
  bonus_reward?: string;
  status: 'active' | 'completed' | 'failed' | 'upcoming';
  starts_at: string;
  ends_at: string;
  participants: {
    user_id: string;
    display_name: string;
    avatar: string;
    contribution: number;
  }[];
}

interface GuildChallengesProps {
  challenges: GuildChallenge[];
  guildId: string;
  canContribute?: boolean;
  onContribute?: (challengeId: string) => void;
  isLoading?: boolean;
}

const ChallengeTypeIcon = ({ type }: { type: GuildChallenge['challenge_type'] }) => {
  switch (type) {
    case 'collective':
      return <Users className="w-4 h-4" />;
    case 'competitive':
      return <Flame className="w-4 h-4" />;
    case 'relay':
      return <Zap className="w-4 h-4" />;
  }
};

const getTimeRemaining = (endsAt: string): string => {
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return 'Terminé';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}j restants`;
  return `${hours}h restantes`;
};

const ChallengeCard = memo(({
  challenge,
  canContribute,
  onContribute
}: {
  challenge: GuildChallenge;
  canContribute: boolean;
  onContribute?: (id: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = (challenge.current_value / challenge.target_value) * 100;
  const isCompleted = challenge.status === 'completed';
  const isActive = challenge.status === 'active';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className={cn(
        "overflow-hidden transition-colors",
        isCompleted && "bg-green-500/10 border-green-500/30",
        challenge.status === 'failed' && "bg-red-500/10 border-red-500/30 opacity-60"
      )}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isCompleted ? "bg-green-500/20" : "bg-primary/20"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Target className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-semibold">{challenge.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChallengeTypeIcon type={challenge.challenge_type} />
                  <span className="capitalize">{challenge.challenge_type}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Badge 
                variant={isActive ? "default" : "secondary"}
                className={cn(
                  isCompleted && "bg-green-500"
                )}
              >
                {isCompleted ? 'Terminé ✓' : getTimeRemaining(challenge.ends_at)}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {challenge.description}
          </p>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span className="font-medium">
                {challenge.current_value.toLocaleString()} / {challenge.target_value.toLocaleString()}
              </span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-3" />
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>{challenge.xp_reward.toLocaleString()} XP</span>
            </div>
            {challenge.bonus_reward && (
              <div className="flex items-center gap-1.5 text-sm">
                <Gift className="w-4 h-4 text-purple-500" />
                <span>{challenge.bonus_reward}</span>
              </div>
            )}
          </div>

          {/* Contributors preview */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {challenge.participants.slice(0, 5).map((p, i) => (
                  <div
                    key={p.user_id}
                    className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs"
                  >
                    {p.avatar}
                  </div>
                ))}
              </div>
              <span>{challenge.participants.length} contributeurs</span>
            </div>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              isExpanded && "rotate-90"
            )} />
          </button>

          {/* Expanded contributors */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t space-y-2">
                  {challenge.participants
                    .sort((a, b) => b.contribution - a.contribution)
                    .slice(0, 10)
                    .map((p, i) => (
                      <div key={p.user_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-4">
                            {i + 1}.
                          </span>
                          <span className="text-lg">{p.avatar}</span>
                          <span className="text-sm">{p.display_name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          +{p.contribution.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action button */}
          {isActive && canContribute && (
            <Button
              className="w-full mt-4"
              onClick={() => onContribute?.(challenge.id)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Contribuer
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

export const GuildChallenges = memo(({
  challenges,
  guildId,
  canContribute = true,
  onContribute,
  isLoading = false
}: GuildChallengesProps) => {
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Chargement des défis...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active challenges */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          Défis en cours ({activeChallenges.length})
        </h3>
        
        {activeChallenges.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activeChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                canContribute={canContribute}
                onContribute={onContribute}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Aucun défi actif pour le moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Défis terminés ({completedChallenges.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedChallenges.slice(0, 4).map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                canContribute={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

GuildChallenges.displayName = 'GuildChallenges';

export default GuildChallenges;
