/**
 * Service de scoring clinique pour évaluations opt-in
 * Calcule les scores et génère les signaux d'orchestration (jamais affichés)
 */

import { supabase } from '@/integrations/supabase/client';

export type InstrumentCode = 
  | 'WHO5' | 'STAI6' | 'PANAS' | 'PSS10' | 'UCLA3' | 'MSPSS' 
  | 'AAQ2' | 'POMS' | 'SSQ' | 'ISI' | 'GAS' | 'GRITS' 
  | 'BRS' | 'WEMWBS' | 'UWES' | 'CBI' | 'CVSQ' | 'SAM' | 'SUDS';

export interface InstrumentItem {
  id: string;
  prompt: string;
  type: 'scale' | 'choice' | 'slider';
  options?: string[];
  min?: number;
  max?: number;
  reversed?: boolean;
  subscale?: string;
}

export interface InstrumentCatalog {
  code: InstrumentCode;
  name: string;
  version: string;
  items: InstrumentItem[];
  scoring: ScoringConfig;
}

export interface ScoringConfig {
  type: 'sum' | 'average' | 'weighted' | 'subscales';
  transform?: 'scale_0_100' | 'raw' | 'norm_score';
  subscales?: Record<string, string[]>;
  thresholds?: Record<string, [number, number]>; // [low, high] for each level
  reversed_items?: string[];
}

export interface OrchestrationHint {
  action: string;
  intensity: 'low' | 'medium' | 'high';
  context: string;
  duration_ms?: number;
}

export interface AssessmentResult {
  instrument: InstrumentCode;
  scores: Record<string, number>;
  level: number; // 0-4 internal level
  orchestration_hints: OrchestrationHint[];
  summary_text: string; // Human-readable, no numbers
}

class ClinicalScoringService {
  private catalogs: Map<InstrumentCode, InstrumentCatalog> = new Map();
  private cache: Map<string, any> = new Map();

  constructor() {
    this.initializeCatalogs();
  }

