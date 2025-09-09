/**
 * Service de scoring clinique pour suggestions personnalisées
 */

export interface ClinicalSuggestion {
  id: string;
  type: string;
  priority: number;
  content: string;
}

class ClinicalScoringService {
  private cache: Map<string, any> = new Map();

  async getUISuggestion(type: string): Promise<ClinicalSuggestion | null> {
    try {
      // Pour l'instant, retourner une suggestion par défaut
      if (type === 'plan-du-jour') {
        return {
          id: 'default-daily',
          type: 'daily-plan',
          priority: 1,
          content: 'Plan quotidien personnalisé'
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur dans getUISuggestion:', error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const clinicalScoringService = new ClinicalScoringService();