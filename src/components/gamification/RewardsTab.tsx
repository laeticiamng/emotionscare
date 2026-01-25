/**
 * Composant Onglet Récompenses - EmotionsCare
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Coins, Check, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGamification, type Reward } from '@/modules/gamification';
import { cn } from '@/lib/utils';

interface RewardsTabProps {
  userPoints: number;
}

const RARITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: 'bg-muted/50', border: 'border-muted', text: 'text-muted-foreground' },
  rare: { bg: 'bg-info/10', border: 'border-info/50', text: 'text-info' },
  epic: { bg: 'bg-accent/10', border: 'border-accent/50', text: 'text-accent' },
  legendary: { bg: 'bg-warning/10', border: 'border-warning/50', text: 'text-warning' },
};

const CATEGORY_LABELS: Record<string, string> = {
  theme: 'Thème',
  avatar: 'Avatar',
  boost: 'Boost',
  content: 'Contenu',
  feature: 'Fonctionnalité',
};

export function RewardsTab({ userPoints }: RewardsTabProps) {
  const { toast } = useToast();
  const { rewards, claimedRewards, claimReward, isClaimingReward } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(rewards.map(r => r.category))];
  
  const filteredRewards = selectedCategory 
    ? rewards.filter(r => r.category === selectedCategory)
    : rewards;

  const handleClaim = async (reward: Reward) => {
    if (userPoints < reward.cost) {
      toast({
        title: 'Points insuffisants',
        description: `Il vous manque ${reward.cost - userPoints} points`,
        variant: 'destructive',
      });
      return;
    }

    claimReward(reward.id, {
      onSuccess: () => {
        toast({
          title: 'Récompense obtenue !',
          description: `Vous avez débloqué "${reward.name}"`,
        });
      },
      onError: () => {
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer la récompense',
          variant: 'destructive',
        });
      },
    });
  };

  const isRewardClaimed = (rewardId: string) => 
    claimedRewards.some(c => c.rewardId === rewardId);

  if (rewards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold mb-2">Toutes les récompenses obtenues !</h3>
        <p className="text-muted-foreground">Revenez bientôt pour de nouvelles récompenses</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Points Display */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-warning" aria-hidden="true" />
              <span className="font-medium">Vos points</span>
            </div>
            <span className="text-2xl font-bold text-primary">{userPoints}</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="shrink-0"
        >
          Toutes
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="shrink-0"
          >
            {CATEGORY_LABELS[cat] || cat}
          </Button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {filteredRewards.map((reward, index) => {
            const claimed = isRewardClaimed(reward.id);
            const canAfford = userPoints >= reward.cost;
            const styles = RARITY_STYLES[reward.rarity] || RARITY_STYLES.common;

            return (
              <motion.div
                key={reward.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  'border-2 transition-all',
                  styles.border,
                  claimed && 'opacity-60'
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
                        styles.bg
                      )}>
                        {reward.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">{reward.name}</h4>
                          <Badge variant="outline" className={cn('text-xs', styles.text)}>
                            {reward.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {reward.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {CATEGORY_LABELS[reward.category] || reward.category}
                          </Badge>
                          {reward.stock !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              Stock: {reward.stock}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 mb-2">
                          <Coins className="w-4 h-4 text-warning" />
                          <span className={cn(
                            'font-bold',
                            canAfford ? 'text-foreground' : 'text-destructive'
                          )}>
                            {reward.cost}
                          </span>
                        </div>
                        
                        {claimed ? (
                          <Button size="sm" variant="ghost" disabled>
                            <Check className="w-4 h-4 mr-1" />
                            Obtenu
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={canAfford ? 'default' : 'outline'}
                            disabled={!canAfford || isClaimingReward}
                            onClick={() => handleClaim(reward)}
                          >
                            {canAfford ? (
                              <>
                                <Sparkles className="w-4 h-4 mr-1" />
                                Obtenir
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-1" />
                                {reward.cost - userPoints} pts
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default RewardsTab;
