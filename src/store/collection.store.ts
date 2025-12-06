import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';
import { UserCollection, Reward, RewardType } from '@/types/rewards';

interface CollectionState {
  collection: UserCollection;
  recentRewards: Reward[];
  
  // Actions
  addReward: (reward: Omit<Reward, 'id' | 'earnedAt'>) => string;
  getRewardsByModule: (moduleId: string) => Reward[];
  getRewardsByType: (type: RewardType) => Reward[];
  markRewardAsSeen: (rewardId: string) => void;
  getTotalCount: () => number;
  getCollectionProgress: () => { [key in RewardType]: number };
}

const useCollectionStoreBase = create<CollectionState>()(
  persist(
    (set, get) => ({
      collection: {
        gems: [],
        flowers: [],
        avatars: [],
        constellations: [],
        samples: [],
        items: [],
        cards: [],
        badges: [],
        lanterns: [],
        flames: []
      },
      recentRewards: [],

      addReward: (rewardData) => {
        const reward: Reward = {
          ...rewardData,
          id: `reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          earnedAt: new Date()
        };

        set((state) => ({
          recentRewards: [reward, ...state.recentRewards.slice(0, 9)] // Keep last 10
        }));

        // Add to specific collection based on type
        set((state) => {
          const newCollection = { ...state.collection };
          
          switch (reward.type) {
            case 'gem':
              newCollection.gems.push(reward.metadata as any);
              break;
            case 'flower':
              newCollection.flowers.push(reward.metadata as any);
              break;
            case 'avatar':
              newCollection.avatars.push(reward.metadata as any);
              break;
            case 'constellation':
              newCollection.constellations.push(reward.metadata as any);
              break;
            case 'sample':
              newCollection.samples.push(reward.metadata as any);
              break;
            case 'item':
              newCollection.items.push(reward.metadata as any);
              break;
            case 'card':
              newCollection.cards.push(reward.metadata as any);
              break;
            case 'badge':
              newCollection.badges.push(reward.metadata as any);
              break;
            case 'lantern':
              newCollection.lanterns.push(reward.metadata as any);
              break;
            case 'flame':
              newCollection.flames.push(reward.metadata as any);
              break;
          }

          return { collection: newCollection };
        });

        return reward.id;
      },

      getRewardsByModule: (moduleId) => {
        return get().recentRewards.filter(reward => reward.moduleId === moduleId);
      },

      getRewardsByType: (type) => {
        return get().recentRewards.filter(reward => reward.type === type);
      },

      markRewardAsSeen: (rewardId) => {
        set((state) => ({
          recentRewards: state.recentRewards.filter(reward => reward.id !== rewardId)
        }));
      },

      getTotalCount: () => {
        const collection = get().collection;
        return Object.values(collection).reduce((total, items) => total + items.length, 0);
      },

      getCollectionProgress: () => {
        const collection = get().collection;
        return {
          gem: collection.gems.length,
          flower: collection.flowers.length,
          avatar: collection.avatars.length,
          constellation: collection.constellations.length,
          sample: collection.samples.length,
          item: collection.items.length,
          card: collection.cards.length,
          badge: collection.badges.length,
          lantern: collection.lanterns.length,
          flame: collection.flames.length
        };
      }
    }),
    {
      name: 'emotionscare-collection',
      version: 1
    }
  )
);

export const useCollectionStore = createSelectors(useCollectionStoreBase);
