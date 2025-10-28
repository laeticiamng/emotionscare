// @ts-nocheck
'use client';

import React, { useMemo } from 'react';

import { ConsentDialog } from './ConsentDialog';
import { useConsent } from './ConsentProvider';
import { useFlags } from '@/core/flags';

export interface ConsentGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  scope?: 'clinical';
}

export function ConsentGate({ children, fallback = null, scope = 'clinical' }: ConsentGateProps) {
  const { flags } = useFlags();
  const requireOptIn = flags?.FF_REQUIRE_CLINICAL_OPTIN !== false;
  const consent = useConsent();

  const bypassGate = !requireOptIn || scope !== 'clinical';

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

  // Laisser passer si accepté, révoqué, ou si l'utilisateur a refusé
  if (consent.status === 'accepted' || consent.status === 'revoked' || consent.wasRevoked) {
    return <>{children}</>;
  }

  // Ne pas bloquer l'affichage indéfiniment - afficher le contenu même si le statut est inconnu
  if (consent.status === 'unknown' || consent.loading) {
    return <>{children}</>;
  }

  return (
    <>
      {fallback}
      <ConsentDialog {...dialogProps} />
    </>
  );
}

export default ConsentGate;

