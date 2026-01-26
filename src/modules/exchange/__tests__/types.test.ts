import { describe, it, expect } from 'vitest';
import type {
  ImprovementGoal,
  GoalType,
  ImprovementLog,
  TrustProfile,
  TrustLevel,
  TrustTransaction,
  TimeOffer,
  SkillCategory,
  TimeExchange,
  TimeMarketRate,
  EmotionAsset,
  EmotionType,
  EmotionPortfolio,
  EmotionTransaction,
  ExchangeProfile,
  LeaderboardEntry,
  MarketType,
  MarketStats,
} from '../types';

describe('Exchange module types', () => {
  describe('Improvement Market', () => {
    describe('GoalType', () => {
      it('validates all goal types', () => {
        const goalTypes: GoalType[] = ['sleep', 'stress', 'productivity', 'study', 'fitness', 'meditation'];
        expect(goalTypes).toHaveLength(6);
      });
    });

    describe('ImprovementGoal', () => {
      it('validates an active goal', () => {
        const goal: ImprovementGoal = {
          id: 'goal-123',
          user_id: 'user-456',
          goal_type: 'sleep',
          title: 'Improve sleep quality',
          description: 'Get 8 hours of quality sleep',
          target_value: 8,
          current_value: 6.5,
          improvement_score: 75,
          ai_analysis: { trend: 'improving' },
          started_at: new Date().toISOString(),
          target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        expect(goal.goal_type).toBe('sleep');
        expect(goal.status).toBe('active');
        expect(goal.improvement_score).toBe(75);
      });

      it('validates a completed goal', () => {
        const goal: ImprovementGoal = {
          id: 'goal-456',
          user_id: 'user-789',
          goal_type: 'meditation',
          title: '30-day meditation challenge',
          target_value: 30,
          current_value: 30,
          improvement_score: 100,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        expect(goal.status).toBe('completed');
        expect(goal.current_value).toBe(goal.target_value);
      });
    });

    describe('ImprovementLog', () => {
      it('validates improvement log entry', () => {
        const log: ImprovementLog = {
          id: 'log-123',
          goal_id: 'goal-456',
          user_id: 'user-789',
          value_change: 0.5,
          new_value: 7.0,
          ai_feedback: 'Great progress! Keep it up.',
          metadata: { source: 'manual_entry' },
          created_at: new Date().toISOString(),
        };

        expect(log.value_change).toBe(0.5);
        expect(log.ai_feedback).toBeDefined();
      });
    });
  });

  describe('Trust Market', () => {
    describe('TrustLevel', () => {
      it('validates all trust levels', () => {
        const levels: TrustLevel[] = ['newcomer', 'trusted', 'verified', 'expert', 'legend'];
        expect(levels).toHaveLength(5);
      });
    });

    describe('TrustProfile', () => {
      it('validates a trust profile', () => {
        const profile: TrustProfile = {
          id: 'profile-123',
          user_id: 'user-456',
          trust_score: 850,
          total_given: 500,
          total_received: 750,
          verified_actions: 25,
          level: 'expert',
          badges: ['early_adopter', 'community_helper'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        expect(profile.level).toBe('expert');
        expect(profile.badges).toContain('early_adopter');
      });
    });

    describe('TrustTransaction', () => {
      it('validates all transaction types', () => {
        const transactionTypes: TrustTransaction['transaction_type'][] = ['give', 'receive', 'earn', 'stake'];
        expect(transactionTypes).toHaveLength(4);
      });

      it('validates a trust transaction', () => {
        const transaction: TrustTransaction = {
          id: 'tx-123',
          from_user_id: 'user-456',
          to_user_id: 'user-789',
          amount: 50,
          reason: 'Helpful advice',
          transaction_type: 'give',
          verified: true,
          created_at: new Date().toISOString(),
        };

        expect(transaction.transaction_type).toBe('give');
        expect(transaction.verified).toBe(true);
      });
    });
  });

  describe('Time Exchange Market', () => {
    describe('SkillCategory', () => {
      it('validates all skill categories', () => {
        const categories: SkillCategory[] = ['tech', 'music', 'coaching', 'medicine', 'art', 'language', 'business'];
        expect(categories).toHaveLength(7);
      });
    });

    describe('TimeOffer', () => {
      it('validates a time offer', () => {
        const offer: TimeOffer = {
          id: 'offer-123',
          user_id: 'user-456',
          skill_category: 'coaching',
          skill_name: 'Life coaching',
          description: '1-on-1 coaching session',
          hours_available: 5,
          time_value: 2.5,
          rating: 4.8,
          reviews_count: 15,
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        expect(offer.skill_category).toBe('coaching');
        expect(offer.status).toBe('available');
        expect(offer.rating).toBe(4.8);
      });
    });

    describe('TimeExchange', () => {
      it('validates a time exchange', () => {
        const exchange: TimeExchange = {
          id: 'exchange-123',
          offer_id: 'offer-456',
          requester_id: 'user-123',
          provider_id: 'user-456',
          hours_exchanged: 2,
          status: 'completed',
          rating_given: 5,
          rating_received: 5,
          feedback: 'Excellent session!',
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        expect(exchange.status).toBe('completed');
        expect(exchange.hours_exchanged).toBe(2);
      });
    });

    describe('TimeMarketRate', () => {
      it('validates market rate with trends', () => {
        const rate: TimeMarketRate = {
          id: 'rate-123',
          category: 'tech',
          current_rate: 3.5,
          demand_index: 85,
          supply_count: 25,
          trend: 'up',
          updated_at: new Date().toISOString(),
        };

        expect(rate.trend).toBe('up');
        expect(rate.demand_index).toBe(85);
      });
    });
  });

  describe('Emotion Exchange Market', () => {
    describe('EmotionType', () => {
      it('validates all emotion types', () => {
        const emotions: EmotionType[] = ['calm', 'focus', 'energy', 'joy', 'creativity', 'confidence'];
        expect(emotions).toHaveLength(6);
      });
    });

    describe('EmotionAsset', () => {
      it('validates an emotion asset', () => {
        const asset: EmotionAsset = {
          id: 'asset-123',
          name: 'Deep Focus',
          emotion_type: 'focus',
          description: 'A deep focus state for productivity',
          intensity: 75,
          music_config: { tempo: 60, genre: 'ambient', mood: 'focused' },
          ambient_config: { color: '#4A90D9', light: 0.6 },
          base_price: 100,
          current_price: 125,
          demand_score: 85,
          total_purchases: 500,
          creator_id: 'user-creator',
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        expect(asset.emotion_type).toBe('focus');
        expect(asset.current_price).toBeGreaterThan(asset.base_price);
        expect(asset.music_config?.tempo).toBe(60);
      });
    });

    describe('EmotionPortfolio', () => {
      it('validates user portfolio', () => {
        const portfolio: EmotionPortfolio = {
          id: 'portfolio-123',
          user_id: 'user-456',
          asset_id: 'asset-789',
          quantity: 3,
          acquired_price: 100,
          acquired_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
        };

        expect(portfolio.quantity).toBe(3);
        expect(portfolio.acquired_price).toBe(100);
      });
    });

    describe('EmotionTransaction', () => {
      it('validates all transaction types', () => {
        const types: EmotionTransaction['transaction_type'][] = ['buy', 'sell', 'use', 'gift'];
        expect(types).toHaveLength(4);
      });
    });
  });

  describe('Exchange Hub', () => {
    describe('ExchangeProfile', () => {
      it('validates exchange profile', () => {
        const profile: ExchangeProfile = {
          id: 'profile-123',
          user_id: 'user-456',
          display_name: 'TopTrader',
          avatar_url: 'https://example.com/avatar.png',
          total_xp: 5000,
          level: 15,
          improvement_rank: 5,
          trust_rank: 10,
          time_rank: 3,
          emotion_rank: 8,
          badges: ['top_trader', 'trusted_member'],
          achievements: ['first_trade', 'hundred_trades'],
          stats: { total_trades: 150, win_rate: 0.75 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        expect(profile.level).toBe(15);
        expect(profile.badges).toContain('top_trader');
      });
    });

    describe('LeaderboardEntry', () => {
      it('validates leaderboard entry', () => {
        const entry: LeaderboardEntry = {
          id: 'entry-123',
          user_id: 'user-456',
          market_type: 'global',
          score: 9500,
          rank: 1,
          period: 'weekly',
          recorded_at: new Date().toISOString(),
        };

        expect(entry.rank).toBe(1);
        expect(entry.market_type).toBe('global');
        expect(entry.period).toBe('weekly');
      });
    });

    describe('MarketType', () => {
      it('validates all market types', () => {
        const markets: MarketType[] = ['improvement', 'trust', 'time', 'emotion', 'global'];
        expect(markets).toHaveLength(5);
      });
    });
  });

  describe('MarketStats', () => {
    it('validates complete market stats', () => {
      const stats: MarketStats = {
        improvement: {
          activeGoals: 150,
          avgScore: 72.5,
          topCategories: [
            { type: 'sleep', count: 50 },
            { type: 'meditation', count: 40 },
          ],
        },
        trust: {
          totalPool: 50000,
          activeProjects: 25,
          avgTrustScore: 750,
        },
        time: {
          activeOffers: 100,
          completedExchanges: 500,
          topCategories: [
            { category: 'coaching', rate: 3.5 },
            { category: 'tech', rate: 4.0 },
          ],
        },
        emotion: {
          totalAssets: 200,
          totalVolume: 25000,
          trendingAssets: [],
        },
      };

      expect(stats.improvement.activeGoals).toBe(150);
      expect(stats.trust.totalPool).toBe(50000);
      expect(stats.time.completedExchanges).toBe(500);
      expect(stats.emotion.totalAssets).toBe(200);
    });
  });
});
