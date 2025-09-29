import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AssessmentInstrument {
  code: string;
  name: string;
  questions: {
    items: Array<{
      id: string;
      text: string;
      scale: string;
      reverse?: boolean;
    }>;
  };
  cadence: string;
}

export interface AssessmentResponse {
  [questionId: string]: number;
}

export interface AssessmentSession {
  instrument: AssessmentInstrument;
  session_id: string;
  can_retake: boolean;
}

export const useClinicalAssessment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);

  const startAssessment = useCallback(async (instrumentCode: string, userId: string): Promise<AssessmentSession | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('assess', {
        body: {
          instrument_code: instrumentCode,
          user_id: userId
        }
      });

      if (error) throw error;

      setCurrentSession(data);
      return data;
    } catch (error) {
      console.error('Error starting assessment:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAssessment = useCallback(async (
    instrumentCode: string,
    userId: string,
    responses: AssessmentResponse,
    sessionId: string,
    contextData: Record<string, any> = {}
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('assess', {
        body: {
          instrument_code: instrumentCode,
          user_id: userId,
          responses,
          session_id: sessionId,
          context_data: contextData
        }
      });

      if (error) throw error;

      // Nettoyer la session après soumission
      setCurrentSession(null);
      return data.success;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const grantConsent = useCallback(async (instrumentCode: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clinical_consents')
        .upsert({
          user_id: userId,
          instrument_code: instrumentCode,
          is_active: true,
          granted_at: new Date().toISOString()
        });

      return !error;
    } catch (error) {
      console.error('Error granting consent:', error);
      return false;
    }
  }, []);

  const revokeConsent = useCallback(async (instrumentCode: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clinical_consents')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('instrument_code', instrumentCode);

      return !error;
    } catch (error) {
      console.error('Error revoking consent:', error);
      return false;
    }
  }, []);

  const checkConsent = useCallback(async (instrumentCode: string, userId: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('clinical_consents')
        .select('is_active')
        .eq('user_id', userId)
        .eq('instrument_code', instrumentCode)
        .eq('is_active', true)
        .single();

      return !!data;
    } catch (error) {
      return false;
    }
  }, []);

  const getClinicalSignal = useCallback(async (userId: string, domain: string): Promise<any> => {
    try {
      const { data } = await supabase
        .from('clinical_signals')
        .select('*')
        .eq('user_id', userId)
        .eq('domain', domain)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return data;
    } catch (error) {
      return null;
    }
  }, []);

  return {
    isLoading,
    currentSession,
    startAssessment,
    submitAssessment,
    grantConsent,
    revokeConsent,
    checkConsent,
    getClinicalSignal
  };
};