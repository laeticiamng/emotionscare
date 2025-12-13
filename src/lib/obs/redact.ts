// @ts-nocheck
/**
 * Redact - Système de redaction de données sensibles
 * Protection des données personnelles et secrets dans les logs
 */

/** Patterns sensibles par défaut */
const DEFAULT_SENSITIVE_KEYS = [
  'authorization',
  'token',
  'accesstoken',
  'refreshtoken',
  'bearer',
  'email',
  'user_id',
  'userid',
  'score_json',
  'password',
  'passwd',
  'secret',
  'cookie',
  'apikey',
  'api_key',
  'key',
  'private',
  'credential',
  'ssn',
  'credit_card',
  'creditcard',
  'cardnumber',
  'cvv',
  'pin',
  'phone',
  'phonenumber',
  'address',
  'birthdate',
  'dob',
  'ip_address',
  'ipaddress'
];

/** Configuration de redaction */
export interface RedactConfig {
  sensitiveKeys: string[];
  caseSensitive: boolean;
  redactedText: string;
  redactPartialMatches: boolean;
  maxDepth: number;
  patterns: RedactPattern[];
  enableStats: boolean;
}

/** Pattern de redaction personnalisé */
export interface RedactPattern {
  name: string;
  regex: RegExp;
  replacement: string;
}

/** Stats de redaction */
export interface RedactStats {
  totalRedactions: number;
  byKey: Record<string, number>;
  byPattern: Record<string, number>;
  lastRedaction: number | null;
}

/** Résultat de redaction */
export interface RedactResult<T> {
  value: T;
  redacted: boolean;
  redactionCount: number;
  redactedPaths: string[];
}

// Configuration par défaut
const DEFAULT_CONFIG: RedactConfig = {
  sensitiveKeys: DEFAULT_SENSITIVE_KEYS,
  caseSensitive: false,
  redactedText: '[REDACTED]',
  redactPartialMatches: true,
  maxDepth: 20,
  patterns: [],
  enableStats: true
};

// Patterns par défaut
const DEFAULT_PATTERNS: RedactPattern[] = [
  {
    name: 'bearer_token',
    regex: /(Bearer\s+)[A-Za-z0-9.\-_]+/g,
    replacement: '$1[REDACTED]'
  },
  {
    name: 'jwt_token',
    regex: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g,
    replacement: '[REDACTED_JWT]'
  },
  {
    name: 'email',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: '[REDACTED_EMAIL]'
  },
  {
    name: 'credit_card',
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    replacement: '[REDACTED_CARD]'
  },
  {
    name: 'phone_fr',
    regex: /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g,
    replacement: '[REDACTED_PHONE]'
  },
  {
    name: 'phone_intl',
    regex: /\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    replacement: '[REDACTED_PHONE]'
  },
  {
    name: 'ip_address',
    regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: '[REDACTED_IP]'
  },
  {
    name: 'uuid',
    regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
    replacement: '[REDACTED_UUID]'
  },
  {
    name: 'base64_long',
    regex: /(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g,
    replacement: (match: string) => match.length > 50 ? '[REDACTED_BASE64]' : match
  }
];

// État global
let config: RedactConfig = { ...DEFAULT_CONFIG, patterns: DEFAULT_PATTERNS };
let sensitiveRegex: RegExp;
const stats: RedactStats = {
  totalRedactions: 0,
  byKey: {},
  byPattern: {},
  lastRedaction: null
};

/** Reconstruire le regex des clés sensibles */
function buildSensitiveRegex(): void {
  const pattern = config.sensitiveKeys.join('|');
  const flags = config.caseSensitive ? '' : 'i';
  sensitiveRegex = new RegExp(`^(${pattern})$`, flags);
}

// Initialiser le regex
buildSensitiveRegex();

/** Configurer le système de redaction */
export function configure(userConfig: Partial<RedactConfig>): void {
  config = { ...config, ...userConfig };
  if (userConfig.sensitiveKeys) {
    buildSensitiveRegex();
  }
}

/** Ajouter des clés sensibles */
export function addSensitiveKeys(keys: string[]): void {
  config.sensitiveKeys = [...new Set([...config.sensitiveKeys, ...keys])];
  buildSensitiveRegex();
}

/** Supprimer des clés sensibles */
export function removeSensitiveKeys(keys: string[]): void {
  const keysSet = new Set(keys.map(k => k.toLowerCase()));
  config.sensitiveKeys = config.sensitiveKeys.filter(
    k => !keysSet.has(k.toLowerCase())
  );
  buildSensitiveRegex();
}

/** Ajouter un pattern personnalisé */
export function addPattern(pattern: RedactPattern): void {
  config.patterns.push(pattern);
}

/** Vérifier si une clé est sensible */
export function isSensitiveKey(key: string): boolean {
  if (config.redactPartialMatches) {
    const lowerKey = key.toLowerCase();
    return config.sensitiveKeys.some(sensitive =>
      lowerKey.includes(sensitive.toLowerCase())
    );
  }
  return sensitiveRegex.test(key);
}

/** Appliquer les patterns de redaction à une string */
function applyPatterns(value: string): { result: string; patternsApplied: string[] } {
  let result = value;
  const patternsApplied: string[] = [];

  for (const pattern of config.patterns) {
    const before = result;
    if (typeof pattern.replacement === 'function') {
      result = result.replace(pattern.regex, pattern.replacement);
    } else {
      result = result.replace(pattern.regex, pattern.replacement);
    }
    if (result !== before) {
      patternsApplied.push(pattern.name);
      if (config.enableStats) {
        stats.byPattern[pattern.name] = (stats.byPattern[pattern.name] || 0) + 1;
      }
    }
  }

  return { result, patternsApplied };
}

/** Redacter une valeur (fonction principale) */
export function redact<T>(value: T, currentPath: string = '', depth: number = 0): T {
  // Protection contre la récursion infinie
  if (depth > config.maxDepth) {
    return config.redactedText as unknown as T;
  }

  // Traitement des tableaux
  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      redact(entry, `${currentPath}[${index}]`, depth + 1)
    ) as unknown as T;
  }

  // Traitement des objets
  if (value && typeof value === 'object') {
    // Gestion des objets spéciaux (Date, etc.)
    if (value instanceof Date) {
      return value;
    }

    const out: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
      const path = currentPath ? `${currentPath}.${key}` : key;

      if (isSensitiveKey(key)) {
        out[key] = config.redactedText;

        if (config.enableStats) {
          stats.totalRedactions++;
          stats.byKey[key] = (stats.byKey[key] || 0) + 1;
          stats.lastRedaction = Date.now();
        }
      } else {
        out[key] = redact(entry, path, depth + 1);
      }
    }

    return out as unknown as T;
  }

  // Traitement des strings avec patterns
  if (typeof value === 'string') {
    const { result } = applyPatterns(value);
    return result as unknown as T;
  }

  return value;
}

