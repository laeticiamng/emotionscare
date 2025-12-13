// @ts-nocheck
/**
 * Activity Jardin Orchestrator - Orchestrateur d'activités du jardin
 * Gestion intelligente des suggestions et activités basées sur le bien-être
 */

import { logger } from '@/lib/logger';
import type { UIHint } from './types';

/** Niveau de bien-être WHO-5 */
export type Who5Level = 'critical' | 'low' | 'moderate' | 'good' | 'excellent';

/** Catégorie d'activité */
export type ActivityCategory =
  | 'breathing'
  | 'meditation'
  | 'journaling'
  | 'movement'
  | 'social'
  | 'creative'
  | 'nature'
  | 'mindfulness'
  | 'gratitude'
  | 'relaxation';

/** Priorité d'activité */
export type ActivityPriority = 'essential' | 'recommended' | 'optional' | 'bonus';

/** Durée d'activité */
export type ActivityDuration = 'quick' | 'short' | 'medium' | 'long';

/** Input de l'orchestrateur */
export interface ActivityJardinOrchestratorInput {
  who5Level?: number;
  userId?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  previousActivities?: string[];
  mood?: string;
  energyLevel?: number;
  availableTime?: number; // en minutes
  preferences?: UserPreferences;
  context?: OrchestratorContext;
}

/** Préférences utilisateur */
export interface UserPreferences {
  favoriteCategories?: ActivityCategory[];
  avoidCategories?: ActivityCategory[];
  preferredDuration?: ActivityDuration;
  notificationEnabled?: boolean;
  language?: string;
}

/** Contexte de l'orchestrateur */
export interface OrchestratorContext {
  streak?: number;
  lastSessionDate?: string;
  completedToday?: number;
  dailyGoal?: number;
  seasonalTheme?: string;
}

/** Activité suggérée */
export interface SuggestedActivity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration: number; // en secondes
  durationLabel: ActivityDuration;
  priority: ActivityPriority;
  icon?: string;
  benefits?: string[];
  instructions?: string[];
  audioUrl?: string;
  imageUrl?: string;
  points?: number;
}

/** Résultat de l'orchestration */
export interface OrchestrationResult {
  hints: UIHint[];
  activities: SuggestedActivity[];
  who5Analysis: Who5Analysis;
  personalizedMessage?: string;
  sessionRecommendation?: SessionRecommendation;
  metadata: OrchestrationMetadata;
}

/** Analyse WHO-5 */
export interface Who5Analysis {
  score: number;
  level: Who5Level;
  trend?: 'improving' | 'stable' | 'declining';
  recommendation: string;
  urgency: 'none' | 'low' | 'medium' | 'high';
}

/** Recommandation de session */
export interface SessionRecommendation {
  type: 'breathing' | 'meditation' | 'activity' | 'mixed';
  duration: number;
  activities: string[];
  reason: string;
}

/** Métadonnées d'orchestration */
export interface OrchestrationMetadata {
  orchestrationId: string;
  timestamp: number;
  processingTime: number;
  factors: string[];
}

/** Configuration de l'orchestrateur */
export interface OrchestratorConfig {
  enabled: boolean;
  maxActivities: number;
  prioritizeByWho5: boolean;
  includePersonalizedMessages: boolean;
  adaptToTimeOfDay: boolean;
  respectPreferences: boolean;
  minActivitiesPerSession: number;
}

/** Statistiques de l'orchestrateur */
export interface OrchestratorStats {
  totalOrchestrations: number;
  byWho5Level: Record<Who5Level, number>;
  popularActivities: Array<{ activity: string; count: number }>;
  averageActivitiesPerSession: number;
  lastOrchestration: number | null;
}

