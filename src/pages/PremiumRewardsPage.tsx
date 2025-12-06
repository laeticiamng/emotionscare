import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Check, Palette, User, Volume2, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { premiumRewardsService, PremiumReward } from '@/services/premium-rewards-service';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Confetti } from '@/components/ui/confetti';

type RewardType = 'theme' | 'avatar' | 'sound_effect' | 'all';

const PremiumRewardsPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<RewardType>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: rewards, isLoading: rewardsLoading } = useQuery({
    queryKey: ['premium-rewards', selectedType],
    queryFn: () => premiumRewardsService.getAvailableRewards(
      selectedType === 'all' ? undefined : selectedType
    ),
  });

  const { data: userRewards, isLoading: userRewardsLoading } = useQuery({
    queryKey: ['user-premium-rewards'],
    queryFn: () => premiumRewardsService.getUserRewards(),
  });

  const { data: equippedRewards } = useQuery({
    queryKey: ['equipped-rewards'],
    queryFn: () => premiumRewardsService.getEquippedRewards(),
  });

  const isOwned = (rewardId: string) => {
    return userRewards?.some((ur) => ur.reward_id === rewardId);
  };

  const isEquipped = (rewardId: string) => {
    return Object.values(equippedRewards || {}).some((r) => r.id === rewardId);
  };

  const handleUnlockReward = async (reward: PremiumReward) => {
    const success = await premiumRewardsService.unlockReward(reward.id);
    if (success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast({
        title: '🎉 Récompense débloquée !',
        description: `Vous avez débloqué "${reward.name}"`,
      });
      queryClient.invalidateQueries({ queryKey: ['user-premium-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    } else {
      toast({
        title: 'Erreur',
        description: 'Vous ne remplissez pas les conditions pour débloquer cette récompense.',
        variant: 'destructive',
      });
    }
  };

  const handleEquipReward = async (rewardId: string) => {
    const success = await premiumRewardsService.equipReward(rewardId);
    if (success) {
      toast({
        title: 'Récompense équipée !',
        description: 'La récompense est maintenant active.',
      });
      queryClient.invalidateQueries({ queryKey: ['equipped-rewards'] });
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'équiper la récompense.',
        variant: 'destructive',
      });
    }
  };

  const getRarityColor = (rarity: PremiumReward['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'rare':
        return 'bg-blue-500';
      case 'epic':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-yellow-500';
    }
  };

  const getTypeIcon = (type: PremiumReward['reward_type']) => {
    switch (type) {
      case 'theme':
        return <Palette className="w-5 h-5" />;
      case 'avatar':
        return <User className="w-5 h-5" />;
      case 'sound_effect':
        return <Volume2 className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-primary" />
              Récompenses Premium
            </h1>
            <p className="text-muted-foreground mt-2">
              Débloquez des thèmes, avatars et effets sonores exclusifs
            </p>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-3xl font-bold">{userRewards?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Récompenses débloquées</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{rewards?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Récompenses disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {Object.keys(equippedRewards || {}).length}
              </p>
              <p className="text-sm text-muted-foreground">Récompenses équipées</p>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as RewardType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="theme">Thèmes</TabsTrigger>
            <TabsTrigger value="avatar">Avatars</TabsTrigger>
            <TabsTrigger value="sound_effect">Sons</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="mt-6">
            {rewardsLoading || userRewardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards?.map((reward) => {
                  const owned = isOwned(reward.id);
                  const equipped = isEquipped(reward.id);

                  return (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="p-6 h-full flex flex-col relative overflow-hidden">
                        {/* Rarity indicator */}
                        <div className={`absolute top-0 right-0 w-24 h-24 ${getRarityColor(reward.rarity)} opacity-10 rounded-bl-full`} />

                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(reward.reward_type)}
                            <Badge variant="secondary" className={getRarityColor(reward.rarity)}>
                              {reward.rarity}
                            </Badge>
                          </div>
                          {equipped && (
                            <Badge variant="default" className="gap-1">
                              <Check className="w-3 h-3" />
                              Équipé
                            </Badge>
                          )}
                        </div>

                        {/* Preview */}
                        <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                          {reward.preview_url ? (
                            <img src={reward.preview_url} alt={reward.name} className="max-h-full" />
                          ) : (
                            <Sparkles className="w-12 h-12 text-muted-foreground" />
                          )}
                        </div>

                        {/* Info */}
                        <h3 className="text-lg font-bold mb-2">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">
                          {reward.description}
                        </p>

                        {/* Requirements */}
                        <div className="flex items-center gap-2 text-sm mb-4">
                          <Badge variant="outline">Niveau {reward.required_level}</Badge>
                          {reward.cost_points > 0 && (
                            <Badge variant="outline">{reward.cost_points} pts</Badge>
                          )}
                        </div>

                        {/* Action Button */}
                        {owned ? (
                          <Button
                            onClick={() => handleEquipReward(reward.id)}
                            variant={equipped ? 'secondary' : 'default'}
                            disabled={equipped}
                            className="w-full"
                          >
                            {equipped ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Équipé
                              </>
                            ) : (
                              'Équiper'
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUnlockReward(reward)}
                            className="w-full gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Débloquer
                          </Button>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default PremiumRewardsPage;
