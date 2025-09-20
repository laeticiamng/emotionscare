import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Feather, Heart, Sparkles, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { computeAurasUIHints, serializeHints } from '@/features/orchestration';
import { createSession } from '@/services/sessions/sessionsApi';
import { cn } from '@/lib/utils';

type AuraKey = 'cool_gentle' | 'neutral' | 'warm_soft';

type AuraCopy = {
  label: string;
  description: string;
  glow: string;
  accent: string;
  microActions: string[];
  affirmations: string[];
  rituals: string[];
  ambiance: string;
};

const auraDictionary: Record<AuraKey, AuraCopy> = {
  cool_gentle: {
    label: 'Halo brise marine',
    description:
      'Ton aura est douce et demande un entourage apaisant. On ralentit, on écoute en silence et on invite une présence discrète.',
    glow: 'bg-sky-200/60',
    accent: 'text-sky-700',
    microActions: [
      'Ouvrir un salon confidentiel pour un temps d’écoute sans commentaire.',
      'Proposer un souffle guidé avec quelqu’un de confiance en mode très doux.',
      'Activer une notification “pause connexion” pour rappeler un moment partagé.',
    ],
    affirmations: [
      '« Je peux me laisser porter, la communauté veille sur moi. »',
      '« Je mérite un espace où l’on m’accueille tel que je suis. »',
    ],
    rituals: [
      'Inviter une personne à partager un souvenir rassurant en message vocal doux.',
      'Partager une playlist ambient et se synchroniser sur quelques respirations lentes.',
    ],
    ambiance: 'Ambiance conseillée : bruits d’eau, murmures rassurants et lumière tamisée.',
  },
  neutral: {
    label: 'Halo équilibre nuage',
    description:
      'Ton aura reste stable et ouverte. On peut explorer des liens subtils, proposer de petits jeux d’empathie ou de gratitude.',
    glow: 'bg-violet-200/50',
    accent: 'text-violet-700',
    microActions: [
      'Inviter quelqu’un à un cercle de gratitude sans attente de réponse immédiate.',
      'Partager un message collectif “merci d’être là” dans le fil communautaire.',
      'Programmer un rituel hebdomadaire de check-in vocal très court.',
    ],
    affirmations: [
      '« Ma simple présence nourrit déjà la douceur du groupe. »',
      '« Je peux proposer un lien sans pression et m’ajuster ensuite. »',
    ],
    rituals: [
      'Composer une visualisation guidée à plusieurs, chacun ajoute une image positive.',
      'Créer une carte postale sonore avec quelques mots chuchotés et un fond musical léger.',
    ],
    ambiance: 'Ambiance conseillée : nappes aériennes, clochettes et respiration partagée.',
  },
  warm_soft: {
    label: 'Halo soleil coton',
    description:
      'Ton aura rayonne vers les autres. C’est le moment d’envoyer une chaleur collective, de célébrer les progrès et d’encourager les partages sensibles.',
    glow: 'bg-amber-200/60',
    accent: 'text-amber-700',
    microActions: [
      'Organiser une bulle “merci” pour célébrer un geste attentionné de la communauté.',
      'Envoyer une carte vocale lumineuse à une personne plus discrète.',
      'Proposer un rituel d’ancrage en duo : visualiser un souvenir heureux et le raconter.',
    ],
    affirmations: [
      '« Ma chaleur inspire et reste accueillante pour toutes les sensibilités. »',
      '« Je peux rayonner sans me perdre, en gardant une écoute curieuse. »',
    ],
    rituals: [
      'Planifier une rencontre audio “rayon doux” pour encourager les idées audacieuses.',
      'Partager un tableau de gratitude collaboratif avec des mots lumineux.',
    ],
    ambiance: 'Ambiance conseillée : textures chaleureuses, voix enjouées et fond musical solaire.',
  },
};

const pageBackground: Record<AuraKey, string> = {
  cool_gentle: 'from-sky-50 via-white to-indigo-50',
  neutral: 'from-violet-50 via-white to-rose-50',
  warm_soft: 'from-amber-50 via-rose-50 to-white',
};

