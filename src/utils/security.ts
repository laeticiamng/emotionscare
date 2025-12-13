// @ts-nocheck
import { logger } from '@/lib/logger';

/** Tentative de connexion */
export interface LoginAttempt {
  count: number;
  lastAttempt: number;
  successfulAttempts: number;
  failedAttempts: number;
  ipAddresses: string[];
  userAgents: string[];
  lockReason?: string;
  lockedUntil?: number;
}

/** Niveau de risque */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/** Événement de sécurité */
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: Date;
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  riskLevel: RiskLevel;
  details?: Record<string, unknown>;
  blocked: boolean;
}

/** Type d'événement de sécurité */
export type SecurityEventType =
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'account_locked'
  | 'account_unlocked'
  | 'password_reset'
  | 'suspicious_activity'
  | 'rate_limit_exceeded'
  | 'unauthorized_access'
  | 'session_hijack_attempt'
  | 'brute_force_detected';

/** Configuration de sécurité */
export interface SecurityConfig {
  maxLoginAttempts: number;
  lockTimeMsBase: number;
  lockTimeMultiplier: number;
  maxLockTimeMs: number;
  suspiciousIpThreshold: number;
  sessionTimeout: number;
  enableGeoBlocking: boolean;
  allowedCountries?: string[];
  enableRateLimiting: boolean;
  rateLimitWindow: number;
  rateLimitMax: number;
}

/** Stats de sécurité */
export interface SecurityStats {
  totalAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  accountsLocked: number;
  suspiciousActivities: number;
  blockedRequests: number;
}

const attempts: Map<string, LoginAttempt> = new Map();
const securityEvents: SecurityEvent[] = [];
const ipAttempts: Map<string, number[]> = new Map();
const rateLimit: Map<string, number[]> = new Map();

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCK_TIME_MS = 5 * 60 * 1000; // 5 minutes

const DEFAULT_CONFIG: SecurityConfig = {
  maxLoginAttempts: 5,
  lockTimeMsBase: 5 * 60 * 1000,
  lockTimeMultiplier: 2,
  maxLockTimeMs: 24 * 60 * 60 * 1000,
  suspiciousIpThreshold: 10,
  sessionTimeout: 30 * 60 * 1000,
  enableGeoBlocking: false,
  enableRateLimiting: true,
  rateLimitWindow: 60 * 1000,
  rateLimitMax: 100
};

let config: SecurityConfig = { ...DEFAULT_CONFIG };

const stats: SecurityStats = {
  totalAttempts: 0,
  successfulLogins: 0,
  failedLogins: 0,
  accountsLocked: 0,
  suspiciousActivities: 0,
  blockedRequests: 0
};

/** Initialiser la configuration de sécurité */
export function initSecurity(userConfig?: Partial<SecurityConfig>): void {
  config = { ...DEFAULT_CONFIG, ...userConfig };
  logger.info('Security initialized', { config }, 'SECURITY');
}

/** Générer un ID d'événement */
function generateEventId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Calculer le temps de verrouillage progressif */
function calculateLockTime(attemptCount: number): number {
  const lockTime = config.lockTimeMsBase * Math.pow(config.lockTimeMultiplier, Math.floor(attemptCount / config.maxLoginAttempts) - 1);
  return Math.min(lockTime, config.maxLockTimeMs);
}

/** Évaluer le niveau de risque */
function assessRiskLevel(data: LoginAttempt, ipAddress?: string): RiskLevel {
  let riskScore = 0;

  // Nombreuses tentatives échouées
  if (data.failedAttempts > 10) riskScore += 3;
  else if (data.failedAttempts > 5) riskScore += 2;
  else if (data.failedAttempts > 2) riskScore += 1;

  // Multiples IPs
  if (data.ipAddresses.length > 3) riskScore += 2;

  // Multiples user agents
  if (data.userAgents.length > 3) riskScore += 1;

  // IP connue pour être suspecte
  if (ipAddress) {
    const ipAttemptCount = ipAttempts.get(ipAddress)?.length || 0;
    if (ipAttemptCount > config.suspiciousIpThreshold) riskScore += 3;
  }

  if (riskScore >= 6) return 'critical';
  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}