// Banque d'activités par catégorie et niveau WHO-5
const ACTIVITY_BANK: Record<Who5Level, SuggestedActivity[]> = {
  critical: [
    {
      id: 'breath-sos',
      title: 'Respiration SOS',
      description: 'Une respiration simple pour retrouver le calme',
      category: 'breathing',
      duration: 60,
      durationLabel: 'quick',
      priority: 'essential',
      icon: '🌬️',
      benefits: ['Calme le système nerveux', 'Réduit l\'anxiété immédiate'],
      instructions: ['Inspire 4 secondes', 'Expire 6 secondes', 'Répète 5 fois'],
      points: 10
    },
    {
      id: 'ground-present',
      title: 'Ancrage au présent',
      description: '5 sens pour revenir ici et maintenant',
      category: 'mindfulness',
      duration: 120,
      durationLabel: 'short',
      priority: 'essential',
      icon: '🌍',
      benefits: ['Reconnexion au moment présent', 'Réduit la dissociation'],
      points: 15
    }
  ],
  low: [
    {
      id: 'breath-calm',
      title: 'Respirer doucement 1 min',
      description: 'Une minute de respiration consciente',
      category: 'breathing',
      duration: 60,
      durationLabel: 'quick',
      priority: 'recommended',
      icon: '🌬️',
      benefits: ['Détente rapide', 'Recentrage'],
      points: 10
    },
    {
      id: 'journal-short',
      title: 'Journal court (2 phrases)',
      description: 'Écrire 2 phrases sur ton état actuel',
      category: 'journaling',
      duration: 120,
      durationLabel: 'short',
      priority: 'recommended',
      icon: '📝',
      benefits: ['Expression émotionnelle', 'Clarté mentale'],
      points: 15
    },
    {
      id: 'nyvee-silence',
      title: 'Nyvée en silence',
      description: 'Moment de calme avec Nyvée',
      category: 'meditation',
      duration: 180,
      durationLabel: 'short',
      priority: 'recommended',
      icon: '🧘',
      benefits: ['Apaisement', 'Connexion intérieure'],
      points: 20
    }
  ],
  moderate: [
    {
      id: 'breath-energize',
      title: 'Respiration énergisante',
      description: 'Boost d\'énergie par la respiration',
      category: 'breathing',
      duration: 180,
      durationLabel: 'short',
      priority: 'recommended',
      icon: '⚡',
      benefits: ['Regain d\'énergie', 'Clarté mentale'],
      points: 15
    },
    {
      id: 'gratitude-3',
      title: '3 gratitudes du jour',
      description: 'Noter 3 choses positives de ta journée',
      category: 'gratitude',
      duration: 180,
      durationLabel: 'short',
      priority: 'recommended',
      icon: '🙏',
      benefits: ['Perspective positive', 'Bien-être émotionnel'],
      points: 20
    },
    {
      id: 'walk-mindful',
      title: 'Marche consciente',
      description: '5 minutes de marche en pleine conscience',
      category: 'movement',
      duration: 300,
      durationLabel: 'medium',
      priority: 'optional',
      icon: '🚶',
      benefits: ['Mouvement doux', 'Connexion corps-esprit'],
      points: 25
    }
  ],
  good: [
    {
      id: 'meditation-loving',
      title: 'Méditation de bienveillance',
      description: 'Cultiver l\'amour bienveillant',
      category: 'meditation',
      duration: 600,
      durationLabel: 'medium',
      priority: 'optional',
      icon: '💗',
      benefits: ['Compassion', 'Connexion aux autres'],
      points: 30
    },
    {
      id: 'creative-express',
      title: 'Expression créative',
      description: 'Dessiner, écrire ou créer librement',
      category: 'creative',
      duration: 900,
      durationLabel: 'long',
      priority: 'bonus',
      icon: '🎨',
      benefits: ['Expression personnelle', 'Flow créatif'],
      points: 40
    }
  ],
  excellent: [
    {
      id: 'challenge-growth',
      title: 'Défi de croissance',
      description: 'Sortir de ta zone de confort aujourd\'hui',
      category: 'movement',
      duration: 1800,
      durationLabel: 'long',
      priority: 'bonus',
      icon: '🚀',
      benefits: ['Croissance personnelle', 'Confiance'],
      points: 50
    },
    {
      id: 'share-joy',
      title: 'Partager la joie',
      description: 'Faire un acte de gentillesse',
      category: 'social',
      duration: 600,
      durationLabel: 'medium',
      priority: 'bonus',
      icon: '🤝',
      benefits: ['Connexion sociale', 'Sens du purpose'],
      points: 35
    }
  ]
};

// Messages personnalisés par niveau
const PERSONALIZED_MESSAGES: Record<Who5Level, string[]> = {
  critical: [
    'Je suis là avec toi. Commençons doucement.',
    'Un petit pas à la fois. Tu es courageux(se) d\'être ici.',
    'Respire avec moi. Tu n\'es pas seul(e).'
  ],
  low: [
    'C\'est ok de ne pas aller bien. Prenons soin de toi.',
    'Chaque petit geste compte. Tu fais de ton mieux.',
    'Je suis là pour t\'accompagner.'
  ],
  moderate: [
    'Belle journée pour prendre soin de soi !',
    'Tu avances bien. Continue comme ça.',
    'Un moment de calme t\'attend.'
  ],
  good: [
    'Super forme ! Profitons-en pour grandir.',
    'Ta régularité porte ses fruits.',
    'Quelle belle énergie aujourd\'hui !'
  ],
  excellent: [
    'Rayonnant(e) ! Partage cette lumière.',
    'Tu es une inspiration.',
    'Le monde a besoin de ton énergie !'
  ]
};

