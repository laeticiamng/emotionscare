// @ts-nocheck
import { sha256Hex } from '@/lib/hash';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Helpers pour la gestion de la confidentialité et du RGPD
 */

export interface ConsentOptions {
  audio?: boolean;
  video?: boolean;
  emotionAnalysis?: boolean;
  dataStorage?: boolean;
  analytics?: boolean;
  marketing?: boolean;
  thirdPartySharing?: boolean;
  personalizedContent?: boolean;
}

/** Historique de consentement */
export interface ConsentHistory {
  version: string;
  consents: ConsentOptions;
  timestamp: Date;
  ipHash?: string;
}

/** Demande d'accès aux données */
export interface DataAccessRequest {
  id: string;
  type: 'export' | 'delete' | 'rectify';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
}

/** Données personnelles exportées */
export interface PersonalDataExport {
  profile: Record<string, unknown>;
  emotions: unknown[];
  journal: unknown[];
  sessions: unknown[];
  preferences: Record<string, unknown>;
  consents: ConsentHistory[];
}

export const CONSENT_VERSION = "2.0.0";

/** Pseudonymise un ID utilisateur */
export async function pseudonymizeUserId(userId: string): Promise<string> {
  const hash = await sha256Hex(userId);
  return hash.substring(0, 16);
}

/** Vérifie si les données doivent être agrégées (k-anonymity) */
export function shouldAggregateData(userCount: number, threshold: number = 5): boolean {
  return userCount >= threshold;
}

/** Anonymise les données émotionnelles */
export function sanitizeEmotionData(emotionData: any) {
  return {
    valence: Math.round(emotionData.valence * 100) / 100,
    arousal: Math.round(emotionData.arousal * 100) / 100,
    dominantEmotion: emotionData.dominantEmotion,
    timestamp: new Date().toISOString(),
  };
}

/** Retourne un badge verbal basé sur valence/arousal */
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

/** Vérifie si tous les consentements requis sont donnés */
export function checkConsent(requiredConsents: (keyof ConsentOptions)[], userConsents: ConsentOptions): boolean {
  return requiredConsents.every(consent => userConsents[consent] === true);
}

/** Génère un enregistrement de consentement */
export async function generateConsentRecord(userId: string, consents: ConsentOptions) {
  return {
    userId: await pseudonymizeUserId(userId),
    consents,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString()
  };
}

/** Sauvegarde les consentements utilisateur */
export async function saveConsents(consents: ConsentOptions): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabase.from('user_consents').upsert({
      user_id: userData.user.id,
      consents,
      version: CONSENT_VERSION,
      updated_at: new Date().toISOString()
    });

    // Enregistrer dans l'historique
    await supabase.from('consent_history').insert({
      user_id: userData.user.id,
      consents,
      version: CONSENT_VERSION
    });

    logger.info('Consents saved', { version: CONSENT_VERSION }, 'PRIVACY');
  } catch (error) {
    logger.error('Error saving consents', error as Error, 'PRIVACY');
    throw error;
  }
}

/** Récupère les consentements utilisateur */
export async function getConsents(): Promise<ConsentOptions> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return getDefaultConsents();

    const { data, error } = await supabase
      .from('user_consents')
      .select('consents')
      .eq('user_id', userData.user.id)
      .single();

    if (error || !data) return getDefaultConsents();
    return data.consents;
  } catch (error) {
    return getDefaultConsents();
  }
}

/** Récupère l'historique des consentements */
export async function getConsentHistory(): Promise<ConsentHistory[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data, error } = await supabase
      .from('consent_history')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(h => ({
      version: h.version,
      consents: h.consents,
      timestamp: new Date(h.created_at),
      ipHash: h.ip_hash
    }));
  } catch (error) {
    return [];
  }
}

/** Demande l'export des données personnelles (RGPD) */
export async function requestDataExport(): Promise<DataAccessRequest | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return null;

    const { data, error } = await supabase
      .from('data_access_requests')
      .insert({
        user_id: userData.user.id,
        type: 'export',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Déclencher le job d'export
    await supabase.functions.invoke('process-data-export', {
      body: { requestId: data.id }
    });

    logger.info('Data export requested', { requestId: data.id }, 'PRIVACY');

    return {
      id: data.id,
      type: 'export',
      status: 'pending',
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    logger.error('Error requesting data export', error as Error, 'PRIVACY');
    return null;
  }
}

/** Demande la suppression des données (RGPD) */
export async function requestDataDeletion(): Promise<DataAccessRequest | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return null;

    const { data, error } = await supabase
      .from('data_access_requests')
      .insert({
        user_id: userData.user.id,
        type: 'delete',
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Data deletion requested', { requestId: data.id }, 'PRIVACY');

    return {
      id: data.id,
      type: 'delete',
      status: 'pending',
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    logger.error('Error requesting data deletion', error as Error, 'PRIVACY');
    return null;
  }
}

/** Récupère les demandes d'accès aux données */
export async function getDataAccessRequests(): Promise<DataAccessRequest[]> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return [];

    const { data, error } = await supabase
      .from('data_access_requests')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(r => ({
      id: r.id,
      type: r.type,
      status: r.status,
      createdAt: new Date(r.created_at),
      completedAt: r.completed_at ? new Date(r.completed_at) : undefined,
      downloadUrl: r.download_url
    }));
  } catch (error) {
    return [];
  }
}

/** Anonymise un texte (supprime emails, téléphones, etc.) */
export function anonymizeText(text: string): string {
  // Email
  let anonymized = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  // Téléphone
  anonymized = anonymized.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[TELEPHONE]');
  // Numéro de carte
  anonymized = anonymized.replace(/\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g, '[CARTE]');
  // Adresse IP
  anonymized = anonymized.replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[IP]');

  return anonymized;
}

/** Vérifie si les données peuvent être traitées */
export async function canProcessData(dataType: keyof ConsentOptions): Promise<boolean> {
  const consents = await getConsents();
  return consents[dataType] === true;
}

/** Récupère la politique de confidentialité */
export async function getPrivacyPolicy(): Promise<{ version: string; content: string; updatedAt: Date } | null> {
  try {
    const { data, error } = await supabase
      .from('privacy_policies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      version: data.version,
      content: data.content,
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    return null;
  }
}

/** Accepte la politique de confidentialité */
export async function acceptPrivacyPolicy(version: string): Promise<void> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) return;

    await supabase.from('privacy_acceptances').insert({
      user_id: userData.user.id,
      policy_version: version
    });

    logger.info('Privacy policy accepted', { version }, 'PRIVACY');
  } catch (error) {
    logger.error('Error accepting privacy policy', error as Error, 'PRIVACY');
  }
}

function getDefaultConsents(): ConsentOptions {
  return {
    audio: false,
    video: false,
    emotionAnalysis: false,
    dataStorage: false,
    analytics: false,
    marketing: false,
    thirdPartySharing: false,
    personalizedContent: false
  };
}
