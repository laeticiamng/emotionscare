/**
 * QuestService ENRICHED - Service de quêtes complet
 * Version enrichie avec statistiques, notifications, favoris, recommandations
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const FAVORITES_KEY = 'quests-favorites';
const NOTIFICATIONS_KEY = 'quests-notifications';
const STATS_KEY = 'quests-stats';
const REMINDERS_KEY = 'quests-reminders';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface Quest {
  id: string;
  title: string;
  description: string;
  quest_type: 'daily' | 'weekly' | 'special';
  category: 'listening' | 'exploration' | 'wellness' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  points_reward: number;
  max_progress: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface UserQuestProgress {
  id: string;
  user_id: string;
  quest_id: string;
  current_progress: number;
  completed: boolean;
  completed_at?: string;
  started_at: string;
  quest?: Quest;
}

export interface QuestNotification {
  id: string;
  questId: string;
  type: 'reminder' | 'progress' | 'completed' | 'expiring';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface QuestStats {
  totalCompleted: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  completionRate: number;
  averageCompletionTime: number;
  questsByType: Record<string, number>;
  questsByDifficulty: Record<string, number>;
  lastCompletedAt: string;
}

export interface QuestReminder {
  questId: string;
  time: string;
  enabled: boolean;
  days: number[];
}

export interface QuestRecommendation {
  quest: Quest;
  reason: string;
  confidence: number;
  estimatedTime: number;
}

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────────────────────

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch { return []; }
}

function saveFavorites(favorites: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function getNotifications(): QuestNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch { return []; }
}

function saveNotifications(notifications: QuestNotification[]): void {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(0, 100)));
}

function getLocalStats(): Partial<QuestStats> {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch { return {}; }
}

function saveLocalStats(stats: Partial<QuestStats>): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getReminders(): QuestReminder[] {
  try {
    return JSON.parse(localStorage.getItem(REMINDERS_KEY) || '[]');
  } catch { return []; }
}

function saveReminders(reminders: QuestReminder[]): void {
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

// ─────────────────────────────────────────────────────────────
// ENRICHED SERVICE
// ─────────────────────────────────────────────────────────────

class QuestServiceEnriched {
  // ========== ORIGINAL METHODS ==========
  
  async getActiveQuests(): Promise<Quest[]> {
    try {
      const { data, error } = await supabase
        .from('music_quests')
        .select('*')
        .eq('is_active', true)
        .order('quest_type', { ascending: true })
        .order('difficulty', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération quêtes', error as Error, 'QuestService');
      return [];
    }
  }

  async getUserQuestProgress(): Promise<UserQuestProgress[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_quest_progress')
        .select('*, quest:music_quests(*)')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération progression', error as Error, 'QuestService');
      return [];
    }
  }

  async updateQuestProgress(questId: string, progress: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data: quest } = await supabase
        .from('music_quests')
        .select('max_progress, points_reward')
        .eq('id', questId)
        .single();

      if (!quest) throw new Error('Quête non trouvée');

      const completed = progress >= quest.max_progress;

      const { error } = await supabase
        .from('user_quest_progress')
        .upsert({
          user_id: user.id,
          quest_id: questId,
          current_progress: Math.min(progress, quest.max_progress),
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,quest_id' });

      if (error) throw error;

      // Add notification if completed
      if (completed) {
        this.addNotification(questId, 'completed', `Quête terminée ! +${quest.points_reward} points`);
        this.updateLocalStats({ questId, points: quest.points_reward });
      } else if (progress > 0 && progress === Math.floor(quest.max_progress / 2)) {
        this.addNotification(questId, 'progress', 'Vous êtes à mi-chemin !');
      }

      return true;
    } catch (error) {
      logger.error('Erreur mise à jour progression', error as Error, 'QuestService');
      return false;
    }
  }

  // ========== ENRICHED: FAVORITES ==========

  getFavorites(): string[] {
    return getFavorites();
  }

  isFavorite(questId: string): boolean {
    return getFavorites().includes(questId);
  }

  addToFavorites(questId: string): void {
    const favorites = getFavorites();
    if (!favorites.includes(questId)) {
      saveFavorites([...favorites, questId]);
    }
  }

  removeFromFavorites(questId: string): void {
    saveFavorites(getFavorites().filter(id => id !== questId));
  }

  async getFavoriteQuests(): Promise<Quest[]> {
    const favorites = getFavorites();
    if (favorites.length === 0) return [];

    const { data, error } = await supabase
      .from('music_quests')
      .select('*')
      .in('id', favorites);

    if (error) return [];
    return data || [];
  }

  // ========== ENRICHED: NOTIFICATIONS ==========

  getNotifications(): QuestNotification[] {
    return getNotifications();
  }

  getUnreadNotifications(): QuestNotification[] {
    return getNotifications().filter(n => !n.read);
  }

  addNotification(questId: string, type: QuestNotification['type'], message: string): void {
    const notification: QuestNotification = {
      id: crypto.randomUUID(),
      questId,
      type,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    saveNotifications([notification, ...getNotifications()]);
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = getNotifications().map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(notifications);
  }

  markAllNotificationsAsRead(): void {
    saveNotifications(getNotifications().map(n => ({ ...n, read: true })));
  }

  clearNotifications(): void {
    saveNotifications([]);
  }

  // ========== ENRICHED: STATISTICS ==========

  async getStats(): Promise<QuestStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getDefaultStats();

      const progress = await this.getUserQuestProgress();
      const completed = progress.filter(p => p.completed);

      const questsByType: Record<string, number> = {};
      const questsByDifficulty: Record<string, number> = {};
      const categoryCount: Record<string, number> = {};
      let totalPoints = 0;

      completed.forEach(p => {
        if (p.quest) {
          questsByType[p.quest.quest_type] = (questsByType[p.quest.quest_type] || 0) + 1;
          questsByDifficulty[p.quest.difficulty] = (questsByDifficulty[p.quest.difficulty] || 0) + 1;
          categoryCount[p.quest.category] = (categoryCount[p.quest.category] || 0) + 1;
          totalPoints += p.quest.points_reward;
        }
      });

      const [favoriteCategory] = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])[0] || ['none', 0];

      const localStats = getLocalStats();

      return {
        totalCompleted: completed.length,
        totalPoints,
        currentStreak: localStats.currentStreak || 0,
        longestStreak: localStats.longestStreak || 0,
        favoriteCategory,
        completionRate: progress.length > 0 ? (completed.length / progress.length) * 100 : 0,
        averageCompletionTime: localStats.averageCompletionTime || 0,
        questsByType,
        questsByDifficulty,
        lastCompletedAt: completed[0]?.completed_at || '',
      };
    } catch {
      return this.getDefaultStats();
    }
  }

  private getDefaultStats(): QuestStats {
    return {
      totalCompleted: 0,
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteCategory: 'none',
      completionRate: 0,
      averageCompletionTime: 0,
      questsByType: {},
      questsByDifficulty: {},
      lastCompletedAt: '',
    };
  }

  private updateLocalStats(_data: { questId: string; points: number }): void {
    const stats = getLocalStats();
    const today = new Date().toISOString().split('T')[0];

    // Update streak
    if (stats.lastCompletedAt?.startsWith(today)) {
      // Same day, don't update streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (stats.lastCompletedAt?.startsWith(yesterdayStr)) {
        stats.currentStreak = (stats.currentStreak || 0) + 1;
      } else {
        stats.currentStreak = 1;
      }

      stats.longestStreak = Math.max(stats.longestStreak || 0, stats.currentStreak);
    }

    stats.lastCompletedAt = new Date().toISOString();
    saveLocalStats(stats);
  }

  // ========== ENRICHED: REMINDERS ==========

  getReminders(): QuestReminder[] {
    return getReminders();
  }

  setReminder(questId: string, time: string, days: number[] = [1, 2, 3, 4, 5]): void {
    const reminders = getReminders().filter(r => r.questId !== questId);
    reminders.push({ questId, time, enabled: true, days });
    saveReminders(reminders);
  }

  removeReminder(questId: string): void {
    saveReminders(getReminders().filter(r => r.questId !== questId));
  }

  toggleReminder(questId: string): void {
    const reminders = getReminders().map(r =>
      r.questId === questId ? { ...r, enabled: !r.enabled } : r
    );
    saveReminders(reminders);
  }

  // ========== ENRICHED: RECOMMENDATIONS ==========

  async getRecommendations(): Promise<QuestRecommendation[]> {
    const quests = await this.getActiveQuests();
    const progress = await this.getUserQuestProgress();
    const favorites = getFavorites();
    const stats = await this.getStats();

    const completedIds = new Set(progress.filter(p => p.completed).map(p => p.quest_id));
    const inProgressIds = new Set(progress.filter(p => !p.completed).map(p => p.quest_id));

    const recommendations: QuestRecommendation[] = [];

    // Prioritize favorites not completed
    quests
      .filter(q => favorites.includes(q.id) && !completedIds.has(q.id))
      .forEach(quest => {
        recommendations.push({
          quest,
          reason: 'Une de vos quêtes favorites',
          confidence: 0.95,
          estimatedTime: this.estimateTime(quest),
        });
      });

    // In-progress quests
    quests
      .filter(q => inProgressIds.has(q.id))
      .forEach(quest => {
        const p = progress.find(pr => pr.quest_id === quest.id);
        const progressPercent = p ? (p.current_progress / quest.max_progress) * 100 : 0;
        recommendations.push({
          quest,
          reason: `En cours - ${Math.round(progressPercent)}% complété`,
          confidence: 0.9,
          estimatedTime: this.estimateTime(quest) * (1 - progressPercent / 100),
        });
      });

    // Based on favorite category
    if (stats.favoriteCategory !== 'none') {
      quests
        .filter(q => q.category === stats.favoriteCategory && !completedIds.has(q.id) && !inProgressIds.has(q.id))
        .slice(0, 2)
        .forEach(quest => {
          recommendations.push({
            quest,
            reason: `Catégorie ${stats.favoriteCategory} - votre préférée`,
            confidence: 0.8,
            estimatedTime: this.estimateTime(quest),
          });
        });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  private estimateTime(quest: Quest): number {
    const baseTime = { easy: 5, medium: 15, hard: 30 };
    return baseTime[quest.difficulty] || 10;
  }

  // ========== ENRICHED: EXPORT ==========

  async exportData(): Promise<{
    quests: Quest[];
    progress: UserQuestProgress[];
    stats: QuestStats;
    favorites: string[];
    reminders: QuestReminder[];
    exportedAt: string;
  }> {
    const [quests, progress, stats] = await Promise.all([
      this.getActiveQuests(),
      this.getUserQuestProgress(),
      this.getStats(),
    ]);

    return {
      quests,
      progress,
      stats,
      favorites: getFavorites(),
      reminders: getReminders(),
      exportedAt: new Date().toISOString(),
    };
  }
}

export const questServiceEnriched = new QuestServiceEnriched();
export default questServiceEnriched;
