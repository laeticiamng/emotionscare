// @ts-nocheck
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
  private async getAuthenticatedUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user;
  }

  async getAvailableRewards(rewardType?: PremiumReward['reward_type']): Promise<PremiumReward[]> {
    let query = supabase
      .from('premium_rewards')
      .select('*')
      .eq('is_active', true)
      .order('required_level', { ascending: true });

    if (rewardType) {
      query = query.eq('reward_type', rewardType);
    }

    const { data, error } = await query;
    if (error) {
      logger.error('Error fetching rewards', error, 'PremiumRewardsService');
      throw error;
    }
    return data || [];
  }

  async getUserRewards(): Promise<UserPremiumReward[]> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await supabase
      .from('user_premium_rewards')
      .select(`*, reward:reward_id(*)`)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    if (error) {
      logger.error('Error fetching user rewards', error, 'PremiumRewardsService');
      throw error;
    }
    return data || [];
  }

  async unlockReward(rewardId: string): Promise<boolean> {
    const user = await this.getAuthenticatedUser();

    const { data: reward } = await supabase
      .from('premium_rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (!reward) throw new Error('Reward not found');

    const { data: stats } = await supabase
      .from('user_stats')
      .select('level, total_points')
      .eq('user_id', user.id)
      .single();

    if (!stats) throw new Error('User stats not found');
    if (stats.level < reward.required_level) throw new Error('Level requirement not met');
    if (reward.cost_points > 0 && stats.total_points < reward.cost_points) throw new Error('Insufficient points');

    const { error } = await supabase
      .from('user_premium_rewards')
      .insert({ user_id: user.id, reward_id: rewardId });

    if (error) {
      logger.error('Error unlocking reward', error, 'PremiumRewardsService');
      throw error;
    }

    if (reward.cost_points > 0) {
      await supabase
        .from('user_stats')
        .update({ total_points: stats.total_points - reward.cost_points })
        .eq('user_id', user.id);
    }

    return true;
  }

  async equipReward(rewardId: string): Promise<boolean> {
    const user = await this.getAuthenticatedUser();

    const { data: userReward } = await supabase
      .from('user_premium_rewards')
      .select('*, reward:reward_id(*)')
      .eq('user_id', user.id)
      .eq('reward_id', rewardId)
      .single();

    if (!userReward) throw new Error('Reward not owned');

    const { data: sameTypeRewards } = await supabase
      .from('premium_rewards')
      .select('id')
      .eq('reward_type', (userReward.reward as PremiumReward).reward_type);

    const rewardIds = sameTypeRewards?.map(r => r.id) || [];

    await supabase
      .from('user_premium_rewards')
      .update({ is_equipped: false })
      .eq('user_id', user.id)
      .in('reward_id', rewardIds);

    const { error } = await supabase
      .from('user_premium_rewards')
      .update({ is_equipped: true })
      .eq('user_id', user.id)
      .eq('reward_id', rewardId);

    if (error) {
      logger.error('Error equipping reward', error, 'PremiumRewardsService');
      throw error;
    }
    return true;
  }

  async getEquippedRewards(): Promise<Record<string, PremiumReward>> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await supabase
      .from('user_premium_rewards')
      .select(`*, reward:reward_id(*)`)
      .eq('user_id', user.id)
      .eq('is_equipped', true);

    if (error) {
      logger.error('Error fetching equipped rewards', error, 'PremiumRewardsService');
      throw error;
    }

    const equipped: Record<string, PremiumReward> = {};
    data?.forEach((item) => {
      const reward = item.reward as PremiumReward;
      equipped[reward.reward_type] = reward;
    });

    return equipped;
  }

  async checkAndAutoUnlock(): Promise<PremiumReward[]> {
    const user = await this.getAuthenticatedUser();

    const { data: stats } = await supabase
      .from('user_stats')
      .select('level, total_xp')
      .eq('user_id', user.id)
      .single();

    if (!stats) return [];

    const { data: unlockedRewards } = await supabase
      .from('user_premium_rewards')
      .select('reward_id')
      .eq('user_id', user.id);

    const unlockedIds = unlockedRewards?.map(r => r.reward_id) || [];

    const { data: allRewards } = await supabase
      .from('premium_rewards')
      .select('*')
      .eq('cost_points', 0)
      .lte('required_level', stats.level);

    const eligibleRewards = allRewards?.filter(r => !unlockedIds.includes(r.id)) || [];
    const newlyUnlocked: PremiumReward[] = [];

    for (const reward of eligibleRewards) {
      try {
        const success = await this.unlockReward(reward.id);
        if (success) newlyUnlocked.push(reward);
      } catch {
        // Individual auto-unlock failures are non-critical
      }
    }

    return newlyUnlocked;
  }

  async getRewardById(rewardId: string): Promise<PremiumReward | null> {
    const { data, error } = await supabase
      .from('premium_rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (error) {
      logger.error('Error fetching reward', error, 'PremiumRewardsService');
      throw error;
    }
    return data;
  }

  async getRewardsByRarity(rarity: PremiumReward['rarity']): Promise<PremiumReward[]> {
    const { data, error } = await supabase
      .from('premium_rewards')
      .select('*')
      .eq('is_active', true)
      .eq('rarity', rarity)
      .order('required_level', { ascending: true });

    if (error) {
      logger.error('Error fetching rewards by rarity', error, 'PremiumRewardsService');
      throw error;
    }
    return data || [];
  }

  async unequipReward(rewardId: string): Promise<boolean> {
    const user = await this.getAuthenticatedUser();

    const { error } = await supabase
      .from('user_premium_rewards')
      .update({ is_equipped: false })
      .eq('user_id', user.id)
      .eq('reward_id', rewardId);

    if (error) {
      logger.error('Error unequipping reward', error, 'PremiumRewardsService');
      throw error;
    }
    return true;
  }

  async isRewardUnlocked(rewardId: string): Promise<boolean> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await supabase
      .from('user_premium_rewards')
      .select('id')
      .eq('user_id', user.id)
      .eq('reward_id', rewardId)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error checking reward unlock', error, 'PremiumRewardsService');
      throw error;
    }
    return !!data;
  }

  async getUnlockProgress(): Promise<{
    totalRewards: number;
    unlockedCount: number;
    percentage: number;
    byRarity: Record<PremiumReward['rarity'], { total: number; unlocked: number }>;
    byType: Record<PremiumReward['reward_type'], { total: number; unlocked: number }>;
  }> {
    const user = await this.getAuthenticatedUser();

    const [allRewardsRes, userRewardsRes] = await Promise.all([
      supabase.from('premium_rewards').select('id, rarity, reward_type').eq('is_active', true),
      supabase.from('user_premium_rewards').select('reward_id').eq('user_id', user.id)
    ]);

    if (allRewardsRes.error) throw allRewardsRes.error;
    if (userRewardsRes.error) throw userRewardsRes.error;

    const allRewards = allRewardsRes.data || [];
    const unlockedIds = new Set((userRewardsRes.data || []).map(r => r.reward_id));

    const byRarity: Record<string, { total: number; unlocked: number }> = {
      common: { total: 0, unlocked: 0 }, rare: { total: 0, unlocked: 0 },
      epic: { total: 0, unlocked: 0 }, legendary: { total: 0, unlocked: 0 }
    };
    const byType: Record<string, { total: number; unlocked: number }> = {
      theme: { total: 0, unlocked: 0 }, avatar: { total: 0, unlocked: 0 },
      sound_effect: { total: 0, unlocked: 0 }, badge: { total: 0, unlocked: 0 }, feature: { total: 0, unlocked: 0 }
    };

    allRewards.forEach(r => {
      if (byRarity[r.rarity]) byRarity[r.rarity].total++;
      if (byType[r.reward_type]) byType[r.reward_type].total++;
      if (unlockedIds.has(r.id)) {
        if (byRarity[r.rarity]) byRarity[r.rarity].unlocked++;
        if (byType[r.reward_type]) byType[r.reward_type].unlocked++;
      }
    });

    return {
      totalRewards: allRewards.length,
      unlockedCount: unlockedIds.size,
      percentage: allRewards.length > 0 ? Math.round((unlockedIds.size / allRewards.length) * 100) : 0,
      byRarity: byRarity as Record<PremiumReward['rarity'], { total: number; unlocked: number }>,
      byType: byType as Record<PremiumReward['reward_type'], { total: number; unlocked: number }>
    };
  }

  async getNextUnlockableRewards(limit: number = 5): Promise<PremiumReward[]> {
    const user = await this.getAuthenticatedUser();

    const { data: stats } = await supabase
      .from('user_stats')
      .select('level, total_points')
      .eq('user_id', user.id)
      .single();

    if (!stats) return [];

    const { data: unlockedRewards } = await supabase
      .from('user_premium_rewards')
      .select('reward_id')
      .eq('user_id', user.id);

    const unlockedIds = unlockedRewards?.map(r => r.reward_id) || [];

    const { data, error } = await supabase
      .from('premium_rewards')
      .select('*')
      .eq('is_active', true)
      .gte('required_level', stats.level)
      .lte('required_level', stats.level + 5)
      .order('required_level', { ascending: true })
      .limit(limit * 2);

    if (error) throw error;
    return (data || []).filter(r => !unlockedIds.includes(r.id)).slice(0, limit);
  }

  async giftReward(rewardId: string, recipientId: string): Promise<boolean> {
    const user = await this.getAuthenticatedUser();

    const { data: owned } = await supabase
      .from('user_premium_rewards')
      .select('id')
      .eq('user_id', user.id)
      .eq('reward_id', rewardId)
      .single();

    if (!owned) throw new Error('Reward not owned');

    const { data: recipientHas } = await supabase
      .from('user_premium_rewards')
      .select('id')
      .eq('user_id', recipientId)
      .eq('reward_id', rewardId)
      .single();

    if (recipientHas) throw new Error('Recipient already has this reward');

    const { error } = await supabase
      .from('user_premium_rewards')
      .insert({
        user_id: recipientId,
        reward_id: rewardId,
        gifted_by: user.id,
        gifted_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Error gifting reward', error, 'PremiumRewardsService');
      throw error;
    }

    logger.info(`Reward ${rewardId} gifted to ${recipientId}`, {}, 'PremiumRewardsService');
    return true;
  }

  async getFeaturedRewards(limit: number = 6): Promise<PremiumReward[]> {
    const { data, error } = await supabase
      .from('premium_rewards')
      .select('*')
      .eq('is_active', true)
      .in('rarity', ['epic', 'legendary'])
      .order('required_level', { ascending: true })
      .limit(limit);

    if (error) {
      logger.error('Error fetching featured rewards', error, 'PremiumRewardsService');
      throw error;
    }
    return data || [];
  }

  async getRewardStats(): Promise<{
    totalRewards: number;
    byRarity: Record<PremiumReward['rarity'], number>;
    byType: Record<PremiumReward['reward_type'], number>;
    totalUnlockedGlobally: number;
  }> {
    const [rewardsRes, unlocksRes] = await Promise.all([
      supabase.from('premium_rewards').select('rarity, reward_type').eq('is_active', true),
      supabase.from('user_premium_rewards').select('id', { count: 'exact', head: true })
    ]);

    if (rewardsRes.error) throw rewardsRes.error;

    const rewards = rewardsRes.data || [];
    const byRarity: Record<string, number> = { common: 0, rare: 0, epic: 0, legendary: 0 };
    const byType: Record<string, number> = { theme: 0, avatar: 0, sound_effect: 0, badge: 0, feature: 0 };

    rewards.forEach(r => {
      if (byRarity[r.rarity] !== undefined) byRarity[r.rarity]++;
      if (byType[r.reward_type] !== undefined) byType[r.reward_type]++;
    });

    return {
      totalRewards: rewards.length,
      byRarity: byRarity as Record<PremiumReward['rarity'], number>,
      byType: byType as Record<PremiumReward['reward_type'], number>,
      totalUnlockedGlobally: unlocksRes.count || 0
    };
  }
}

export const premiumRewardsService = new PremiumRewardsService();
