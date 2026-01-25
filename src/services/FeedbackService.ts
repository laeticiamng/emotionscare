import { supabase } from '@/integrations/supabase/client';
import { FeedbackEntry, ImprovementSuggestion, AuditLog, QualityMetrics } from '@/types/feedback';
import { v4 as uuidv4 } from 'uuid';

export class FeedbackService {
  // Gestion des feedbacks
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

    // Sauvegarde en localStorage pour la démo (remplacer par Supabase en production)
    const existingFeedbacks = this.getFeedbacksFromStorage();
    existingFeedbacks.push(newFeedback);
    localStorage.setItem('emotionscare_feedbacks', JSON.stringify(existingFeedbacks));

    // Log de l'audit
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

    return newFeedback;
  }

  static async getFeedbacks(): Promise<FeedbackEntry[]> {
    // En production, récupérer depuis Supabase
    return this.getFeedbacksFromStorage();
  }

  static async updateFeedbackStatus(id: string, status: FeedbackEntry['status']): Promise<void> {
    const feedbacks = this.getFeedbacksFromStorage();
    const index = feedbacks.findIndex(f => f.id === id);
    
    if (index !== -1) {
      feedbacks[index].status = status;
      feedbacks[index].updated_at = new Date().toISOString();
      localStorage.setItem('emotionscare_feedbacks', JSON.stringify(feedbacks));

      // Log de l'audit
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

  // Gestion des suggestions d'amélioration
  static async generateImprovementSuggestions(): Promise<ImprovementSuggestion[]> {
    const feedbacks = this.getFeedbacksFromStorage();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Simulation d'analyse IA basée sur les feedbacks
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
          reasoning: `Basé sur ${count} signalements de bugs dans ce module, une intervention est nécessaire pour améliorer l'expérience utilisateur.`,
          feedback_ids: feedbacks.filter(f => f.type === 'bug' && f.module === module).map(f => f.id),
          status: 'generated',
          created_at: new Date().toISOString()
        });
      }
    });

    // Analyser les demandes de fonctionnalités
    const featureRequests = feedbacks.filter(f => f.type === 'feature_request');
    const requestsByFeature = featureRequests.reduce((acc, f) => {
      const key = f.title.toLowerCase();
      if (!acc[key]) {
        acc[key] = { count: 0, feedbacks: [] };
      }
      acc[key].count++;
      acc[key].feedbacks.push(f);
      return acc;
    }, {} as Record<string, { count: number; feedbacks: FeedbackEntry[] }>);

    Object.entries(requestsByFeature).forEach(([_feature, data]) => {
      if (data.count >= 2) {
        suggestions.push({
          id: uuidv4(),
          user_id: user.id,
          type: 'feature',
          title: `Implémenter: ${data.feedbacks[0].title}`,
          description: data.feedbacks[0].description,
          confidence: Math.min(95, 70 + data.count * 5),
          impact_score: Math.min(10, 6 + data.count),
          effort_estimation: data.count > 4 ? 'medium' : 'high',
          reasoning: `${data.count} utilisateurs ont demandé cette fonctionnalité, indiquant un besoin réel du marché.`,
          feedback_ids: data.feedbacks.map(f => f.id),
          status: 'generated',
          created_at: new Date().toISOString()
        });
      }
    });

    // Analyser les notes basses
    const lowRatedModules = feedbacks
      .filter(f => f.rating < 3)
      .reduce((acc, f) => {
        if (!acc[f.module]) {
          acc[f.module] = { ratings: [], count: 0 };
        }
        acc[f.module].ratings.push(f.rating);
        acc[f.module].count++;
        return acc;
      }, {} as Record<string, { ratings: number[]; count: number }>);

    Object.entries(lowRatedModules).forEach(([module, data]) => {
      if (data.count >= 2) {
        const avgRating = data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length;
        suggestions.push({
          id: uuidv4(),
          user_id: user.id,
          type: 'ui_improvement',
          title: `Améliorer l'UX du module ${module}`,
          description: `Le module ${module} reçoit des notes basses (moyenne: ${avgRating.toFixed(1)}/5). Une révision de l'interface utilisateur est recommandée.`,
          confidence: Math.min(85, 50 + data.count * 8),
          impact_score: Math.min(10, Math.round(8 - avgRating * 1.5)),
          effort_estimation: 'medium',
          reasoning: `Notes moyennes de ${avgRating.toFixed(1)}/5 sur ${data.count} évaluations indiquent des problèmes d'expérience utilisateur.`,
          feedback_ids: feedbacks.filter(f => f.module === module && f.rating < 3).map(f => f.id),
          status: 'generated',
          created_at: new Date().toISOString()
        });
      }
    });

    // Sauvegarder les suggestions
    const existingSuggestions = this.getSuggestionsFromStorage();
    const newSuggestions = suggestions.filter(s => 
      !existingSuggestions.some(es => es.title === s.title)
    );
    
    const allSuggestions = [...existingSuggestions, ...newSuggestions];
    localStorage.setItem('emotionscare_suggestions', JSON.stringify(allSuggestions));

    // Log de l'audit
    await this.createAuditLog({
      user_id: user.id,
      action: 'suggestions_generated',
      module: 'ai_engine',
      impact: 'high',
      details: {
        suggestions_count: newSuggestions.length,
        analysis_based_on_feedbacks: feedbacks.length
      }
    });

    return allSuggestions;
  }

  static async getSuggestions(): Promise<ImprovementSuggestion[]> {
    return this.getSuggestionsFromStorage();
  }

  static async implementSuggestion(id: string): Promise<void> {
    const suggestions = this.getSuggestionsFromStorage();
    const index = suggestions.findIndex(s => s.id === id);
    
    if (index !== -1) {
      suggestions[index].status = 'implemented';
      localStorage.setItem('emotionscare_suggestions', JSON.stringify(suggestions));

      // Log de l'audit
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.createAuditLog({
          user_id: user.id,
          action: 'suggestion_implemented',
          module: 'improvement_engine',
          impact: 'high',
          details: {
            suggestion_id: id,
            suggestion_title: suggestions[index].title
          }
        });
      }
    }
  }

  // Métriques de qualité
  static async getQualityMetrics(): Promise<QualityMetrics> {
    const feedbacks = this.getFeedbacksFromStorage();
    const suggestions = this.getSuggestionsFromStorage();

    const totalRatings = feedbacks.filter(f => f.rating).length;
    const averageRating = totalRatings > 0 
      ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalRatings 
      : 0;

    // Calcul du NPS (simplifié)
    const promoters = feedbacks.filter(f => f.rating >= 4).length;
    const detractors = feedbacks.filter(f => f.rating <= 2).length;
    const npsScore = totalRatings > 0 
      ? Math.round(((promoters - detractors) / totalRatings) * 100)
      : 0;

    const implementedSuggestions = suggestions.filter(s => s.status === 'implemented').length;
    const totalSuggestions = suggestions.length;

    return {
      satisfaction_score: Math.round(averageRating * 20), // Convert to percentage
      nps_score: npsScore,
      feature_adoption_rate: Math.round(Math.random() * 30 + 70), // Simulation
      bug_report_frequency: feedbacks.filter(f => f.type === 'bug').length,
      improvement_implementation_rate: totalSuggestions > 0 
        ? Math.round((implementedSuggestions / totalSuggestions) * 100)
        : 0,
      user_retention_rate: Math.round(Math.random() * 10 + 85) // Simulation
    };
  }

  // Gestion des logs d'audit
  static async createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp' | 'ip_address' | 'user_agent'>): Promise<void> {
    const auditLog: AuditLog = {
      id: uuidv4(),
      ...log,
      timestamp: new Date().toISOString(),
      ip_address: '127.0.0.1', // En production, récupérer la vraie IP
      user_agent: navigator.userAgent
    };

    // Sauvegarder en localStorage pour la démo
    const existingLogs = this.getAuditLogsFromStorage();
    existingLogs.push(auditLog);
    
    // Garder seulement les 1000 derniers logs
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    
    localStorage.setItem('emotionscare_audit_logs', JSON.stringify(existingLogs));
  }

  static async getAuditLogs(): Promise<AuditLog[]> {
    return this.getAuditLogsFromStorage();
  }

  // Méthodes utilitaires pour localStorage (remplacer par Supabase en production)
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

  // Conformité RGPD
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
    // Anonymiser les données au lieu de les supprimer pour garder les statistiques
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

    // Log de l'audit
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
