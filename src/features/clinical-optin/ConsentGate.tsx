'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useConsent } from './ConsentProvider';

interface ConsentGateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  acceptLabel?: string;
  declineLabel?: string;
  onDecline?: () => void;
  fallback?: ReactNode;
}

export function ConsentGate({
  children,
  title = "Activer l'écoute clinique",
  description =
    'Tu peux accepter ou refuser librement. Les expériences adaptatives se débloquent uniquement avec ton accord explicite.',
  acceptLabel = 'Oui, activer les signaux doux',
  declineLabel = 'Je préfère rester sans adaptation',
  onDecline,
  fallback,
}: ConsentGateProps): JSX.Element {
  const { clinicalAccepted, setClinicalAccepted } = useConsent();

  const declineAction = useMemo(() => onDecline, [onDecline]);

  if (!clinicalAccepted) {
    return (
      <Card role="region" aria-live="polite" className="border-dashed">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => setClinicalAccepted(true)}>
            {acceptLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setClinicalAccepted(false);
              declineAction?.();
            }}
          >
            {declineLabel}
          </Button>
          {fallback}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

export default ConsentGate;
