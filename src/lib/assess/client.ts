import { supabase } from '@/integrations/supabase/client';
import type { 
  StartInput, 
  StartOutput, 
  SubmitInput, 
  SubmitOutput, 
  AggregateInput, 
  AggregateOutput 
} from '../../../packages/contracts/assess';

/**
 * Client pour les assessments cliniques
 * Intègre avec les Edge Functions Supabase
 */

export async function startAssess(body: StartInput): Promise<StartOutput> {
  const { data, error } = await supabase.functions.invoke<StartOutput>('assess-start', { 
    body 
  });
  
  if (error) {
    console.error('Assessment start error:', error);
    throw new Error(`assess_start_failed: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('assess_start_no_data');
  }
  
  return data;
}

export async function submitAssess(body: SubmitInput): Promise<SubmitOutput> {
  const { data, error } = await supabase.functions.invoke<SubmitOutput>('assess-submit', { 
    body 
  });
  
  if (error) {
    // Gestion spécifique des erreurs
    if (error.message?.includes('409') || error.message?.includes('already_submitted')) {
      // Session déjà soumise - idempotent, on retourne silencieusement
      throw new Error('assess_already_submitted');
    }
    
    if (error.message?.includes('429') || error.message?.includes('rate_limit')) {
      throw new Error('assess_rate_limited');
    }
    
    if (error.message?.includes('401') || error.message?.includes('403')) {
      throw new Error('assess_unauthorized');
    }
    
    console.error('Assessment submit error:', error);
    throw new Error(`assess_submit_failed: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('assess_submit_no_data');
  }
  
  return data;
}

export async function aggregateAssess(body: AggregateInput): Promise<AggregateOutput> {
  const { data, error } = await supabase.functions.invoke<AggregateOutput>('assess-aggregate', { 
    body 
  });
  
  if (error) {
    console.error('Assessment aggregate error:', error);
    throw new Error(`assess_aggregate_failed: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('assess_aggregate_no_data');
  }
  
  return data;
}