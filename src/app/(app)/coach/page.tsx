'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useFlags } from '@/core/flags';
import { ConsentProvider, useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useAssessment } from '@/features/assess/useAssessment';
import { MicroCard } from '@/features/coach/components/MicroCard';
import { generateCoachReply, type CoachReplyMode } from '@/features/coach/engine/coachLLM';
import { computeCoachActions } from '@/features/orchestration/coach.orchestrator';
import ZeroNumberBoundary from '@/lib/ui/ZeroNumberBoundary';
import { createSession } from '@/services/sessions/sessionsApi';
import { cn } from '@/lib/utils';

type ThreadMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type SuggestionKey = 'breath_1min' | 'walk_2min' | 'note_thought' | 'nyvee' | 'none';

type MicrocardKey = 'defusion_observe' | 'label_thought' | 'ground_body';

const MICROCARD_LIBRARY: Record<MicrocardKey, { title: string; description: string; hint: string }> = {
  defusion_observe: {
    title: 'Observer la pensée',
    description: 'Regarde la pensée, puis souffle.',
    hint: 'defusion',
  },
  label_thought: {
    title: 'Nommer la pensée',
    description: 'Dis : « je remarque cette pensée ».',
    hint: 'defusion',
  },
  ground_body: {
    title: 'Ancrage corporel',
    description: 'Contact sol, épaules, souffle lent.',
    hint: 'ancrage',
  },
};

const SUGGESTION_LIBRARY: Record<SuggestionKey, { label: string; description: string; href?: string }> = {
  breath_1min: {
    label: 'Respirer une minute ?',
    description: 'Une minute d’ancrage respiratoire pour adoucir la tension.',
    href: '/app/breath',
  },
  walk_2min: {
    label: 'Marcher deux minutes ?',
    description: 'Quelques pas lents pour délier le corps et relâcher l’esprit.',
  },
  note_thought: {
    label: 'Noter cette pensée ?',
    description: 'Écris deux phrases sur ce que tu ressens et ce qui compte pour toi.',
    href: '/app/journal',
  },
  nyvee: {
    label: 'Ouvrir Nyvée ?',
    description: 'Nyvée propose un accompagnement apaisant si la tension reste forte.',
    href: '/app/nyvee',
  },
  none: {
    label: '',
    description: '',
  },
};

const SCALE_LABELS = [
  'Jamais vrai',
  'Très rarement vrai',
  'Plutôt rarement vrai',
  'Parfois vrai',
  'Souvent vrai',
  'Très souvent vrai',
  'Toujours vrai',
];

const sanitizeDisplay = (value: string) => value.replace(/[0-9]+/g, '').replace(/\s{2,}/g, ' ').trim();

const randomId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const createMessage = (role: ThreadMessage['role'], content: string): ThreadMessage => ({
  id: `${role}-${randomId()}`,
  role,
  content,
});

const clampLevel = (value: number | null | undefined): 0 | 1 | 2 | 3 | 4 => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 2;
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as 0 | 1 | 2 | 3 | 4;
};