const haloRing: Record<AuraKey, string> = {
  cool_gentle: 'border-sky-200',
  neutral: 'border-violet-200',
  warm_soft: 'border-amber-200',
};

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { has } = useFlags();
  const orchestratorEnabled = has('FF_ORCH_AURAS');
  const who5Enabled = has('FF_ASSESS_WHO5');

  const whoAssessment = useAssessment('WHO5');
  const { data: whoHistory } = useAssessmentHistory('WHO5', {
    limit: 1,
    enabled: orchestratorEnabled && who5Enabled && whoAssessment.state.canDisplay,
  });

  const whoLevel = orchestratorEnabled
    ? whoHistory?.[0]?.level ?? whoAssessment.state.lastComputation?.level
    : undefined;

  const auraHints = useMemo(
    () => computeAurasUIHints({ who5Level: orchestratorEnabled ? whoLevel : undefined }),
    [orchestratorEnabled, whoLevel],
  );

  const auraKey = (auraHints.find((hint) => hint.action === 'set_aura')?.key ?? 'neutral') as AuraKey;
  const aura = auraDictionary[auraKey];

  const serializedHints = useMemo(() => serializeHints(auraHints), [auraHints]);
  const hintsSignature = useMemo(() => serializedHints.join('|'), [serializedHints]);
  const lastLoggedSignature = useRef<string | null>(null);

  useEffect(() => {
    if (!orchestratorEnabled) return;
    if (hintsSignature === lastLoggedSignature.current) return;
    lastLoggedSignature.current = hintsSignature;

    Sentry.addBreadcrumb({
      category: 'orch:auras',
      message: 'apply',
      level: 'info',
      data: { hints: serializedHints },
    });

    if (serializedHints.length === 0) {
      return;
    }

    void createSession({
      type: 'auras',
      duration_sec: 0,
      meta: { hints: serializedHints },
    }).catch((error) => {
      Sentry.captureException(error);
    });
  }, [orchestratorEnabled, serializedHints, hintsSignature]);

  const auraMotion = prefersReducedMotion
    ? { initial: { opacity: 1, scale: 1 }, animate: { opacity: 1, scale: 1 } }
    : {
        initial: { opacity: 0.8, scale: 0.96 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: 'easeInOut' } },
      };

  return (
    <ZeroNumberBoundary
      as="div"
      className={cn('min-h-screen bg-gradient-to-b', pageBackground[auraKey])}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
        <header className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Retour
          </Button>
          <div className="text-right">
            <p className={cn('text-xs uppercase tracking-wide', aura.accent)}>Orchestration sociale</p>
            <h1 className="text-2xl font-semibold text-slate-900">Auras partagées</h1>
          </div>
        </header>

        <motion.section
          initial={auraMotion.initial}
          animate={auraMotion.animate}
          className={cn(
            'relative overflow-hidden rounded-3xl border bg-white/80 p-8 shadow-sm backdrop-blur',
            haloRing[auraKey],
          )}
        >
          <div className="absolute inset-0" aria-hidden="true">
            <div className={cn('absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl', aura.glow)} />
          </div>
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 lg:max-w-xl">
              <p className={cn('text-sm font-medium', aura.accent)}>Aura actuelle</p>
              <h2 className="text-3xl font-semibold text-slate-900">{aura.label}</h2>
              <p className="text-base text-slate-700">{aura.description}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/40 blur-xl" aria-hidden="true" />
                <motion.div
                  className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/60 bg-white/70"
                  animate={prefersReducedMotion ? undefined : { rotate: [0, 6, -4, 0] }}
                  transition={prefersReducedMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart className={cn('h-10 w-10', aura.accent)} aria-hidden="true" />
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-[200px]">{aura.ambiance}</p>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-white/60 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className={cn('h-5 w-5', aura.accent)} aria-hidden="true" />
                Micro-actions à tenter
              </CardTitle>
              <CardDescription>
                Des gestes sans métriques pour nourrir l’appartenance et faire rayonner ton aura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {aura.microActions.map((action) => (
                  <li key={action} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/70 p-3 text-sm text-slate-700">
                    <Feather className={cn('mt-1 h-4 w-4 flex-shrink-0', aura.accent)} aria-hidden="true" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-white/60 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className={cn('h-5 w-5', aura.accent)} aria-hidden="true" />
                Affirmations à souffler
              </CardTitle>
              <CardDescription>
                Des phrases à répéter ou partager pour ancrer une atmosphère rassurante.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {aura.affirmations.map((affirmation) => (
                  <li key={affirmation} className="rounded-xl border border-slate-100 bg-white/80 p-3 text-sm text-slate-700">
                    {affirmation}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-white/60 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Waves className={cn('h-5 w-5', aura.accent)} aria-hidden="true" />
              Rituels à partager
            </CardTitle>
            <CardDescription>
              Des invitations collectives pour prolonger l’effet halo dans Social Cocon ou la Communauté.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-slate-700">
              {aura.rituals.map((ritual) => (
                <li key={ritual} className="rounded-xl border border-slate-100 bg-white/70 p-3">
                  {ritual}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 text-sm text-slate-600">
              <p>
                Tip : partage ton aura avec l’équipe ou un·e pair via le Social Cocon. Mentionne simplement la couleur ressentie et l’envie associée, sans chiffre ni classement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ZeroNumberBoundary>
  );
};

export default LeaderboardPage;
