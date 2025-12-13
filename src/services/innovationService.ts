// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { Experiment } from '@/types/innovation';
import { logger } from '@/lib/logger';

/** Résultat d'expérience */
export interface ExperimentResult {
  experimentId: string;
  metric: string;
  value: number;
  control: number;
  improvement: number;
  significance: number;
  sampleSize: number;
}

/** Variante d'expérience */
export interface ExperimentVariant {
  id: string;
  experimentId: string;
  name: string;
  description: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
}

/** Idée d'innovation */
export interface InnovationIdea {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'research' | 'other';
  status: 'new' | 'reviewing' | 'approved' | 'rejected' | 'implemented';
  votes: number;
  submittedBy: string;
  createdAt: Date;
}

/** Feedback d'innovation */
export interface InnovationFeedback {
  id: string;
  ideaId: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: Date;
}

/**
 * Service for managing innovation experiments
 */
export const innovationService = {
  /** Récupère tous les expériments */
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

  /** Crée un nouvel expériment */
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

    logger.info('Experiment created', { name: exp.name }, 'INNOVATION');
    return data as Experiment;
  },

  /** Met à jour un expériment */
  async updateExperiment(id: string, updates: Partial<Experiment>): Promise<Experiment> {
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating experiment', error as Error, 'API');
      throw error;
    }

    return data as Experiment;
  },

  /** Supprime un expériment */
  async deleteExperiment(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting experiment', error as Error, 'API');
      throw error;
    }

    logger.info('Experiment deleted', { id }, 'INNOVATION');
    return true;
  },

  /** Récupère un expériment par ID */
  async getExperimentById(id: string): Promise<Experiment | null> {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as Experiment;
  },

  /** Démarre un expériment */
  async startExperiment(id: string): Promise<Experiment> {
    return this.updateExperiment(id, { status: 'running' });
  },

  /** Arrête un expériment */
  async stopExperiment(id: string): Promise<Experiment> {
    return this.updateExperiment(id, { status: 'completed' });
  },

  /** Récupère les résultats d'un expériment */
  async getExperimentResults(experimentId: string): Promise<ExperimentResult[]> {
    try {
      const { data, error } = await supabase
        .from('experiment_results')
        .select('*')
        .eq('experiment_id', experimentId);

      if (error) throw error;

      return (data || []).map(r => ({
        experimentId: r.experiment_id,
        metric: r.metric,
        value: r.value,
        control: r.control,
        improvement: r.improvement,
        significance: r.significance,
        sampleSize: r.sample_size
      }));
    } catch (error) {
      logger.error('Error fetching experiment results', error as Error, 'INNOVATION');
      return [];
    }
  },

  /** Récupère les variantes d'un expériment */
  async getExperimentVariants(experimentId: string): Promise<ExperimentVariant[]> {
    try {
      const { data, error } = await supabase
        .from('experiment_variants')
        .select('*')
        .eq('experiment_id', experimentId);

      if (error) throw error;

      return (data || []).map(v => ({
        id: v.id,
        experimentId: v.experiment_id,
        name: v.name,
        description: v.description,
        traffic: v.traffic,
        conversions: v.conversions,
        conversionRate: v.conversions / Math.max(v.traffic, 1)
      }));
    } catch (error) {
      return [];
    }
  },

  /** Enregistre une conversion */
  async trackConversion(experimentId: string, variantId: string): Promise<void> {
    try {
      await supabase.rpc('increment_conversion', {
        p_experiment_id: experimentId,
        p_variant_id: variantId
      });
    } catch (error) {
      logger.error('Error tracking conversion', error as Error, 'INNOVATION');
    }
  },

  /** Soumet une idée d'innovation */
  async submitIdea(idea: Omit<InnovationIdea, 'id' | 'votes' | 'createdAt' | 'status'>): Promise<InnovationIdea | null> {
    try {
      const { data, error } = await supabase
        .from('innovation_ideas')
        .insert({
          title: idea.title,
          description: idea.description,
          category: idea.category,
          submitted_by: idea.submittedBy,
          status: 'new',
          votes: 0
        })
        .select()
        .single();

      if (error) throw error;
      logger.info('Idea submitted', { title: idea.title }, 'INNOVATION');

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        votes: data.votes,
        submittedBy: data.submitted_by,
        createdAt: new Date(data.created_at)
      };
    } catch (error) {
      logger.error('Error submitting idea', error as Error, 'INNOVATION');
      return null;
    }
  },

  /** Récupère les idées d'innovation */
  async getIdeas(status?: string): Promise<InnovationIdea[]> {
    try {
      let query = supabase
        .from('innovation_ideas')
        .select('*')
        .order('votes', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(i => ({
        id: i.id,
        title: i.title,
        description: i.description,
        category: i.category,
        status: i.status,
        votes: i.votes,
        submittedBy: i.submitted_by,
        createdAt: new Date(i.created_at)
      }));
    } catch (error) {
      return [];
    }
  },

  /** Vote pour une idée */
  async voteForIdea(ideaId: string, vote: 1 | -1): Promise<void> {
    try {
      await supabase.rpc('vote_idea', { p_idea_id: ideaId, p_vote: vote });
    } catch (error) {
      logger.error('Error voting for idea', error as Error, 'INNOVATION');
    }
  },

  /** Ajoute un feedback à une idée */
  async addFeedback(ideaId: string, comment: string, rating: number): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      await supabase.from('innovation_feedback').insert({
        idea_id: ideaId,
        user_id: userData.user.id,
        comment,
        rating
      });
    } catch (error) {
      logger.error('Error adding feedback', error as Error, 'INNOVATION');
    }
  },

  /** Récupère les métriques d'innovation */
  async getInnovationMetrics(): Promise<{
    totalExperiments: number;
    activeExperiments: number;
    totalIdeas: number;
    implementedIdeas: number;
    averageImpact: number;
  }> {
    try {
      const experiments = await this.fetchExperiments();
      const ideas = await this.getIdeas();

      return {
        totalExperiments: experiments.length,
        activeExperiments: experiments.filter(e => e.status === 'running').length,
        totalIdeas: ideas.length,
        implementedIdeas: ideas.filter(i => i.status === 'implemented').length,
        averageImpact: 0 // À calculer depuis les résultats
      };
    } catch (error) {
      return {
        totalExperiments: 0,
        activeExperiments: 0,
        totalIdeas: 0,
        implementedIdeas: 0,
        averageImpact: 0
      };
    }
  }
};

export default innovationService;
