
import { FeedbackEntry, ImprovementSuggestion, AuditLog } from '@/types/feedback';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

class FeedbackService {
  private baseUrl = 'https://yaincoxihiqdksxgrsrk.supabase.co';

  /**
   * Soumettre un nouveau feedback
   */
  async submitFeedback(feedback: Omit<FeedbackEntry, 'id' | 'created_at' | 'updated_at'>): Promise<FeedbackEntry> {
    const response = await GlobalInterceptor.secureFetch(`${this.baseUrl}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
      },
      body: JSON.stringify({
        ...feedback,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    if (!response?.ok) {
      throw new Error('Erreur lors de la soumission du feedback');
    }

    return response.json();
  }

  /**
   * Récupérer les feedbacks avec filtres
   */
  async getFeedbacks(filters?: {
    module?: string;
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<FeedbackEntry[]> {
    const params = new URLSearchParams();
    
    if (filters?.module) params.append('module', `eq.${filters.module}`);
    if (filters?.type) params.append('type', `eq.${filters.type}`);
    if (filters?.status) params.append('status', `eq.${filters.status}`);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await GlobalInterceptor.secureFetch(
      `${this.baseUrl}/rest/v1/feedback?${params.toString()}&order=created_at.desc`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
        }
      }
    );

    if (!response?.ok) {
      throw new Error('Erreur lors de la récupération des feedbacks');
    }

    return response.json();
  }

  /**
   * Générer des suggestions d'amélioration via IA
   */
  async generateImprovementSuggestions(feedbackIds: string[]): Promise<ImprovementSuggestion[]> {
    // Simulation d'appel IA - à remplacer par un vrai service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: crypto.randomUUID(),
            user_id: 'system',
            type: 'ui_improvement',
            title: 'Optimiser les temps de réponse',
            description: 'Basé sur les feedbacks collectés, optimiser les animations pour une meilleure fluidité',
            confidence: 85,
            impact_score: 7.5,
            effort_estimation: 'medium',
            reasoning: 'Plusieurs utilisateurs ont mentionné des lenteurs dans les transitions',
            feedback_ids: feedbackIds,
            status: 'generated',
            created_at: new Date().toISOString()
          }
        ]);
      }, 1000);
    });
  }

  /**
   * Analyser le sentiment des feedbacks
   */
  async analyzeFeedbackSentiment(feedbacks: FeedbackEntry[]): Promise<{
    positive: number;
    neutral: number;
    negative: number;
    trends: Array<{ date: string; sentiment: number }>;
  }> {
    // Simulation d'analyse de sentiment
    return {
      positive: 0.65,
      neutral: 0.25,
      negative: 0.10,
      trends: [
        { date: '2024-01-01', sentiment: 0.6 },
        { date: '2024-01-02', sentiment: 0.65 },
        { date: '2024-01-03', sentiment: 0.7 },
        { date: '2024-01-04', sentiment: 0.68 },
        { date: '2024-01-05', sentiment: 0.72 }
      ]
    };
  }

  /**
   * Calculer les métriques de qualité
   */
  async getQualityMetrics(): Promise<{
    nps_score: number;
    satisfaction_average: number;
    improvement_rate: number;
    response_time: number;
  }> {
    const response = await GlobalInterceptor.secureFetch(
      `${this.baseUrl}/rest/v1/rpc/calculate_quality_metrics`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
        }
      }
    );

    if (!response?.ok) {
      // Retourner des données mockées si l'API n'est pas disponible
      return {
        nps_score: 67,
        satisfaction_average: 4.6,
        improvement_rate: 0.78,
        response_time: 2.3
      };
    }

    return response.json();
  }

  /**
   * Enregistrer un audit log
   */
  async logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    await GlobalInterceptor.secureFetch(`${this.baseUrl}/rest/v1/audit_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
      },
      body: JSON.stringify(auditLog)
    });
  }

  /**
   * Exporter les données de feedback (RGPD)
   */
  async exportUserData(userId: string): Promise<{
    feedbacks: FeedbackEntry[];
    audit_logs: AuditLog[];
    export_date: string;
  }> {
    const [feedbacks, auditLogs] = await Promise.all([
      this.getFeedbacks({ limit: 1000 }),
      this.getAuditLogs(userId)
    ]);

    return {
      feedbacks: feedbacks.filter(f => f.user_id === userId),
      audit_logs: auditLogs,
      export_date: new Date().toISOString()
    };
  }

  /**
   * Supprimer toutes les données utilisateur (RGPD)
   */
  async deleteUserData(userId: string): Promise<void> {
    await Promise.all([
      GlobalInterceptor.secureFetch(`${this.baseUrl}/rest/v1/feedback?user_id=eq.${userId}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
        }
      }),
      GlobalInterceptor.secureFetch(`${this.baseUrl}/rest/v1/audit_logs?user_id=eq.${userId}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
        }
      })
    ]);
  }

  private async getAuditLogs(userId: string): Promise<AuditLog[]> {
    const response = await GlobalInterceptor.secureFetch(
      `${this.baseUrl}/rest/v1/audit_logs?user_id=eq.${userId}&order=timestamp.desc`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU'
        }
      }
    );

    if (!response?.ok) {
      return [];
    }

    return response.json();
  }
}

export const feedbackService = new FeedbackService();
