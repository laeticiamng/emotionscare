// @ts-nocheck
import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type RewardType = 'aura' | 'constellation' | 'flower' | 'flame' | 'pearl' | 'lantern' | 'crystal' | 'bubble' | 'sticker';

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  moduleId: string;
  unlockedAt: Date;
  isNew: boolean;
}

export interface Badge {
  id: string;
  text: string;
  moduleId: string;
  earnedAt: Date;
  isShown: boolean;
}

interface RewardsState {
  rewards: Reward[];
  badges: Badge[];
  currentAura: string | null;
  
  // Actions
  addReward: (reward: Omit<Reward, 'id' | 'unlockedAt' | 'isNew'>) => void;
  addBadge: (badge: Omit<Badge, 'id' | 'earnedAt' | 'isShown'>) => void;
  markRewardAsSeen: (rewardId: string) => void;
  markBadgeAsShown: (badgeId: string) => void;
  setCurrentAura: (auraId: string) => void;
  getRewardsByModule: (moduleId: string) => Reward[];
  getNewRewardsCount: () => number;
}

const useRewardsStoreBase = create<RewardsState>()(
  persist(
    (set, get) => ({
      rewards: [],
      badges: [],
      currentAura: null,

      addReward: (rewardData) => {
        const reward: Reward = {
          ...rewardData,
          id: `reward-${Date.now()}-${Math.random()}`,
          unlockedAt: new Date(),
          isNew: true,
        };
        
        set((state) => ({
          rewards: [...state.rewards, reward]
        }));
      },

      addBadge: (badgeData) => {
        const badge: Badge = {
          ...badgeData,
          id: `badge-${Date.now()}-${Math.random()}`,
          earnedAt: new Date(),
          isShown: false,
        };
        
        set((state) => ({
          badges: [...state.badges, badge]
        }));
      },

      markRewardAsSeen: (rewardId) => {
        set((state) => ({
          rewards: state.rewards.map(reward =>
            reward.id === rewardId ? { ...reward, isNew: false } : reward
          )
        }));
      },

      markBadgeAsShown: (badgeId) => {
        set((state) => ({
          badges: state.badges.map(badge =>
            badge.id === badgeId ? { ...badge, isShown: true } : badge
          )
        }));
      },

      setCurrentAura: (auraId) => {
        set({ currentAura: auraId });
      },

      getRewardsByModule: (moduleId) => {
        return get().rewards.filter(reward => reward.moduleId === moduleId);
      },

      getNewRewardsCount: () => {
        return get().rewards.filter(reward => reward.isNew).length;
      },
    }),
    {
      name: 'emotionscare-rewards',
      version: 1,
    }
  )
);

export const useRewardsStore = createSelectors(useRewardsStoreBase);
