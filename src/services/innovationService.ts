// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { Experiment } from '@/types/innovation';
import { logger } from '@/lib/logger';

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
      logger.error('Error fetching experiments', error as Error, 'API');
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
      logger.error('Error creating experiment', error as Error, 'API');
      throw error;
    }

    return data as Experiment;
  }
};

export default innovationService;
