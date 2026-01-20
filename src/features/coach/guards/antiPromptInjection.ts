/**
 * Anti-Prompt Injection Guard
 *
 * Protects against prompt injection attacks by sanitizing user input
 * and detecting malicious patterns.
 */

import { logger } from '@/lib/logger';

// ============================================================================
// INJECTION PATTERNS
// ============================================================================

/**
 * Patterns that indicate prompt injection attempts
 */
const INJECTION_PATTERNS: RegExp[] = [
  // Direct instruction override
  /ignore\s+(all\s+)?previous\s+instructions?/i,
  /forget\s+(all\s+)?previous\s+(context|instructions?|rules?)/i,
  /dis(able|regard)\s+(all\s+)?(safety|rules?|filters?|guidelines?)/i,
  /override\s+(system|safety|rules?)/i,

  // Jailbreak attempts
  /\bjailbreak\b/i,
  /\bdeveloper\s*mode\b/i,
  /\bdan\s*mode\b/i,
  /\bunlocked\s*mode\b/i,

  // System prompt extraction
  /system\s*prompt/i,
  /reveal\s+(your\s+)?(system|hidden|secret)\s+(prompt|instructions?)/i,
  /what\s+are\s+your\s+(hidden\s+)?(instructions?|rules?)/i,
  /show\s+me\s+your\s+(system\s+)?prompt/i,

  // Role manipulation
  /you\s+are\s+(now\s+)?(a|an)\s+(?!coach|aide|assistant)/i,
  /pretend\s+(to\s+be|you'?re?)\s+/i,
  /act\s+as\s+(if\s+you'?re?|a)\s+/i,
  /roleplay\s+as\s+/i,

  // Encoding/obfuscation attempts
  /base64|rot13|encode|decode/i,
  /\[\s*INST\s*\]/i,
  /\[\s*\/INST\s*\]/i,
  /<\|.*?\|>/,

  // French equivalents
  /ignore[rz]?\s+(toutes?\s+)?(les\s+)?instructions?\s+(précédentes?|antérieures?)/i,
  /oublie[rz]?\s+(tout|toutes?\s+les\s+règles?)/i,
  /désactive[rz]?\s+(la\s+)?sécurité/i,
  /montre[rz]?\s+(moi\s+)?(ton|tes)\s+(prompt|instructions?)/i,
  /tu\s+es\s+(maintenant\s+)?(un|une)\s+(?!coach|aide|assistant)/i,
  /fais\s+comme\s+si\s+tu\s+étais/i,
];

/**
 * Patterns that should be completely blocked (high-risk)
 */
const HIGH_RISK_PATTERNS: RegExp[] = [
  /\bexecute\s*code\b/i,
  /\brun\s*(this\s*)?(command|script|code)\b/i,
  /\b(rm|del(ete)?)\s+\-rf?\b/i,
  /\bsudo\b/i,
  /<script[^>]*>/i,
  /javascript:/i,
];

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_INPUT_LENGTH = 2000;
const REDACTED_MARKER = '[redacted]';

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

/**
 * Sanitize user text by detecting and neutralizing injection attempts
 * @param input - Raw user input
 * @returns Sanitized text safe for LLM processing
 */
export function sanitizeUserText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Trim to max length
  let sanitized = input.slice(0, MAX_INPUT_LENGTH);

  // Check for high-risk patterns first
  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.test(sanitized)) {
      logger.warn('guard:high_risk_injection_blocked', {
        pattern: pattern.source,
        inputLength: input.length
      }, 'COACH');
      return REDACTED_MARKER;
    }
  }

  // Neutralize injection patterns
  let injectionDetected = false;
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      injectionDetected = true;
      sanitized = sanitized.replace(pattern, REDACTED_MARKER);
    }
  }

  if (injectionDetected) {
    logger.warn('guard:injection_attempt_neutralized', {
      originalLength: input.length,
      sanitizedLength: sanitized.length
    }, 'COACH');
  }

  // Remove potential encoding attempts
  sanitized = sanitized
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Control characters
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, ''); // Zero-width characters

  return sanitized.trim();
}

/**
 * Check if input contains high-risk injection that should be completely blocked
 * @param input - User input to check
 * @returns true if the input is high-risk and should be blocked
 */
export function isHighRiskInput(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }

  return false;
}

/**
 * Detect if input contains any injection attempt (logged but not blocked)
 * @param input - User input to check
 * @returns true if injection patterns were detected
 */
export function hasInjectionAttempt(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }

  return false;
}

/**
 * Get sanitization statistics for monitoring
 */
export function getSanitizationStats(input: string): {
  originalLength: number;
  containsHighRisk: boolean;
  injectionPatternCount: number;
} {
  const stats = {
    originalLength: input?.length || 0,
    containsHighRisk: false,
    injectionPatternCount: 0
  };

  if (!input || typeof input !== 'string') {
    return stats;
  }

  stats.containsHighRisk = HIGH_RISK_PATTERNS.some(p => p.test(input));
  stats.injectionPatternCount = INJECTION_PATTERNS.filter(p => p.test(input)).length;

  return stats;
}
