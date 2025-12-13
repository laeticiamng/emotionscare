// @ts-nocheck
/**
 * Anti-Prompt Injection - Protection contre les attaques d'injection de prompts
 * Système de détection et neutralisation des tentatives de manipulation
 */

/** Types de menaces détectées */
export type ThreatType =
  | 'instruction_override'
  | 'role_manipulation'
  | 'jailbreak_attempt'
  | 'system_prompt_leak'
  | 'delimiter_injection'
  | 'encoding_attack'
  | 'context_escape'
  | 'payload_injection'
  | 'social_engineering'
  | 'data_exfiltration';

/** Niveau de sévérité */
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

/** Résultat de l'analyse */
export interface AnalysisResult {
  isSafe: boolean;
  sanitizedText: string;
  threats: DetectedThreat[];
  score: number;
  processingTime: number;
}

/** Menace détectée */
export interface DetectedThreat {
  type: ThreatType;
  severity: SeverityLevel;
  pattern: string;
  location: { start: number; end: number };
  originalText: string;
  confidence: number;
}

/** Configuration de protection */
export interface ProtectionConfig {
  enabled: boolean;
  maxInputLength: number;
  strictMode: boolean;
  blockOnDetection: boolean;
  sanitizeMode: 'redact' | 'remove' | 'escape';
  logDetections: boolean;
  customPatterns: CustomPattern[];
  whitelist: string[];
  severityThreshold: SeverityLevel;
}

/** Pattern personnalisé */
export interface CustomPattern {
  name: string;
  pattern: RegExp;
  severity: SeverityLevel;
  type: ThreatType;
}

/** Statistiques de protection */
export interface ProtectionStats {
  totalAnalyzed: number;
  threatsDetected: number;
  threatsBlocked: number;
  threatsByType: Record<ThreatType, number>;
  threatsBySeverity: Record<SeverityLevel, number>;
  averageProcessingTime: number;
  lastDetection: number | null;
}

