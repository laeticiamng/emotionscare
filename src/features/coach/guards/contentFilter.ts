/**
 * Content Filter Guard
 *
 * Filters sensitive content for safety and moderates LLM output.
 * Handles crisis detection and output sanitization.
 */

import { logger } from '@/lib/logger';

// ============================================================================
// SENSITIVE CONTENT PATTERNS
// ============================================================================

/**
 * Patterns indicating potential crisis or sensitive topics
 * These trigger immediate blocking and crisis resources
 */
const CRISIS_PATTERNS: RegExp[] = [
  // French patterns
  /\b(suicide|suicidaire|me suicider)\b/i,
  /\b(me tuer|me faire du mal|en finir)\b/i,
  /\b(plus envie de vivre|envie de mourir)\b/i,
  /\b(automutilation|me couper|me blesser)\b/i,
  /\b(overdose|surdose)\b/i,
  /\b(veux? mourir|mourir|crever)\b/i,

  // English patterns
  /\b(kill myself|end my life|want to die)\b/i,
  /\b(self[- ]?harm|cutting|hurt myself)\b/i,
  /\b(suicidal|suicide)\b/i,
];

/**
 * Topics the coach should not provide advice on
 */
const RESTRICTED_TOPICS: RegExp[] = [
  // Medical advice
  /\b(dose|dosage|médicament|medication|prescri(re|ption))\b/i,
  /\b(diagnostic|diagnostiquer|diagnose)\b/i,

  // Legal issues
  /\b(avocat|lawyer|procès|lawsuit)\b/i,

  // Financial advice
  /\b(investir|investment|bourse|stock market)\b/i,
];

// ============================================================================
// PUBLIC FUNCTIONS
// ============================================================================

/**
 * Check if text contains crisis-level content that must be blocked
 * Returns true if the content should trigger crisis intervention
 */
export function mustBlock(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(text) || pattern.test(normalizedText)) {
      logger.warn('guard:crisis_content_detected', {
        pattern: pattern.source,
        textLength: text.length
      }, 'COACH');
      return true;
    }
  }

  return false;
}

/**
 * Check if text contains restricted topics the coach shouldn't advise on
 */
export function isRestrictedTopic(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  for (const pattern of RESTRICTED_TOPICS) {
    if (pattern.test(text)) {
      logger.info('guard:restricted_topic_detected', {
        pattern: pattern.source
      }, 'COACH');
      return true;
    }
  }

  return false;
}

/**
 * Get appropriate crisis response message
 */
export function getCrisisResponse(): string {
  return `Je vois que tu traverses un moment vraiment difficile. Ta sécurité est importante.

Appelle maintenant le 3114 (numéro national de prévention du suicide) ou rends-toi aux urgences les plus proches.

Tu n'es pas seul(e).`;
}

/**
 * Get response for restricted topics
 */
export function getRestrictedTopicResponse(): string {
  return `Je ne suis pas en mesure de te conseiller sur ce sujet.
Je te recommande de consulter un professionnel qualifié pour cette question.`;
}

/**
 * Moderate LLM output to ensure it's safe and appropriate
 * - Removes any numerical/clinical data
 * - Truncates to safe length
 * - Sanitizes potentially harmful content
 */
export function moderateOutput(output: string): string {
  if (!output || typeof output !== 'string') {
    logger.warn('guard:empty_output', undefined, 'COACH');
    return 'Respire doucement. Je suis là pour toi.';
  }

  let result = output.trim();

  // Remove any numerical values that could be misinterpreted as clinical data
  // (heart rates, blood pressure, dosages, etc.)
  if (/\d+\s*(mg|ml|bpm|kg|%|mmHg)/i.test(result)) {
    logger.info('guard:clinical_data_removed', undefined, 'COACH');
    return 'Respire doucement. Observe, laisse passer.';
  }

  // Remove sequences of numbers that look like measurements
  if (/\d{2,}/.test(result)) {
    // Allow years and simple counts but block measurement-like patterns
    const measurementPattern = /\d+[.,]\d+|\d+\s*[xX×]\s*\d+/;
    if (measurementPattern.test(result)) {
      logger.info('guard:measurement_data_removed', undefined, 'COACH');
      return 'Respire doucement. Observe, laisse passer.';
    }
  }

  // Ensure output doesn't contain crisis content
  if (mustBlock(result)) {
    logger.warn('guard:blocked_output', undefined, 'COACH');
    return getCrisisResponse();
  }

  // Truncate to safe length (120 chars for UI display)
  const maxLength = 120;
  if (result.length > maxLength) {
    // Try to cut at sentence boundary
    const truncated = result.slice(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastExclaim = truncated.lastIndexOf('!');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastSentenceEnd = Math.max(lastPeriod, lastExclaim, lastQuestion);

    if (lastSentenceEnd > maxLength * 0.6) {
      result = truncated.slice(0, lastSentenceEnd + 1);
    } else {
      result = truncated + '...';
    }
  }

  return result;
}

/**
 * Validate that content is safe for display
 * Returns sanitized content or null if completely unsafe
 */
export function validateContent(content: string): string | null {
  if (!content || typeof content !== 'string') {
    return null;
  }

  if (mustBlock(content)) {
    return null;
  }

  return moderateOutput(content);
}
