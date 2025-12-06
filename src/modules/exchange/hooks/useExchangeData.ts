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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
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
        .insert({ ...offer, user_id: user?.id })
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
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
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
