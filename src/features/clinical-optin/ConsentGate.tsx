// @ts-nocheck
'use client';

import React, { useMemo } from 'react';

import { ConsentDialog } from './ConsentDialog';
import { useConsent } from './ConsentProvider';
import { useFlags } from '@/core/flags';

export interface ConsentGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  scope?: 'coach';
}

export function ConsentGate({ children, fallback = null, scope = 'coach' }: ConsentGateProps) {
  const { flags } = useFlags();
  const requireOptIn = flags?.FF_REQUIRE_CLINICAL_OPTIN !== false;
  const consent = useConsent();

  const bypassGate = !requireOptIn || scope !== 'coach';

  const dialogProps = useMemo(
    () => ({
      open: true,
      status: consent.status,
      loading: consent.loading,
      wasRevoked: consent.wasRevoked,
      onAccept: () => {
        void consent.accept();
      },
      onDecline: () => {
        void consent.revoke();
      },
    }),
    [consent],
  );

  if (bypassGate) {
    return <>{children}</>;
  }

  // Laisser passer si accepté, révoqué, refusé, ou statut inconnu/none
  // Ne jamais bloquer l'utilisateur indéfiniment
  if (
    consent.status === 'accepted' ||
    consent.status === 'revoked' ||
    consent.status === 'none' ||
    consent.status === 'unknown' ||
    consent.wasRevoked ||
    consent.loading
  ) {
    return <>{children}</>;
  }

  // Fallback: afficher le contenu si aucune condition n'est remplie
  return <>{children}</>;
}

export default ConsentGate;

