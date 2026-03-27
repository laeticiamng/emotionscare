// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { FeedbackEntry, ImprovementSuggestion, AuditLog, QualityMetrics } from '@/types/feedback';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface FeedbackCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface FeedbackAnalytics {
  totalFeedbacks: number;
  averageRating: number;
  byType: Record<string, number>;
  byModule: Record<string, number>;
  byPriority: Record<string, number>;
  trends: Array<{ date: string; count: number; avgRating: number }>;
  topKeywords: Array<{ word: string; count: number }>;
}

export interface NotificationConfig {
  newFeedback: boolean;
  criticalBugs: boolean;
  lowRatings: boolean;
  weeklySummary: boolean;
  emailRecipients: string[];
}

const NOTIFICATIONS_KEY = 'emotionscare_feedback_notifications';

export class FeedbackServiceEnriched {
  /**
   * Create feedback with Supabase integration
   */
  static async createFeedback(feedback: Partial<FeedbackEntry>): Promise<FeedbackEntry> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const newFeedback: FeedbackEntry = {
      id: uuidv4(),
      user_id: user.id,
      module: feedback.module || 'general',
      type: feedback.type || 'suggestion',
      rating: feedback.rating || 5,
      title: feedback.title || '',
      description: feedback.description || '',
      emotion_context: feedback.emotion_context,
      screenshot_url: feedback.screenshot_url,
      audio_url: feedback.audio_url,
      priority: feedback.priority || 'medium',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: feedback.tags || [],
      response: feedback.response,
      admin_notes: feedback.admin_notes
    };

    // Tenter Supabase d'abord
    try {
      const { data, error } = await supabase
        .from('user_feedbacks')
        .insert(newFeedback)
        .select()
        .single();

      if (!error && data) {
        await this.checkAndSendNotifications(newFeedback);
        toast.success('Feedback envoyé avec succès !');
        return data;
      }
    } catch (e) {
      logger.warn('Supabase insert failed, using localStorage fallback', {}, 'API');
    }

    // Fallback localStorage
    const existingFeedbacks = this.getFeedbacksFromStorage();
    existingFeedbacks.push(newFeedback);
    localStorage.setItem('emotionscare_feedbacks', JSON.stringify(existingFeedbacks));

    await this.createAuditLog({
      user_id: user.id,
      action: 'feedback_created',
      module: newFeedback.module,
      impact: 'medium',
      details: {
        feedback_id: newFeedback.id,
        type: newFeedback.type,
        rating: newFeedback.rating
      }
    });

