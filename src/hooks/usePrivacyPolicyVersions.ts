// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PrivacyPolicy {
  id: string;
  version: string;
  title: string;
  content: string;
  summary?: string;
  effective_date: string;
  created_at: string;
  created_by?: string;
  status: 'draft' | 'published' | 'archived';
  requires_acceptance: boolean;
  is_current: boolean;
  metadata?: any;
}

export interface PolicyChange {
  id: string;
  policy_id: string;
  change_type: string;
  section?: string;
  description: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
  created_by?: string;
}

export interface PolicyAcceptance {
  id: string;
  user_id: string;
  policy_id: string;
  accepted_at: string;
  ip_address?: string;
  user_agent?: string;
  acceptance_method: string;
}

export const usePrivacyPolicyVersions = () => {
  const [policies, setPolicies] = useState<PrivacyPolicy[]>([]);
  const [currentPolicy, setCurrentPolicy] = useState<PrivacyPolicy | null>(null);
  const [userAcceptance, setUserAcceptance] = useState<PolicyAcceptance | null>(null);
  const [needsAcceptance, setNeedsAcceptance] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger toutes les politiques (admin)
  const loadPolicies = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error: any) {
      console.error('Error loading policies:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les politiques',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Charger la politique actuelle
  const loadCurrentPolicy = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('privacy_policies')
        .select('*')
        .eq('is_current', true)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCurrentPolicy(data || null);

      // Vérifier si l'utilisateur a accepté
      if (data) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: acceptance, error: accError } = await supabase
            .from('policy_acceptances')
            .select('*')
            .eq('user_id', user.id)
            .eq('policy_id', data.id)
            .maybeSingle();

          if (accError && accError.code !== 'PGRST116') throw accError;
          setUserAcceptance(acceptance);
          setNeedsAcceptance(data.requires_acceptance && !acceptance);
        }
      }
    } catch (error: any) {
      console.error('Error loading current policy:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle politique
  const createPolicy = useCallback(async (policyData: Partial<PrivacyPolicy>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('privacy_policies')
        .insert({
          ...policyData,
          created_by: user?.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Politique créée avec succès',
      });

      await loadPolicies();
      return data;
    } catch (error: any) {
      console.error('Error creating policy:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de créer la politique',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, loadPolicies]);

  // Publier une politique
  const publishPolicy = useCallback(async (policyId: string) => {
    try {
      const { error } = await supabase.rpc('publish_privacy_policy', {
        policy_uuid: policyId,
      });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Politique publiée avec succès',
      });

      // Déclencher les notifications
      await supabase.functions.invoke('notify-policy-update', {
        body: { policy_id: policyId },
      });

      await loadPolicies();
      await loadCurrentPolicy();
    } catch (error: any) {
      console.error('Error publishing policy:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de publier la politique',
        variant: 'destructive',
      });
    }
  }, [toast, loadPolicies, loadCurrentPolicy]);

  // Enregistrer les changements
  const logChanges = useCallback(async (
    policyId: string,
    changes: Array<Omit<PolicyChange, 'id' | 'policy_id' | 'created_at' | 'created_by'>>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('policy_changes')
        .insert(
          changes.map(change => ({
            ...change,
            policy_id: policyId,
            created_by: user?.id,
          }))
        );

      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging changes:', error);
    }
  }, []);

  // Accepter la politique
  const acceptPolicy = useCallback(async (policyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('policy_acceptances')
        .insert({
          user_id: user.id,
          policy_id: policyId,
          acceptance_method: 'explicit',
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Politique acceptée',
      });

      await loadCurrentPolicy();
    } catch (error: any) {
      console.error('Error accepting policy:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'accepter la politique',
        variant: 'destructive',
      });
    }
  }, [toast, loadCurrentPolicy]);

  // Obtenir l'historique des changements
  const getPolicyChanges = useCallback(async (policyId: string) => {
    try {
      const { data, error } = await supabase
        .from('policy_changes')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error loading policy changes:', error);
      return [];
    }
  }, []);

  // Obtenir les statistiques d'acceptation
  const getAcceptanceStats = useCallback(async (policyId: string) => {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: acceptedUsers } = await supabase
        .from('policy_acceptances')
        .select('*', { count: 'exact', head: true })
        .eq('policy_id', policyId);

      return {
        total: totalUsers || 0,
        accepted: acceptedUsers || 0,
        pending: (totalUsers || 0) - (acceptedUsers || 0),
        percentage: totalUsers ? ((acceptedUsers || 0) / totalUsers) * 100 : 0,
      };
    } catch (error: any) {
      console.error('Error loading acceptance stats:', error);
      return { total: 0, accepted: 0, pending: 0, percentage: 0 };
    }
  }, []);

  useEffect(() => {
    loadCurrentPolicy();
  }, [loadCurrentPolicy]);

  return {
    policies,
    currentPolicy,
    userAcceptance,
    needsAcceptance,
    loading,
    loadPolicies,
    loadCurrentPolicy,
    createPolicy,
    publishPolicy,
    logChanges,
    acceptPolicy,
    getPolicyChanges,
    getAcceptanceStats,
  };
};
