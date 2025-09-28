'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { aurasOrchestrator } from '@/features/orchestration/auras.orchestrator';
import type { AuraKey } from '@/features/orchestration/types';
import { createSession } from '@/services/sessions/sessionsApi';

const auraPalette: Record<
  AuraKey,
  {
    title: string;
    description: string;
    halo: string;
    gradient: string;
    suggestions: string[];
    affirmation: string;
    ambience: string;
  }
> = {
  cool_gentle: {
    title: 'Halo brise marine',
    description:
      'Ton aura est douce et cherche un entourage apaisant. On ralentit, on écoute en silence et on invite une présence discrète.',
    halo: 'from-sky-200/60 via-sky-100/40 to-transparent',
    gradient: 'from-sky-50 via-white to-indigo-50',
    suggestions: [
      'Ouvrir un salon confidentiel pour un temps d’écoute sans commentaire.',
      'Proposer un souffle guidé avec une personne de confiance en mode très doux.',
      'Activer une notification pause connexion pour rappeler un moment partagé.',
    ],
    affirmation: '« Je peux me laisser porter, la communauté veille sur moi. »',
    ambience: 'Ambiance conseillée : bruits d’eau, murmures rassurants et lumière tamisée.',
  },
  neutral: {
    title: 'Halo équilibre nuage',
    description:
      'Ton aura reste stable et ouverte. On peut explorer des liens subtils, proposer de petits jeux d’empathie ou de gratitude.',
    halo: 'from-violet-200/60 via-violet-100/40 to-transparent',
    gradient: 'from-violet-50 via-white to-rose-50',
    suggestions: [
      'Inviter quelqu’un à un cercle de gratitude sans attente de réponse immédiate.',
      'Partager un message collectif merci d’être là dans le fil communautaire.',
      'Programmer un rituel hebdomadaire de check-in vocal très court.',
    ],
    affirmation: '« Ma simple présence nourrit déjà la douceur du groupe. »',
    ambience: 'Ambiance conseillée : nappes aériennes, clochettes et respiration partagée.',
  },
  warm_soft: {
    title: 'Halo soleil coton',
    description:
      'Ton aura rayonne vers les autres. C’est le moment d’envoyer une chaleur collective, de célébrer les progrès et d’encourager les partages sensibles.',
    halo: 'from-amber-200/60 via-amber-100/40 to-transparent',
    gradient: 'from-amber-50 via-rose-50 to-white',
    suggestions: [
      'Organiser une bulle merci pour célébrer un geste attentionné de la communauté.',
      'Envoyer une carte vocale lumineuse à une personne plus discrète.',
      'Proposer un rituel d’ancrage en duo : visualiser un souvenir heureux et le raconter.',
    ],
    affirmation: '« Ma chaleur inspire et reste accueillante pour toutes les sensibilités. »',
    ambience: 'Ambiance conseillée : textures chaleureuses, voix enjouées et fond musical solaire.',
  },
};

const haloMotion = {
  initial: { opacity: 0.85, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: 'easeInOut' } },
} as const;

