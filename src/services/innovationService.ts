import { supabase } from '@/integrations/supabase/client';
import { Experiment } from '@/types/innovation';

/**
 * Service for managing innovation experiments
 */
export const innovationService = {
  async fetchExperiments(): Promise<Experiment[]> {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching experiments:', error);
      throw error;
    }

    return (data || []) as Experiment[];
  },

  async createExperiment(
    exp: Omit<Experiment, 'id' | 'createdAt'>
  ): Promise<Experiment> {
    const { data, error } = await supabase
      .from('experiments')
      .insert({
        name: exp.name,
        description: exp.description,
        status: exp.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }

    return data as Experiment;
  }
};

export default innovationService;
