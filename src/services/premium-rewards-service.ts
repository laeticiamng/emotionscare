import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface PremiumReward {
  id: string;
  name: string;
  description: string | null;
  reward_type: 'theme' | 'avatar' | 'sound_effect' | 'badge' | 'feature';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  required_level: number;
  required_xp: number | null;
  cost_points: number;
  data: Record<string, any>;
  preview_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserPremiumReward {
  id: string;
  user_id: string;
  reward_id: string;
  unlocked_at: string;
  is_equipped: boolean;
  reward?: PremiumReward;
}

class PremiumRewardsService {
  async getAvailableRewards(rewardType?: PremiumReward['reward_type']): Promise<PremiumReward[]> {
    try {
      let query = supabase
        .from('premium_rewards')
        .select('*')
        .eq('is_active', true)
        .order('required_level', { ascending: true });

      if (rewardType) {
        query = query.eq('reward_type', rewardType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching rewards', error as Error, 'PremiumRewardsService');
      return [];
    }
  }

  async getUserRewards(): Promise<UserPremiumReward[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_premium_rewards')
        .select(`
          *,
          reward:reward_id(*)
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching user rewards', error as Error, 'PremiumRewardsService');
      return [];
    }
  }

  async unlockReward(rewardId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user meets requirements
      const { data: reward } = await supabase
        .from('premium_rewards')
        .select('*')
        .eq('id', rewardId)
        .single();

      if (!reward) throw new Error('Reward not found');

      // Get user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('level, total_points')
        .eq('user_id', user.id)
        .single();

      if (!stats) throw new Error('User stats not found');

      if (stats.level < reward.required_level) {
        throw new Error('Level requirement not met');
      }

      if (reward.cost_points > 0 && stats.total_points < reward.cost_points) {
        throw new Error('Insufficient points');
      }

      // Unlock reward
      const { error } = await supabase
        .from('user_premium_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
        });

      if (error) throw error;

      // Deduct points if needed
      if (reward.cost_points > 0) {
        await supabase
          .from('user_stats')
          .update({
            total_points: stats.total_points - reward.cost_points,
          })
          .eq('user_id', user.id);
      }

      return true;
    } catch (error) {
      logger.error('Error unlocking reward', error as Error, 'PremiumRewardsService');
      return false;
    }
  }

  async equipReward(rewardId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the reward to check type
      const { data: userReward } = await supabase
        .from('user_premium_rewards')
        .select('*, reward:reward_id(*)')
        .eq('user_id', user.id)
        .eq('reward_id', rewardId)
        .single();

      if (!userReward) throw new Error('Reward not owned');

      // Get all rewards of same type
      const { data: sameTypeRewards } = await supabase
        .from('premium_rewards')
        .select('id')
        .eq('reward_type', (userReward.reward as PremiumReward).reward_type);

      const rewardIds = sameTypeRewards?.map(r => r.id) || [];

      // Unequip all rewards of same type
      await supabase
        .from('user_premium_rewards')
        .update({ is_equipped: false })
        .eq('user_id', user.id)
        .in('reward_id', rewardIds);

      // Equip the new reward
      const { error } = await supabase
        .from('user_premium_rewards')
        .update({ is_equipped: true })
        .eq('user_id', user.id)
        .eq('reward_id', rewardId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error equipping reward', error as Error, 'PremiumRewardsService');
      return false;
    }
  }

  async getEquippedRewards(): Promise<Record<string, PremiumReward>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};

      const { data, error } = await supabase
        .from('user_premium_rewards')
        .select(`
          *,
          reward:reward_id(*)
        `)
        .eq('user_id', user.id)
        .eq('is_equipped', true);

      if (error) throw error;

      const equipped: Record<string, PremiumReward> = {};
      data?.forEach((item) => {
        const reward = item.reward as PremiumReward;
        equipped[reward.reward_type] = reward;
      });

      return equipped;
    } catch (error) {
      logger.error('Error fetching equipped rewards', error as Error, 'PremiumRewardsService');
      return {};
    }
  }

  async checkAndAutoUnlock(): Promise<PremiumReward[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: stats } = await supabase
        .from('user_stats')
        .select('level, total_xp')
        .eq('user_id', user.id)
        .single();

      if (!stats) return [];

      // Get user's unlocked reward IDs
      const { data: unlockedRewards } = await supabase
        .from('user_premium_rewards')
        .select('reward_id')
        .eq('user_id', user.id);

      const unlockedIds = unlockedRewards?.map(r => r.reward_id) || [];

      // Get rewards user is eligible for but hasn't unlocked
      const { data: allRewards } = await supabase
        .from('premium_rewards')
        .select('*')
        .eq('cost_points', 0)
        .lte('required_level', stats.level);

      const eligibleRewards = allRewards?.filter(r => !unlockedIds.includes(r.id)) || [];

      const newlyUnlocked: PremiumReward[] = [];

      if (eligibleRewards && eligibleRewards.length > 0) {
        for (const reward of eligibleRewards) {
          const success = await this.unlockReward(reward.id);
          if (success) {
            newlyUnlocked.push(reward);
          }
        }
      }

      return newlyUnlocked;
    } catch (error) {
      logger.error('Error checking auto-unlock', error as Error, 'PremiumRewardsService');
      return [];
    }
  }
}

export const premiumRewardsService = new PremiumRewardsService();