export default function LeaderboardPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('WHO5');
  const { data: history } = useAssessmentHistory('WHO5', {
    limit: 1,
    enabled: assessment.isEligible,
  });

  const [auraKey, setAuraKey] = useState<AuraKey>('neutral');
  const lastPersistedAura = useRef<AuraKey | null>(null);

  const whoLevel = useMemo(() => {
    if (typeof assessment.state.lastComputation?.level === 'number') {
      return assessment.state.lastComputation.level;
    }
    if (history && history.length > 0) {
      return history[0].level;
    }
    return null;
  }, [assessment.state.lastComputation?.level, history]);

  useEffect(() => {
    if (!flags.FF_ORCH_AURAS || !flags.FF_ASSESS_WHO5) {
      return;
    }
    if (!assessment.isEligible) {
      return;
    }

    const hints = aurasOrchestrator({
      who5Level: typeof whoLevel === 'number' ? whoLevel : undefined,
    });
    const auraAction = hints.find((hint) => hint.action === 'set_aura');
    const resolvedAura = auraAction && 'key' in auraAction ? auraAction.key : 'neutral';

    setAuraKey(resolvedAura);

    Sentry.addBreadcrumb({
      category: 'orch',
      message: 'orch:auras:set',
      level: 'info',
      data: { aura: resolvedAura },
    });

    if (lastPersistedAura.current === resolvedAura) {
      return;
    }

    lastPersistedAura.current = resolvedAura;
    void createSession({
      type: 'auras',
      duration_sec: 0,
      meta: { module: 'auras', aura: resolvedAura },
    }).catch((error) => {
      Sentry.captureException(error);
    });
  }, [assessment.isEligible, flags.FF_ASSESS_WHO5, flags.FF_ORCH_AURAS, whoLevel]);

  const prefersReducedMotion = useReducedMotion();
  const aura = auraPalette[auraKey];
  const orchestratorEnabled = flags.FF_ORCH_AURAS && flags.FF_ASSESS_WHO5;

  const consentFallback = (
    <main className="px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Auras partagées</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Halo collectif sans chiffres</h1>
          <p className="text-base text-muted-foreground">
            Active le consentement doux pour que l’aura s’adapte automatiquement, sans afficher de niveaux.
          </p>
        </header>

        <Card role="region" aria-label="Consentement Auras">
          <CardHeader>
            <CardTitle>Activer les Auras</CardTitle>
            <CardDescription>
              Le consentement clinique déclenche la synchronisation du halo partagé, sans révéler de score.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );

  const pageContent = (
    <main className="px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Auras partagées</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Halo collectif sans chiffres</h1>
          <p className="text-base text-muted-foreground">
            Chaque aura diffuse un climat relationnel différent. Les signaux cliniques restent invisibles, tout est traduit en guidance humaine.
          </p>
        </header>

        {!orchestratorEnabled && (
          <Card role="region" aria-label="Activation de l’orchestration Auras">
            <CardHeader>
              <CardTitle>Orchestration indisponible</CardTitle>
              <CardDescription>
                Cette expérience nécessite l’activation des Auras et du suivi WHO bien-être. Vérifie les fonctionnalités disponibles côté produit.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {orchestratorEnabled && !assessment.isEligible && (
          <Card role="region" aria-label="Activation du suivi WHO bien-être">
            <CardHeader>
              <CardTitle>Activer le suivi bien-être</CardTitle>
              <CardDescription>
                Lorsque tu autorises l’évaluation WHO bien-être, l’aura adopte des teintes adaptées sans jamais afficher de chiffres.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {orchestratorEnabled && assessment.isEligible && (
          <Card role="region" aria-live="polite">
            <CardHeader>
              <CardTitle>{aura.title}</CardTitle>
              <CardDescription>{aura.description}</CardDescription>
            </CardHeader>
            <CardContent className="relative overflow-hidden rounded-2xl bg-white/70 p-6 shadow-sm">
              <motion.div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${aura.halo}`}
                initial={prefersReducedMotion ? false : haloMotion.initial}
                animate={prefersReducedMotion ? undefined : haloMotion.animate}
              />
              <div className="relative space-y-6">
                <section className="space-y-2">
                  <h2 className="text-base font-semibold text-foreground">Inspiration du moment</h2>
                  <p className="text-sm text-muted-foreground">{aura.ambience}</p>
                  <p className="text-sm text-muted-foreground">{aura.affirmation}</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">Micro-actions suggérées</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {aura.suggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );

  return (
    <ZeroNumberBoundary className={`min-h-screen bg-gradient-to-b ${aura.gradient}`}>
      <ConsentGate fallback={consentFallback}>{pageContent}</ConsentGate>
    </ZeroNumberBoundary>
  );
}
