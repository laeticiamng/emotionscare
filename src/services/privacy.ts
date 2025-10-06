// @ts-nocheck
import { sha256Hex } from '@/lib/hash';

/**
 * Helpers pour la gestion de la confidentialité et du RGPD
 */

export interface ConsentOptions {
  audio?: boolean;
  video?: boolean;
  emotionAnalysis?: boolean;
  dataStorage?: boolean;
}

export async function pseudonymizeUserId(userId: string): Promise<string> {
  const hash = await sha256Hex(userId);
  return hash.substring(0, 16);
}

export function shouldAggregateData(userCount: number, threshold: number = 5): boolean {
  return userCount >= threshold;
}

export function sanitizeEmotionData(emotionData: any) {
  // Ne garder que les données agrégées et anonymisées
  return {
    valence: Math.round(emotionData.valence * 100) / 100,
    arousal: Math.round(emotionData.arousal * 100) / 100,
    dominantEmotion: emotionData.dominantEmotion,
    timestamp: new Date().toISOString(),
    // Pas d'identifiants personnels
  };
}

export function getVerbalBadge(valence: number, arousal: number): string {
  if (valence > 0.6 && arousal < 0.4) {
    return "État serein et apaisé";
  } else if (valence > 0.6 && arousal > 0.6) {
    return "Énergie positive et dynamique";
  } else if (valence < 0.4 && arousal < 0.4) {
    return "Calme intérieur recherché";
  } else if (valence < 0.4 && arousal > 0.6) {
    return "Moment de tension détecté";
  } else {
    return "Équilibre émotionnel stable";
  }
}

export function checkConsent(requiredConsents: (keyof ConsentOptions)[], userConsents: ConsentOptions): boolean {
  return requiredConsents.every(consent => userConsents[consent] === true);
}

export const CONSENT_VERSION = "1.0.0";

export async function generateConsentRecord(userId: string, consents: ConsentOptions) {
  return {
    userId: await pseudonymizeUserId(userId),
    consents,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString()
  };
}
