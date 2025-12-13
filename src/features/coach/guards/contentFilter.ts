// @ts-nocheck
/**
 * Content Filter - Filtre de contenu pour le coach
 * Système de modération et filtrage des contenus sensibles
 */

import { logger } from '@/lib/logger';

/** Niveau de sensibilité */
export type SensitivityLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

/** Catégorie de contenu */
export type ContentCategory =
  | 'safe'
  | 'mental_health'
  | 'self_harm'
  | 'violence'
  | 'adult'
  | 'spam'
  | 'harassment'
  | 'misinformation'
  | 'personal_info'
  | 'medical_advice';

/** Type d'action de modération */
export type ModerationAction = 'allow' | 'warn' | 'block' | 'escalate' | 'redirect';

/** Résultat du filtrage */
export interface FilterResult {
  allowed: boolean;
  action: ModerationAction;
  category: ContentCategory;
  sensitivity: SensitivityLevel;
  originalText: string;
  filteredText: string;
  triggers: TriggerMatch[];
  suggestions?: string[];
  helpResources?: HelpResource[];
  processingTime: number;
}

/** Match de déclencheur */
export interface TriggerMatch {
  pattern: string;
  category: ContentCategory;
  sensitivity: SensitivityLevel;
  position: { start: number; end: number };
  matchedText: string;
}

/** Ressource d'aide */
export interface HelpResource {
  name: string;
  type: 'hotline' | 'website' | 'app' | 'professional' | 'article';
  description: string;
  contact?: string;
  url?: string;
  available24h?: boolean;
  languages?: string[];
}

/** Configuration du filtre */
export interface FilterConfig {
  enabled: boolean;
  sensitivityThreshold: SensitivityLevel;
  maxOutputLength: number;
  enableRedactions: boolean;
  logDetections: boolean;
  customPatterns: CustomPattern[];
  whitelist: string[];
  escalationCallback?: (result: FilterResult) => void;
  resourcesByCategory: Record<ContentCategory, HelpResource[]>;
}

/** Pattern personnalisé */
export interface CustomPattern {
  name: string;
  pattern: RegExp;
  category: ContentCategory;
  sensitivity: SensitivityLevel;
  action: ModerationAction;
}

/** Statistiques de filtrage */
export interface FilterStats {
  totalChecks: number;
  blockedCount: number;
  warnedCount: number;
  escalatedCount: number;
  byCategory: Record<ContentCategory, number>;
  bySensitivity: Record<SensitivityLevel, number>;
  averageProcessingTime: number;
  lastCheck: number | null;
}

// Patterns de détection par catégorie
const SELF_HARM_PATTERNS = [
  /\b(suicide|suicidaire|me tuer|me suicider)\b/i,
  /\b(plus envie de vivre|en finir|mettre fin à mes jours)\b/i,
  /\b(automutilation|me faire du mal|me blesser)\b/i,
  /\b(veux mourir|envie de mourir|mieux mort)\b/i,
  /\b(ne plus être là|disparaître|partir pour toujours)\b/i
];

const MENTAL_HEALTH_PATTERNS = [
  /\b(dépression|dépressif|déprimé|déprime)\b/i,
  /\b(anxiété|angoisse|panique|anxieux)\b/i,
  /\b(trouble alimentaire|anorexie|boulimie)\b/i,
  /\b(traumatisme|trauma|ptsd|stress post)\b/i,
  /\b(addiction|dépendance|accro)\b/i
];

