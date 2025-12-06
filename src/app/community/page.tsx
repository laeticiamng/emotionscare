'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useConsent } from '@/features/clinical-optin/ConsentProvider';
import EmpathicRepliesPanel from '@/features/community/EmpathicRepliesPanel';
import ListenTwoMinutesBanner from '@/features/community/ListenTwoMinutesBanner';
import {
  communityOrchestrator,
  persistOrchestrationSession,
  serializeHints,
  type UIHint,
} from '@/features/orchestration';
import { useAssessment } from '@/hooks/useAssessment';
import { useReducedMotion } from '@/components/ui/AccessibilityOptimized';

const baseCards = [
  {
    id: 'social_cocon',
    title: 'Social Cocon',
    description: 'Rejoins un cocon privé pour respirer avec d’autres sans obligation de parole.',
    cta: 'Entrer dans le cocon',
    href: '/app/social-cocon',
  },
  {
    id: 'gentle_threads',
    title: 'Fils doux',
    description: 'Dépose quelques mots dans un fil de discussion apaisé, les réponses arrivent quand elles peuvent.',
    cta: 'Ouvrir un fil',
    href: '/app/modules',
  },
  {
    id: 'quiet_library',
    title: 'Coin inspiration',
    description: 'Découvre des messages soigneusement préparés pour accompagner ton écoute ou proposer un moment de silence.',
    cta: 'Explorer les ressources',
    href: '/app/modules',
  },
] as const;

const readMockLevels = () => {
  if (typeof window === 'undefined') return {} as Partial<Record<'uclaLevel' | 'mspssLevel', number>>;
  try {
    const raw = window.localStorage.getItem('orchestration:community');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const output: Partial<Record<'uclaLevel' | 'mspssLevel', number>> = {};
    if (typeof parsed?.uclaLevel === 'number') {
      output.uclaLevel = parsed.uclaLevel;
    }
    if (typeof parsed?.mspssLevel === 'number') {
      output.mspssLevel = parsed.mspssLevel;
    }
    return output;
  } catch (error) {
    console.warn('[community/page] unable to parse mock levels', error);
    return {};
  }
};