/** Redacter avec résultat détaillé */
export function redactWithDetails<T>(value: T): RedactResult<T> {
  const redactedPaths: string[] = [];
  let redactionCount = 0;

  function innerRedact<U>(val: U, path: string = '', depth: number = 0): U {
    if (depth > config.maxDepth) {
      return config.redactedText as unknown as U;
    }

    if (Array.isArray(val)) {
      return val.map((entry, index) =>
        innerRedact(entry, `${path}[${index}]`, depth + 1)
      ) as unknown as U;
    }

    if (val && typeof val === 'object' && !(val instanceof Date)) {
      const out: Record<string, unknown> = {};

      for (const [key, entry] of Object.entries(val as Record<string, unknown>)) {
        const currentPath = path ? `${path}.${key}` : key;

        if (isSensitiveKey(key)) {
          out[key] = config.redactedText;
          redactionCount++;
          redactedPaths.push(currentPath);
        } else {
          out[key] = innerRedact(entry, currentPath, depth + 1);
        }
      }

      return out as unknown as U;
    }

    if (typeof val === 'string') {
      const { result, patternsApplied } = applyPatterns(val);
      if (patternsApplied.length > 0) {
        redactionCount += patternsApplied.length;
        redactedPaths.push(path || 'string');
      }
      return result as unknown as U;
    }

    return val;
  }

  const result = innerRedact(value);

  return {
    value: result,
    redacted: redactionCount > 0,
    redactionCount,
    redactedPaths
  };
}

/** Redacter une string uniquement avec les patterns */
export function redactString(value: string): string {
  if (typeof value !== 'string') return value;
  const { result } = applyPatterns(value);
  return result;
}

/** Redacter les clés d'un objet (masque aussi les valeurs des clés sensibles) */
export function redactDeep<T extends object>(obj: T): T {
  return redact(obj);
}

/** Créer une copie sécurisée pour le logging */
export function safeForLogging<T>(value: T): T {
  return redact(value);
}