/** Logger un événement de sécurité */
function logSecurityEvent(
  type: SecurityEventType,
  options: {
    userId?: string;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    riskLevel?: RiskLevel;
    details?: Record<string, unknown>;
    blocked?: boolean;
  }
): SecurityEvent {
  const event: SecurityEvent = {
    id: generateEventId(),
    type,
    timestamp: new Date(),
    userId: options.userId,
    email: options.email,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    riskLevel: options.riskLevel || 'low',
    details: options.details,
    blocked: options.blocked || false
  };

  securityEvents.push(event);

  // Garder seulement les 1000 derniers événements
  if (securityEvents.length > 1000) {
    securityEvents.shift();
  }

  logger.info('Security event', { event }, 'SECURITY');
  return event;
}

/** Enregistrer une tentative de connexion */
export function recordLoginAttempt(
  email: string,
  success: boolean,
  options?: {
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
  }
): { allowed: boolean; remainingAttempts: number; lockTimeMs?: number } {
  const key = email.toLowerCase();
  const now = Date.now();
  stats.totalAttempts++;

  let data = attempts.get(key) || {
    count: 0,
    lastAttempt: now,
    successfulAttempts: 0,
    failedAttempts: 0,
    ipAddresses: [],
    userAgents: []
  };

  // Ajouter l'IP et le user agent si fournis
  if (options?.ipAddress && !data.ipAddresses.includes(options.ipAddress)) {
    data.ipAddresses.push(options.ipAddress);

    // Tracker les tentatives par IP
    const ipTimestamps = ipAttempts.get(options.ipAddress) || [];
    ipTimestamps.push(now);
    ipAttempts.set(options.ipAddress, ipTimestamps.filter(t => now - t < 3600000));
  }

  if (options?.userAgent && !data.userAgents.includes(options.userAgent)) {
    data.userAgents.push(options.userAgent);
  }

  if (success) {
    data.successfulAttempts++;
    data.count = 0;
    data.lockReason = undefined;
    data.lockedUntil = undefined;
    stats.successfulLogins++;

    logSecurityEvent('login_success', {
      email,
      userId: options?.userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      riskLevel: 'low'
    });

    attempts.set(key, data);
    return { allowed: true, remainingAttempts: config.maxLoginAttempts };
  }

  // Échec de connexion
  stats.failedLogins++;
  data.failedAttempts++;

  // Vérifier si le compte est actuellement verrouillé
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainingLockTime = data.lockedUntil - now;

    logSecurityEvent('login_failure', {
      email,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      riskLevel: assessRiskLevel(data, options?.ipAddress),
      details: { accountLocked: true, remainingLockTime },
      blocked: true
    });

    return {
      allowed: false,
      remainingAttempts: 0,
      lockTimeMs: remainingLockTime
    };
  }

  // Réinitialiser le compteur si le délai de verrouillage est passé
  if (data.lockedUntil && now >= data.lockedUntil) {
    data.count = 0;
    data.lockedUntil = undefined;
  }

  data.count++;
  data.lastAttempt = now;

  const riskLevel = assessRiskLevel(data, options?.ipAddress);

  // Verrouiller si trop de tentatives
  if (data.count >= config.maxLoginAttempts) {
    const lockTime = calculateLockTime(data.failedAttempts);
    data.lockedUntil = now + lockTime;
    data.lockReason = 'too_many_attempts';
    stats.accountsLocked++;

    logSecurityEvent('account_locked', {
      email,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      riskLevel,
      details: { lockTimeMs: lockTime, attemptCount: data.count }
    });

    attempts.set(key, data);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockTimeMs: lockTime
    };
  }

  logSecurityEvent('login_failure', {
    email,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    riskLevel,
    details: { attemptCount: data.count }
  });

  attempts.set(key, data);
  return {
    allowed: true,
    remainingAttempts: config.maxLoginAttempts - data.count
  };
}

/** Vérifier si un compte est verrouillé */
export function isLoginLocked(email: string): { locked: boolean; remainingMs?: number; reason?: string } {
  const key = email.toLowerCase();
  const data = attempts.get(key);

  if (!data) return { locked: false };

  const now = Date.now();

  if (data.lockedUntil && now < data.lockedUntil) {
    return {
      locked: true,
      remainingMs: data.lockedUntil - now,
      reason: data.lockReason
    };
  }

  if (data.count >= config.maxLoginAttempts) {
    const lockTime = calculateLockTime(data.failedAttempts);
    return {
      locked: true,
      remainingMs: lockTime,
      reason: 'too_many_attempts'
    };
  }

  return { locked: false };
}

