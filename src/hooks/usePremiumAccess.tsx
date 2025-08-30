/**
 * Stripe Premium Gating Hook - Contrôle serveur des fonctionnalités Premium
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  loading: boolean;
  error?: string;
}

/**
 * Hook pour vérifier l'accès Premium via Stripe
 * Contrôle serveur-side (pas juste un badge UI)
 */
export const usePremiumAccess = () => {
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    loading: true,
  });

  const checkSubscription = async () => {
    if (!isAuthenticated || !user) {
      setStatus({ subscribed: false, loading: false });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));
      
      // Appel sécurisé côté serveur
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.warn('[Premium] Erreur vérification:', error);
        setStatus({
          subscribed: false,
          loading: false,
          error: 'Erreur de vérification premium'
        });
        return;
      }

      setStatus({
        subscribed: data?.subscribed || false,
        subscription_tier: data?.subscription_tier,
        subscription_end: data?.subscription_end,
        loading: false,
      });
    } catch (err) {
      console.warn('[Premium] Erreur:', err);
      setStatus({
        subscribed: false,
        loading: false,
        error: 'Service indisponible'
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [isAuthenticated, user]);

  const hasAccess = (feature: 'music' | 'coach' | 'vr-premium'): boolean => {
    // Pendant le chargement, on bloque l'accès
    if (status.loading) return false;
    
    // Logique métier Premium
    switch (feature) {
      case 'music':
      case 'coach':
        return status.subscribed;
      case 'vr-premium':
        return status.subscribed && status.subscription_tier !== 'Basic';
      default:
        return false;
    }
  };

  return {
    ...status,
    hasAccess,
    refreshStatus: checkSubscription,
  };
};

/**
 * Composant Wrapper pour gating Premium
 */
interface PremiumGateProps {
  feature: 'music' | 'coach' | 'vr-premium';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ 
  feature, 
  children, 
  fallback 
}) => {
  const { hasAccess, loading, subscribed } = usePremiumAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess(feature)) {
    return fallback || (
      <div className="text-center p-8 bg-muted/50 rounded-lg border-2 border-dashed">
        <h3 className="text-lg font-semibold mb-2">Fonctionnalité Premium</h3>
        <p className="text-muted-foreground mb-4">
          Cette fonctionnalité nécessite un abonnement actif.
        </p>
        <button className="btn btn-primary">
          Découvrir Premium
        </button>
      </div>
    );
  }

  return <>{children}</>;
};