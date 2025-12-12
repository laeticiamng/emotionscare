import { supabase } from '@/integrations/supabase/client';

export interface AmbitionRun {
  id: string;
  userId: string;
  objective: string;
  status: 'active' | 'completed' | 'abandoned';
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  completedAt?: Date;
  isFavorite?: boolean;
  rating?: number;
}

export interface AmbitionQuest {
  id: string;
  runId: string;
  title: string;
  flavor?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  xpReward: number;
  estMinutes?: number;
  notes?: string;
  result?: string;
  completedAt?: Date;
  createdAt: Date;
}

export interface AmbitionArtifact {
  id: string;
  runId: string;
  name: string;
  description?: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  obtainedAt: Date;
}

export interface AmbitionStats {
  totalRuns: number;
  completedRuns: number;
  abandonedRuns: number;
  totalQuests: number;
  completedQuests: number;
  totalXpEarned: number;
  averageQuestsPerRun: number;
  completionRate: number;
  favoriteRuns: number;
  artifactsCollected: number;
  longestStreak: number;
  currentStreak: number;
  totalTimeSpent: number;
  byTag: Record<string, number>;
}

export interface RunRecommendation {
  id: string;
  type: 'continue' | 'similar' | 'popular' | 'new';
  title: string;
  description: string;
  tags: string[];
  confidence: number;
  basedOn?: string;
}

const STORAGE_KEYS = {
  favorites: 'ambition_favorites',
  ratings: 'ambition_ratings',
  stats: 'ambition_local_stats',
  recommendations: 'ambition_recommendations'
};

