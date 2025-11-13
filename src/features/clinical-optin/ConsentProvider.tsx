// @ts-nocheck
'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { captureException } from '@/lib/ai-monitoring';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const CONSENT_SCOPE = 'coach';
const CONSENT_VERSION = 'v1';
const CONSENT_QUERY_KEY = ['clinical-optin', 'status'] as const;

export type ConsentStatus = 'unknown' | 'none' | 'accepted' | 'revoked';

interface ConsentSnapshot {
  status: Exclude<ConsentStatus, 'unknown'>;
  scope: string | null;
  wasRevoked: boolean;
}

interface ConsentContextValue {
  status: ConsentStatus;
  scope: string | null;
  wasRevoked: boolean;
  loading: boolean;
  accept: () => Promise<void>;
  revoke: () => Promise<void>;
  refresh: () => Promise<ConsentSnapshot | undefined>;
}

const FALLBACK_CONTEXT: ConsentContextValue = {
  status: 'accepted',
  scope: CONSENT_SCOPE,
  wasRevoked: false,
  loading: false,
  accept: async () => {},
  revoke: async () => {},
  refresh: async () => ({ status: 'accepted', scope: CONSENT_SCOPE, wasRevoked: false }),
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

type SupabaseRecord = {
  scope: string | null;
  revoked_at: string | null;
};

const normalizeSnapshot = (record: SupabaseRecord | null): ConsentSnapshot => {
  if (!record) {
    return { status: 'none', scope: null, wasRevoked: false };
  }

  if (record.revoked_at) {
    return { status: 'revoked', scope: record.scope ?? CONSENT_SCOPE, wasRevoked: true };
  }

  return { status: 'accepted', scope: record.scope ?? CONSENT_SCOPE, wasRevoked: false };
};

async function fetchConsentSnapshot(): Promise<ConsentSnapshot> {
  const { data: active, error: activeError } = await supabase
    .from('clinical_optins')
    .select('scope, revoked_at')
    .is('revoked_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<SupabaseRecord>();

  if (activeError) {
    throw activeError;
  }

  if (active) {
    return normalizeSnapshot(active);
  }

  const { data: latest, error: latestError } = await supabase
    .from('clinical_optins')
    .select('scope, revoked_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<SupabaseRecord>();

  if (latestError) {
    throw latestError;
  }

  return normalizeSnapshot(latest ?? null);
}

const useConsentQuery = () =>
  useQuery({
    queryKey: CONSENT_QUERY_KEY,
    queryFn: fetchConsentSnapshot,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [optimisticSnapshot, setOptimisticSnapshot] = useState<ConsentSnapshot | null>(null);
  const lastActionRef = useRef<'accept' | 'revoke' | null>(null);

  useEffect(() => {
    Sentry.setTag('consent.version', CONSENT_VERSION);
  }, []);

  const consentQuery = useConsentQuery();

  useEffect(() => {
    if (consentQuery.error) {
      toast({
        variant: 'destructive',
        title: t('consent.title'),
        description: t('consent.error'),
      });
    }
  }, [consentQuery.error, toast, t]);

  useEffect(() => {
    if (optimisticSnapshot) {
      return;
    }

    if (consentQuery.data) {
      setOptimisticSnapshot(consentQuery.data);
    }
  }, [consentQuery.data, optimisticSnapshot]);

  useEffect(() => {
    if (!consentQuery.isFetching || !optimisticSnapshot) {
      return;
    }

    if (consentQuery.data && consentQuery.data !== optimisticSnapshot) {
      setOptimisticSnapshot(consentQuery.data);
    }
  }, [consentQuery.data, consentQuery.isFetching, optimisticSnapshot]);

  const mutationErrorHandler = () => {
    toast({
      variant: 'destructive',
      title: t('consent.title'),
      description: t('consent.update_error'),
    });
  };

  const acceptMutation = useMutation({
    mutationFn: async () => {
      Sentry.addBreadcrumb({
        category: 'consent',
        level: 'info',
        message: 'optin.accept.click',
        data: { scope: CONSENT_SCOPE },
      });

      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Vérifier s'il existe déjà un consentement actif
      const { data: existing } = await supabase
        .from('clinical_optins')
        .select('id')
        .is('revoked_at', null)
        .maybeSingle();

      if (existing) {
        return; // Déjà accepté
      }

      // Insérer un nouveau consentement avec le user_id
      const { error } = await supabase
        .from('clinical_optins')
        .insert({
          user_id: user.id,
          scope: CONSENT_SCOPE,
        });

      if (error) {
        throw error;
      }
    },
    onMutate: async () => {
      lastActionRef.current = 'accept';
      setOptimisticSnapshot({ status: 'accepted', scope: CONSENT_SCOPE, wasRevoked: false });
    },
    onError: mutationErrorHandler,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CONSENT_QUERY_KEY });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async () => {
      Sentry.addBreadcrumb({
        category: 'consent',
        level: 'info',
        message: 'optin.revoke.click',
        data: { scope: CONSENT_SCOPE },
      });

      // Marquer tous les consentements actifs comme révoqués
      const { error } = await supabase
        .from('clinical_optins')
        .update({ revoked_at: new Date().toISOString() })
        .is('revoked_at', null);

      if (error) {
        throw error;
      }
    },
    onMutate: async () => {
      lastActionRef.current = 'revoke';
      setOptimisticSnapshot({ status: 'none', scope: null, wasRevoked: true });
      toast({ title: t('consent.revoked'), description: t('consent.body') });
    },
    onError: mutationErrorHandler,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CONSENT_QUERY_KEY });
    },
  });

  const refresh = useMemo(
    () => async () => {
      const result = await queryClient.fetchQuery({ queryKey: CONSENT_QUERY_KEY, queryFn: fetchConsentSnapshot });
      setOptimisticSnapshot(result);
      return result;
    },
    [queryClient],
  );

  const status: ConsentStatus = consentQuery.isPending
    ? 'unknown'
    : optimisticSnapshot?.status ?? 'none';

  const scope = optimisticSnapshot?.scope ?? CONSENT_SCOPE;
  const wasRevoked = Boolean(optimisticSnapshot?.wasRevoked);
  const loading = consentQuery.isPending || acceptMutation.isPending || revokeMutation.isPending;

  const contextValue = useMemo<ConsentContextValue>(() => {
    return {
      status,
      scope,
      wasRevoked,
      loading,
      accept: async () => {
        await acceptMutation.mutateAsync();
      },
      revoke: async () => {
        await revokeMutation.mutateAsync();
      },
      refresh,
    };
  }, [status, scope, wasRevoked, loading, acceptMutation, revokeMutation, refresh]);

  useEffect(() => {
    if (!consentQuery.data || !lastActionRef.current) {
      return;
    }

    if (lastActionRef.current === 'accept' && consentQuery.data.status === 'accepted') {
      setOptimisticSnapshot(consentQuery.data);
      lastActionRef.current = null;
    }

    if (lastActionRef.current === 'revoke' && consentQuery.data.wasRevoked) {
      setOptimisticSnapshot({ ...consentQuery.data, status: 'none', wasRevoked: true });
      lastActionRef.current = null;
    }
  }, [consentQuery.data]);

  return <ConsentContext.Provider value={contextValue}>{children}</ConsentContext.Provider>;
};

export const useConsent = (): ConsentContextValue => {
  const context = useContext(ConsentContext);
  if (!context) {
    return FALLBACK_CONTEXT;
  }
  return context;
};

