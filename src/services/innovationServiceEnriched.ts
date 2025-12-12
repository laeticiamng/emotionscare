// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { Experiment } from '@/types/innovation';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface ExperimentEnriched extends Experiment {
  votes?: { up: number; down: number };
  comments?: ExperimentComment[];
  isFavorite?: boolean;
  viewCount?: number;
  statusHistory?: StatusChange[];
  tags?: string[];
}

export interface ExperimentComment {
  id: string;
  experimentId: string;
  content: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
}

export interface StatusChange {
  status: string;
  changedAt: string;
  changedBy?: string;
  notes?: string;
}

export interface InnovationStats {
  totalExperiments: number;
  byStatus: Record<string, number>;
  totalVotes: number;
  averageVotesPerExperiment: number;
  mostVoted: string[];
  recentActivity: Array<{ type: string; experimentId: string; timestamp: string }>;
}

export interface InnovationFilter {
  status?: string[];
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'votes' | 'date' | 'views';
  dateFrom?: string;
  dateTo?: string;
}

const FAVORITES_KEY = 'emotionscare_innovation_favorites';
const VOTES_KEY = 'emotionscare_innovation_votes';

export const innovationServiceEnriched = {
  /**
   * Fetch all experiments with enriched data
   */
  async fetchExperiments(filter: InnovationFilter = {}): Promise<ExperimentEnriched[]> {
    try {
      let query = supabase
        .from('experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter.status?.length) {
        query = query.in('status', filter.status);
      }

      if (filter.dateFrom) {
        query = query.gte('created_at', filter.dateFrom);
      }

      if (filter.dateTo) {
        query = query.lte('created_at', filter.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching experiments', error as Error, 'API');
        throw error;
      }

      let experiments = (data || []) as ExperimentEnriched[];

      // Enrichir avec les données locales
      const favorites = this.getFavorites();
      const votes = this.getVotes();

      experiments = experiments.map(exp => ({
        ...exp,
        isFavorite: favorites.includes(exp.id),
        votes: votes[exp.id] || { up: 0, down: 0 },
        viewCount: Math.floor(Math.random() * 100) + 10 // Simulé pour l'instant
      }));

      // Filtrage par recherche
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        experiments = experiments.filter(e =>
          e.name.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
        );
      }

      // Tri
      if (filter.sortBy === 'votes') {
        experiments.sort((a, b) => 
          ((b.votes?.up || 0) - (b.votes?.down || 0)) - ((a.votes?.up || 0) - (a.votes?.down || 0))
        );
      } else if (filter.sortBy === 'views') {
        experiments.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      }

      return experiments;
    } catch (error) {
      logger.error('Error in fetchExperiments', error as Error, 'API');
      return [];
    }
  },

  /**
   * Create a new experiment
   */
  async createExperiment(
    exp: Omit<Experiment, 'id' | 'createdAt'> & { tags?: string[] }
  ): Promise<ExperimentEnriched | null> {
    try {
      const { data, error } = await supabase
        .from('experiments')
        .insert({
          name: exp.name,
          description: exp.description,
          status: exp.status || 'proposed',
          tags: exp.tags || []
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating experiment', error as Error, 'API');
        throw error;
      }

      toast.success('Expérience créée avec succès');
      return data as ExperimentEnriched;
    } catch (error) {
      toast.error('Erreur lors de la création');
      return null;
    }
  },

  /**
   * Update experiment status
   */
  async updateExperimentStatus(
    experimentId: string,
    newStatus: string,
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('experiments')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', experimentId);

      if (error) throw error;

      // Sauvegarder l'historique de statut localement
      const historyKey = `innovation_status_history_${experimentId}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      history.push({
        status: newStatus,
        changedAt: new Date().toISOString(),
        notes
      });
      localStorage.setItem(historyKey, JSON.stringify(history));

      toast.success(`Statut mis à jour: ${newStatus}`);
      return true;
    } catch (error) {
      logger.error('Error updating experiment status', error as Error, 'API');
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  },

  /**
   * Vote for an experiment
   */
  voteForExperiment(experimentId: string, voteType: 'up' | 'down'): void {
    const votes = this.getVotes();
    if (!votes[experimentId]) {
      votes[experimentId] = { up: 0, down: 0 };
    }
    votes[experimentId][voteType]++;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
    toast.success('Vote enregistré !');
  },

  /**
   * Get votes from storage
   */
  getVotes(): Record<string, { up: number; down: number }> {
    try {
      const stored = localStorage.getItem(VOTES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  /**
   * Toggle favorite
   */
  toggleFavorite(experimentId: string): boolean {
    const favorites = this.getFavorites();
    const isFav = favorites.includes(experimentId);
    
    if (isFav) {
      const updated = favorites.filter(id => id !== experimentId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      toast.success('Retiré des favoris');
      return false;
    } else {
      favorites.push(experimentId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      toast.success('Ajouté aux favoris');
      return true;
    }
  },

  /**
   * Get favorites from storage
   */
  getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Get favorite experiments
   */
  async getFavoriteExperiments(): Promise<ExperimentEnriched[]> {
    const favorites = this.getFavorites();
    const all = await this.fetchExperiments();
    return all.filter(e => favorites.includes(e.id));
  },

  /**
   * Add comment to experiment
   */
  addComment(experimentId: string, content: string): ExperimentComment {
    const commentsKey = `innovation_comments_${experimentId}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    
    const newComment: ExperimentComment = {
      id: Date.now().toString(),
      experimentId,
      content,
      authorId: 'current-user',
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    toast.success('Commentaire ajouté');
    
    return newComment;
  },

  /**
   * Get comments for experiment
   */
  getComments(experimentId: string): ExperimentComment[] {
    const commentsKey = `innovation_comments_${experimentId}`;
    try {
      return JSON.parse(localStorage.getItem(commentsKey) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Get innovation statistics
   */
  async getStatistics(): Promise<InnovationStats> {
    const experiments = await this.fetchExperiments();
    const votes = this.getVotes();

    const byStatus: Record<string, number> = {};
    experiments.forEach(e => {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    });

    let totalVotes = 0;
    Object.values(votes).forEach(v => {
      totalVotes += v.up + v.down;
    });

    const mostVoted = experiments
      .sort((a, b) => {
        const aVotes = (votes[a.id]?.up || 0) - (votes[a.id]?.down || 0);
        const bVotes = (votes[b.id]?.up || 0) - (votes[b.id]?.down || 0);
        return bVotes - aVotes;
      })
      .slice(0, 5)
      .map(e => e.name);

    return {
      totalExperiments: experiments.length,
      byStatus,
      totalVotes,
      averageVotesPerExperiment: experiments.length > 0 ? totalVotes / experiments.length : 0,
      mostVoted,
      recentActivity: []
    };
  },

  /**
   * Get recommendations based on user activity
   */
  async getRecommendations(): Promise<ExperimentEnriched[]> {
    const experiments = await this.fetchExperiments();
    const favorites = this.getFavorites();

    // Recommander les expériences populaires non encore en favori
    return experiments
      .filter(e => !favorites.includes(e.id))
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);
  },

  /**
   * Export experiments data
   */
  async exportExperiments(format: 'json' | 'csv' = 'json'): Promise<string> {
    const experiments = await this.fetchExperiments();
    const stats = await this.getStatistics();

    if (format === 'csv') {
      const headers = 'ID,Nom,Description,Status,Votes Up,Votes Down,Vues,Favori\n';
      const rows = experiments.map(e =>
        `${e.id},"${e.name}","${e.description || ''}",${e.status},${e.votes?.up || 0},${e.votes?.down || 0},${e.viewCount || 0},${e.isFavorite || false}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({
      experiments,
      statistics: stats,
      exportedAt: new Date().toISOString()
    }, null, 2);
  },

  /**
   * Download experiments export
   */
  async downloadExperiments(format: 'json' | 'csv' = 'json'): Promise<void> {
    const content = await this.exportExperiments(format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `innovations-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Delete experiment (admin only)
   */
  async deleteExperiment(experimentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('experiments')
        .delete()
        .eq('id', experimentId);

      if (error) throw error;

      toast.success('Expérience supprimée');
      return true;
    } catch (error) {
      logger.error('Error deleting experiment', error as Error, 'API');
      toast.error('Erreur lors de la suppression');
      return false;
    }
  }
};

export default innovationServiceEnriched;