// Patterns de détection par catégorie
const INSTRUCTION_OVERRIDE_PATTERNS = [
  /ignore (?:all )?(?:your )?(?:previous |prior )?instructions/i,
  /forget (?:all |everything |your )?(?:previous |prior )?(?:instructions|rules|guidelines)/i,
  /disregard (?:all )?(?:previous |prior )?(?:instructions|rules|guidelines)/i,
  /override (?:all )?(?:previous |prior )?(?:instructions|rules|guidelines)/i,
  /new (?:system )?instructions?:?\s*\[/i,
  /from now on,?\s*(?:you will|you are|ignore)/i,
  /pretend (?:that )?(?:the previous|your|all) instructions/i,
  /act as if (?:you )?(?:have )?no (?:rules|restrictions|guidelines)/i,
];

const ROLE_MANIPULATION_PATTERNS = [
  /you are (?:now )?(?:a |an )?(?:different|new|evil|malicious)/i,
  /pretend (?:to be|you are) (?:a |an )?(?:different|evil|malicious)/i,
  /your new (?:role|persona|identity|character) is/i,
  /switch (?:to |into )?(?:a )?(?:new |different )?(?:mode|persona|character)/i,
  /transform into (?:a |an )?/i,
  /change your (?:behavior|personality|character) to/i,
];

const JAILBREAK_PATTERNS = [
  /jailbreak/i,
  /dan\s*(?:mode|prompt)?/i,
  /do anything now/i,
  /developer mode/i,
  /unrestricted mode/i,
  /bypass (?:all )?(?:safety|security|restrictions|filters)/i,
  /dis?able (?:all )?(?:safety|security|restrictions|filters)/i,
  /remove (?:all )?(?:safety|security|restrictions|filters)/i,
  /turn off (?:all )?(?:safety|security|restrictions|filters)/i,
  /without (?:any )?(?:restrictions|limitations|filters)/i,
];

const SYSTEM_PROMPT_PATTERNS = [
  /system prompt/i,
  /initial prompt/i,
  /original prompt/i,
  /reveal your (?:system|initial|original) (?:prompt|instructions)/i,
  /show me your (?:system|initial|original) (?:prompt|instructions)/i,
  /what (?:are|were) your (?:original|initial|system) (?:instructions|prompt)/i,
  /output your (?:system|initial|original) (?:prompt|instructions)/i,
  /print your (?:system|initial|original) (?:prompt|instructions)/i,
];

const DELIMITER_PATTERNS = [
  /\[system\]/i,
  /\[assistant\]/i,
  /\[user\]/i,
  /\[\[(?:system|user|assistant)\]\]/i,
  /```system/i,
  /---\s*system\s*---/i,
  /<\/?(?:system|user|assistant)>/i,
  /\{\{(?:system|user|assistant)\}\}/i,
];

const ENCODING_PATTERNS = [
  /base64:\s*[a-zA-Z0-9+/=]{20,}/i,
  /hex:\s*[0-9a-fA-F]{20,}/i,
  /rot13:\s*/i,
  /unicode:\s*(?:\\u[0-9a-fA-F]{4}){5,}/i,
  /morse:\s*[\.\-\s]{10,}/i,
  /binary:\s*[01\s]{20,}/i,
];

const CONTEXT_ESCAPE_PATTERNS = [
  /end of (?:context|conversation|session)/i,
  /new (?:context|conversation|session):/i,
  /\*{3,}(?:new|reset|clear)/i,
  /reset (?:context|conversation|memory)/i,
  /clear (?:context|conversation|memory)/i,
  /starting fresh/i,
];

// Configuration par défaut
const DEFAULT_CONFIG: ProtectionConfig = {
  enabled: true,
  maxInputLength: 10000,
  strictMode: false,
  blockOnDetection: false,
  sanitizeMode: 'redact',
  logDetections: true,
  customPatterns: [],
  whitelist: [],
  severityThreshold: 'low'
};

// Configuration actuelle
let config: ProtectionConfig = { ...DEFAULT_CONFIG };

// Statistiques
const stats: ProtectionStats = {
  totalAnalyzed: 0,
  threatsDetected: 0,
  threatsBlocked: 0,
  threatsByType: {
    instruction_override: 0,
    role_manipulation: 0,
    jailbreak_attempt: 0,
    system_prompt_leak: 0,
    delimiter_injection: 0,
    encoding_attack: 0,
    context_escape: 0,
    payload_injection: 0,
    social_engineering: 0,
    data_exfiltration: 0
  },
  threatsBySeverity: {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  },
  averageProcessingTime: 0,
  lastDetection: null
};

/** Configurer la protection */
export function configureProtection(userConfig: Partial<ProtectionConfig>): void {
  config = { ...config, ...userConfig };
}

/** Obtenir la configuration actuelle */
export function getConfig(): ProtectionConfig {
  return { ...config };
}

/** Analyser un texte pour les menaces */
export function analyzeText(input: string): AnalysisResult {
  const startTime = performance.now();
  stats.totalAnalyzed++;

  if (!config.enabled) {
    return {
      isSafe: true,
      sanitizedText: input,
      threats: [],
      score: 0,
      processingTime: performance.now() - startTime
    };
  }

  // Tronquer si trop long
  const text = input.slice(0, config.maxInputLength);
  const threats: DetectedThreat[] = [];

  // Vérifier la whitelist
  const isWhitelisted = config.whitelist.some(w =>
    text.toLowerCase().includes(w.toLowerCase())
  );

  if (!isWhitelisted) {
    // Analyser les différents types de menaces
    detectPatterns(text, INSTRUCTION_OVERRIDE_PATTERNS, 'instruction_override', 'critical', threats);
    detectPatterns(text, ROLE_MANIPULATION_PATTERNS, 'role_manipulation', 'high', threats);
    detectPatterns(text, JAILBREAK_PATTERNS, 'jailbreak_attempt', 'critical', threats);
    detectPatterns(text, SYSTEM_PROMPT_PATTERNS, 'system_prompt_leak', 'high', threats);
    detectPatterns(text, DELIMITER_PATTERNS, 'delimiter_injection', 'medium', threats);
    detectPatterns(text, ENCODING_PATTERNS, 'encoding_attack', 'medium', threats);
    detectPatterns(text, CONTEXT_ESCAPE_PATTERNS, 'context_escape', 'medium', threats);

    // Patterns personnalisés
    for (const custom of config.customPatterns) {
      detectPatterns(text, [custom.pattern], custom.type, custom.severity, threats);
    }
  }

  // Calculer le score de menace
  const score = calculateThreatScore(threats);

  // Mettre à jour les statistiques
  if (threats.length > 0) {
    stats.threatsDetected += threats.length;
    stats.lastDetection = Date.now();

    for (const threat of threats) {
      stats.threatsByType[threat.type]++;
      stats.threatsBySeverity[threat.severity]++;
    }

    if (config.logDetections) {
      console.warn('[AntiPromptInjection] Threats detected:', threats);
    }
  }

  // Filtrer par seuil de sévérité
  const filteredThreats = filterBySeverity(threats, config.severityThreshold);

  // Déterminer si le texte est sûr
  const isSafe = filteredThreats.length === 0 || !config.blockOnDetection;

  // Sanitiser le texte
  const sanitizedText = sanitizeText(text, filteredThreats);

  // Mettre à jour le temps moyen
  const processingTime = performance.now() - startTime;
  updateAverageTime(processingTime);

  if (!isSafe) {
    stats.threatsBlocked++;
  }

  return {
    isSafe,
    sanitizedText,
    threats: filteredThreats,
    score,
    processingTime
  };
}

/** Détecter les patterns */
function detectPatterns(
  text: string,
  patterns: RegExp[],
  type: ThreatType,
  severity: SeverityLevel,
  threats: DetectedThreat[]
): void {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      threats.push({
        type,
        severity,
        pattern: pattern.source,
        location: {
          start: match.index,
          end: match.index + match[0].length
        },
        originalText: match[0],
        confidence: calculateConfidence(match[0], pattern)
      });
    }
  }
}

/** Calculer la confiance de détection */
function calculateConfidence(matchedText: string, pattern: RegExp): number {
  // Plus le match est long, plus la confiance est élevée
  const lengthScore = Math.min(1, matchedText.length / 50);

  // Pattern spécifique = plus de confiance
  const specificityScore = pattern.source.length > 30 ? 0.9 : 0.7;

  return Math.min(1, (lengthScore + specificityScore) / 2);
}

/** Calculer le score de menace global */
function calculateThreatScore(threats: DetectedThreat[]): number {
  if (threats.length === 0) return 0;

  const severityWeights: Record<SeverityLevel, number> = {
    low: 0.1,
    medium: 0.3,
    high: 0.6,
    critical: 1.0
  };

  let totalScore = 0;
  for (const threat of threats) {
    totalScore += severityWeights[threat.severity] * threat.confidence;
  }

  return Math.min(1, totalScore);
}

/** Filtrer par seuil de sévérité */
function filterBySeverity(
  threats: DetectedThreat[],
  threshold: SeverityLevel
): DetectedThreat[] {
  const levels: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
  const thresholdIndex = levels.indexOf(threshold);

  return threats.filter(t => levels.indexOf(t.severity) >= thresholdIndex);
}

/** Sanitiser le texte */
function sanitizeText(text: string, threats: DetectedThreat[]): string {
  if (threats.length === 0) return text;

  let result = text;

  // Trier par position décroissante pour éviter les décalages d'index
  const sortedThreats = [...threats].sort((a, b) => b.location.start - a.location.start);

  for (const threat of sortedThreats) {
    const { start, end } = threat.location;

    switch (config.sanitizeMode) {
      case 'redact':
        result = result.slice(0, start) + '[redacted]' + result.slice(end);
        break;
      case 'remove':
        result = result.slice(0, start) + result.slice(end);
        break;
      case 'escape':
        const escaped = threat.originalText.replace(/[<>&"']/g, char => {
          const entities: Record<string, string> = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;'
          };
          return entities[char] || char;
        });
        result = result.slice(0, start) + escaped + result.slice(end);
        break;
    }
  }

  return result.trim();
}

/** Mettre à jour le temps moyen de traitement */
function updateAverageTime(time: number): void {
  stats.averageProcessingTime =
    (stats.averageProcessingTime * (stats.totalAnalyzed - 1) + time) /
    stats.totalAnalyzed;
}

/** Fonction simplifiée pour la compatibilité */
export function sanitizeUserText(input: string): string {
  const result = analyzeText(input);
  return result.sanitizedText;
}

/** Vérifier si un texte est sûr */
export function isTextSafe(input: string): boolean {
  const result = analyzeText(input);
  return result.isSafe;
}

/** Obtenir les menaces d'un texte */
export function getThreats(input: string): DetectedThreat[] {
  const result = analyzeText(input);
  return result.threats;
}

/** Obtenir les statistiques */
export function getStats(): ProtectionStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetStats(): void {
  stats.totalAnalyzed = 0;
  stats.threatsDetected = 0;
  stats.threatsBlocked = 0;

  for (const key of Object.keys(stats.threatsByType) as ThreatType[]) {
    stats.threatsByType[key] = 0;
  }

  for (const key of Object.keys(stats.threatsBySeverity) as SeverityLevel[]) {
    stats.threatsBySeverity[key] = 0;
  }

  stats.averageProcessingTime = 0;
  stats.lastDetection = null;
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

/** Ajouter à la whitelist */
export function addToWhitelist(text: string): void {
  if (!config.whitelist.includes(text)) {
    config.whitelist.push(text);
  }
}

/** Supprimer de la whitelist */
export function removeFromWhitelist(text: string): boolean {
  const index = config.whitelist.indexOf(text);
  if (index >= 0) {
    config.whitelist.splice(index, 1);
    return true;
  }
  return false;
}

/** Patterns par défaut exportés pour référence */
export const BLOCK_PATTERNS = [
  ...INSTRUCTION_OVERRIDE_PATTERNS,
  ...ROLE_MANIPULATION_PATTERNS,
  ...JAILBREAK_PATTERNS,
  ...SYSTEM_PROMPT_PATTERNS
];

export default {
  sanitizeUserText,
  analyzeText,
  isTextSafe,
  getThreats,
  configureProtection,
  getConfig,
  getStats,
  resetStats,
  addCustomPattern,
  removeCustomPattern,
  addToWhitelist,
  removeFromWhitelist,
  BLOCK_PATTERNS
};