const VIOLENCE_PATTERNS = [
  /\b(tuer|frapper|battre|agresser)\b/i,
  /\b(violence|violent|brutalité)\b/i,
  /\b(blesser quelqu'un|faire du mal à)\b/i
];

const PERSONAL_INFO_PATTERNS = [
  /\b\d{10}\b/,  // Numéros de téléphone
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  // Emails
  /\b\d{5}\s?[A-Za-z]{2}\d{4}\b/i,  // Numéros de sécurité sociale
  /\b\d{16}\b/  // Numéros de carte
];

// Configuration par défaut
const DEFAULT_CONFIG: FilterConfig = {
  enabled: true,
  sensitivityThreshold: 'low',
  maxOutputLength: 500,
  enableRedactions: true,
  logDetections: true,
  customPatterns: [],
  whitelist: [],
  resourcesByCategory: {
    safe: [],
    mental_health: [
      {
        name: 'Fil Santé Jeunes',
        type: 'hotline',
        description: 'Écoute et conseils pour les jeunes',
        contact: '0 800 235 236',
        available24h: false,
        languages: ['fr']
      }
    ],
    self_harm: [
      {
        name: 'SOS Amitié',
        type: 'hotline',
        description: 'Écoute 24h/24 pour personnes en détresse',
        contact: '09 72 39 40 50',
        available24h: true,
        languages: ['fr']
      },
      {
        name: 'Numéro National de Prévention du Suicide',
        type: 'hotline',
        description: 'Ligne nationale de prévention du suicide',
        contact: '3114',
        available24h: true,
        languages: ['fr']
      }
    ],
    violence: [],
    adult: [],
    spam: [],
    harassment: [],
    misinformation: [],
    personal_info: [],
    medical_advice: []
  }
};

// État global
let config: FilterConfig = { ...DEFAULT_CONFIG };
const stats: FilterStats = {
  totalChecks: 0,
  blockedCount: 0,
  warnedCount: 0,
  escalatedCount: 0,
  byCategory: {
    safe: 0, mental_health: 0, self_harm: 0, violence: 0,
    adult: 0, spam: 0, harassment: 0, misinformation: 0,
    personal_info: 0, medical_advice: 0
  },
  bySensitivity: {
    none: 0, low: 0, medium: 0, high: 0, critical: 0
  },
  averageProcessingTime: 0,
  lastCheck: null
};

// Messages de réponse empathiques
const EMPATHIC_RESPONSES: Record<ContentCategory, string[]> = {
  safe: [],
  self_harm: [
    'Je comprends que tu traverses un moment difficile. Tu n\'es pas seul(e).',
    'Ce que tu ressens est important. Parler à quelqu\'un peut vraiment aider.',
    'Des professionnels sont disponibles pour t\'écouter et t\'accompagner.'
  ],
  mental_health: [
    'Ce que tu ressens est normal et valide.',
    'Prendre soin de sa santé mentale est un signe de force.',
    'Respire doucement. Observe, laisse passer.'
  ],
  violence: [
    'Si tu es en danger, n\'hésite pas à contacter les autorités.',
    'Ta sécurité est importante.'
  ],
  adult: [],
  spam: [],
  harassment: [],
  misinformation: [],
  personal_info: [
    'Attention, évite de partager des informations personnelles sensibles.'
  ],
  medical_advice: [
    'Pour des conseils médicaux, consulte un professionnel de santé.'
  ]
};

/** Configurer le filtre */
export function configureFilter(userConfig: Partial<FilterConfig>): void {
  config = { ...config, ...userConfig };
}

/** Obtenir la configuration */
export function getFilterConfig(): FilterConfig {
  return { ...config };
}

/** Vérifier si le texte doit être bloqué (rétrocompatibilité) */
export function mustBlock(text: string): boolean {
  const result = filterContent(text);
  return result.action === 'block';
}

/** Modérer la sortie (rétrocompatibilité) */
export function moderateOutput(output: string): string {
  const result = filterContent(output, { isOutput: true });
  return result.filteredText;
}

/** Filtrer le contenu (fonction principale) */
export function filterContent(
  text: string,
  options?: { isOutput?: boolean }
): FilterResult {
  const startTime = performance.now();
  stats.totalChecks++;
  stats.lastCheck = Date.now();

  if (!config.enabled) {
    return createSafeResult(text, performance.now() - startTime);
  }

  const triggers: TriggerMatch[] = [];
  let highestSensitivity: SensitivityLevel = 'none';
  let primaryCategory: ContentCategory = 'safe';

  // Vérifier les patterns de self-harm (critique)
  detectPatterns(text, SELF_HARM_PATTERNS, 'self_harm', 'critical', triggers);

  // Vérifier les patterns de santé mentale
  detectPatterns(text, MENTAL_HEALTH_PATTERNS, 'mental_health', 'high', triggers);

  // Vérifier les patterns de violence
  detectPatterns(text, VIOLENCE_PATTERNS, 'violence', 'high', triggers);

  // Vérifier les informations personnelles
  detectPatterns(text, PERSONAL_INFO_PATTERNS, 'personal_info', 'medium', triggers);

  // Patterns personnalisés
  for (const custom of config.customPatterns) {
    detectPatterns(text, [custom.pattern], custom.category, custom.sensitivity, triggers);
  }

  // Déterminer la sensibilité et la catégorie principale
  for (const trigger of triggers) {
    if (compareSensitivity(trigger.sensitivity, highestSensitivity) > 0) {
      highestSensitivity = trigger.sensitivity;
      primaryCategory = trigger.category;
    }
  }

  // Déterminer l'action
  const action = determineAction(highestSensitivity, primaryCategory, triggers);

  // Filtrer le texte si nécessaire
  let filteredText = text;
  if (options?.isOutput) {
    filteredText = sanitizeOutput(text, triggers, action);
  }

  // Mettre à jour les stats
  updateStats(action, primaryCategory, highestSensitivity);

  // Logger si nécessaire
  if (config.logDetections && triggers.length > 0) {
    logger.warn('[ContentFilter] Triggers detected', {
      category: primaryCategory,
      sensitivity: highestSensitivity,
      action,
      triggerCount: triggers.length
    }, 'CONTENT_FILTER');
  }

  // Callback d'escalade si nécessaire
  if (action === 'escalate' && config.escalationCallback) {
    const result = createResult(
      text, filteredText, triggers, primaryCategory,
      highestSensitivity, action, performance.now() - startTime
    );
    config.escalationCallback(result);
  }

  return createResult(
    text, filteredText, triggers, primaryCategory,
    highestSensitivity, action, performance.now() - startTime
  );
}

/** Détecter les patterns */
function detectPatterns(
  text: string,
  patterns: RegExp[],
  category: ContentCategory,
  sensitivity: SensitivityLevel,
  triggers: TriggerMatch[]
): void {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      triggers.push({
        pattern: pattern.source,
        category,
        sensitivity,
        position: { start: match.index, end: match.index + match[0].length },
        matchedText: match[0]
      });
    }
  }
}

