import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface CustomChallenge {
  id: string;
  created_by: string;
  title: string;
  description?: string;
  type: string;
  objective: string;
  target_value: number;
  reward_type: string;
  reward_value: any;
  emotional_profile: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export const useCustomChallenges = () => {
  const [challenges, setChallenges] = useState<CustomChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      logger.error('Error fetching custom challenges:', error, 'HOOK');
      toast.error('Erreur lors du chargement des défis');
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (challenge: Omit<CustomChallenge, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('custom_challenges')
        .insert({
          ...challenge,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Défi personnalisé créé avec succès');
      fetchChallenges();
      return data;
    } catch (error: any) {
      logger.error('Error creating challenge:', error, 'HOOK');
      toast.error(error.message || 'Erreur lors de la création du défi');
      return null;
    }
  };

  const updateChallenge = async (id: string, updates: Partial<CustomChallenge>) => {
    try {
      const { error } = await supabase
        .from('custom_challenges')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Défi mis à jour');
      fetchChallenges();
      return true;
    } catch (error: any) {
      logger.error('Error updating challenge:', error, 'HOOK');
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return false;
    }
  };

  const deleteChallenge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_challenges')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Défi supprimé');
      fetchChallenges();
    } catch (error: any) {
      logger.error('Error deleting challenge:', error, 'HOOK');
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    refetch: fetchChallenges,
  };
};