/** Masquer partiellement une valeur (pour l'affichage) */
export function mask(value: string, options?: {
  showFirst?: number;
  showLast?: number;
  maskChar?: string;
}): string {
  const { showFirst = 0, showLast = 0, maskChar = '*' } = options || {};

  if (!value || value.length <= showFirst + showLast) {
    return maskChar.repeat(value?.length || 0);
  }

  const first = value.slice(0, showFirst);
  const last = value.slice(-showLast || value.length);
  const maskLength = value.length - showFirst - showLast;

  return `${first}${maskChar.repeat(maskLength)}${last}`;
}

/** Masquer un email */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return mask(email, { showFirst: 1, showLast: 1 });

  const maskedLocal = local.length > 2
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : '*'.repeat(local.length);

  const domainParts = domain.split('.');
  const maskedDomain = domainParts.length > 1
    ? `${domainParts[0][0]}***${domainParts[0].slice(-1)}.${domainParts.slice(1).join('.')}`
    : mask(domain, { showFirst: 1, showLast: 1 });

  return `${maskedLocal}@${maskedDomain}`;
}

/** Masquer un numéro de téléphone */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '*'.repeat(phone.length);

  return mask(digits, { showLast: 4 });
}

/** Masquer un numéro de carte */
export function maskCard(card: string): string {
  const digits = card.replace(/\D/g, '');
  if (digits.length < 4) return '*'.repeat(card.length);

  return mask(digits, { showLast: 4, maskChar: 'X' });
}

/** Obtenir les stats de redaction */
export function getStats(): RedactStats {
  return { ...stats };
}

/** Réinitialiser les stats */
export function resetStats(): void {
  stats.totalRedactions = 0;
  stats.byKey = {};
  stats.byPattern = {};
  stats.lastRedaction = null;
}

/** Obtenir la configuration actuelle */
export function getConfig(): RedactConfig {
  return { ...config };
}

/** Obtenir les clés sensibles */
export function getSensitiveKeys(): string[] {
  return [...config.sensitiveKeys];
}

/** Vérifier si une valeur contient des données sensibles */
export function containsSensitiveData<T>(value: T): boolean {
  const result = redactWithDetails(value);
  return result.redacted;
}

/** Obtenir les chemins des données sensibles */
export function findSensitivePaths<T>(value: T): string[] {
  const result = redactWithDetails(value);
  return result.redactedPaths;
}

/** Créer un redacteur avec configuration personnalisée */
export function createRedactor(customConfig: Partial<RedactConfig>): {
  redact: typeof redact;
  redactString: typeof redactString;
  mask: typeof mask;
} {
  const mergedConfig = { ...config, ...customConfig };
  const customSensitiveKeys = customConfig.sensitiveKeys || config.sensitiveKeys;
  const customPatterns = customConfig.patterns || config.patterns;

  const customSensitiveRegex = new RegExp(
    `^(${customSensitiveKeys.join('|')})$`,
    mergedConfig.caseSensitive ? '' : 'i'
  );

  function customIsSensitive(key: string): boolean {
    if (mergedConfig.redactPartialMatches) {
      const lowerKey = key.toLowerCase();
      return customSensitiveKeys.some(sensitive =>
        lowerKey.includes(sensitive.toLowerCase())
      );
    }
    return customSensitiveRegex.test(key);
  }

  function customRedact<T>(value: T, depth: number = 0): T {
    if (depth > mergedConfig.maxDepth) {
      return mergedConfig.redactedText as unknown as T;
    }

    if (Array.isArray(value)) {
      return value.map(entry => customRedact(entry, depth + 1)) as unknown as T;
    }

    if (value && typeof value === 'object' && !(value instanceof Date)) {
      const out: Record<string, unknown> = {};
      for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
        out[key] = customIsSensitive(key)
          ? mergedConfig.redactedText
          : customRedact(entry, depth + 1);
      }
      return out as unknown as T;
    }

    if (typeof value === 'string') {
      let result = value;
      for (const pattern of customPatterns) {
        result = result.replace(pattern.regex, pattern.replacement as string);
      }
      return result as unknown as T;
    }

    return value;
  }

  return {
    redact: customRedact,
    redactString: (value: string) => {
      let result = value;
      for (const pattern of customPatterns) {
        result = result.replace(pattern.regex, pattern.replacement as string);
      }
      return result;
    },
    mask
  };
}

export default {
  redact,
  redactWithDetails,
  redactString,
  redactDeep,
  safeForLogging,
  mask,
  maskEmail,
  maskPhone,
  maskCard,
  configure,
  addSensitiveKeys,
  removeSensitiveKeys,
  addPattern,
  isSensitiveKey,
  containsSensitiveData,
  findSensitivePaths,
  getStats,
  resetStats,
  getConfig,
  getSensitiveKeys,
  createRedactor
};