class AmbitionArcadeServiceEnriched {
  // ===== RUNS =====
  async getRuns(userId: string): Promise<AmbitionRun[]> {
    const { data, error } = await supabase
      .from('ambition_runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const favorites = this.getFavorites();
    const ratings = this.getRatings();

    return (data || []).map(run => ({
      id: run.id,
      userId: run.user_id || '',
      objective: run.objective || '',
      status: (run.status as AmbitionRun['status']) || 'active',
      tags: run.tags || [],
      metadata: (run.metadata as Record<string, unknown>) || {},
      createdAt: new Date(run.created_at || Date.now()),
      completedAt: run.completed_at ? new Date(run.completed_at) : undefined,
      isFavorite: favorites.includes(run.id),
      rating: ratings[run.id]
    }));
  }

  async createRun(userId: string, objective: string, tags: string[] = []): Promise<AmbitionRun> {
    const { data, error } = await supabase
      .from('ambition_runs')
      .insert({
        user_id: userId,
        objective,
        tags,
        status: 'active',
        metadata: {}
      })
      .select()
      .single();

    if (error) throw error;
    this.updateLocalStats({ runsCreated: 1 });

    return {
      id: data.id,
      userId: data.user_id || '',
      objective: data.objective || '',
      status: 'active',
      tags: data.tags || [],
      metadata: {},
      createdAt: new Date(data.created_at || Date.now())
    };
  }

  async completeRun(runId: string): Promise<void> {
    const { error } = await supabase
      .from('ambition_runs')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', runId);

    if (error) throw error;
    this.updateLocalStats({ runsCompleted: 1 });
  }

  async abandonRun(runId: string): Promise<void> {
    const { error } = await supabase
      .from('ambition_runs')
      .update({ status: 'abandoned' })
      .eq('id', runId);

    if (error) throw error;
  }

  // ===== QUESTS =====
  async getQuests(runId: string): Promise<AmbitionQuest[]> {
    const { data, error } = await supabase
      .from('ambition_quests')
      .select('*')
      .eq('run_id', runId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(quest => ({
      id: quest.id,
      runId: quest.run_id || '',
      title: quest.title,
      flavor: quest.flavor || undefined,
      status: (quest.status as AmbitionQuest['status']) || 'pending',
      xpReward: quest.xp_reward || 0,
      estMinutes: quest.est_minutes || undefined,
      notes: quest.notes || undefined,
      result: quest.result || undefined,
      completedAt: quest.completed_at ? new Date(quest.completed_at) : undefined,
      createdAt: new Date(quest.created_at || Date.now())
    }));
  }

  async createQuest(runId: string, title: string, xpReward: number = 10, estMinutes?: number): Promise<AmbitionQuest> {
    const { data, error } = await supabase
      .from('ambition_quests')
      .insert({
        run_id: runId,
        title,
        xp_reward: xpReward,
        est_minutes: estMinutes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      runId: data.run_id || '',
      title: data.title,
      status: 'pending',
      xpReward: data.xp_reward || 0,
      estMinutes: data.est_minutes || undefined,
      createdAt: new Date(data.created_at || Date.now())
    };
  }

  async completeQuest(questId: string, result?: string): Promise<void> {
    const { data, error } = await supabase
      .from('ambition_quests')
      .update({ 
        status: 'completed', 
        completed_at: new Date().toISOString(),
        result 
      })
      .eq('id', questId)
      .select('xp_reward')
      .single();

    if (error) throw error;
    this.updateLocalStats({ questsCompleted: 1, xpEarned: data?.xp_reward || 0 });
  }

  // ===== ARTIFACTS =====
  async getArtifacts(runId: string): Promise<AmbitionArtifact[]> {
    const { data, error } = await supabase
      .from('ambition_artifacts')
      .select('*')
      .eq('run_id', runId);

    if (error) throw error;

    return (data || []).map(artifact => ({
      id: artifact.id,
      runId: artifact.run_id || '',
      name: artifact.name,
      description: artifact.description || undefined,
      icon: artifact.icon || undefined,
      rarity: (artifact.rarity as AmbitionArtifact['rarity']) || 'common',
      obtainedAt: new Date(artifact.obtained_at || Date.now())
    }));
  }

  async awardArtifact(runId: string, name: string, rarity: AmbitionArtifact['rarity'], description?: string): Promise<AmbitionArtifact> {
    const { data, error } = await supabase
      .from('ambition_artifacts')
      .insert({
        run_id: runId,
        name,
        rarity,
        description,
        obtained_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    this.updateLocalStats({ artifactsCollected: 1 });

    return {
      id: data.id,
      runId: data.run_id || '',
      name: data.name,
      description: data.description || undefined,
      rarity: data.rarity as AmbitionArtifact['rarity'],
      obtainedAt: new Date(data.obtained_at || Date.now())
    };
  }

  // ===== FAVORITES =====
  getFavorites(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
    } catch {
      return [];
    }
  }

  toggleFavorite(runId: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(runId);
    
    if (index === -1) {
      favorites.push(runId);
    } else {
      favorites.splice(index, 1);
    }
    
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    return index === -1;
  }

  // ===== RATINGS =====
  getRatings(): Record<string, number> {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ratings) || '{}');
    } catch {
      return {};
    }
  }

  rateRun(runId: string, rating: number): void {
    const ratings = this.getRatings();
    ratings[runId] = Math.max(1, Math.min(5, rating));
    localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(ratings));
  }