/** Déverrouiller manuellement un compte */
export function unlockAccount(email: string, adminUserId?: string): boolean {
  const key = email.toLowerCase();
  const data = attempts.get(key);

  if (!data) return false;

  data.count = 0;
  data.lockedUntil = undefined;
  data.lockReason = undefined;

  logSecurityEvent('account_unlocked', {
    email,
    userId: adminUserId,
    details: { unlockedBy: adminUserId || 'system' }
  });

  attempts.set(key, data);
  return true;
}

/** Vérifier le rate limiting */
export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  if (!config.enableRateLimiting) return { allowed: true };

  const now = Date.now();
  const timestamps = rateLimit.get(identifier) || [];

  // Nettoyer les timestamps expirés
  const validTimestamps = timestamps.filter(t => now - t < config.rateLimitWindow);

  if (validTimestamps.length >= config.rateLimitMax) {
    const oldestTimestamp = Math.min(...validTimestamps);
    const retryAfter = oldestTimestamp + config.rateLimitWindow - now;

    stats.blockedRequests++;

    logSecurityEvent('rate_limit_exceeded', {
      details: { identifier, requestCount: validTimestamps.length },
      blocked: true,
      riskLevel: 'medium'
    });

    return { allowed: false, retryAfter };
  }

  validTimestamps.push(now);
  rateLimit.set(identifier, validTimestamps);
  return { allowed: true };
}

/** Signaler une activité suspecte */
export function reportSuspiciousActivity(
  description: string,
  options?: {
    userId?: string;
    email?: string;
    ipAddress?: string;
    details?: Record<string, unknown>;
  }
): SecurityEvent {
  stats.suspiciousActivities++;

  return logSecurityEvent('suspicious_activity', {
    userId: options?.userId,
    email: options?.email,
    ipAddress: options?.ipAddress,
    riskLevel: 'high',
    details: { description, ...options?.details }
  });
}

/** Valider un mot de passe (règles de complexité) */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Le mot de passe doit contenir au moins 8 caractères');

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Ajoutez des lettres minuscules');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Ajoutez des lettres majuscules');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Ajoutez des chiffres');

  if (/[^a-zA-Z0-9]/.test(password)) score += 2;
  else feedback.push('Ajoutez des caractères spéciaux');

  // Vérifier les patterns communs
  const commonPatterns = ['123456', 'password', 'qwerty', 'azerty', 'admin'];
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    feedback.push('Évitez les patterns communs');
  }

  return {
    valid: score >= 5 && password.length >= 8,
    score: Math.min(10, score),
    feedback
  };
}

/** Générer un token sécurisé */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Hasher une valeur (côté client, pour comparaison) */
export async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Obtenir les événements de sécurité récents */
export function getSecurityEvents(limit: number = 100): SecurityEvent[] {
  return securityEvents.slice(-limit);
}

/** Obtenir les stats de sécurité */
export function getSecurityStats(): SecurityStats {
  return { ...stats };
}

/** Obtenir les tentatives pour un email */
export function getLoginAttempts(email: string): LoginAttempt | null {
  return attempts.get(email.toLowerCase()) || null;
}

/** Nettoyer les données expirées */
export function cleanupExpiredData(): void {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const oneDayAgo = now - 86400000;

  // Nettoyer les tentatives expirées
  for (const [key, data] of attempts.entries()) {
    if (data.lastAttempt < oneDayAgo && !data.lockedUntil) {
      attempts.delete(key);
    }
  }

  // Nettoyer les IPs expirées
  for (const [ip, timestamps] of ipAttempts.entries()) {
    const valid = timestamps.filter(t => t > oneHourAgo);
    if (valid.length === 0) {
      ipAttempts.delete(ip);
    } else {
      ipAttempts.set(ip, valid);
    }
  }

  // Nettoyer le rate limit
  for (const [id, timestamps] of rateLimit.entries()) {
    const valid = timestamps.filter(t => now - t < config.rateLimitWindow);
    if (valid.length === 0) {
      rateLimit.delete(id);
    } else {
      rateLimit.set(id, valid);
    }
  }

  logger.debug('Security data cleanup completed', {}, 'SECURITY');
}

export default {
  init: initSecurity,
  recordLoginAttempt,
  isLoginLocked,
  unlockAccount,
  checkRateLimit,
  reportSuspiciousActivity,
  validatePasswordStrength,
  generateSecureToken,
  hashValue,
  getSecurityEvents,
  getSecurityStats,
  getLoginAttempts,
  cleanupExpiredData
};
