// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Instrument } from '../../../packages/contracts/assess';

/**
 * Gestion des feature flags pour les assessments
 */

interface FeatureFlag {
  flag_name: string;
  is_enabled: boolean;
  rollout_percentage: number;
}

export async function isAssessmentEnabled(instrument: Instrument): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('clinical_feature_flags')
      .select('is_enabled, rollout_percentage')
      .eq('flag_name', `assess_${instrument.toLowerCase()}`)
      .maybeSingle();
      
    if (error) {
      logger.warn('Error checking feature flag', error as Error, 'API');
      return false; // Par défaut désactivé en cas d'erreur
    }
    
    if (!data) {
      return false; // Pas de flag = désactivé
    }
    
    return data.is_enabled;
  } catch (error) {
    logger.warn('Feature flag check failed', error as Error, 'API');
    return false;
  }
}

export async function getEnabledAssessments(instruments: Instrument[]): Promise<Instrument[]> {
  try {
    const flagNames = instruments.map(i => `assess_${i.toLowerCase()}`);
    
    const { data, error } = await supabase
      .from('clinical_feature_flags')
      .select('flag_name, is_enabled')
      .in('flag_name', flagNames)
      .eq('is_enabled', true);
      
    if (error) {
      logger.warn('Error fetching enabled assessments', error as Error, 'API');
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    return data
      .map(flag => flag.flag_name.replace('assess_', '').toUpperCase() as Instrument)
      .filter(instrument => instruments.includes(instrument));
      
  } catch (error) {
    logger.warn('Failed to get enabled assessments', error as Error, 'API');
    return [];
  }
}

// Fréquences recommandées par instrument
export const instrumentFrequencies: Record<Instrument, 'instant' | 'session' | 'daily' | 'weekly' | 'monthly'> = {
  // Instantanés
  SAM: 'instant',
  SUDS: 'instant',
  
  // Sessionnels (pré/post)
  STAI6: 'session',
  POMS_SF: 'session',
  SSQ: 'session',
  
  // Hebdomadaires
  WHO5: 'weekly',
  PSS10: 'weekly',
  ISI: 'weekly',
  GAS: 'weekly',
  
  // Mensuels
  PANAS10: 'monthly',
  UCLA3: 'monthly',
  MSPSS: 'monthly',
  AAQ2: 'monthly',
  GRITS: 'monthly',
  BRS: 'monthly',
  WEMWBS: 'monthly',
  SWEMWBS: 'monthly',
  UWES9: 'monthly',
  CBI: 'monthly',
  CVSQ: 'monthly'
};

export function shouldShowAssessment(
  instrument: Instrument, 
  lastSubmittedAt?: string,
  context?: 'pre' | 'post' | 'weekly' | 'monthly' | 'adhoc'
): boolean {
  if (context === 'adhoc') return true;
  
  const frequency = instrumentFrequencies[instrument];
  
  // Toujours afficher les instantanés et sessionnels
  if (frequency === 'instant' || frequency === 'session') {
    return true;
  }
  
  if (!lastSubmittedAt) {
    return true; // Jamais fait = toujours afficher
  }
  
  const lastSubmitted = new Date(lastSubmittedAt);
  const now = new Date();
  const daysSince = (now.getTime() - lastSubmitted.getTime()) / (1000 * 60 * 60 * 24);
  
  switch (frequency) {
    case 'daily':
      return daysSince >= 1;
    case 'weekly':
      return daysSince >= 7;
    case 'monthly':
      return daysSince >= 30;
    default:
      return true;
  }
}