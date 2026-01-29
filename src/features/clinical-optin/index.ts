/**
 * Feature: Clinical Opt-In
 * Gestion du consentement clinique et des opt-ins spécifiques
 * 
 * Conformité:
 * - RGPD Article 7 (Consentement)
 * - Traçabilité des consentements
 * - Révocation à tout moment
 */

import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

export interface ClinicalOptIn {
  id: string;
  user_id: string;
  scope: OptInScope;
  granted_at: string;
  revoked_at?: string;
  ip_address?: string;
  user_agent?: string;
  version: string;
}

export type OptInScope = 
  | 'coach'           // Accès au coach IA
  | 'assessment'      // Questionnaires cliniques (PHQ-9, GAD-7)
  | 'data_sharing'    // Partage anonymisé pour recherche
  | 'crisis_alert'    // Alertes de crise
  | 'biometric'       // Données biométriques (HRV, etc.)
  | 'voice_analysis'  // Analyse vocale émotionnelle
  | 'face_scan';      // Scan facial émotionnel

export interface OptInStatus {
  scope: OptInScope;
  granted: boolean;
  grantedAt?: string;
  canRevoke: boolean;
}

export interface OptInRequirement {
  scope: OptInScope;
  title: string;
  description: string;
  required: boolean;
  legalBasis: string;
  dataRetention: string;
}

// ============================================================================
// REQUIREMENTS CONFIG
// ============================================================================

export const OPTIN_REQUIREMENTS: OptInRequirement[] = [
  {
    scope: 'coach',
    title: 'Coach IA Personnel',
    description: 'Permet au coach IA d\'analyser vos conversations pour fournir un accompagnement personnalisé.',
    required: false,
    legalBasis: 'Consentement (RGPD Art. 6.1.a)',
    dataRetention: '12 mois après dernière interaction',
  },
  {
    scope: 'assessment',
    title: 'Évaluations Cliniques',
    description: 'Autorise l\'utilisation de questionnaires validés (PHQ-9, GAD-7, WHO-5) pour le suivi.',
    required: false,
    legalBasis: 'Consentement explicite (RGPD Art. 9.2.a)',
    dataRetention: '24 mois ou sur demande',
  },
  {
    scope: 'crisis_alert',
    title: 'Alertes de Crise',
    description: 'Permet la détection et l\'alerte en cas de signaux de détresse psychologique.',
    required: false,
    legalBasis: 'Intérêt vital (RGPD Art. 6.1.d)',
    dataRetention: 'Durée de l\'abonnement',
  },
  {
    scope: 'biometric',
    title: 'Données Biométriques',
    description: 'Collecte et analyse des données de santé (fréquence cardiaque, HRV) depuis vos appareils.',
    required: false,
    legalBasis: 'Consentement explicite (RGPD Art. 9.2.a)',
    dataRetention: '6 mois glissants',
  },
  {
    scope: 'voice_analysis',
    title: 'Analyse Vocale',
    description: 'Analyse les caractéristiques vocales pour détecter l\'état émotionnel.',
    required: false,
    legalBasis: 'Consentement explicite (RGPD Art. 9.2.a)',
    dataRetention: 'Traitement immédiat, pas de stockage audio',
  },
  {
    scope: 'face_scan',
    title: 'Scan Facial',
    description: 'Analyse les expressions faciales pour évaluer l\'état émotionnel.',
    required: false,
    legalBasis: 'Consentement explicite (RGPD Art. 9.2.a)',
    dataRetention: 'Traitement immédiat, pas de stockage image',
  },
  {
    scope: 'data_sharing',
    title: 'Recherche Anonymisée',
    description: 'Partage anonyme de données agrégées pour la recherche en santé mentale.',
    required: false,
    legalBasis: 'Consentement (RGPD Art. 6.1.a)',
    dataRetention: 'Indéfini (données anonymisées)',
  },
];

// ============================================================================
// HOOKS
// ============================================================================

