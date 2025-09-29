'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useConsent } from '@/features/clinical-optin/ConsentProvider';
import SchedulePrompt from '@/features/social-cocon/SchedulePrompt';
import { useSocialRooms } from '@/features/social-cocon/hooks/useSocialRooms';
import { socialCoconOrchestrator, persistOrchestrationSession, serializeHints, type UIHint } from '@/features/orchestration';
import { useAssessment } from '@/hooks/useAssessment';
import type { SocialRoom } from '@/features/social-cocon/types';
import { useReducedMotion } from '@/components/ui/AccessibilityOptimized';

const readMockLevel = () => {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem('orchestration:social_cocon');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return typeof parsed?.mspssLevel === 'number' ? parsed.mspssLevel : undefined;
  } catch (error) {
    console.warn('[social-cocon/page] unable to parse mock level', error);
    return undefined;
  }
};

const describeRoom = (room: SocialRoom) => {
  if (room.isPrivate) {
    return 'Espace réservé, invitations discrètes et accès limité.';
  }
  if (room.allowAudio) {
    return 'Salle à la fois vocale et écrite pour improviser ensemble.';
  }
  return 'Salon texte idéal pour échanger par messages apaisés.';
};

export default function SocialCoconPage(): JSX.Element {
  const { flags } = useFlags();
  const { clinicalAccepted } = useConsent();
  const prefersReducedMotion = useReducedMotion();
  const mspss = useAssessment('MSPSS');
  const { rooms, isLoading: roomsLoading } = useSocialRooms({ enabled: true });
  const [mockLevel, setMockLevel] = useState<number | undefined>(undefined);
  const persistedSignatureRef = useRef<string | null>(null);
  const breadcrumbsSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    setMockLevel(readMockLevel());
  }, []);

  const orchestrationEnabled = Boolean(flags.FF_SOCIAL_COCON && flags.FF_ORCH_SOCIAL_COCON);
  const assessmentEnabled = Boolean(flags.FF_ASSESS_MSPSS);

  const resolvedMspssLevel = useMemo(() => {
    if (typeof mockLevel === 'number') return mockLevel;
    return typeof mspss.lastLevel === 'number' ? mspss.lastLevel : undefined;
  }, [mockLevel, mspss.lastLevel]);

  const consented = Boolean(
    clinicalAccepted && mspss.state.hasConsent && mspss.state.consentDecision !== 'declined',
  );

  const hints: UIHint[] = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' }];
    }
    return socialCoconOrchestrator({
      mspssLevel: typeof resolvedMspssLevel === 'number' ? resolvedMspssLevel : undefined,
      consented,
    });
  }, [assessmentEnabled, consented, orchestrationEnabled, resolvedMspssLevel]);

  const actionableHints = hints.filter((hint) => hint.action !== 'none');
  const showSchedulePrompt = actionableHints.some(
    (hint) => hint.action === 'promote_cta' && hint.key === 'schedule_break',
  );
  const highlightPrivateRooms = actionableHints.some((hint) => hint.action === 'highlight_rooms_private');

  const metadata = useMemo(() => {
    const payload: Record<string, string | undefined> = {};
    if (showSchedulePrompt) payload.cta = 'schedule_break';
    if (highlightPrivateRooms) payload.highlight = 'rooms_private';
    return payload;
  }, [highlightPrivateRooms, showSchedulePrompt]);

  useEffect(() => {
    if (!consented) return;
    const signature = JSON.stringify(metadata);
    if (!signature || signature === '{}' || signature === persistedSignatureRef.current) return;
    persistedSignatureRef.current = signature;
    void persistOrchestrationSession('social_cocon', metadata);
  }, [consented, metadata]);

  const serializedHints = useMemo(() => serializeHints(actionableHints), [actionableHints]);

  useEffect(() => {
    if (serializedHints.length === 0) return;
    const signature = serializedHints.join('|');
    if (breadcrumbsSignatureRef.current === signature) return;
    breadcrumbsSignatureRef.current = signature;

    serializedHints.forEach((entry) => {
      if (entry.startsWith('promote_cta:schedule_break')) {
        Sentry.addBreadcrumb({
          category: 'social',
          level: 'info',
          message: 'social:schedule_prompt_shown',
        });
      }
      if (entry === 'highlight_rooms_private') {
        Sentry.addBreadcrumb({
          category: 'social',
          level: 'info',
          message: 'social:room_highlighted',
        });
      }
    });
  }, [serializedHints]);

  const sortedRooms = useMemo(() => {
    if (!highlightPrivateRooms) return rooms;
    return [...rooms].sort((a, b) => Number(b.isPrivate) - Number(a.isPrivate));
  }, [highlightPrivateRooms, rooms]);

  const cardMotionClass = prefersReducedMotion
    ? 'transition-none'
    : 'transition-transform duration-150 ease-out hover:-translate-y-1';

  if (!consented) {
    return (
      <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16 text-indigo-950">
          <header className="space-y-4">
            <h1 className="text-3xl font-semibold">Social Cocon</h1>
            <p className="text-base text-indigo-800">
              Les rooms restent accessibles même sans instrumentation clinique. Tu peux observer ou rejoindre une conversation librement.
            </p>
          </header>
        </main>
      </ZeroNumberBoundary>
    );
  }

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 text-indigo-950">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-indigo-600">Cocon social</p>
          <h1 className="text-3xl font-semibold leading-tight">Planifier des respirations ensemble</h1>
          <p className="max-w-2xl text-base text-indigo-800">
            Les suggestions ci-dessous évoluent selon ton ressenti de soutien social. Les messages restent textuels, aucune valeur chiffrée n’est affichée.
          </p>
        </header>

        {showSchedulePrompt && <SchedulePrompt highlightRooms={highlightPrivateRooms} />}

        <section aria-label="Espaces disponibles" className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-900">Rooms tranquilles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sortedRooms.map((room) => (
              <Card
                key={room.id}
                className={`border-indigo-100 bg-white/80 shadow-sm ${cardMotionClass} ${
                  highlightPrivateRooms && room.isPrivate ? 'ring-2 ring-indigo-400' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg text-indigo-900">
                    {room.name}
                    {room.isPrivate && <Badge className="bg-indigo-900 text-indigo-50">Privé</Badge>}
                  </CardTitle>
                  <CardDescription className="text-sm text-indigo-700">{room.topic}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-indigo-800">
                  <p>{describeRoom(room)}</p>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-indigo-600">
                    {room.allowAudio ? <span className="rounded-full bg-indigo-100 px-3 py-1">Voix douce</span> : null}
                    <span className="rounded-full bg-indigo-100 px-3 py-1">Messages</span>
                    {room.softModeEnabled ? (
                      <span className="rounded-full bg-indigo-100 px-3 py-1">Mode feutré</span>
                    ) : (
                      <span className="rounded-full bg-indigo-100 px-3 py-1">Ambiance libre</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {!roomsLoading && sortedRooms.length === 0 && (
              <Card className="border-indigo-100 bg-white/70 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg text-indigo-900">Pas encore de rooms</CardTitle>
                  <CardDescription className="text-indigo-700">
                    Lance la première invitation depuis le module de planification ci-dessus.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </section>
      </main>
    </ZeroNumberBoundary>
  );
}
