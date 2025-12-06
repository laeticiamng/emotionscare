/**
 * Panneau des défis quotidiens et hebdomadaires
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Clock, Star, Trophy, CheckCircle2 } from '@/components/music/icons';
import { getUserChallenges, completeChallenge, type MusicChallenge } from '@/services/music/challenges-service';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface DailyChallengesPanelProps {
  userId: string;
  onXPEarned?: (xp: number) => void;
}

export const DailyChallengesPanel: React.FC<DailyChallengesPanelProps> = ({
  userId,
  onXPEarned
}) => {
  const [challenges, setChallenges] = useState<MusicChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      const data = await getUserChallenges(userId);
      setChallenges(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les défis',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeComplete = async (challenge: MusicChallenge) => {
    if (challenge.currentValue < challenge.targetValue) return;
    
    try {
      const result = await completeChallenge(userId, challenge);
      
      // Animation confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: '🎉 Défi complété !',
        description: `+${result.xpEarned} XP${result.badgeUnlocked ? ' + Badge débloqué !' : ''}`
      });
      
      if (onXPEarned) {
        onXPEarned(result.xpEarned);
      }
      
      // Marquer comme complété
      setChallenges(prev =>
        prev.map(c =>
          c.id === challenge.id ? { ...c, status: 'completed' } : c
        )
      );
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de compléter le défi',
        variant: 'destructive'
      });
    }
  };

  const dailyChallenges = challenges.filter(c => c.frequency === 'daily');
  const weeklyChallenges = challenges.filter(c => c.frequency === 'weekly');

  const renderChallengeCard = (challenge: MusicChallenge) => {
    const progress = (challenge.currentValue / challenge.targetValue) * 100;
    const isCompleted = challenge.status === 'completed';
    const canClaim = progress >= 100 && !isCompleted;
    
    const timeLeft = new Date(challenge.expiresAt).getTime() - Date.now();
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    
    return (
      <m.div
        key={challenge.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className={`p-4 ${isCompleted ? 'opacity-60' : ''} ${canClaim ? 'border-primary border-2' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{challenge.icon}</div>
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  {challenge.title}
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
              </div>
            </div>
            
            <Badge variant={canClaim ? 'default' : 'secondary'}>
              +{challenge.xpReward} XP
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {challenge.currentValue} / {challenge.targetValue}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {hoursLeft}h restantes
              </span>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            {canClaim && (
              <Button
                onClick={() => handleChallengeComplete(challenge)}
                className="w-full mt-2"
                size="sm"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Réclamer la récompense
              </Button>
            )}
            
            {challenge.badgeReward && !isCompleted && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                <Star className="h-3 w-3 text-yellow-500" />
                Badge exclusif à débloquer
              </div>
            )}
          </div>
        </Card>
      </m.div>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <LazyMotionWrapper>
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Défis Actifs</h3>
        <p className="text-sm text-muted-foreground">
          Complétez les défis pour gagner de l'XP et débloquer des badges exclusifs
        </p>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="daily">
            Quotidiens ({dailyChallenges.filter(c => c.status !== 'completed').length})
          </TabsTrigger>
          <TabsTrigger value="weekly">
            Hebdomadaires ({weeklyChallenges.filter(c => c.status !== 'completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-3 mt-4">
          {dailyChallenges.length > 0 ? (
            dailyChallenges.map(renderChallengeCard)
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Aucun défi quotidien disponible</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-3 mt-4">
          {weeklyChallenges.length > 0 ? (
            weeklyChallenges.map(renderChallengeCard)
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Aucun défi hebdomadaire disponible</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
    </LazyMotionWrapper>
  );
};
