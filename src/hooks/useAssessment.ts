/**
 * Clinical Assessment Hook - Opt-in invisible evaluations
 * Provides orchestration callbacks without UI display
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type InstrumentCode = 
  | 'WHO5' | 'STAI6' | 'PANAS' | 'PSS10' | 'UCLA3' | 'MSPSS' 
  | 'AAQ2' | 'POMS' | 'SSQ' | 'ISI' | 'GAS' | 'GRITS' 
  | 'BRS' | 'WEMWBS' | 'UWES' | 'CBI' | 'CVSQ';

export type OrchestrationAction = 
  | 'gentle_tone' | 'suggest_breathing' | 'reduce_intensity' 
  | 'encourage_movement' | 'offer_social' | 'extend_session'
  | 'soft_exit' | 'increase_support' | 'quiet_mode';

export interface OrchestrationCallbacks {
  onLowWellbeing?: () => void;
  onHighAnxiety?: () => void;
  onLowPositiveAffect?: () => void;
  onHighStress?: () => void;
  onSocialNeed?: () => void;
  onFatigueDetected?: () => void;
  onOptimalState?: () => void;
}

export interface AssessmentState {
  isActive: boolean;
  currentInstrument: InstrumentCode | null;
  hasConsent: boolean;
  lastResponse?: Date;
  orchestrationActions: OrchestrationAction[];
}

export interface AssessmentHook {
  state: AssessmentState;
  triggerAssessment: ( 
    instrument: InstrumentCode, 
    callbacks?: OrchestrationCallbacks
  ) => Promise<void>;
  submitResponse: (answers: Record<string, any>) => Promise<boolean>;
  grantConsent: (instrument: InstrumentCode) => Promise<void>;
  revokeConsent: (instrument: InstrumentCode) => Promise<void>;
  getOrchestrationActions: () => OrchestrationAction[];
  clearActions: () => void;
}

export const useAssessment = (defaultInstrument?: InstrumentCode): AssessmentHook => {
  const { toast } = useToast();
  const [state, setState] = useState<AssessmentState>({
    isActive: false,
    currentInstrument: defaultInstrument || null,
    hasConsent: false,
    orchestrationActions: []
  });

  const [currentCallbacks, setCurrentCallbacks] = useState<OrchestrationCallbacks>({});

  // Check consent status
  useEffect(() => {
    if (state.currentInstrument) {
      checkConsent(state.currentInstrument);
    }
  }, [state.currentInstrument]);

  const checkConsent = async (instrument: InstrumentCode) => {
    try {
      const { data } = await supabase
        .from('clinical_consents')
        .select('is_active')
        .eq('instrument_code', instrument)
        .eq('is_active', true)
        .maybeSingle();

      setState(prev => ({
        ...prev,
        hasConsent: !!data?.is_active
      }));
    } catch (error) {
      console.error('Error checking consent:', error);
    }
  };

  const grantConsent = async (instrument: InstrumentCode) => {
    try {
      const { error } = await supabase
        .from('clinical_consents')
        .insert({
          instrument_code: instrument,
          is_active: true
        });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        hasConsent: true
      }));

      toast({
        title: "Évaluation activée",
        description: "L'évaluation clinique a été activée pour personnaliser votre expérience.",
      });
    } catch (error) {
      console.error('Error granting consent:', error);
    }
  };

  const revokeConsent = async (instrument: InstrumentCode) => {
    try {
      const { error } = await supabase
        .from('clinical_consents')
        .update({ 
          is_active: false,
          revoked_at: new Date().toISOString()
        })
        .eq('instrument_code', instrument);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        hasConsent: false,
        isActive: false
      }));
    } catch (error) {
      console.error('Error revoking consent:', error);
    }
  };

  const triggerAssessment = async (
    instrument: InstrumentCode,
    callbacks: OrchestrationCallbacks = {}
  ) => {
    if (!state.hasConsent) {
      console.log(`Assessment ${instrument} skipped - no consent`);
      return;
    }

    try {
      // Check if feature flag is enabled
      const { data: flag } = await supabase
        .from('clinical_feature_flags')
        .select('is_enabled')
        .eq('flag_name', `FF_ASSESS_${instrument}`)
        .maybeSingle();

      if (!flag?.is_enabled) {
        console.log(`Assessment ${instrument} skipped - feature disabled`);
        return;
      }

      // Get instrument catalog
      const response = await supabase.functions.invoke('assess-start', {
        body: { instrument }
      });

      if (response.error) throw response.error;

      setState(prev => ({
        ...prev,
        isActive: true,
        currentInstrument: instrument
      }));

      setCurrentCallbacks(callbacks);

      console.log(`Assessment ${instrument} ready for opt-in collection`);
    } catch (error) {
      console.error('Error triggering assessment:', error);
    }
  };

  const submitResponse = async (answers: Record<string, any>): Promise<boolean> => {
    if (!state.currentInstrument || !state.hasConsent) {
      return false;
    }

    try {
      const response = await supabase.functions.invoke('assess-submit', {
        body: {
          instrument: state.currentInstrument,
          answers
        }
      });

      if (response.error) throw response.error;

      // Process orchestration based on results
      await processOrchestration(state.currentInstrument, answers);

      setState(prev => ({
        ...prev,
        isActive: false,
        lastResponse: new Date()
      }));

      return true;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return false;
    }
  };

  const processOrchestration = async (instrument: InstrumentCode, answers: Record<string, any>) => {
    const actions: OrchestrationAction[] = [];
    
    switch (instrument) {
      case 'WHO5':
        const who5Score = Object.values(answers).reduce((sum: number, val: any) => sum + Number(val), 0);
        if (who5Score < 13) {
          actions.push('gentle_tone', 'increase_support');
          currentCallbacks.onLowWellbeing?.();
        } else {
          actions.push('encourage_movement');
          currentCallbacks.onOptimalState?.();
        }
        break;

      case 'STAI6':
        const staiScore = Object.values(answers).reduce((sum: number, val: any) => sum + Number(val), 0);
        if (staiScore > 16) {
          actions.push('suggest_breathing', 'reduce_intensity');
          currentCallbacks.onHighAnxiety?.();
        }
        break;

      case 'PANAS':
        const positiveItems = Object.entries(answers)
          .filter(([key]) => Number(key) <= 10)
          .reduce((sum, [, val]) => sum + Number(val), 0);
        
        if (positiveItems < 30) {
          actions.push('gentle_tone', 'offer_social');
          currentCallbacks.onLowPositiveAffect?.();
        }
        break;
    }

    // Store orchestration signals in database (invisible to UI)
    if (actions.length > 0) {
      const { error } = await supabase
        .from('clinical_signals')
        .insert({
          source_instrument: instrument,
          domain: instrument === 'WHO5' ? 'wellbeing' : instrument === 'STAI6' ? 'anxiety' : 'affect',
          level: actions.includes('increase_support') ? 1 : actions.includes('gentle_tone') ? 2 : 3,
          window_type: 'contextual',
          module_context: 'assessment_response',
          metadata: { actions },
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        });

      if (error) {
        console.error('Error storing orchestration signals:', error);
      }
    }

    setState(prev => ({
      ...prev,
      orchestrationActions: actions
    }));
  };

  const getOrchestrationActions = useCallback(() => {
    return state.orchestrationActions;
  }, [state.orchestrationActions]);

  const clearActions = useCallback(() => {
    setState(prev => ({
      ...prev,
      orchestrationActions: []
    }));
  }, []);

  return {
    state,
    triggerAssessment,
    submitResponse,
    grantConsent,
    revokeConsent,
    getOrchestrationActions,
    clearActions
  };
};