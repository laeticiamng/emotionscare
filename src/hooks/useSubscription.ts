/**
 * Hook pour gérer l'état d'abonnement Stripe
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface SubscriptionState {
  isLoading: boolean;
  subscribed: boolean;
  plan: SubscriptionPlan;
  subscriptionEnd: string | null;
  error: string | null;
}

export interface UseSubscriptionReturn extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  createCheckout: (plan: 'pro' | 'business') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  isPro: boolean;
  isBusiness: boolean;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    subscribed: false,
    plan: 'free',
    subscriptionEnd: null,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false, subscribed: false, plan: 'free' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;

      setState({
        isLoading: false,
        subscribed: data.subscribed || false,
        plan: (data.plan as SubscriptionPlan) || 'free',
        subscriptionEnd: data.subscription_end || null,
        error: null,
      });
    } catch (err) {
      logger.error('Error checking subscription', err instanceof Error ? err : new Error(String(err)), 'API');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erreur lors de la vérification',
      }));
    }
  }, [user]);

  const createCheckout = useCallback(async (plan: 'pro' | 'business') => {
    if (!user) {
      throw new Error('Vous devez être connecté pour souscrire');
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('URL de paiement non reçue');

      // Ouvrir Stripe Checkout dans un nouvel onglet
      window.open(data.url, '_blank');
    } catch (err) {
      logger.error('Error creating checkout', err instanceof Error ? err : new Error(String(err)), 'API');
      throw err;
    }
  }, [user]);

  const openCustomerPortal = useCallback(async () => {
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;
      if (!data?.url) throw new Error('URL du portail non reçue');

      // Ouvrir le portail Stripe dans un nouvel onglet
      window.open(data.url, '_blank');
    } catch (err) {
      logger.error('Error opening customer portal', err instanceof Error ? err : new Error(String(err)), 'API');
      throw err;
    }
  }, [user]);

  // Vérifier l'abonnement au montage et quand l'utilisateur change
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh toutes les 60 secondes si l'utilisateur est connecté
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...state,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    isPro: state.plan === 'pro' || state.plan === 'business',
    isBusiness: state.plan === 'business',
  };
}

export default useSubscription;