/** Comparer les niveaux de sensibilité */
function compareSensitivity(a: SensitivityLevel, b: SensitivityLevel): number {
  const levels: SensitivityLevel[] = ['none', 'low', 'medium', 'high', 'critical'];
  return levels.indexOf(a) - levels.indexOf(b);
}

/** Déterminer l'action à prendre */
function determineAction(
  sensitivity: SensitivityLevel,
  category: ContentCategory,
  triggers: TriggerMatch[]
): ModerationAction {
  if (sensitivity === 'critical' || category === 'self_harm') {
    return 'escalate';
  }
  if (sensitivity === 'high') {
    return 'warn';
  }
  if (sensitivity === 'medium') {
    return 'warn';
  }
  if (triggers.length > 0) {
    return 'warn';
  }
  return 'allow';
}

/** Sanitiser la sortie */
function sanitizeOutput(
  text: string,
  triggers: TriggerMatch[],
  action: ModerationAction
): string {
  // Si escalade, utiliser une réponse empathique
  if (action === 'escalate') {
    const category = triggers[0]?.category || 'mental_health';
    const responses = EMPATHIC_RESPONSES[category];
    if (responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return 'Respire doucement. Observe, laisse passer.';
  }

  // Si blocage partiel, redact les patterns
  if (config.enableRedactions && triggers.length > 0) {
    let result = text;
    const sortedTriggers = [...triggers].sort((a, b) => b.position.start - a.position.start);
    for (const trigger of sortedTriggers) {
      const { start, end } = trigger.position;
      result = result.slice(0, start) + '[...]' + result.slice(end);
    }
    text = result;
  }

  // Limiter la longueur
  return text.trim().slice(0, config.maxOutputLength);
}

/** Créer un résultat safe */
function createSafeResult(text: string, processingTime: number): FilterResult {
  return {
    allowed: true,
    action: 'allow',
    category: 'safe',
    sensitivity: 'none',
    originalText: text,
    filteredText: text.trim().slice(0, config.maxOutputLength),
    triggers: [],
    processingTime
  };
}

/** Créer un résultat complet */
function createResult(
  originalText: string,
  filteredText: string,
  triggers: TriggerMatch[],
  category: ContentCategory,
  sensitivity: SensitivityLevel,
  action: ModerationAction,
  processingTime: number
): FilterResult {
  const result: FilterResult = {
    allowed: action === 'allow' || action === 'warn',
    action,
    category,
    sensitivity,
    originalText,
    filteredText,
    triggers,
    processingTime
  };

  // Ajouter des suggestions
  if (action !== 'allow') {
    result.suggestions = EMPATHIC_RESPONSES[category] || [];
    result.helpResources = config.resourcesByCategory[category] || [];
  }

  return result;
}

/** Mettre à jour les statistiques */
function updateStats(
  action: ModerationAction,
  category: ContentCategory,
  sensitivity: SensitivityLevel
): void {
  stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  stats.bySensitivity[sensitivity] = (stats.bySensitivity[sensitivity] || 0) + 1;

  switch (action) {
    case 'block':
      stats.blockedCount++;
      break;
    case 'warn':
      stats.warnedCount++;
      break;
    case 'escalate':
      stats.escalatedCount++;
      break;
  }
}

/** Obtenir les statistiques */
export function getFilterStats(): FilterStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetFilterStats(): void {
  stats.totalChecks = 0;
  stats.blockedCount = 0;
  stats.warnedCount = 0;
  stats.escalatedCount = 0;
  stats.averageProcessingTime = 0;
  stats.lastCheck = null;

  for (const key of Object.keys(stats.byCategory) as ContentCategory[]) {
    stats.byCategory[key] = 0;
  }
  for (const key of Object.keys(stats.bySensitivity) as SensitivityLevel[]) {
    stats.bySensitivity[key] = 0;
  }
}

/** Ajouter un pattern personnalisé */
export function addCustomPattern(pattern: CustomPattern): void {
  config.customPatterns.push(pattern);
}

/** Supprimer un pattern personnalisé */
export function removeCustomPattern(name: string): boolean {
  const index = config.customPatterns.findIndex(p => p.name === name);
  if (index >= 0) {
    config.customPatterns.splice(index, 1);
    return true;
  }
  return false;
}

/** Vérifier si un texte contient du contenu sensible */
export function hasSensitiveContent(text: string): boolean {
  const result = filterContent(text);
  return result.sensitivity !== 'none';
}

/** Obtenir les ressources d'aide pour une catégorie */
export function getHelpResources(category: ContentCategory): HelpResource[] {
  return config.resourcesByCategory[category] || [];
}

export default {
  mustBlock,
  moderateOutput,
  filterContent,
  configureFilter,
  getFilterConfig,
  getFilterStats,
  resetFilterStats,
  addCustomPattern,
  removeCustomPattern,
  hasSensitiveContent,
  getHelpResources
};