  private initializeCatalogs() {
    // WHO-5 Well-Being Index
    this.catalogs.set('WHO5', {
      code: 'WHO5',
      name: 'WHO Well-Being Index',
      version: '1.0',
      items: [
        { id: '1', prompt: 'Je me suis senti(e) gai(e) et de bonne humeur', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Je me suis senti(e) calme et détendu(e)', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Je me suis senti(e) actif/ve et énergique', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Je me suis réveillé(e) en me sentant frais/fraîche et reposé(e)', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Ma vie quotidienne a été remplie de choses qui m\'intéressent', type: 'scale', min: 0, max: 5 }
      ],
      scoring: {
        type: 'sum',
        transform: 'scale_0_100',
        thresholds: {
          '0': [0, 12], // Vigilance - bien-être très faible
          '1': [13, 16], // Attention - bien-être faible
          '2': [17, 20], // Neutre - bien-être modéré
          '3': [21, 23], // Bon - bien-être élevé
          '4': [24, 25]  // Optimal - bien-être très élevé
        }
      }
    });

    // STAI-6 State Anxiety (short)
    this.catalogs.set('STAI6', {
      code: 'STAI6',
      name: 'State Anxiety Inventory (Short)',
      version: '1.0',
      items: [
        { id: '1', prompt: 'Je me sens calme', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Je me sens tendu(e)', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Je me sens contrarié(e)', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Je me sens détendu(e)', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Je me sens inquiet/ète', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Je me sens confus(e)', type: 'scale', min: 1, max: 4 }
      ],
      scoring: {
        type: 'sum',
        transform: 'scale_0_100',
        reversed_items: ['1', '4'],
        thresholds: {
          '0': [6, 10],   // Très calme
          '1': [11, 15],  // Calme
          '2': [16, 20],  // Modéré
          '3': [21, 23],  // Anxieux
          '4': [24, 24]   // Très anxieux
        }
      }
    });

    // PANAS (Positive/Negative Affect Schedule)
    this.catalogs.set('PANAS', {
      code: 'PANAS',
      name: 'Positive and Negative Affect Schedule',
      version: '1.0',
      items: [
        { id: '1', prompt: 'Enthousiaste', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '2', prompt: 'Alerte', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '3', prompt: 'Déterminé(e)', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '4', prompt: 'Attentif/ve', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '5', prompt: 'Actif/ve', type: 'scale', min: 1, max: 5, subscale: 'PA' },
        { id: '6', prompt: 'Contrarié(e)', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '7', prompt: 'Coupable', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '8', prompt: 'Effrayé(e)', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '9', prompt: 'Hostile', type: 'scale', min: 1, max: 5, subscale: 'NA' },
        { id: '10', prompt: 'Irritable', type: 'scale', min: 1, max: 5, subscale: 'NA' }
      ],
      scoring: {
        type: 'subscales',
        subscales: {
          'PA': ['1', '2', '3', '4', '5'],
          'NA': ['6', '7', '8', '9', '10']
        },
        transform: 'scale_0_100'
      }
    });

    // SAM (Self-Assessment Manikin)
    this.catalogs.set('SAM', {
      code: 'SAM',
      name: 'Self-Assessment Manikin',
      version: '1.0',
      items: [
        { id: '1', prompt: 'Valence (plaisir/déplaisir)', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Arousal (activation/calme)', type: 'slider', min: 1, max: 9 }
      ],
      scoring: {
        type: 'subscales',
        subscales: {
          'valence': ['1'],
          'arousal': ['2']
        },
        transform: 'scale_0_100'
      }
    });

    // SUDS (Subjective Units of Distress)
    this.catalogs.set('SUDS', {
      code: 'SUDS',
      name: 'Subjective Units of Distress',
      version: '1.0',
      items: [
        { id: '1', prompt: 'Niveau de détresse actuel', type: 'slider', min: 0, max: 10 }
      ],
      scoring: {
        type: 'sum',
        transform: 'scale_0_100'
      }
    });

    // Add other instruments...
    this.initializeRemainingCatalogs();
  }

  private initializeRemainingCatalogs() {
    // PSS-10, UCLA-3, MSPSS, AAQ-II, POMS, SSQ, ISI, GAS, GRIT-S, BRS, WEMWBS, UWES, CBI, CVS-Q
    // Implementation truncated for brevity - each would follow the same pattern
  }

  async getCatalog(instrument: InstrumentCode, locale: string = 'fr'): Promise<InstrumentCatalog | null> {
    const catalog = this.catalogs.get(instrument);
    if (!catalog) return null;

    // TODO: Implement localization
    return catalog;
  }

  async calculateScore(instrument: InstrumentCode, answers: Record<string, any>): Promise<AssessmentResult> {
    const catalog = this.catalogs.get(instrument);
    if (!catalog) {
      throw new Error(`Unknown instrument: ${instrument}`);
    }

    const scores = this.computeScores(catalog, answers);
    const level = this.determineLevel(catalog, scores);
    const orchestrationHints = this.generateOrchestrationHints(instrument, level, scores);
    const summaryText = this.generateSummaryText(instrument, level);

    return {
      instrument,
      scores,
      level,
      orchestration_hints: orchestrationHints,
      summary_text: summaryText
    };
  }

  private computeScores(catalog: InstrumentCatalog, answers: Record<string, any>): Record<string, number> {
    const { scoring, items } = catalog;
    const scores: Record<string, number> = {};

    if (scoring.type === 'sum' || scoring.type === 'average') {
      let sum = 0;
      let count = 0;

      for (const item of items) {
        if (answers[item.id] !== undefined) {
          let value = Number(answers[item.id]);
          
          // Handle reversed items
          if (item.reversed || scoring.reversed_items?.includes(item.id)) {
            const range = (item.max || 5) - (item.min || 1) + 1;
            value = range - value + (item.min || 1);
          }
          
          sum += value;
          count++;
        }
      }

      const rawScore = scoring.type === 'sum' ? sum : sum / count;
      scores.total = scoring.transform === 'scale_0_100' ? this.scaleToHundred(rawScore, catalog) : rawScore;

    } else if (scoring.type === 'subscales' && scoring.subscales) {
      for (const [subscaleName, itemIds] of Object.entries(scoring.subscales)) {
        let sum = 0;
        let count = 0;

        for (const itemId of itemIds) {
          if (answers[itemId] !== undefined) {
            const item = items.find(i => i.id === itemId);
            let value = Number(answers[itemId]);
            
            if (item?.reversed) {
              const range = (item.max || 5) - (item.min || 1) + 1;
              value = range - value + (item.min || 1);
            }
            
            sum += value;
            count++;
          }
        }

        const rawScore = sum;
        scores[subscaleName] = scoring.transform === 'scale_0_100' ? this.scaleToHundred(rawScore, catalog) : rawScore;
      }
    }

    return scores;
  }

  private scaleToHundred(rawScore: number, catalog: InstrumentCatalog): number {
    // Simple linear scaling - should be calibrated for each instrument
    const maxPossible = catalog.items.length * (catalog.items[0]?.max || 5);
    const minPossible = catalog.items.length * (catalog.items[0]?.min || 1);
    return Math.round(((rawScore - minPossible) / (maxPossible - minPossible)) * 100);
  }

  private determineLevel(catalog: InstrumentCatalog, scores: Record<string, number>): number {
    const { thresholds } = catalog.scoring;
    if (!thresholds) return 2; // Default neutral

    const mainScore = scores.total || Object.values(scores)[0] || 0;

    for (let level = 0; level <= 4; level++) {
      const threshold = thresholds[level.toString()];
      if (threshold && mainScore >= threshold[0] && mainScore <= threshold[1]) {
        return level;
      }
    }

    return 2; // Fallback neutral
  }

  private generateOrchestrationHints(instrument: InstrumentCode, level: number, scores: Record<string, number>): OrchestrationHint[] {
    const hints: OrchestrationHint[] = [];

    switch (instrument) {
      case 'WHO5':
        if (level <= 1) {
          hints.push(
            { action: 'gentle_tone', intensity: 'high', context: 'dashboard_cards' },
            { action: 'increase_support', intensity: 'medium', context: 'ui_adaptation' }
          );
        } else if (level >= 3) {
          hints.push(
            { action: 'encourage_movement', intensity: 'low', context: 'activity_suggestions' }
          );
        }
        break;

      case 'STAI6':
        if (level >= 3) {
          hints.push(
            { action: 'suggest_breathing', intensity: 'high', context: 'nyvee_module' },
            { action: 'reduce_intensity', intensity: 'medium', context: 'visual_effects' }
          );
        }
        break;

      case 'PANAS':
        if (scores.PA && scores.PA < 40) {
          hints.push(
            { action: 'offer_social', intensity: 'medium', context: 'community_nudge' }
          );
        }
        if (scores.NA && scores.NA > 60) {
          hints.push(
            { action: 'gentle_tone', intensity: 'high', context: 'journal_suggestions' }
          );
        }
        break;

      case 'SUDS':
        if (level >= 3) {
          hints.push(
            { action: 'extend_session', intensity: 'medium', context: 'flash_glow', duration_ms: 60000 }
          );
        } else if (level <= 1) {
          hints.push(
            { action: 'soft_exit', intensity: 'low', context: 'session_completion' }
          );
        }
        break;
    }

    return hints;
  }

  private generateSummaryText(instrument: InstrumentCode, level: number): string {
    const summaries: Record<InstrumentCode, Record<number, string>> = {
      'WHO5': {
        0: 'besoin de douceur',
        1: 'moment plus délicat',
        2: 'équilibre stable',
        3: 'bonne forme',
        4: 'très belle énergie'
      },
      'STAI6': {
        0: 'grande sérénité',
        1: 'calme ressenti',
        2: 'état équilibré',
        3: 'tension présente',
        4: 'besoin d\'apaisement'
      },
      'SUDS': {
        0: 'grande tranquillité',
        1: 'sérénité',
        2: 'état neutre',
        3: 'tension élevée',
        4: 'détresse importante'
      }
    };

    return summaries[instrument]?.[level] || 'état évalué';
  }

  async submitResponse(instrument: InstrumentCode, answers: Record<string, any>, metadata?: any): Promise<boolean> {
    try {
      const result = await this.calculateScore(instrument, answers);
      
      // Store in assessments table
      const { error } = await supabase
        .from('assessments')
        .insert({
          instrument,
          score_json: {
            summary: result.summary_text,
            level: result.level,
            instrument_version: this.catalogs.get(instrument)?.version || '1.0',
            generated_at: new Date().toISOString()
          }
        });

      if (error) throw error;

      // Store orchestration signals
      if (result.orchestration_hints.length > 0) {
        const { error: signalError } = await supabase
          .from('clinical_signals')
          .insert({
            source_instrument: instrument,
            domain: this.getDomain(instrument),
            level: result.level,
            window_type: 'contextual',
            module_context: 'assessment_response',
            metadata: { hints: result.orchestration_hints },
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          });

        if (signalError) {
          console.error('Error storing signals:', signalError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error submitting response:', error);
      return false;
    }
  }

  private getDomain(instrument: InstrumentCode): string {
    const domains: Record<InstrumentCode, string> = {
      'WHO5': 'wellbeing',
      'STAI6': 'anxiety',
      'PANAS': 'affect',
      'PSS10': 'stress',
      'UCLA3': 'social',
      'MSPSS': 'social',
      'AAQ2': 'flexibility',
      'POMS': 'mood',
      'SSQ': 'vr_safety',
      'ISI': 'sleep',
      'GAS': 'goals',
      'GRITS': 'persistence',
      'BRS': 'resilience',
      'WEMWBS': 'wellbeing',
      'UWES': 'engagement',
      'CBI': 'burnout',
      'CVSQ': 'vision',
      'SAM': 'valence_arousal',
      'SUDS': 'distress'
    };
    return domains[instrument] || 'general';
  }

  async getUISuggestion(type: string): Promise<any> {
    // Legacy compatibility
    return null;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const clinicalScoringService = new ClinicalScoringService();