/**
 * Orchestration clinique - Adaptation des modules selon les signaux
 * JAMAIS de chiffres affichés, seulement adaptation comportementale
 */

import type { InstrumentCode } from '@/services/clinicalScoringService'

export interface ClinicalSignal {
  id: string
  user_id: string
  source_instrument: InstrumentCode
  level: 0 | 1 | 2 | 3 | 4
  domain: 'wellbeing' | 'anxiety' | 'mood' | 'stress' | 'engagement' | 'burnout'
  window_type: 'immediate' | 'daily' | 'weekly' | 'monthly'
  module_context: string
  metadata: Record<string, any>
  expires_at: string
  created_at: string
}

export interface OrchestrationHints {
  cardOrdering: string[]
  nudgeTone: 'gentle' | 'neutral' | 'energetic'
  primarySuggestions: string[]
  moduleParameters: Record<string, any>
  emergencyTools: string[]
}

export class ClinicalOrchestrator {
  /**
   * Analyse les signaux cliniques pour adapter l'expérience utilisateur
   * Retourne des directives d'adaptation, JAMAIS de scores
   */
  adaptExperience(signals: ClinicalSignal[]): OrchestrationHints {
    if (!signals.length) {
      return this.getDefaultHints()
    }

    // Prioriser les signaux les plus récents et critiques
    const prioritizedSignals = this.prioritizeSignals(signals)
    const dominantSignal = prioritizedSignals[0]

    return this.generateHints(dominantSignal, prioritizedSignals)
  }