// Configuration par défaut
const DEFAULT_CONFIG: OrchestratorConfig = {
  enabled: true,
  maxActivities: 5,
  prioritizeByWho5: true,
  includePersonalizedMessages: true,
  adaptToTimeOfDay: true,
  respectPreferences: true,
  minActivitiesPerSession: 3
};

// État global
let config: OrchestratorConfig = { ...DEFAULT_CONFIG };
const stats: OrchestratorStats = {
  totalOrchestrations: 0,
  byWho5Level: {
    critical: 0, low: 0, moderate: 0, good: 0, excellent: 0
  },
  popularActivities: [],
  averageActivitiesPerSession: 0,
  lastOrchestration: null
};

/** Générer un ID unique */
function generateId(): string {
  return `orch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Convertir score WHO-5 en niveau */
function scoreToLevel(score: number): Who5Level {
  if (score <= 20) return 'critical';
  if (score <= 40) return 'low';
  if (score <= 60) return 'moderate';
  if (score <= 80) return 'good';
  return 'excellent';
}

/** Analyser le score WHO-5 */
function analyzeWho5(score: number): Who5Analysis {
  const level = scoreToLevel(score);

  const recommendations: Record<Who5Level, string> = {
    critical: 'Priorité au soutien émotionnel immédiat',
    low: 'Focus sur les activités apaisantes et le self-care',
    moderate: 'Équilibre entre repos et activités légères',
    good: 'Maintenir les bonnes habitudes et explorer',
    excellent: 'Partager et consolider les acquis'
  };

  const urgencies: Record<Who5Level, 'none' | 'low' | 'medium' | 'high'> = {
    critical: 'high',
    low: 'medium',
    moderate: 'low',
    good: 'none',
    excellent: 'none'
  };

  return {
    score,
    level,
    recommendation: recommendations[level],
    urgency: urgencies[level]
  };
}

/** Sélectionner les activités appropriées */
function selectActivities(
  level: Who5Level,
  input: ActivityJardinOrchestratorInput
): SuggestedActivity[] {
  const levelActivities = ACTIVITY_BANK[level] || [];
  let activities = [...levelActivities];

  // Ajouter des activités des niveaux adjacents si nécessaire
  const levels: Who5Level[] = ['critical', 'low', 'moderate', 'good', 'excellent'];
  const currentIndex = levels.indexOf(level);

  if (currentIndex > 0 && activities.length < config.minActivitiesPerSession) {
    activities.push(...(ACTIVITY_BANK[levels[currentIndex - 1]] || []));
  }
  if (currentIndex < levels.length - 1 && activities.length < config.minActivitiesPerSession) {
    activities.push(...(ACTIVITY_BANK[levels[currentIndex + 1]] || []));
  }

  // Filtrer par préférences
  if (config.respectPreferences && input.preferences) {
    const { favoriteCategories, avoidCategories } = input.preferences;

    if (avoidCategories?.length) {
      activities = activities.filter(a => !avoidCategories.includes(a.category));
    }

    if (favoriteCategories?.length) {
      activities.sort((a, b) => {
        const aFav = favoriteCategories.includes(a.category) ? 1 : 0;
        const bFav = favoriteCategories.includes(b.category) ? 1 : 0;
        return bFav - aFav;
      });
    }
  }

  // Adapter au temps disponible
  if (input.availableTime) {
    const availableSeconds = input.availableTime * 60;
    activities = activities.filter(a => a.duration <= availableSeconds);
  }

  // Adapter à l'heure de la journée
  if (config.adaptToTimeOfDay && input.timeOfDay) {
    activities = adaptToTimeOfDay(activities, input.timeOfDay);
  }

  // Limiter le nombre
  return activities.slice(0, config.maxActivities);
}

/** Adapter les activités à l'heure */
function adaptToTimeOfDay(
  activities: SuggestedActivity[],
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
): SuggestedActivity[] {
  const priorityByTime: Record<string, ActivityCategory[]> = {
    morning: ['breathing', 'gratitude', 'movement'],
    afternoon: ['mindfulness', 'creative', 'social'],
    evening: ['journaling', 'meditation', 'relaxation'],
    night: ['breathing', 'meditation', 'relaxation']
  };

  const priorityCategories = priorityByTime[timeOfDay] || [];

  return activities.sort((a, b) => {
    const aP = priorityCategories.indexOf(a.category);
    const bP = priorityCategories.indexOf(b.category);
    const aPriority = aP >= 0 ? aP : 100;
    const bPriority = bP >= 0 ? bP : 100;
    return aPriority - bPriority;
  });
}

/** Créer des UIHints à partir des activités */
function createHints(activities: SuggestedActivity[]): UIHint[] {
  return [{
    action: 'show_highlights',
    items: activities.map(a => a.title)
  }];
}

/** Obtenir un message personnalisé */
function getPersonalizedMessage(level: Who5Level): string {
  const messages = PERSONALIZED_MESSAGES[level];
  return messages[Math.floor(Math.random() * messages.length)];
}

/** Orchestrateur principal (rétrocompatibilité) */
export const activityJardinOrchestrator = (
  { who5Level }: ActivityJardinOrchestratorInput
): UIHint[] => {
  const result = orchestrate({ who5Level });
  return result.hints;
};

/** Orchestration complète */
export function orchestrate(input: ActivityJardinOrchestratorInput): OrchestrationResult {
  const startTime = performance.now();
  const orchestrationId = generateId();

  stats.totalOrchestrations++;
  stats.lastOrchestration = Date.now();

  // Analyser WHO-5
  const score = input.who5Level ?? 50;
  const who5Analysis = analyzeWho5(score);

  stats.byWho5Level[who5Analysis.level]++;

  // Sélectionner les activités
  const activities = selectActivities(who5Analysis.level, input);

  // Créer les hints
  const hints = createHints(activities);

  // Message personnalisé
  const personalizedMessage = config.includePersonalizedMessages
    ? getPersonalizedMessage(who5Analysis.level)
    : undefined;

  // Recommandation de session
  const sessionRecommendation = createSessionRecommendation(activities, who5Analysis);

  // Facteurs considérés
  const factors: string[] = [`who5:${who5Analysis.level}`];
  if (input.timeOfDay) factors.push(`time:${input.timeOfDay}`);
  if (input.mood) factors.push(`mood:${input.mood}`);
  if (input.energyLevel) factors.push(`energy:${input.energyLevel}`);

  logger.info('Orchestration completed', {
    orchestrationId,
    level: who5Analysis.level,
    activitiesCount: activities.length
  }, 'ORCHESTRATOR');

  return {
    hints,
    activities,
    who5Analysis,
    personalizedMessage,
    sessionRecommendation,
    metadata: {
      orchestrationId,
      timestamp: Date.now(),
      processingTime: performance.now() - startTime,
      factors
    }
  };
}

/** Créer une recommandation de session */
function createSessionRecommendation(
  activities: SuggestedActivity[],
  analysis: Who5Analysis
): SessionRecommendation {
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
  const activityNames = activities.map(a => a.title);

  const types: Record<Who5Level, SessionRecommendation['type']> = {
    critical: 'breathing',
    low: 'meditation',
    moderate: 'mixed',
    good: 'activity',
    excellent: 'mixed'
  };

  const reasons: Record<Who5Level, string> = {
    critical: 'La respiration t\'aidera à te stabiliser',
    low: 'La méditation apaise et restaure',
    moderate: 'Un mix équilibré pour ton bien-être',
    good: 'L\'activité renforce ton élan positif',
    excellent: 'Explore et partage ta belle énergie'
  };

  return {
    type: types[analysis.level],
    duration: Math.round(totalDuration / 60),
    activities: activityNames,
    reason: reasons[analysis.level]
  };
}

/** Configurer l'orchestrateur */
export function configureOrchestrator(userConfig: Partial<OrchestratorConfig>): void {
  config = { ...config, ...userConfig };
}

/** Obtenir la configuration */
export function getOrchestratorConfig(): OrchestratorConfig {
  return { ...config };
}

/** Obtenir les statistiques */
export function getOrchestratorStats(): OrchestratorStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetOrchestratorStats(): void {
  stats.totalOrchestrations = 0;
  stats.averageActivitiesPerSession = 0;
  stats.lastOrchestration = null;
  stats.popularActivities = [];
  for (const key of Object.keys(stats.byWho5Level) as Who5Level[]) {
    stats.byWho5Level[key] = 0;
  }
}

/** Obtenir les activités pour un niveau */
export function getActivitiesForLevel(level: Who5Level): SuggestedActivity[] {
  return ACTIVITY_BANK[level] || [];
}

/** Obtenir toutes les catégories d'activités */
export function getActivityCategories(): ActivityCategory[] {
  return [
    'breathing', 'meditation', 'journaling', 'movement',
    'social', 'creative', 'nature', 'mindfulness',
    'gratitude', 'relaxation'
  ];
}

export default activityJardinOrchestrator;