  // ===== STATISTICS =====
  async getStats(userId: string): Promise<AmbitionStats> {
    const runs = await this.getRuns(userId);
    const localStats = this.getLocalStats();
    
    const completedRuns = runs.filter(r => r.status === 'completed');
    const abandonedRuns = runs.filter(r => r.status === 'abandoned');
    
    let totalQuests = 0;
    let completedQuests = 0;
    let totalXp = 0;
    let totalTime = 0;
    const byTag: Record<string, number> = {};

    for (const run of runs) {
      const quests = await this.getQuests(run.id);
      totalQuests += quests.length;
      completedQuests += quests.filter(q => q.status === 'completed').length;
      totalXp += quests.filter(q => q.status === 'completed').reduce((sum, q) => sum + q.xpReward, 0);
      totalTime += quests.reduce((sum, q) => sum + (q.estMinutes || 0), 0);
      
      run.tags.forEach(tag => {
        byTag[tag] = (byTag[tag] || 0) + 1;
      });
    }

    // Calculate streaks
    const sortedCompletedRuns = completedRuns
      .filter(r => r.completedAt)
      .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const run of sortedCompletedRuns) {
      if (!run.completedAt) continue;
      
      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        if (this.isSameDay(run.completedAt, today) || this.isYesterday(run.completedAt, today)) {
          currentStreak = 1;
        }
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - run.completedAt.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 1) {
          tempStreak++;
          if (currentStreak > 0) currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      lastDate = run.completedAt;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      totalRuns: runs.length,
      completedRuns: completedRuns.length,
      abandonedRuns: abandonedRuns.length,
      totalQuests,
      completedQuests,
      totalXpEarned: totalXp + (localStats.xpEarned || 0),
      averageQuestsPerRun: runs.length > 0 ? totalQuests / runs.length : 0,
      completionRate: runs.length > 0 ? (completedRuns.length / runs.length) * 100 : 0,
      favoriteRuns: this.getFavorites().length,
      artifactsCollected: localStats.artifactsCollected || 0,
      longestStreak,
      currentStreak,
      totalTimeSpent: totalTime,
      byTag
    };
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }

  private isYesterday(d1: Date, d2: Date): boolean {
    const yesterday = new Date(d2);
    yesterday.setDate(yesterday.getDate() - 1);
    return d1.toDateString() === yesterday.toDateString();
  }

  // ===== LOCAL STATS =====
  private getLocalStats(): Record<string, number> {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || '{}');
    } catch {
      return {};
    }
  }

  private updateLocalStats(updates: Record<string, number>): void {
    const stats = this.getLocalStats();
    Object.entries(updates).forEach(([key, value]) => {
      stats[key] = (stats[key] || 0) + value;
    });
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
  }

  // ===== RECOMMENDATIONS =====
  async getRecommendations(userId: string): Promise<RunRecommendation[]> {
    const runs = await this.getRuns(userId);
    const recommendations: RunRecommendation[] = [];

    // Continue incomplete runs
    const activeRuns = runs.filter(r => r.status === 'active');
    activeRuns.slice(0, 2).forEach(run => {
      recommendations.push({
        id: `continue_${run.id}`,
        type: 'continue',
        title: `Continuer: ${run.objective}`,
        description: 'Reprendre là où vous vous êtes arrêté',
        tags: run.tags,
        confidence: 0.95,
        basedOn: run.id
      });
    });

    // Similar to favorites
    const favorites = this.getFavorites();
    const favoriteTags = runs
      .filter(r => favorites.includes(r.id))
      .flatMap(r => r.tags);
    
    const tagCounts: Record<string, number> = {};
    favoriteTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);

    if (topTags.length > 0) {
      recommendations.push({
        id: 'similar_favorites',
        type: 'similar',
        title: 'Basé sur vos favoris',
        description: `Objectifs liés à: ${topTags.join(', ')}`,
        tags: topTags,
        confidence: 0.8
      });
    }

    // Popular objectives
    recommendations.push({
      id: 'popular_1',
      type: 'popular',
      title: 'Développer une routine matinale',
      description: 'Objectif populaire parmi les utilisateurs',
      tags: ['routine', 'productivité', 'bien-être'],
      confidence: 0.7
    });

    return recommendations;
  }

  // ===== EXPORT =====
  async exportData(userId: string): Promise<string> {
    const runs = await this.getRuns(userId);
    const allQuests: AmbitionQuest[] = [];
    const allArtifacts: AmbitionArtifact[] = [];

    for (const run of runs) {
      const quests = await this.getQuests(run.id);
      const artifacts = await this.getArtifacts(run.id);
      allQuests.push(...quests);
      allArtifacts.push(...artifacts);
    }

    const stats = await this.getStats(userId);

    return JSON.stringify({
      exportDate: new Date().toISOString(),
      runs,
      quests: allQuests,
      artifacts: allArtifacts,
      stats,
      favorites: this.getFavorites(),
      ratings: this.getRatings()
    }, null, 2);
  }

  downloadExport(data: string): void {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ambition_arcade_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ===== SHARING =====
  async shareRun(run: AmbitionRun): Promise<string> {
    const shareData = {
      title: `Mon objectif: ${run.objective}`,
      text: `J'ai ${run.status === 'completed' ? 'accompli' : 'lancé'} cet objectif sur EmotionsCare!`,
      tags: run.tags
    };

    if (navigator.share) {
      await navigator.share({
        title: shareData.title,
        text: shareData.text
      });
    }

    return `${window.location.origin}/app/ambition/${run.id}`;
  }
}

export const ambitionArcadeServiceEnriched = new AmbitionArcadeServiceEnriched();