export default function CommunityPage(): JSX.Element {
  const { flags } = useFlags();
  const { clinicalAccepted } = useConsent();
  const prefersReducedMotion = useReducedMotion();
  const ucla = useAssessment('UCLA3');
  const mspss = useAssessment('MSPSS');
  const [mockLevels, setMockLevels] = useState<Partial<Record<'uclaLevel' | 'mspssLevel', number>>>(() => ({}));
  const [bannerOpen, setBannerOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const persistedSignatureRef = useRef<string | null>(null);
  const breadcrumbsSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    setMockLevels(readMockLevels());
  }, []);

  const orchestrationEnabled = Boolean(flags.FF_COMMUNITY && flags.FF_ORCH_COMMUNITY);
  const assessmentsEnabled = Boolean(flags.FF_ASSESS_UCLA3 && flags.FF_ASSESS_MSPSS);

  const resolvedUclaLevel = useMemo(() => {
    if (typeof mockLevels.uclaLevel === 'number') return mockLevels.uclaLevel;
    return typeof ucla.lastLevel === 'number' ? ucla.lastLevel : undefined;
  }, [mockLevels.uclaLevel, ucla.lastLevel]);

  const resolvedMspssLevel = useMemo(() => {
    if (typeof mockLevels.mspssLevel === 'number') return mockLevels.mspssLevel;
    return typeof mspss.lastLevel === 'number' ? mspss.lastLevel : undefined;
  }, [mockLevels.mspssLevel, mspss.lastLevel]);

  const consented = Boolean(
    clinicalAccepted && ucla.state.hasConsent && mspss.state.hasConsent && ucla.state.consentDecision !== 'declined' && mspss.state.consentDecision !== 'declined',
  );

  const hints: UIHint[] = useMemo(() => {
    if (!orchestrationEnabled || !assessmentsEnabled) {
      return [{ action: 'none' }];
    }
    return communityOrchestrator({
      uclaLevel: typeof resolvedUclaLevel === 'number' ? resolvedUclaLevel : undefined,
      mspssLevel: typeof resolvedMspssLevel === 'number' ? resolvedMspssLevel : undefined,
      consented,
    });
  }, [assessmentsEnabled, consented, orchestrationEnabled, resolvedMspssLevel, resolvedUclaLevel]);

  const actionableHints = hints.filter((hint) => hint.action !== 'none');

  const showBanner = actionableHints.some((hint) => hint.action === 'show_banner');
  const showReplies = actionableHints.some((hint) => hint.action === 'show_empathic_replies');
  const pinSocialCocon = actionableHints.some(
    (hint) => hint.action === 'pin_card' && hint.key === 'social_cocon',
  );

  useEffect(() => {
    if (showBanner && !bannerDismissed) {
      setBannerOpen(true);
    }
  }, [bannerDismissed, showBanner]);

  useEffect(() => {
    if (!showBanner && bannerDismissed) {
      setBannerDismissed(false);
    }
  }, [bannerDismissed, showBanner]);

  const cards = useMemo(() => {
    const ordered = [...baseCards];
    if (pinSocialCocon) {
      const index = ordered.findIndex((card) => card.id === 'social_cocon');
      if (index > 0) {
        const [card] = ordered.splice(index, 1);
        ordered.unshift(card);
      }
    }
    return ordered;
  }, [pinSocialCocon]);

  const metadata = useMemo(() => {
    const payload: Record<string, string | undefined> = {};
    if (showBanner) payload.banner = 'listen_two_minutes';
    if (showReplies) payload.panel = 'empathic_replies';
    if (pinSocialCocon) payload.pin = 'social_cocon';
    return payload;
  }, [pinSocialCocon, showBanner, showReplies]);

  const serializedHints = useMemo(() => serializeHints(actionableHints), [actionableHints]);

  useEffect(() => {
    if (!consented) return;
    const signature = JSON.stringify(metadata);
    if (!signature || signature === '{}' || signature === persistedSignatureRef.current) return;
    persistedSignatureRef.current = signature;
    void persistOrchestrationSession('community', metadata);
  }, [consented, metadata]);

  useEffect(() => {
    if (serializedHints.length === 0) return;
    const signature = serializedHints.join('|');
    if (breadcrumbsSignatureRef.current === signature) return;
    breadcrumbsSignatureRef.current = signature;

    serializedHints.forEach((entry) => {
      if (entry.startsWith('show_banner')) {
        Sentry.addBreadcrumb({
          category: 'social',
          level: 'info',
          message: 'social:community:banner_shown',
        });
      }
      if (entry === 'show_empathic_replies') {
        Sentry.addBreadcrumb({
          category: 'social',
          level: 'info',
          message: 'social:replies_shown',
        });
      }
    });
  }, [serializedHints]);

  const cardMotionClass = prefersReducedMotion ? 'transition-none' : 'transition-transform duration-150 ease-out hover:-translate-y-1';

  const handleBannerAccept = () => {
    Sentry.addBreadcrumb({
      category: 'social',
      level: 'info',
      message: 'social:community:banner_accepted',
    });
    setBannerOpen(false);
    setBannerDismissed(true);
  };

  const handleBannerLater = () => {
    Sentry.addBreadcrumb({
      category: 'social',
      level: 'info',
      message: 'social:community:banner_later',
    });
    setBannerOpen(false);
    setBannerDismissed(true);
  };

  if (!consented) {
    return (
      <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16 text-emerald-950">
          <header className="space-y-4">
            <h1 className="text-3xl font-semibold">Communauté en douceur</h1>
            <p className="text-base text-emerald-800">
              Tu peux explorer les espaces partagés sans activer la collecte clinique. Quand tu seras prêt·e, tu pourras accepter l’accompagnement plus structuré.
            </p>
          </header>
          <div className="space-y-4">
            <Card className="border-emerald-100 bg-white/80">
              <CardHeader>
                <CardTitle>Partager un moment</CardTitle>
                <CardDescription className="text-emerald-700">
                  Retrouve un cocon de conversation, même sans indicateur clinique. Les échanges restent libres et non mesurés.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="bg-emerald-900 text-emerald-50 hover:bg-emerald-800">
                  <Link href="/app/social-cocon">Rejoindre le Social Cocon</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </ZeroNumberBoundary>
    );
  }

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 text-emerald-950">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-emerald-600">Communauté apaisée</p>
          <h1 className="text-3xl font-semibold leading-tight">Trouver un soutien sans chiffres</h1>
          <p className="max-w-2xl text-base text-emerald-800">
            Cette page adapte les propositions selon ton ressenti récent. Tout reste textuel et doux, aucune donnée chiffrée n’est affichée.
          </p>
        </header>

        {bannerOpen && (
          <ListenTwoMinutesBanner open={bannerOpen} onAccept={handleBannerAccept} onLater={handleBannerLater} />
        )}

        {showReplies && <EmpathicRepliesPanel />}

        <section aria-label="Espaces suggérés" className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className={`border-emerald-100 bg-white/80 shadow-sm ${cardMotionClass}`}>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-900">{card.title}</CardTitle>
                <CardDescription className="text-sm text-emerald-700">{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-emerald-900 text-emerald-50 hover:bg-emerald-800">
                  <Link href={card.href}>{card.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </ZeroNumberBoundary>
  );
}