function CoachPageInner() {
  const { flags } = useFlags();
  const consent = useConsent();
  const assessment = useAssessment('AAQ2');
  const [mode, setMode] = useState<CoachReplyMode>('brief');
  const [queuedMicrocards, setQueuedMicrocards] = useState<MicrocardKey[]>([]);
  const [suggestion, setSuggestion] = useState<SuggestionKey>('none');
  const [contextHints, setContextHints] = useState<string[]>(['presence']);
  const [messages, setMessages] = useState<ThreadMessage[]>([
    createMessage('assistant', 'Bonjour, je t’écoute doucement.'),
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [microFeedback, setMicroFeedback] = useState<string | null>(null);
  const [microcardsUsed, setMicrocardsUsed] = useState<MicrocardKey[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [securityRedirect, setSecurityRedirect] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const flagsEnabled = {
    orchestration: flags.FF_ORCH_COACH !== false,
    aaq: flags.FF_ASSESS_AAQ2 !== false,
    zeroNumber: flags.FF_ZERO_NUMBERS !== false,
  };

  const aaqLevel = useMemo(() => clampLevel(assessment.lastLevel ?? assessment.state.lastLevel ?? 2), [
    assessment.lastLevel,
    assessment.state.lastLevel,
  ]);

  const actions = useMemo(() => {
    if (!flagsEnabled.orchestration) {
      return [
        { action: 'set_tone', key: 'soft' } as const,
        { action: 'llm_guardrails', enabled: true } as const,
        { action: 'set_response_mode', key: 'brief' } as const,
        { action: 'queue_microcards', keys: [] } as const,
        { action: 'suggest_next', key: 'walk_2min' } as const,
      ];
    }
    return computeCoachActions({ aaqLevel });
  }, [aaqLevel, flagsEnabled.orchestration]);

  useEffect(() => {
    if (consent.clinicalAccepted) {
      setConsentChecked(false);
    }
  }, [consent.clinicalAccepted]);

  useEffect(() => {
    const nextMode = actions.find((act) => act.action === 'set_response_mode');
    if (nextMode && 'key' in nextMode) {
      setMode(nextMode.key);
      Sentry.addBreadcrumb({
        category: 'coach',
        message: 'coach:mode',
        level: 'info',
        data: { mode: nextMode.key },
      });
    }

    const queueAction = actions.find((act) => act.action === 'queue_microcards');
    const nextQueue = queueAction && 'keys' in queueAction
      ? queueAction.keys.filter((key): key is MicrocardKey => Boolean(key && MICROCARD_LIBRARY[key as MicrocardKey]))
      : [];
    setQueuedMicrocards(nextQueue);

    const suggestionAction = actions.find((act) => act.action === 'suggest_next');
    const nextSuggestion = suggestionAction && 'key' in suggestionAction ? (suggestionAction.key as SuggestionKey) : 'none';
    setSuggestion(nextSuggestion);

    const hints = new Set<string>();
    if (aaqLevel >= 3) {
      hints.add('defusion');
      hints.add('ancrage');
    }
    if (aaqLevel <= 1) {
      hints.add('valeurs');
    }
    nextQueue.forEach((key) => {
      const detail = MICROCARD_LIBRARY[key];
      if (detail?.hint) {
        hints.add(detail.hint);
      }
    });
    if (nextSuggestion === 'note_thought') {
      hints.add('valeurs');
    }
    setContextHints(hints.size ? Array.from(hints) : ['presence']);
  }, [actions, aaqLevel]);

  useEffect(() => {
    if (flagsEnabled.aaq && !assessment.state.stage && !assessment.state.summary) {
      Sentry.addBreadcrumb({
        category: 'assess',
        message: 'assess:aaq2:due',
        level: 'info',
      });
    }
  }, [assessment.state.stage, assessment.state.summary, flagsEnabled.aaq]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim() || isSending) {
        return;
      }

      const userMessage = sanitizeDisplay(input.trim());
      setInput('');
      setMessages((prev) => [...prev, createMessage('user', userMessage)]);
      Sentry.addBreadcrumb({
        category: 'coach',
        message: 'coach:msg:user',
        level: 'info',
        data: { length: userMessage.length },
      });

      setIsSending(true);
      try {
        const reply = await generateCoachReply(userMessage, mode, contextHints);
        const safeReply = sanitizeDisplay(reply);
        setMessages((prev) => [...prev, createMessage('assistant', safeReply)]);
        Sentry.addBreadcrumb({
          category: 'coach',
          message: 'coach:msg:assistant',
          level: 'info',
          data: { mode },
        });

        if (safeReply.includes('Parlons sécurité')) {
          setSecurityRedirect(true);
        } else {
          setSecurityRedirect(false);
        }

        try {
          await createSession({
            type: 'coach',
            duration_sec: 60,
            meta: {
              module: 'coach',
              mode,
              microcards_used: microcardsUsed,
              next_suggestion: suggestion,
            },
          });
        } catch (storageError) {
          console.warn('[coach] unable to persist session', storageError);
        }
      } catch (error) {
        console.error('[coach] unable to generate reply', error);
        setMessages((prev) => [
          ...prev,
          createMessage('assistant', 'Je rencontre un souci technique. Retentons dans un instant.'),
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [contextHints, input, isSending, microcardsUsed, mode, suggestion],
  );

  const handleMicrocard = useCallback(
    (key: MicrocardKey) => {
      const detail = MICROCARD_LIBRARY[key];
      if (!detail) return;

      setMicroFeedback(detail.description);
      setMicrocardsUsed((prev) => (prev.includes(key) ? prev : [...prev, key]));
      Sentry.addBreadcrumb({
        category: 'coach',
        message: 'coach:microcard',
        level: 'info',
        data: { key },
      });
    },
    [],
  );

  const startAssessment = useCallback(async () => {
    setShowAssessment(true);
    try {
      await assessment.start('pre');
    } catch (error) {
      console.error('[coach] AAQ start failed', error);
    }
  }, [assessment]);

  const submitAssessment = useCallback(async () => {
    if (!assessment.state.catalog) return;
    const payload: Record<string, number> = {};
    for (const item of assessment.state.catalog.items) {
      if (assessmentAnswers[item.id] == null) {
        return;
      }
      payload[item.id] = assessmentAnswers[item.id];
    }

    try {
      await assessment.submit('pre', payload);
      setShowAssessment(false);
      setAssessmentAnswers({});
    } catch (error) {
      console.error('[coach] AAQ submit failed', error);
    }
  }, [assessment, assessment.state.catalog, assessmentAnswers]);

  const allAnswered = useMemo(() => {
    if (!assessment.state.catalog) return false;
    return assessment.state.catalog.items.every((item) => typeof assessmentAnswers[item.id] === 'number');
  }, [assessment.state.catalog, assessmentAnswers]);

  const consentOverlay = !consent.clinicalAccepted && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl outline-none">
        <h2 className="text-xl font-semibold text-slate-900">Coach IA</h2>
        <p className="mt-3 text-sm text-slate-700">
          Le coach propose des pistes douces et ne remplace pas une aide médicale. En cas d’urgence, contacte le 112 ou une personne de confiance.
        </p>
        <p className="mt-3 text-sm text-slate-700">
          En continuant, tu confirmes avoir lu notre charte Confidentialité &amp; Aide et tu acceptes l’anonymisation de tes échanges.
        </p>
        <label className="mt-6 flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={consentChecked}
            onChange={(event) => setConsentChecked(event.target.checked)}
            aria-label="Accepter les conditions d’utilisation"
          />
          <span>Je comprends et j’accepte ces conditions.</span>
        </label>
        <Button
          type="button"
          className="mt-6 w-full"
          onClick={() => {
            if (consentChecked) {
              consent.setClinicalAccepted(true);
            }
          }}
          disabled={!consentChecked}
        >
          Commencer la conversation
        </Button>
      </div>
    </div>
  );

  const suggestionDetail = SUGGESTION_LIBRARY[suggestion];
  const microcardList = queuedMicrocards.map((key) => ({ key, ...MICROCARD_LIBRARY[key] }));

  const content = (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-indigo-950">Coach IA EmotionsCare</h1>
        <p className="text-sm text-indigo-900/80">
          Partage ton ressenti. Le coach adapte ses réponses à ton niveau de souplesse psychologique sans jamais afficher de chiffres.
        </p>
      </header>

      <section className="space-y-4" aria-label="Fil de discussion du coach IA">
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <ul className="flex flex-col gap-4" aria-live="polite">
            {messages.map((message) => (
              <li
                key={message.id}
                className={cn('flex w-full', message.role === 'assistant' ? 'justify-start' : 'justify-end')}
              >
                <span
                  className={cn(
                    'max-w-[85%] rounded-xl px-4 py-2 text-sm leading-relaxed text-indigo-950',
                    message.role === 'assistant'
                      ? 'bg-indigo-50'
                      : 'bg-indigo-600 text-indigo-50',
                  )}
                >
                  {message.content}
                </span>
              </li>
            ))}
          </ul>
          {securityRedirect && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
              Besoin de soutien immédiat ? Tu peux ouvrir Nyvée ou contacter une aide d’urgence.
            </div>
          )}
          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <Label htmlFor="coach-input" className="text-sm font-medium text-indigo-900">
              Ton message pour le coach
            </Label>
            <Textarea
              id="coach-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Décris ce que tu traverses en ce moment."
              className="min-h-[120px] resize-y"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-indigo-800/80">Mode de réponse : {mode === 'micro' ? 'ultra bref' : 'bref'}</span>
              <Button type="submit" disabled={isSending}>
                {isSending ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </form>
        </div>
        {microFeedback && (
          <p aria-live="polite" className="text-sm text-indigo-900/80">
            {microFeedback}
          </p>
        )}
      </section>

      {microcardList.length > 0 && (
        <section className="space-y-3" aria-label="Micro-cartes de défusion">
          <h2 className="text-lg font-semibold text-indigo-950">Micro-cartes proposées</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {microcardList.map((item) => (
              <MicroCard
                key={item.key}
                title={item.title}
                description={item.description}
                onClick={() => handleMicrocard(item.key as MicrocardKey)}
              />
            ))}
          </div>
        </section>
      )}

      {suggestionDetail?.label && (
        <section aria-label="Prochain geste suggéré" className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-indigo-950">Prochain geste</h2>
          <p className="mt-2 text-sm text-indigo-900/80">{suggestionDetail.description}</p>
          {suggestionDetail.href ? (
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link href={suggestionDetail.href}>{suggestionDetail.label}</Link>
            </Button>
          ) : (
            <Button className="mt-4 w-full sm:w-auto" onClick={() => setMicroFeedback(suggestionDetail.description)}>
              {suggestionDetail.label}
            </Button>
          )}
        </section>
      )}

      {flagsEnabled.aaq && (
        <section aria-label="Échelle de flexibilité AAQ-II" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Souplesse psychologique</CardTitle>
              <CardDescription>
                Ce mini-check-in reste confidentiel et dure moins de deux minutes. Aucun score chiffré ne s’affiche.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showAssessment && !assessment.state.catalog && (
                <Button variant="outline" onClick={startAssessment} className="w-full sm:w-auto">
                  Démarrer le check-in AAQ-II
                </Button>
              )}

              {showAssessment && assessment.state.catalog && (
                <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
                  {assessment.state.catalog.items.map((item, index) => (
                    <div key={item.id} className="space-y-3">
                      <p className="text-sm font-medium text-indigo-950">{sanitizeDisplay(item.prompt)}</p>
                      <RadioGroup
                        value={assessmentAnswers[item.id]?.toString() ?? ''}
                        onValueChange={(value) =>
                          setAssessmentAnswers((prev) => ({ ...prev, [item.id]: Number.parseInt(value, 10) }))
                        }
                        className="grid gap-2 md:grid-cols-2"
                      >
                        {(item.options ?? []).map((option, optionIndex) => {
                          const value = Number.parseInt(option, 10);
                          const label = SCALE_LABELS[optionIndex] ?? `Option ${optionIndex + 1}`;
                          return (
                            <Label
                              key={`${item.id}-${option}`}
                              className={cn(
                                'flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm text-indigo-900 shadow-sm',
                                assessmentAnswers[item.id] === value && 'border-indigo-300 bg-indigo-50',
                              )}
                            >
                              <RadioGroupItem value={value.toString()} className="h-4 w-4" />
                              <span>{label}</span>
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAssessment(false);
                        setAssessmentAnswers({});
                      }}
                    >
                      Annuler
                    </Button>
                    <Button type="button" disabled={!allAnswered || assessment.state.isSubmitting} onClick={submitAssessment}>
                      {assessment.state.isSubmitting ? 'Envoi...' : 'Valider'}
                    </Button>
                  </div>
                </form>
              )}

              {assessment.state.summary && !showAssessment && (
                <p className="text-sm text-indigo-900/80">
                  {assessment.state.summary}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  );

  return (
    <ZeroNumberBoundary as="div" className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      {content}
      {consentOverlay}
    </ZeroNumberBoundary>
  );
}

export default function CoachPage() {
  return (
    <ConsentProvider defaultAccepted={false}>
      <CoachPageInner />
    </ConsentProvider>
  );
}