export function useClinicalOptIn(scope: OptInScope) {
  const { user } = useAuth();
  const [status, setStatus] = useState<OptInStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkOptIn = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    
    const { data } = await supabase
      .from('clinical_optins')
      .select('*')
      .eq('user_id', user.id)
      .eq('scope', scope)
      .is('revoked_at', null)
      .order('granted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setStatus({
      scope,
      granted: !!data,
      grantedAt: data?.granted_at,
      canRevoke: true,
    });
    
    setLoading(false);
  }, [user?.id, scope]);

  useEffect(() => {
    checkOptIn();
  }, [checkOptIn]);

  const grant = async (): Promise<boolean> => {
    if (!user?.id) return false;

    const { error } = await supabase.functions.invoke('optin-accept', {
      body: { scope, version: '1.0' }
    });

    if (!error) {
      setStatus({
        scope,
        granted: true,
        grantedAt: new Date().toISOString(),
        canRevoke: true,
      });
      return true;
    }
    
    return false;
  };

  const revoke = async (): Promise<boolean> => {
    if (!user?.id) return false;

    const { error } = await supabase.functions.invoke('optin-revoke', {
      body: { scope }
    });

    if (!error) {
      setStatus({
        scope,
        granted: false,
        canRevoke: true,
      });
      return true;
    }
    
    return false;
  };

  return { status, loading, grant, revoke, refresh: checkOptIn };
}

export function useAllClinicalOptIns() {
  const { user } = useAuth();
  const [optIns, setOptIns] = useState<OptInStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAll = async () => {
      setLoading(true);
      
      const { data } = await supabase
        .from('clinical_optins')
        .select('scope, granted_at, revoked_at')
        .eq('user_id', user.id)
        .is('revoked_at', null);

      const grantedScopes = new Set((data || []).map(d => d.scope));
      
      const statuses: OptInStatus[] = OPTIN_REQUIREMENTS.map(req => ({
        scope: req.scope,
        granted: grantedScopes.has(req.scope),
        grantedAt: data?.find(d => d.scope === req.scope)?.granted_at,
        canRevoke: true,
      }));

      setOptIns(statuses);
      setLoading(false);
    };

    fetchAll();
  }, [user?.id]);

  return { optIns, requirements: OPTIN_REQUIREMENTS, loading };
}

// ============================================================================
// SERVICE
// ============================================================================

export const clinicalOptInService = {
  getRequirement(scope: OptInScope): OptInRequirement | undefined {
    return OPTIN_REQUIREMENTS.find(r => r.scope === scope);
  },

  async checkOptIn(userId: string, scope: OptInScope): Promise<boolean> {
    const { data } = await supabase
      .from('clinical_optins')
      .select('id')
      .eq('user_id', userId)
      .eq('scope', scope)
      .is('revoked_at', null)
      .limit(1)
      .maybeSingle();

    return !!data;
  },

  async getActiveOptIns(userId: string): Promise<OptInScope[]> {
    const { data } = await supabase
      .from('clinical_optins')
      .select('scope')
      .eq('user_id', userId)
      .is('revoked_at', null);

    return (data || []).map(d => d.scope as OptInScope);
  },

  async getOptInHistory(userId: string): Promise<ClinicalOptIn[]> {
    const { data } = await supabase
      .from('clinical_optins')
      .select('*')
      .eq('user_id', userId)
      .order('granted_at', { ascending: false });

    return (data || []).map(d => ({
      id: d.id,
      user_id: d.user_id,
      scope: d.scope as OptInScope,
      granted_at: d.granted_at,
      revoked_at: d.revoked_at,
      ip_address: d.ip_address,
      user_agent: d.user_agent,
      version: d.version || '1.0',
    }));
  },

  getScopeLabel(scope: OptInScope): string {
    const labels: Record<OptInScope, string> = {
      coach: 'Coach IA',
      assessment: 'Évaluations',
      data_sharing: 'Recherche',
      crisis_alert: 'Alertes Crise',
      biometric: 'Biométrie',
      voice_analysis: 'Voix',
      face_scan: 'Visage',
    };
    return labels[scope];
  },
};
