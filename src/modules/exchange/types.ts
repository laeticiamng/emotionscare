/**
 * Types for EmotionsCare Exchange V2.0
 */

// Improvement Market
export interface ImprovementGoal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  improvement_score: number;
  ai_analysis?: Record<string, unknown>;
  started_at: string;
  target_date?: string;
  completed_at?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export type GoalType = 'sleep' | 'stress' | 'productivity' | 'study' | 'fitness' | 'meditation';

export interface ImprovementLog {
  id: string;
  goal_id: string;
  user_id: string;
  value_change: number;
  new_value: number;
  ai_feedback?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Trust Market
export interface TrustProfile {
  id: string;
  user_id: string;
  trust_score: number;
  total_given: number;
  total_received: number;
  verified_actions: number;
  level: TrustLevel;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export type TrustLevel = 'newcomer' | 'trusted' | 'verified' | 'expert' | 'legend';

export interface TrustProject {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  category: string;
  trust_pool: number;
  backers_count: number;
  status: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrustTransaction {
  id: string;
  from_user_id: string;
  to_user_id?: string;
  to_project_id?: string;
  amount: number;
  reason?: string;
  transaction_type: 'give' | 'receive' | 'earn' | 'stake';
  verified: boolean;
  created_at: string;
}

// Time Exchange Market
export interface TimeOffer {
  id: string;
  user_id: string;
  skill_category: SkillCategory;
  skill_name: string;
  description?: string;
  hours_available: number;
  time_value: number;
  rating: number;
  reviews_count: number;
  status: 'available' | 'reserved' | 'completed';
  created_at: string;
  updated_at: string;
}

export type SkillCategory = 'tech' | 'music' | 'coaching' | 'medicine' | 'art' | 'language' | 'business';

export interface TimeExchange {
  id: string;
  offer_id: string;
  requester_id: string;
  provider_id: string;
  hours_exchanged: number;
  exchange_for_offer_id?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  rating_given?: number;
  rating_received?: number;
  feedback?: string;
  scheduled_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface TimeMarketRate {
  id: string;
  category: SkillCategory;
  current_rate: number;
  demand_index: number;
  supply_count: number;
  trend: 'up' | 'down' | 'stable';
  updated_at: string;
}

// Emotion Exchange Market
export interface EmotionAsset {
  id: string;
  name: string;
  emotion_type: EmotionType;
  description?: string;
  intensity: number;
  music_config?: MusicConfig;
  ambient_config?: AmbientConfig;
  base_price: number;
  current_price: number;
  demand_score: number;
  total_purchases: number;
  creator_id?: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export type EmotionType = 'calm' | 'focus' | 'energy' | 'joy' | 'creativity' | 'confidence';

export interface MusicConfig {
  tempo: number;
  genre: string;
  mood: string;
}

export interface AmbientConfig {
  color: string;
  light: number;
}

export interface EmotionPortfolio {
  id: string;
  user_id: string;
  asset_id: string;
  quantity: number;
  acquired_price: number;
  acquired_at: string;
  last_used_at?: string;
  asset?: EmotionAsset;
}

export interface EmotionTransaction {
  id: string;
  user_id: string;
  asset_id: string;
  transaction_type: 'buy' | 'sell' | 'use' | 'gift';
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at: string;
}

// Exchange Hub
export interface ExchangeProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  improvement_rank?: number;
  trust_rank?: number;
  time_rank?: number;
  emotion_rank?: number;
  badges: string[];
  achievements: string[];
  stats: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  market_type: MarketType;
  score: number;
  rank: number;
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  recorded_at: string;
  profile?: ExchangeProfile;
}

export type MarketType = 'improvement' | 'trust' | 'time' | 'emotion' | 'global';

// Market Stats
export interface MarketStats {
  improvement: {
    activeGoals: number;
    avgScore: number;
    topCategories: { type: GoalType; count: number }[];
  };
  trust: {
    totalPool: number;
    activeProjects: number;
    avgTrustScore: number;
  };
  time: {
    activeOffers: number;
    completedExchanges: number;
    topCategories: { category: SkillCategory; rate: number }[];
  };
  emotion: {
    totalAssets: number;
    totalVolume: number;
    trendingAssets: EmotionAsset[];
  };
}