  private prioritizeSignals(signals: ClinicalSignal[]): ClinicalSignal[] {
    return signals
      .filter(signal => new Date(signal.expires_at) > new Date())
      .sort((a, b) => {
        // Prioriser par urgence puis par récence
        const urgencyA = this.getUrgencyScore(a)
        const urgencyB = this.getUrgencyScore(b)
        
        if (urgencyA !== urgencyB) {
          return urgencyB - urgencyA
        }
        
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }

  private getUrgencyScore(signal: ClinicalSignal): number {
    // Plus le niveau est extrême (0 ou 4), plus c'est urgent
    if (signal.level === 0 || signal.level === 4) return 3
    if (signal.level === 1 || signal.level === 3) return 2
    return 1
  }

  private generateHints(dominantSignal: ClinicalSignal, allSignals: ClinicalSignal[]): OrchestrationHints {
    const { source_instrument, level, domain } = dominantSignal

    // Adaptation selon l'instrument et le niveau
    switch (source_instrument) {
      case 'WHO5':
        return this.adaptForWellbeing(level)
      
      case 'STAI6':
        return this.adaptForAnxiety(level)
      
      case 'SAM':
        return this.adaptForMood(level, dominantSignal.metadata)
      
      case 'PSS10':
        return this.adaptForStress(level)
      
      case 'AAQ2':
        return this.adaptForFlexibility(level)
      
      default:
        return this.adaptByDomain(domain, level)
    }
  }

  private adaptForWellbeing(level: 0 | 1 | 2 | 3 | 4): OrchestrationHints {
    if (level <= 1) {
      return {
        cardOrdering: ['nyvee', 'breathwork', 'music', 'coach'],
        nudgeTone: 'gentle',
        primarySuggestions: ['Respirer doucement 1 min', 'Cocon d\'urgence', 'Musique apaisante'],
        moduleParameters: {
          breathwork: { defaultDuration: 60, gentlePacing: true },
          music: { mood: 'very_calm', volume: 0.7 },
          coach: { responseLength: 'short', tone: 'supportive' }
        },
        emergencyTools: ['nyvee', 'flash-glow']
      }
    } else if (level >= 3) {
      return {
        cardOrdering: ['scan', 'music', 'activity', 'social-cocon'],
        nudgeTone: 'energetic',
        primarySuggestions: ['Scan émotionnel', 'Mouvement doux', 'Partager l\'énergie'],
        moduleParameters: {
          music: { mood: 'uplifting', intensity: 'medium' },
          activity: { suggestions: 'energetic' },
          scan: { celebratePositive: true }
        },
        emergencyTools: []
      }
    }
    
    return this.getDefaultHints()
  }

  private adaptForAnxiety(level: 0 | 1 | 2 | 3 | 4): OrchestrationHints {
    if (level >= 3) {
      return {
        cardOrdering: ['nyvee', 'breathwork', 'flash-glow', 'coach'],
        nudgeTone: 'gentle',
        primarySuggestions: ['5-4-3-2-1 ancrage', 'Respiration longue', 'Flash de calme'],
        moduleParameters: {
          breathwork: { 
            technique: 'box_breathing',
            exhaleEmphasis: true,
            duration: 300 // 5 minutes
          },
          nyvee: { 
            ambiance: 'deep_calm',
            autoExtend: true 
          },
          coach: { 
            scripts: 'grounding',
            responseTime: 'immediate'
          }
        },
        emergencyTools: ['nyvee', 'flash-glow', 'breathwork']
      }
    }
    
    return this.getDefaultHints()
  }

  private adaptForMood(level: 0 | 1 | 2 | 3 | 4, metadata: Record<string, any>): OrchestrationHints {
    const valence = metadata.valence || 50
    const arousal = metadata.arousal || 50

    if (valence < 40 && arousal > 60) {
      // Valence basse + Arousal haut = agitation négative
      return {
        cardOrdering: ['flash-glow', 'breathwork', 'nyvee'],
        nudgeTone: 'gentle',
        primarySuggestions: ['Expiration longue', 'Flash de calme', 'Cocon apaisant'],
        moduleParameters: {
          breathwork: { emphasis: 'exhale', rhythm: 'slow' },
          music: { texture: 'ambient', tempo: 'very_slow' }
        },
        emergencyTools: ['flash-glow']
      }
    } else if (valence > 70) {
      // Humeur positive
      return {
        cardOrdering: ['scan', 'music', 'activity', 'journal'],
        nudgeTone: 'energetic',
        primarySuggestions: ['Capturer ce moment', 'Musique inspirante', 'Journal créatif'],
        moduleParameters: {
          journal: { prompts: 'gratitude' },
          music: { mood: 'uplifting' }
        },
        emergencyTools: []
      }
    }

    return this.getDefaultHints()
  }

  private adaptForStress(level: 0 | 1 | 2 | 3 | 4): OrchestrationHints {
    if (level >= 3) {
      return {
        cardOrdering: ['bubble-beat', 'nyvee', 'screen-silk', 'breathwork'],
        nudgeTone: 'gentle',
        primarySuggestions: ['Parcours court', 'Pause écran', 'Respiration'],
        moduleParameters: {
          'bubble-beat': { difficulty: 'easy', duration: 'short' },
          'screen-silk': { reminders: 'frequent' },
          notifications: { quietMode: true }
        },
        emergencyTools: ['nyvee', 'flash-glow']
      }
    }
    
    return this.getDefaultHints()
  }

  private adaptForFlexibility(level: 0 | 1 | 2 | 3 | 4): OrchestrationHints {
    if (level >= 3) {
      return {
        cardOrdering: ['coach', 'bounce-back', 'journal'],
        nudgeTone: 'neutral',
        primarySuggestions: ['Micro-défusion', 'Action simple', 'Observer sans juger'],
        moduleParameters: {
          coach: { 
            scripts: 'defusion',
            responseLength: 'micro', // ≤ 7 mots
            metaphors: 'act_based'
          },
          'bounce-back': { 
            nextAction: 'simplified',
            compassionMode: true
          }
        },
        emergencyTools: []
      }
    }
    
    return this.getDefaultHints()
  }

  private adaptByDomain(domain: string, level: 0 | 1 | 2 | 3 | 4): OrchestrationHints {
    switch (domain) {
      case 'burnout':
        if (level >= 3) {
          return {
            cardOrdering: ['screen-silk', 'nyvee', 'coach'],
            nudgeTone: 'gentle',
            primarySuggestions: ['Pause obligatoire', 'Calendrier protégé'],
            moduleParameters: {
              notifications: { drasticQuietMode: true },
              'screen-silk': { forceBreaks: true }
            },
            emergencyTools: ['nyvee']
          }
        }
        break
      
      case 'engagement':
        if (level <= 1) {
          return {
            cardOrdering: ['activity', 'ambition-arcade', 'social-cocon'],
            nudgeTone: 'gentle',
            primarySuggestions: ['Micro-objectif', 'Connexion douce'],
            moduleParameters: {
              'ambition-arcade': { challenges: 'micro', encouragement: 'high' }
            },
            emergencyTools: []
          }
        }
        break
    }
    
    return this.getDefaultHints()
  }

  private getDefaultHints(): OrchestrationHints {
    return {
      cardOrdering: ['scan', 'breathwork', 'music', 'coach', 'journal'],
      nudgeTone: 'neutral',
      primarySuggestions: ['Scan émotionnel', 'Respiration', 'Musique douce'],
      moduleParameters: {},
      emergencyTools: []
    }
  }

  /**
   * Génère des insights pour l'agrégation B2B
   * Retourne UNIQUEMENT du texte descriptif, jamais de chiffres
   */
  generateTeamInsights(signals: ClinicalSignal[], minParticipants: number = 5): string[] {
    if (signals.length < minParticipants) {
      return ['Données insuffisantes pour analyse d\'équipe']
    }

    const insights: string[] = []
    const wellbeingSignals = signals.filter(s => s.domain === 'wellbeing')
    const stressSignals = signals.filter(s => s.domain === 'stress')
    const burnoutSignals = signals.filter(s => s.domain === 'burnout')

    // Analyse du bien-être d'équipe
    if (wellbeingSignals.length >= minParticipants) {
      const lowWellbeingCount = wellbeingSignals.filter(s => s.level <= 1).length
      const proportion = lowWellbeingCount / wellbeingSignals.length
      
      if (proportion > 0.3) {
        insights.push('Période plus délicate pour l\'équipe, privilégier les pauses et l\'entraide')
      } else if (proportion < 0.1) {
        insights.push('Belle dynamique d\'équipe, énergie collective positive')
      } else {
        insights.push('Équipe en équilibre, maintenir les bonnes pratiques')
      }
    }

    // Analyse du stress
    if (stressSignals.length >= minParticipants) {
      const highStressCount = stressSignals.filter(s => s.level >= 3).length
      const proportion = highStressCount / stressSignals.length
      
      if (proportion > 0.4) {
        insights.push('Charge élevée ressentie, envisager allègement temporaire')
      } else if (proportion > 0.2) {
        insights.push('Pression modérée, surveiller l\'évolution')
      }
    }

    // Suggestions d'actions d'équipe
    if (insights.length > 0) {
      insights.push('Suggestion: réunion courte sans agenda pour relâcher')
      insights.push('Rappel: pauses collectives encouragées')
    }

    return insights.length > 0 ? insights : ['Équipe en fonctionnement nominal']
  }
}

export const clinicalOrchestrator = new ClinicalOrchestrator()