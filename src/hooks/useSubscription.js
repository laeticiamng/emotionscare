import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
    fetchCurrentPlan();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly');

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Set default free plan for non-authenticated users
        setCurrentPlan({ plan_name: 'free', status: 'free' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .rpc('get_user_current_plan');

      if (error) throw error;
      
      setCurrentPlan(data?.[0] || { plan_name: 'free', status: 'free' });
    } catch (error) {
      console.error('Error fetching current plan:', error);
      setCurrentPlan({ plan_name: 'free', status: 'free' });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planName, isYearly = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const plan = plans.find(p => p.name === planName);
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          is_yearly: isYearly,
          expires_at: isYearly 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCurrentPlan();
      return { success: true, subscription: data };
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      return { success: false, error: error.message };
    }
  };

  const cancelSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      await fetchCurrentPlan();
      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    currentPlan,
    plans,
    loading,
    subscribeToPlan,
    cancelSubscription,
    refetch: fetchCurrentPlan
  };
};