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
        if (consent.wasRevoked) {
          return;
        }
      },
    }),
    [consent],
  );

  if (bypassGate) {
    return <>{children}</>;
  }

  if (consent.status === 'accepted') {
    return <>{children}</>;
  }

  if (consent.status === 'unknown' || consent.loading) {
    return null;
  }

  return (
    <>
      {fallback}
      <ConsentDialog {...dialogProps} />
    </>
  );
}

export default ConsentGate;

