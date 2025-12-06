// @ts-nocheck
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

type ClinicalConsentDecision = 'granted' | 'declined';

export type ClinicalInstrumentCode =
  | 'WHO5'
  | 'STAI6'
  | 'PANAS'
  | 'SUDS'
  | 'SAM'
  | 'PSS10'
  | 'WEMWBS'
  | 'CBI'
  | 'UWES'
  | 'SSQ';

interface ClinicalConsentState {
  decision: ClinicalConsentDecision | null;
  loading: boolean;
  isSaving: boolean;
  shouldPrompt: boolean;
  hasConsented: boolean;
  error: string | null;
  isDNTEnabled: boolean;
  grantConsent: () => Promise<void>;
  declineConsent: () => Promise<void>;
}

const detectDoNotTrack = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorDnt =
    (window.navigator as Navigator & { doNotTrack?: string; msDoNotTrack?: string }).doNotTrack ??
    (window as Window & { doNotTrack?: string }).doNotTrack ??
    (window.navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack;

  return navigatorDnt === '1' || navigatorDnt === 'yes';
};

export const useClinicalConsent = (instrument: ClinicalInstrumentCode): ClinicalConsentState => {
  const [decision, setDecision] = useState<ClinicalConsentDecision | null>(null);
  const [consentId, setConsentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isDNTEnabled = useMemo(() => detectDoNotTrack(), []);

  useEffect(() => {
    let isMounted = true;

    const fetchConsent = async () => {
      if (!instrument) {
        setLoading(false);
        return;
      }

      if (isDNTEnabled) {
        if (isMounted) {
          setDecision('declined');
          setLoading(false);
        }
        return;
      }

      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          if (isMounted) {
            setDecision(null);
            setConsentId(null);
            setLoading(false);
          }
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('clinical_consents')
          .select('id, is_active, revoked_at')
          .eq('user_id', user.id)
          .eq('instrument_code', instrument)
          .order('granted_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!isMounted) {
          return;
        }

        if (fetchError && fetchError.code !== 'PGRST116') {
          logger.error('useClinicalConsent fetch error', fetchError as Error, 'AUTH');
          setError("Une erreur est survenue lors de la vérification du consentement.");
        } else {
          setError(null);
        }

        if (data) {
          setConsentId(data.id);

          if (data.is_active === true) {
            setDecision('granted');
          } else if (data.is_active === false || data.revoked_at) {
            setDecision('declined');
          } else {
            setDecision(null);
          }
        } else {
          setConsentId(null);
          setDecision(null);
        }
      } catch (err) {
        logger.error('useClinicalConsent error', err as Error, 'AUTH');
        if (isMounted) {
          setError("Impossible de récupérer votre consentement pour le moment.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConsent();

    return () => {
      isMounted = false;
    };
  }, [instrument, isDNTEnabled]);

  const updateConsent = useCallback(
    async (granted: boolean) => {
      if (!instrument || isDNTEnabled) {
        return;
      }

      setIsSaving(true);
      setError(null);

      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          setError('Vous devez être connecté pour enregistrer votre choix.');
          setIsSaving(false);
          return;
        }

        const timestamp = new Date().toISOString();

        if (consentId) {
          const { error: updateError } = await supabase
            .from('clinical_consents')
            .update({
              is_active: granted,
              granted_at: granted ? timestamp : null,
              revoked_at: granted ? null : timestamp
            })
            .eq('id', consentId);

          if (updateError) {
            throw updateError;
          }
        } else {
          const insertPayload = {
            user_id: user.id,
            instrument_code: instrument,
            is_active: granted,
            granted_at: granted ? timestamp : null,
            revoked_at: granted ? null : timestamp
          };

          const { data, error: insertError } = await supabase
            .from('clinical_consents')
            .insert(insertPayload)
            .select('id')
            .single();

          if (insertError) {
            throw insertError;
          }

          setConsentId(data?.id ?? null);
        }

        setDecision(granted ? 'granted' : 'declined');
        setLoading(false);
      } catch (err) {
        logger.error('useClinicalConsent update error', err as Error, 'AUTH');
        setError("Impossible d'enregistrer votre décision pour le moment.");
      } finally {
        setIsSaving(false);
      }
    },
    [consentId, instrument, isDNTEnabled]
  );

  const grantConsent = useCallback(async () => {
    await updateConsent(true);
  }, [updateConsent]);

  const declineConsent = useCallback(async () => {
    await updateConsent(false);
  }, [updateConsent]);

  return {
    decision,
    loading,
    isSaving,
    shouldPrompt: !loading && decision === null && !isDNTEnabled,
    hasConsented: decision === 'granted',
    error,
    isDNTEnabled,
    grantConsent,
    declineConsent
  };
};

export default useClinicalConsent;
