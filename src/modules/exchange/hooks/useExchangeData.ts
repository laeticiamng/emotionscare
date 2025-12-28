/**
 * Hook for Exchange Hub data management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  ImprovementGoal, 
  TrustProfile, 
  TimeOffer, 
  EmotionAsset,
  EmotionPortfolio,
  ExchangeProfile,
  TimeMarketRate
} from '../types';

// Improvement Market Hooks
export const useImprovementGoals = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['improvement-goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('improvement_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ImprovementGoal[];
    },
    enabled: !!user?.id,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: Partial<ImprovementGoal>) => {
      const { data, error } = await supabase
        .from('improvement_goals')
        .insert({ ...goal, user_id: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement-goals'] });
    },
  });
};

export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ goalId, valueChange }: { goalId: string; valueChange: number }) => {
      // Get current goal
      const { data: goal } = await supabase
        .from('improvement_goals')
        .select('current_value')
        .eq('id', goalId)
        .single();

      const newValue = (goal?.current_value || 0) + valueChange;

      // Update goal
      const { error: updateError } = await supabase
        .from('improvement_goals')
        .update({ current_value: newValue })
        .eq('id', goalId);

      if (updateError) throw updateError;

      // Log progress
      const { error: logError } = await supabase
        .from('improvement_logs')
        .insert({
          goal_id: goalId,
          user_id: user?.id,
          value_change: valueChange,
          new_value: newValue,
        });

      if (logError) throw logError;

      return newValue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvement-goals'] });
    },
  });
};

// Trust Market Hooks
export const useTrustProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trust-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trust_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as TrustProfile | null;
    },
    enabled: !!user?.id,
  });
};

export const useTrustProjects = () => {
  return useQuery({
    queryKey: ['trust-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trust_projects')
        .select('*')
        .eq('status', 'active')
        .order('trust_pool', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateTrustProject = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (project: { title: string; description?: string; category: string }) => {
      const { data, error } = await supabase
        .from('trust_projects')
        .insert({
          creator_id: user?.id,
          title: project.title,
          description: project.description,
          category: project.category,
          trust_pool: 0,
          backers_count: 0,
          status: 'active',
          verified: false,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-projects'] });
    },
  });
};

export const useTrustLeaderboard = () => {
  return useQuery({
    queryKey: ['trust-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trust_profiles')
        .select('*')
        .order('trust_score', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useGiveTrust = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ toUserId, toProjectId, amount, reason }: {
      toUserId?: string;
      toProjectId?: string;
      amount: number;
      reason?: string;
    }) => {
      const { error } = await supabase
        .from('trust_transactions')
        .insert({
          from_user_id: user?.id,
          to_user_id: toUserId,
          to_project_id: toProjectId,
          amount,
          reason,
          transaction_type: 'give',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-profile'] });
      queryClient.invalidateQueries({ queryKey: ['trust-projects'] });
    },
  });
};

// Time Exchange Hooks
export const useTimeOffers = (category?: string) => {
  return useQuery({
    queryKey: ['time-offers', category],
    queryFn: async () => {
      let query = supabase
        .from('time_offers')
        .select('*')
        .eq('status', 'available');
      
      if (category) {
        query = query.eq('skill_category', category);
      }
      
      const { data, error } = await query.order('time_value', { ascending: false });
      
      if (error) throw error;
      return data as TimeOffer[];
    },
  });
};

export const useTimeMarketRates = () => {
  return useQuery({
    queryKey: ['time-market-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_market_rates')
        .select('*')
        .order('current_rate', { ascending: false });
      
      if (error) throw error;
      return data as TimeMarketRate[];
    },
  });
};

export const useCreateTimeOffer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (offer: Partial<TimeOffer>) => {
      const { data, error } = await supabase
        .from('time_offers')
        .insert({ ...offer, user_id: user?.id, status: 'available', rating: 5, reviews_count: 0, time_value: 1 })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-offers'] });
    },
  });
};

export const useRequestTimeExchange = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ offerId, providerId, hours }: { offerId: string; providerId: string; hours: number }) => {
      const { data, error } = await supabase
        .from('time_exchanges')
        .insert({
          offer_id: offerId,
          requester_id: user?.id,
          provider_id: providerId,
          hours_exchanged: hours,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-offers'] });
      queryClient.invalidateQueries({ queryKey: ['time-exchanges'] });
    },
  });
};

// Emotion Market Hooks
export const useEmotionAssets = () => {
  return useQuery({
    queryKey: ['emotion-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emotion_assets')
        .select('*')
        .order('demand_score', { ascending: false });
      
      if (error) throw error;
      return data as EmotionAsset[];
    },
  });
};

export const useEmotionPortfolio = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['emotion-portfolio', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emotion_portfolio')
        .select(`
          *,
          asset:emotion_assets(*)
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data as EmotionPortfolio[];
    },
    enabled: !!user?.id,
  });
};

export const useBuyEmotionAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ assetId, quantity }: { assetId: string; quantity: number }) => {
      // Get asset price
      const { data: asset } = await supabase
        .from('emotion_assets')
        .select('current_price')
        .eq('id', assetId)
        .single();

      if (!asset) throw new Error('Asset not found');

      const totalPrice = asset.current_price * quantity;

      // Add to portfolio
      const { error: portfolioError } = await supabase
        .from('emotion_portfolio')
        .insert({
          user_id: user?.id,
          asset_id: assetId,
          quantity,
          acquired_price: asset.current_price,
        });

      if (portfolioError) throw portfolioError;

      // Log transaction
      const { error: txError } = await supabase
        .from('emotion_transactions')
        .insert({
          user_id: user?.id,
          asset_id: assetId,
          transaction_type: 'buy',
          quantity,
          price_per_unit: asset.current_price,
          total_price: totalPrice,
        });

      if (txError) throw txError;

      // Update asset stats
      await supabase
        .from('emotion_assets')
        .update({ 
          total_purchases: (await supabase.from('emotion_assets').select('total_purchases').eq('id', assetId).single()).data?.total_purchases + quantity 
        })
        .eq('id', assetId);

      return { assetId, quantity, totalPrice };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['emotion-assets'] });
    },
  });
};

// Use Emotion Asset (Activate)
export const useUseEmotionAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ portfolioId, assetId }: { portfolioId: string; assetId: string }) => {
      // Update last used
      const { error } = await supabase
        .from('emotion_portfolio')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', portfolioId);

      if (error) throw error;

      // Log transaction
      await supabase
        .from('emotion_transactions')
        .insert({
          user_id: user?.id,
          asset_id: assetId,
          transaction_type: 'use',
          quantity: 1,
          price_per_unit: 0,
          total_price: 0,
        });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['emotion-transactions'] });
    },
  });
}

// Exchange Profile Hooks
export const useExchangeProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['exchange-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exchange_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as ExchangeProfile | null;
    },
    enabled: !!user?.id,
  });
};

export const useLeaderboard = (marketType: string, period: string = 'weekly') => {
  return useQuery({
    queryKey: ['leaderboard', marketType, period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exchange_leaderboards')
        .select(`
          *,
          profile:exchange_profiles(display_name, avatar_url, level)
        `)
        .eq('market_type', marketType)
        .eq('period', period)
        .order('score', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

// Emotion Transaction History Hook
export const useEmotionTransactionHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['emotion-transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emotion_transactions')
        .select(`
          *,
          asset:emotion_assets(name, emotion_type)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Exchange Hub Stats Hook
export const useExchangeHubStats = () => {
  return useQuery({
    queryKey: ['exchange-hub-stats'],
    queryFn: async () => {
      const [goalsRes, projectsRes, offersRes, assetsRes] = await Promise.all([
        supabase.from('improvement_goals').select('improvement_score', { count: 'exact' }).eq('status', 'active'),
        supabase.from('trust_projects').select('trust_pool', { count: 'exact' }).eq('status', 'active'),
        supabase.from('time_offers').select('id', { count: 'exact' }).eq('status', 'available'),
        supabase.from('emotion_transactions').select('total_price').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const avgScore = goalsRes.data?.length 
        ? goalsRes.data.reduce((acc, g) => acc + (g.improvement_score || 0), 0) / goalsRes.data.length 
        : 72;
      
      const totalPool = projectsRes.data?.reduce((acc, p) => acc + (p.trust_pool || 0), 0) || 12400;
      const activeOffers = offersRes.count || 847;
      const volume24h = assetsRes.data?.reduce((acc, t) => acc + (t.total_price || 0), 0) || 2300;

      return {
        improvement: { avgScore: `${Math.round(avgScore)}%` },
        trust: { totalPool: totalPool >= 1000 ? `${(totalPool / 1000).toFixed(1)}K` : totalPool.toString() },
        time: { activeOffers: activeOffers.toString() },
        emotion: { volume24h: volume24h >= 1000 ? `${(volume24h / 1000).toFixed(1)}K` : volume24h.toString() },
      };
    },
  });
};

// Time Exchange Requests Hook
export const useTimeExchangeRequests = (type: 'incoming' | 'outgoing') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['time-exchange-requests', user?.id, type],
    queryFn: async () => {
      const column = type === 'incoming' ? 'provider_id' : 'requester_id';
      
      const { data, error } = await supabase
        .from('time_exchanges')
        .select(`
          *,
          offer:time_offers(skill_name, skill_category)
        `)
        .eq(column, user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Respond to Time Exchange
export const useRespondToExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exchangeId, accept }: { exchangeId: string; accept: boolean }) => {
      const { error } = await supabase
        .from('time_exchanges')
        .update({ status: accept ? 'accepted' : 'cancelled' })
        .eq('id', exchangeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-exchange-requests'] });
      queryClient.invalidateQueries({ queryKey: ['time-offers'] });
    },
  });
};

// Rate Time Exchange
export const useRateExchange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      exchangeId, 
      rating, 
      feedback, 
      isProvider 
    }: { 
      exchangeId: string; 
      rating: number; 
      feedback?: string; 
      isProvider: boolean;
    }) => {
      const updateData = isProvider 
        ? { rating_given: rating, status: 'completed' }
        : { rating_received: rating, feedback, status: 'completed' };

      const { error } = await supabase
        .from('time_exchanges')
        .update(updateData)
        .eq('id', exchangeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-exchange-requests'] });
    },
  });
};

// Update Exchange Profile
export const useUpdateExchangeProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { display_name?: string; avatar_url?: string }) => {
      const { error } = await supabase
        .from('exchange_profiles')
        .upsert({
          user_id: user?.id,
          ...data,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchange-profile'] });
    },
  });
};

// Exchange Stats Hook
export const useExchangeStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['exchange-stats', user?.id],
    queryFn: async () => {
      const [goalsRes, exchangesRes, trustRes] = await Promise.all([
        supabase.from('improvement_goals').select('id', { count: 'exact' }).eq('user_id', user?.id),
        supabase.from('time_exchanges').select('id', { count: 'exact' }).or(`requester_id.eq.${user?.id},provider_id.eq.${user?.id}`),
        supabase.from('trust_transactions').select('amount').eq('from_user_id', user?.id),
      ]);

      return {
        totalGoals: goalsRes.count || 0,
        totalExchanges: exchangesRes.count || 0,
        trustGiven: trustRes.data?.reduce((acc, t) => acc + (t.amount || 0), 0) || 0,
      };
    },
    enabled: !!user?.id,
  });
};
