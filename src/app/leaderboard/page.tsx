'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { createSession } from '@/services/sessions/sessionsApi';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { aurasOrchestrator } from '@/features/orchestration/auras.orchestrator';
import type { UIHint } from '@/features/orchestration/types';

const haloCopy = {
  cool_gentle: {
    title: 'Halo brise marine',
    description:
      'Ton rayonnement appelle le calme et les présences douces. On ralentit, on invite une écoute discrète et on laisse le groupe entourer.',
    ambiance: 'Ambiance conseillée : textures brumeuses, murmures rassurants et souffle lent.',
    gestures: [
      'Ouvrir un salon confidentiel pour un temps de partage sans retour immédiat.',
      'Proposer une respiration guidée très douce en duo.',
      'Programmer un rappel “pause connexion” pour encourager un moment partagé.',
    ],
  },
  neutral: {
    title: 'Halo équilibre nuage',
    description:
      'Tu rayonnes avec constance. On peut explorer des liens subtils et inviter des rituels de gratitude sans pression.',
    ambiance: 'Ambiance conseillée : nappes aériennes, clochettes légères et voix chaleureuses.',
    gestures: [
      'Inviter à un cercle de gratitude sans attente de réponse.',
      'Partager un mot collectif “merci d’être là” dans le fil communautaire.',
      'Imaginer un rituel de check-in vocal tout en douceur.',
    ],
  },
  warm_soft: {
    title: 'Halo soleil coton',
    description:
      'La chaleur est palpable. C’est le moment de célébrer les avancées et d’encourager les partages sensibles.',
    ambiance: 'Ambiance conseillée : textures lumineuses, voix enveloppantes et rythmes souples.',
    gestures: [
      'Organiser une bulle gratitude pour mettre en lumière un geste attentionné.',
      'Envoyer une carte vocale rayonnante à une personne plus discrète.',
      'Co-créer un rituel d’ancrage en duo autour d’un souvenir apaisant.',
    ],
  },
} as const;

const auraToGradient: Record<keyof typeof haloCopy, string> = {
  cool_gentle: 'from-sky-200/60 via-sky-100 to-indigo-100',
  neutral: 'from-violet-200/60 via-violet-100 to-rose-100',
  warm_soft: 'from-amber-200/60 via-rose-100 to-amber-50',
};

type AuraKey = keyof typeof haloCopy;

const resolveAuraKey = (hints: UIHint[]): AuraKey => {
  const auraHint = hints.find((hint) => hint.action === 'set_aura');
  if (auraHint && 'key' in auraHint) {
    return auraHint.key as AuraKey;
  }
  return 'neutral';
};

export default function LeaderboardPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('WHO5');
  const { data: history } = useAssessmentHistory('WHO5', {
    limit: 1,
    enabled: assessment.isEligible,
  });
  const { prefersReducedMotion } = useMotionPrefs();

  const [auraKey, setAuraKey] = useState<AuraKey>('neutral');
  const persistedAuraRef = useRef<AuraKey | null>(null);

  const latestLevel = useMemo(() => {
    if (typeof assessment.state.lastComputation?.level === 'number') {
      return assessment.state.lastComputation.level;
    }
    if (history && history.length > 0 && typeof history[0]?.level === 'number') {
      return history[0].level;
    }
    return undefined;
  }, [assessment.state.lastComputation?.level, history]);

  useEffect(() => {
    if (!flags.FF_ORCH_AURAS || !flags.FF_ASSESS_WHO5) {
      return;
    }
    if (!assessment.isEligible) {
      return;
    }

    const hints = aurasOrchestrator({ who5Level: latestLevel });
    const key = resolveAuraKey(hints);
    setAuraKey(key);

    Sentry.addBreadcrumb({
      category: 'orch',
      message: 'orch:auras:set',
      level: 'info',
      data: { aura: key },
    });

    if (persistedAuraRef.current === key) {
      return;
    }

    persistedAuraRef.current = key;

    void createSession({
      type: 'auras',
      duration_sec: 0,
      meta: { module: 'auras', aura: key },
    }).catch((error) => {
      Sentry.captureException(error);
    });
  }, [assessment.isEligible, flags.FF_ASSESS_WHO5, flags.FF_ORCH_AURAS, latestLevel]);

  const aura = haloCopy[auraKey];
  const haloGradient = auraToGradient[auraKey];
  const haloStyle = prefersReducedMotion
    ? { animation: 'none' }
    : { animation: 'pulse 8s ease-in-out infinite' };

  return (
    <ZeroNumberBoundary className="min-h-screen bg-muted/20 px-4 py-10">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Halo communautaire</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Un rayonnement sans chiffres</h1>
          <p className="text-base text-muted-foreground">
            Les halos se modulent grâce aux signaux hebdomadaires du bien-être OMS avec ton accord. Aucun rang, uniquement une ambiance bienveillante.
          </p>
        </header>

        <ConsentGate>
          <div className="space-y-6">
            {!assessment.isEligible && (
              <Card role="region" aria-live="polite">
                <CardHeader>
                  <CardTitle>Activer l’écoute hebdomadaire</CardTitle>
                  <CardDescription>
                    Autorise le bilan bien-être OMS pour que le halo reflète ton énergie du moment. Tu peux ajuster ton choix à tout instant.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {assessment.isEligible && (
              <Card role="region" aria-live="polite">
                <CardHeader>
                  <CardTitle>{aura.title}</CardTitle>
                  <CardDescription>{aura.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className={`h-24 w-24 rounded-full border border-white/40 bg-gradient-to-br ${haloGradient}`}
                      style={haloStyle}
                    />
                    <p className="text-sm text-muted-foreground">{aura.ambiance}</p>
                  </div>

                  <section className="space-y-2">
                    <h2 className="text-base font-semibold text-foreground">Gestes complices suggérés</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {aura.gestures.map((gesture) => (
                        <li key={gesture} className="rounded-lg bg-muted/40 p-3">
                          {gesture}
                        </li>
                      ))}
                    </ul>
                  </section>
                </CardContent>
              </Card>
            )}
          </div>
        </ConsentGate>
      </main>
    </ZeroNumberBoundary>
  );
}
