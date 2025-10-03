/**
 * Gestion des consentements privacy avec horodatage et source
 */

import { supabase } from '@/integrations/supabase/client';

export type ConsentType = 'cam' | 'mic' | 'hr' | 'notify' | 'data_processing';
export type ConsentSource = 'onboarding' | 'settings';

export interface PrivacyConsent {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  granted: boolean;
  source: ConsentSource;
  granted_at: string;
  revoked_at?: string;
  metadata: Record<string, any>;
  created_at: string;
}

class PrivacyConsentManager {
  /**
   * Enregistrer un consentement avec horodatage
   */
  async recordConsent(
    consentType: ConsentType,
    granted: boolean,
    source: ConsentSource = 'settings',
    metadata: Record<string, any> = {}
  ): Promise<{ data: any; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Révoquer le consentement précédent s'il existe
    if (!granted) {
      await supabase
        .from('privacy_consents')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', user.user.id)
        .eq('consent_type', consentType)
        .is('revoked_at', null);
    }

    // Créer le nouveau consentement
    return await supabase
      .from('privacy_consents')
      .insert({
        user_id: user.user.id,
        consent_type: consentType,
        granted,
        source,
        metadata,
        granted_at: new Date().toISOString()
      });
  }

  /**
   * Vérifier si un consentement est accordé
   */
  async hasConsent(consentType: ConsentType): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data, error } = await supabase
      .from('privacy_consents')
      .select('granted')
      .eq('user_id', user.user.id)
      .eq('consent_type', consentType)
      .is('revoked_at', null)
      .order('granted_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return false;
    return data?.granted || false;
  }

  /**
   * Obtenir tous les consentements actifs d'un utilisateur
   */
  async getAllConsents(): Promise<Record<ConsentType, boolean>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return {
        cam: false,
        mic: false,
        hr: false,
        notify: false,
        data_processing: false
      };
    }

    const { data } = await supabase
      .from('privacy_consents')
      .select('consent_type, granted')
      .eq('user_id', user.user.id)
      .is('revoked_at', null);

    const consents: Record<ConsentType, boolean> = {
      cam: false,
      mic: false,
      hr: false,
      notify: false,
      data_processing: false
    };

    // Obtenir le dernier consentement pour chaque type
    const consentMap = new Map<ConsentType, boolean>();
    data?.forEach(consent => {
      consentMap.set(consent.consent_type as ConsentType, consent.granted);
    });

    consentMap.forEach((granted, type) => {
      consents[type] = granted;
    });

    return consents;
  }

  /**
   * Bloquer l'accès aux APIs matérielles si consentement refusé
   */
  async checkConsentBeforeAPICall(consentType: ConsentType): Promise<boolean> {
    const hasConsent = await this.hasConsent(consentType);
    if (!hasConsent) {
      console.warn(`API call blocked: no consent for ${consentType}`);
      return false;
    }
    return true;
  }

  /**
   * Obtenir l'historique des consentements (pour RGPD)
   */
  async getConsentHistory(): Promise<PrivacyConsent[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data } = await supabase
      .from('privacy_consents')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    return data || [];
  }
}

export const privacyConsentManager = new PrivacyConsentManager();

/**
 * Hook pour vérifier les consentements avant l'accès matériel
 */
export const usePrivacyGuard = () => {
  const checkCamera = async (): Promise<boolean> => {
    return await privacyConsentManager.checkConsentBeforeAPICall('cam');
  };

  const checkMicrophone = async (): Promise<boolean> => {
    return await privacyConsentManager.checkConsentBeforeAPICall('mic');
  };

  const checkHeartRate = async (): Promise<boolean> => {
    return await privacyConsentManager.checkConsentBeforeAPICall('hr');
  };

  const checkNotifications = async (): Promise<boolean> => {
    return await privacyConsentManager.checkConsentBeforeAPICall('notify');
  };

  return {
    checkCamera,
    checkMicrophone,
    checkHeartRate,
    checkNotifications
  };
};