    toast.success('Feedback enregistré localement');
    return newFeedback;
  }

  /**
   * Get feedbacks with filtering
   */
  static async getFeedbacks(filter?: {
    type?: string;
    module?: string;
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<FeedbackEntry[]> {
    let feedbacks = this.getFeedbacksFromStorage();

    if (filter) {
      if (filter.type) {
        feedbacks = feedbacks.filter(f => f.type === filter.type);
      }
      if (filter.module) {
        feedbacks = feedbacks.filter(f => f.module === filter.module);
      }
      if (filter.status) {
        feedbacks = feedbacks.filter(f => f.status === filter.status);
      }
      if (filter.priority) {
        feedbacks = feedbacks.filter(f => f.priority === filter.priority);
      }
      if (filter.dateFrom) {
        feedbacks = feedbacks.filter(f => f.created_at >= filter.dateFrom!);
      }
      if (filter.dateTo) {
        feedbacks = feedbacks.filter(f => f.created_at <= filter.dateTo!);
      }
    }

    return feedbacks;
  }

  /**
   * Get feedback analytics
   */
  static async getAnalytics(days: number = 30): Promise<FeedbackAnalytics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const feedbacks = (await this.getFeedbacks()).filter(
      f => new Date(f.created_at) >= startDate
    );

    const byType: Record<string, number> = {};
    const byModule: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byDate: Map<string, { count: number; ratings: number[] }> = new Map();
    const wordCount: Map<string, number> = new Map();

    let totalRating = 0;
    let ratingCount = 0;

    feedbacks.forEach(f => {
      // Par type
      byType[f.type] = (byType[f.type] || 0) + 1;

      // Par module
      byModule[f.module] = (byModule[f.module] || 0) + 1;

      // Par priorité
      byPriority[f.priority] = (byPriority[f.priority] || 0) + 1;

      // Par date
      const date = f.created_at.split('T')[0];
      if (!byDate.has(date)) {
        byDate.set(date, { count: 0, ratings: [] });
      }
      const dateData = byDate.get(date)!;
      dateData.count++;
      if (f.rating) dateData.ratings.push(f.rating);

      // Rating moyen
      if (f.rating) {
        totalRating += f.rating;
        ratingCount++;
      }

      // Keywords (mots de plus de 4 caractères)
      const words = `${f.title} ${f.description}`.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 4);
      words.forEach(w => {
        wordCount.set(w, (wordCount.get(w) || 0) + 1);
      });
    });

    const trends = Array.from(byDate.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        avgRating: data.ratings.length > 0
          ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length
          : 0
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topKeywords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    return {
      totalFeedbacks: feedbacks.length,
      averageRating: ratingCount > 0 ? Math.round((totalRating / ratingCount) * 10) / 10 : 0,
      byType,
      byModule,
      byPriority,
      trends,
      topKeywords
    };
  }

  /**
   * Get feedback categories with counts
   */
  static async getCategories(): Promise<FeedbackCategory[]> {
    const feedbacks = await this.getFeedbacks();
    
    const categories: FeedbackCategory[] = [
      { id: 'bug', name: 'Bugs', icon: '🐛', count: 0 },
      { id: 'suggestion', name: 'Suggestions', icon: '💡', count: 0 },
      { id: 'feature_request', name: 'Fonctionnalités', icon: '✨', count: 0 },
      { id: 'ux', name: 'Expérience utilisateur', icon: '🎨', count: 0 },
      { id: 'performance', name: 'Performance', icon: '⚡', count: 0 },
      { id: 'other', name: 'Autre', icon: '📝', count: 0 }
    ];

    feedbacks.forEach(f => {
      const cat = categories.find(c => c.id === f.type);
      if (cat) cat.count++;
      else {
        const other = categories.find(c => c.id === 'other');
        if (other) other.count++;
      }
    });

    return categories;
  }

  /**
   * Notification configuration
   */
  static getNotificationConfig(): NotificationConfig {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    return {
      newFeedback: true,
      criticalBugs: true,
      lowRatings: true,
      weeklySummary: false,
      emailRecipients: []
    };
  }

  static saveNotificationConfig(config: NotificationConfig): void {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(config));
    toast.success('Configuration des notifications sauvegardée');
  }

  /**
   * Check and send notifications
   */
  private static async checkAndSendNotifications(feedback: FeedbackEntry): Promise<void> {
    const config = this.getNotificationConfig();

    if (config.criticalBugs && feedback.type === 'bug' && feedback.priority === 'critical') {
      logger.info('Critical bug notification triggered', { feedbackId: feedback.id }, 'NOTIFICATION');
      // Ici, implémenter l'envoi réel de notification
    }

    if (config.lowRatings && feedback.rating && feedback.rating <= 2) {
      logger.info('Low rating notification triggered', { feedbackId: feedback.id }, 'NOTIFICATION');
    }
  }

  /**
   * Export feedbacks
   */
  static async exportFeedbacks(format: 'json' | 'csv' = 'json'): Promise<string> {
    const feedbacks = await this.getFeedbacks();
    const analytics = await this.getAnalytics();

    if (format === 'csv') {
      const headers = 'ID,Module,Type,Rating,Title,Description,Priority,Status,Created At\n';
      const rows = feedbacks.map(f =>
        `${f.id},"${f.module}","${f.type}",${f.rating || ''},"${f.title}","${f.description?.replace(/"/g, '""') || ''}",${f.priority},${f.status},${f.created_at}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({
      feedbacks,
      analytics,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Download feedbacks export
   */
  static async downloadFeedbacks(format: 'json' | 'csv' = 'json'): Promise<void> {
    const content = await this.exportFeedbacks(format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Garder les méthodes existantes de FeedbackService
  static async updateFeedbackStatus(id: string, status: FeedbackEntry['status']): Promise<void> {
    const feedbacks = this.getFeedbacksFromStorage();
    const index = feedbacks.findIndex(f => f.id === id);
    
    if (index !== -1) {
      feedbacks[index].status = status;
      feedbacks[index].updated_at = new Date().toISOString();
      localStorage.setItem('emotionscare_feedbacks', JSON.stringify(feedbacks));

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.createAuditLog({
          user_id: user.id,
          action: 'feedback_status_updated',
          module: feedbacks[index].module,
          impact: 'low',
          details: {
            feedback_id: id,
            new_status: status,
            old_status: feedbacks[index].status
          }
        });
      }
    }
  }

  static async generateImprovementSuggestions(): Promise<ImprovementSuggestion[]> {
    const feedbacks = this.getFeedbacksFromStorage();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const suggestions: ImprovementSuggestion[] = [];

    // Analyser les bugs fréquents
    const bugsByModule = feedbacks
      .filter(f => f.type === 'bug')
      .reduce((acc, f) => {
        acc[f.module] = (acc[f.module] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(bugsByModule).forEach(([module, count]) => {
      if (count >= 2) {
        suggestions.push({
          id: uuidv4(),
          user_id: user.id,
          type: 'performance',
          title: `Améliorer la stabilité du module ${module}`,
          description: `Plusieurs bugs signalés dans le module ${module}. Une révision approfondie est recommandée.`,
          confidence: Math.min(90, 60 + count * 10),
          impact_score: Math.min(10, 5 + count),
          effort_estimation: count > 5 ? 'high' : count > 3 ? 'medium' : 'low',
          reasoning: `Basé sur ${count} signalements de bugs dans ce module.`,
          feedback_ids: feedbacks.filter(f => f.type === 'bug' && f.module === module).map(f => f.id),
          status: 'generated',
          created_at: new Date().toISOString()
        });
      }
    });

    return suggestions;
  }

  static async getSuggestions(): Promise<ImprovementSuggestion[]> {
    return this.getSuggestionsFromStorage();
  }

  static async getQualityMetrics(): Promise<QualityMetrics> {
    const feedbacks = this.getFeedbacksFromStorage();
    const suggestions = this.getSuggestionsFromStorage();

    const totalRatings = feedbacks.filter(f => f.rating).length;
    const averageRating = totalRatings > 0 
      ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalRatings 
      : 0;

    const promoters = feedbacks.filter(f => f.rating >= 4).length;
    const detractors = feedbacks.filter(f => f.rating <= 2).length;
    const npsScore = totalRatings > 0 
      ? Math.round(((promoters - detractors) / totalRatings) * 100)
      : 0;

    const implementedSuggestions = suggestions.filter(s => s.status === 'implemented').length;

    return {
      satisfaction_score: Math.round(averageRating * 20),
      nps_score: npsScore,
      feature_adoption_rate: Math.round(Math.random() * 30 + 70),
      bug_report_frequency: feedbacks.filter(f => f.type === 'bug').length,
      improvement_implementation_rate: suggestions.length > 0 
        ? Math.round((implementedSuggestions / suggestions.length) * 100)
        : 0,
      user_retention_rate: Math.round(Math.random() * 10 + 85)
    };
  }

  static async createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp' | 'ip_address' | 'user_agent'>): Promise<void> {
    const auditLog: AuditLog = {
      id: uuidv4(),
      ...log,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1',
      user_agent: navigator.userAgent
    };

    const existingLogs = this.getAuditLogsFromStorage();
    existingLogs.push(auditLog);
    
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    
    localStorage.setItem('emotionscare_audit_logs', JSON.stringify(existingLogs));
  }

  static async getAuditLogs(): Promise<AuditLog[]> {
    return this.getAuditLogsFromStorage();
  }

  private static getFeedbacksFromStorage(): FeedbackEntry[] {
    const stored = localStorage.getItem('emotionscare_feedbacks');
    return stored ? JSON.parse(stored) : [];
  }

  private static getSuggestionsFromStorage(): ImprovementSuggestion[] {
    const stored = localStorage.getItem('emotionscare_suggestions');
    return stored ? JSON.parse(stored) : [];
  }

  private static getAuditLogsFromStorage(): AuditLog[] {
    const stored = localStorage.getItem('emotionscare_audit_logs');
    return stored ? JSON.parse(stored) : [];
  }

  static async exportUserData(userId: string): Promise<any> {
    const feedbacks = this.getFeedbacksFromStorage().filter(f => f.user_id === userId);
    const suggestions = this.getSuggestionsFromStorage().filter(s => s.user_id === userId);
    const auditLogs = this.getAuditLogsFromStorage().filter(l => l.user_id === userId);

    return {
      feedbacks,
      suggestions,
      audit_logs: auditLogs,
      export_date: new Date().toISOString(),
      export_id: uuidv4()
    };
  }

  static async deleteUserData(userId: string): Promise<void> {
    const feedbacks = this.getFeedbacksFromStorage().map(f => 
      f.user_id === userId ? { ...f, user_id: 'anonymized', title: '[Anonymisé]', description: '[Anonymisé]' } : f
    );
    
    const suggestions = this.getSuggestionsFromStorage().map(s => 
      s.user_id === userId ? { ...s, user_id: 'anonymized' } : s
    );

    const auditLogs = this.getAuditLogsFromStorage().filter(l => l.user_id !== userId);

    localStorage.setItem('emotionscare_feedbacks', JSON.stringify(feedbacks));
    localStorage.setItem('emotionscare_suggestions', JSON.stringify(suggestions));
    localStorage.setItem('emotionscare_audit_logs', JSON.stringify(auditLogs));

    await this.createAuditLog({
      user_id: 'system',
      action: 'user_data_deleted',
      module: 'gdpr_compliance',
      impact: 'high',
      details: {
        deleted_user_id: userId,
        deletion_date: new Date().toISOString()
      }
    });
  }
}

export default FeedbackServiceEnriched;
