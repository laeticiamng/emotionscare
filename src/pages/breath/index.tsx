"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import { PageHeader, Button } from '@/COMPONENTS.reg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { useToast } from '@/hooks/useToast';
import { useSessionClock } from '@/modules/breath/useSessionClock';
import { makeProtocol, getTotalDuration, type ProtocolPreset, type Step } from '@/modules/breath/protocols';
import { BreathCircle } from '@/modules/breath/components/BreathCircle';
import { BreathProgress } from '@/modules/breath/components/BreathProgress';
import { logAndJournal } from '@/modules/breath/logging';
import { computeMoodDelta, sanitizeMoodScore } from '@/modules/breath/mood';
import { useSound } from '@/COMPONENTS.reg';
import { useFlags } from '@/core/flags';
import { supabase } from '@/integrations/supabase/client';

const STEP_LABELS: Record<Step['kind'], string> = {
  in: 'Inspire',
  hold: 'Retiens',
  out: 'Expire',
};

const STEP_HINTS: Record<Step['kind'], string> = {
  in: 'Remplis les poumons en douceur, épaules relâchées.',
  hold: 'Garde l’air sans crispation et relâche les épaules.',
  out: 'Relâche progressivement l’air jusqu’au bout.',
};

const COHERENCE_VARIANTS = [
  { id: '5-5', label: 'In 5 s / Out 5 s', overrides: undefined },
  { id: '45-55', label: 'In 4,5 s / Out 5,5 s', overrides: { inMs: 4_500, outMs: 5_500 } },
] as const;

type CoherenceVariantId = (typeof COHERENCE_VARIANTS)[number]['id'];

type AssessmentItem = { id: string; text: string; scale?: string[] };

type AssessmentStatus = 'idle' | 'loading' | 'ready' | 'error' | 'submitted';

type StaiPhase = 'before' | 'after';

const FALLBACK_STAI_ITEMS: AssessmentItem[] = [
  { id: 's1', text: 'Je me sens calme.' },
  { id: 's2', text: 'Je me sens en sécurité.' },
  { id: 's3', text: 'Je me sens tendu(e).' },
  { id: 's4', text: 'Je me sens à l’aise.' },
  { id: 's5', text: 'Je me sens inquiet/inquiète.' },
  { id: 's6', text: 'Je me sens détendu(e).' },
];

const STAI_SCALE = [
  { value: '1', label: 'Jamais' },
  { value: '2', label: 'Parfois' },
  { value: '3', label: 'Souvent' },
  { value: '4', label: 'Toujours' },
] as const;

const clampMinutes = (value: number): number => {
  if (!Number.isFinite(value)) return 5;
  return Math.min(10, Math.max(3, Math.round(value)));
};

const formatMs = (value: number): string => {
  const safe = Math.max(0, Math.round(value / 1000));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const buildJournalText = ({
  protocol,
  minutes,
  durationSec,
  moodBefore,
  moodAfter,
  moodDelta,
  notes,
  audioCues,
  visualGuide,
  reduced,
  coherenceVariant,
}: {
  protocol: ProtocolPreset;
  minutes: number;
  durationSec: number;
  moodBefore: number | null;
  moodAfter: number | null;
  moodDelta: number | null;
  notes: string;
  audioCues: boolean;
  visualGuide: boolean;
  reduced: boolean;
  coherenceVariant: CoherenceVariantId;
}): string => {
  const lines = [
    `🧘 Session de respiration guidée`,
    `Protocole : ${protocol === '478' ? '4-7-8 sommeil' : coherenceVariant === '45-55' ? 'Cohérence 4,5/5,5' : 'Cohérence cardiaque 5/5'}`,
    `Durée choisie : ${minutes} min`,
    `Durée effectuée : ${durationSec} s`,
    `Guidances : ${[
      visualGuide && !reduced ? 'visuelle' : null,
      audioCues ? 'audio douce' : null,
      reduced ? 'mode motion-safe' : null,
    ]
      .filter(Boolean)
      .join(', ') || 'texte seule'}`,
  ];

  if (moodBefore !== null || moodAfter !== null) {
    lines.push('', 'Suivi ressenti :');
    if (moodBefore !== null) {
      lines.push(`• Avant séance : ${moodBefore}/100`);
    }
    if (moodAfter !== null) {
      lines.push(`• Après séance : ${moodAfter}/100`);
    }
    if (moodDelta !== null) {
      const sign = moodDelta > 0 ? '+' : '';
      lines.push(`• Delta perçu : ${sign}${moodDelta}`);
    }
  }

  if (notes.trim()) {
    lines.push('', notes.trim());
  }

  lines.push('', 'Respiration enregistrée automatiquement par EmotionsCare.');

  return lines.join('\n');
};

const toSeconds = (ms: number): number => Math.max(1, Math.round(ms / 1000));

export default function BreathPage() {
  const { prefersReducedMotion } = useMotionPrefs();
  const { toast } = useToast();
  const { flags } = useFlags();

  const [protocol, setProtocol] = useState<ProtocolPreset>('478');
  const [minutes, setMinutes] = useState(5);
  const [coherenceVariant, setCoherenceVariant] = useState<CoherenceVariantId>('5-5');
  const [audioCues, setAudioCues] = useState(false);
  const [visualGuide, setVisualGuide] = useState(true);
  const [notes, setNotes] = useState('');
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string>('');
  const [staiOptIn, setStaiOptIn] = useState(false);
  const [staiItems, setStaiItems] = useState<AssessmentItem[]>([]);
  const [staiStatus, setStaiStatus] = useState<AssessmentStatus>('idle');
  const [staiBeforeResponses, setStaiBeforeResponses] = useState<Record<string, string>>({});
  const [staiAfterResponses, setStaiAfterResponses] = useState<Record<string, string>>({});
  const [staiSubmissionStatus, setStaiSubmissionStatus] = useState<{ before: AssessmentStatus; after: AssessmentStatus }>({
    before: 'idle',
    after: 'idle',
  });

  const sound = useSound?.('/sounds/click.mp3', { volume: 0.4 });
  const hasCompletedRef = useRef(false);
  const sessionStartRef = useRef<Date | null>(null);
  const activeStepIndexRef = useRef(0);
  const stepOffsetsRef = useRef<number[]>([]);
  const lastAnnouncedSecondsRef = useRef<number | null>(null);

  const overrides = useMemo(() => {
    if (protocol !== 'coherence') return undefined;
    const variant = COHERENCE_VARIANTS.find(option => option.id === coherenceVariant);
    return variant?.overrides;
  }, [protocol, coherenceVariant]);

  const steps = useMemo(() => makeProtocol(protocol, { minutes, ...overrides }), [protocol, minutes, overrides]);

  const totalDurationMs = useMemo(() => getTotalDuration(steps), [steps]);
  const sessionClock = useSessionClock({ durationMs: totalDurationMs || 1, tickMs: 200 });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepElapsedMs, setStepElapsedMs] = useState(0);
  const [liveMessage, setLiveMessage] = useState('Prêt à respirer.');

  useEffect(() => {
    const offsets: number[] = [];
    let acc = 0;
    steps.forEach(step => {
      offsets.push(acc);
      acc += step.ms;
    });
    stepOffsetsRef.current = offsets;
    activeStepIndexRef.current = 0;
    setActiveStepIndex(0);
    setStepElapsedMs(0);
    lastAnnouncedSecondsRef.current = null;
  }, [steps]);

  useEffect(() => {
    if (sessionClock.state !== 'idle') {
      sessionClock.reset();
    }
  }, [totalDurationMs, sessionClock.state, sessionClock.reset]);

  useEffect(() => {
    return sessionClock.onTick(ms => {
      if (!steps.length) return;

      let index = activeStepIndexRef.current;
      const offsets = stepOffsetsRef.current;

      while (index < steps.length - 1 && ms >= (offsets[index + 1] ?? Number.POSITIVE_INFINITY)) {
        index += 1;
        activeStepIndexRef.current = index;
        setActiveStepIndex(index);
        setStepElapsedMs(0);
        lastAnnouncedSecondsRef.current = null;
        const step = steps[index];
        Sentry.addBreadcrumb({
          category: 'breath',
          level: 'info',
          message: 'breath:protocol:step',
          data: { index, kind: step.kind },
        });
        if (audioCues && sound?.play) {
          sound.play().catch(() => {});
        }
      }

      const start = offsets[index] ?? 0;
      const localElapsed = ms - start;
      setStepElapsedMs(localElapsed);

      const remainingMs = Math.max(0, (steps[index]?.ms ?? 0) - localElapsed);
      const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
      if (secondsLeft !== lastAnnouncedSecondsRef.current) {
        setLiveMessage(`${STEP_LABELS[steps[index]?.kind ?? 'in']} — ${secondsLeft} seconde${secondsLeft > 1 ? 's' : ''} restantes.`);
        lastAnnouncedSecondsRef.current = secondsLeft;
      }
    });
  }, [sessionClock, steps, audioCues, sound]);

  const phase = steps[activeStepIndex]?.kind ?? 'in';
  const phaseLabel = STEP_LABELS[phase];
  const phaseHint = STEP_HINTS[phase];
  const phaseProgress = steps[activeStepIndex]?.ms
    ? Math.min(1, Math.max(0, stepElapsedMs / steps[activeStepIndex].ms))
    : 0;

  const sessionRemaining = Math.max(0, totalDurationMs - sessionClock.elapsedMs);
  const sessionProgress = totalDurationMs > 0 ? Math.min(1, sessionClock.progress) : 0;

  const showCircle = visualGuide && !prefersReducedMotion;
  const showProgress = prefersReducedMotion || !visualGuide;

  const loadStaiCatalogue = useCallback(async () => {
    if (!flags.FF_ASSESS_STAI6) {
      setStaiItems(FALLBACK_STAI_ITEMS);
      setStaiStatus('ready');
      return;
    }

    setStaiStatus('loading');
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const response = await fetch('/assess/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ instrument: 'STAI6', locale: 'fr' }),
      });

      if (!response.ok) {
        throw new Error(`Assess start failed: ${response.status}`);
      }

      const payload = await response.json();
      const items: AssessmentItem[] = Array.isArray(payload?.items) && payload.items.length
        ? payload.items
        : FALLBACK_STAI_ITEMS;

      setStaiItems(items);
      setStaiStatus('ready');

      Sentry.addBreadcrumb({
        category: 'assess',
        level: 'info',
        message: 'assess:start',
        data: { instrument: 'STAI6', count: items.length },
      });
    } catch (error) {
      console.error('STAI-6 catalogue load failed', error);
      setStaiItems(FALLBACK_STAI_ITEMS);
      setStaiStatus('error');
    }
  }, [flags.FF_ASSESS_STAI6]);

  const submitAssessment = useCallback(async (phase: StaiPhase) => {
    const answers = phase === 'before' ? staiBeforeResponses : staiAfterResponses;
    const items = staiItems;

    if (!items.length || Object.keys(answers).length < items.length) {
      toast.warning({
        title: 'Complète les 6 réponses',
        description: 'Merci de répondre à chaque item pour enregistrer le ressenti.',
      });
      return;
    }

    const payloadAnswers = Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [key, Number.parseInt(value, 10)]),
    );

    setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'loading' }));

    try {
      if (flags.FF_ASSESS_STAI6) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const response = await fetch('/assess/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ instrument: 'STAI6', answers: payloadAnswers, ts: new Date().toISOString() }),
        });

        if (!response.ok) {
          throw new Error(`Assess submit failed: ${response.status}`);
        }

        Sentry.addBreadcrumb({
          category: 'assess',
          level: 'info',
          message: 'assess:submit',
          data: { instrument: 'STAI6', phase },
        });
      }

      setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'submitted' }));
      toast.success({
        title: phase === 'before' ? 'Check-in pré-séance enregistré' : 'Check-in post-séance enregistré',
      });
    } catch (error) {
      console.error('STAI-6 submit failed', error);
      setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'error' }));
      toast.error({ title: 'Impossible d’enregistrer les réponses STAI pour le moment.' });
    }
  }, [staiItems, staiBeforeResponses, staiAfterResponses, toast, flags.FF_ASSESS_STAI6]);

  const startSession = useCallback(() => {
    if (!steps.length) return;
    hasCompletedRef.current = false;
    sessionStartRef.current = new Date();
    setCompletionMessage('');
    Sentry.addBreadcrumb({
      category: 'breath',
      level: 'info',
      message: 'breath:protocol:start',
      data: { protocol, minutes, durationMs: totalDurationMs },
    });
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:start',
      data: { module: 'breath', protocol },
    });
    sessionClock.start();
    if (audioCues && sound?.play) {
      sound.play().catch(() => {});
    }
  }, [steps.length, protocol, minutes, totalDurationMs, sessionClock, audioCues, sound]);

  const pauseSession = useCallback(() => {
    sessionClock.pause();
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:pause',
      data: { module: 'breath' },
    });
  }, [sessionClock]);

  const resumeSession = useCallback(() => {
    sessionClock.resume();
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:resume',
      data: { module: 'breath' },
    });
  }, [sessionClock]);

  const completeSession = useCallback(() => {
    sessionClock.complete();
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'session:complete',
      data: { module: 'breath', trigger: 'manual' },
    });
  }, [sessionClock]);

  const resetSession = useCallback(() => {
    sessionClock.reset();
    hasCompletedRef.current = false;
    setCompletionMessage('');
    setStepElapsedMs(0);
    setActiveStepIndex(0);
    activeStepIndexRef.current = 0;
    sessionStartRef.current = null;
  }, [sessionClock]);

  const handleComplete = useCallback(async () => {
    const elapsed = sessionClock.elapsedMs || totalDurationMs;
    const durationSec = toSeconds(elapsed);
    const sanitizedBefore = sanitizeMoodScore(moodBefore);
    const sanitizedAfter = sanitizeMoodScore(moodAfter);
    const moodDelta = computeMoodDelta(sanitizedBefore, sanitizedAfter);

    const journalText = buildJournalText({
      protocol,
      minutes,
      durationSec,
      moodBefore: sanitizedBefore,
      moodAfter: sanitizedAfter,
      moodDelta,
      notes,
      audioCues,
      visualGuide,
      reduced: prefersReducedMotion,
      coherenceVariant,
    });

    const metadata = {
      protocol,
      minutes,
      duration_ms: totalDurationMs,
      audio_cues: audioCues,
      visual_guide: visualGuide,
      prefers_reduced_motion: prefersReducedMotion,
      coherence_variant: coherenceVariant,
      mood_before: sanitizedBefore,
      mood_after: sanitizedAfter,
      session_started_at: sessionStartRef.current?.toISOString?.() ?? null,
      stai_opt_in: staiOptIn,
    } as const;

    try {
      const result = await logAndJournal({
        type: 'breath',
        durationSec,
        moodDelta: moodDelta ?? undefined,
        journalText,
        metadata,
      });

      if (!result.errors.session) {
        toast.success({
          title: 'Session enregistrée',
          description: 'Ton historique a été mis à jour et une note a été ajoutée au journal.',
        });
        setCompletionMessage('Session enregistrée dans ton historique et ton journal.');
      } else {
        toast.warning({
          title: 'Session terminée',
          description: 'Impossible de journaliser côté Supabase. Tes notes locales sont conservées.',
        });
        setCompletionMessage("Session terminée mais la sauvegarde distante a échoué.");
      }

      if (result.errors.journal) {
        toast.warning({
          title: 'Journal indisponible',
          description: 'La note automatique n’a pas pu être enregistrée localement.',
        });
      }
    } catch (error) {
      console.error('Breath session logging failed', error);
      toast.error({ title: 'Impossible de sauvegarder la session pour le moment.' });
      setCompletionMessage('Session terminée. Sauvegarde différée en raison d’une erreur.');
    }

    Sentry.addBreadcrumb({
      category: 'breath',
      level: 'info',
      message: 'breath:protocol:complete',
      data: { protocol, durationSec, moodDelta },
    });
  }, [
    sessionClock.elapsedMs,
    totalDurationMs,
    protocol,
    minutes,
    moodBefore,
    moodAfter,
    notes,
    audioCues,
    visualGuide,
    prefersReducedMotion,
    coherenceVariant,
    staiOptIn,
    toast,
  ]);

  useEffect(() => {
    if (sessionClock.state === 'completed' && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      void handleComplete();
    }
  }, [sessionClock.state, handleComplete]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      event.preventDefault();
      if (sessionClock.state === 'idle') {
        startSession();
      } else if (sessionClock.state === 'running') {
        pauseSession();
      } else if (sessionClock.state === 'paused') {
        resumeSession();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sessionClock.state, startSession, pauseSession, resumeSession]);

  useEffect(() => {
    if (staiOptIn) {
      void loadStaiCatalogue();
    } else {
      setStaiStatus('idle');
      setStaiItems([]);
      setStaiBeforeResponses({});
      setStaiAfterResponses({});
      setStaiSubmissionStatus({ before: 'idle', after: 'idle' });
    }
  }, [staiOptIn, loadStaiCatalogue]);

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(clampMinutes(Number.parseInt(event.target.value, 10)));
  };

  const renderStaiForm = (phase: StaiPhase) => {
    if (!staiOptIn) return null;
    const responses = phase === 'before' ? staiBeforeResponses : staiAfterResponses;
    const onChange = (id: string, value: string) => {
      if (phase === 'before') {
        setStaiBeforeResponses(prev => ({ ...prev, [id]: value }));
      } else {
        setStaiAfterResponses(prev => ({ ...prev, [id]: value }));
      }
    };

    return (
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle>{phase === 'before' ? 'Check-in STAI-6 (avant séance)' : 'Check-in STAI-6 (après séance)'}</CardTitle>
          <CardDescription>
            Réponds librement aux 6 items. Aucune note affichée : les réponses servent à personnaliser tes recommandations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {staiStatus === 'loading' && <p className="text-sm text-muted-foreground">Chargement des items…</p>}
          {staiStatus === 'error' && (
            <p className="text-sm text-amber-600">
              Catalogue indisponible, affichage d’une version simplifiée.
            </p>
          )}
          {staiItems.map(item => {
            const groupId = `${phase}-${item.id}`;
            return (
              <div key={groupId} className="space-y-2 rounded-lg border border-slate-200/70 bg-white/70 p-3">
                <p id={`${groupId}-label`} className="text-sm font-medium text-slate-800">{item.text}</p>
                <RadioGroup
                  value={responses[item.id] ?? ''}
                  onValueChange={value => onChange(item.id, value)}
                  className="grid gap-2 sm:grid-cols-4"
                  aria-labelledby={`${groupId}-label`}
                >
                  {STAI_SCALE.map(option => {
                    const optionId = `${groupId}-${option.value}`;
                    return (
                      <div key={option.value} className="flex items-center space-x-2 rounded-md border border-transparent bg-slate-50/80 p-2 hover:border-slate-300">
                        <RadioGroupItem id={optionId} value={option.value} />
                        <Label htmlFor={optionId} className="text-sm font-medium text-slate-700">
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          })}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={staiSubmissionStatus[phase] === 'loading'}
              onClick={() => submitAssessment(phase)}
            >
              {staiSubmissionStatus[phase] === 'submitted'
                ? 'Réponses enregistrées'
                : staiSubmissionStatus[phase] === 'loading'
                  ? 'Enregistrement…'
                  : 'Enregistrer les réponses'}
            </Button>
            {staiSubmissionStatus[phase] === 'submitted' && (
              <span className="text-sm text-emerald-600">Merci ! Tes réponses ont été prises en compte.</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="space-y-6 p-6" aria-label="Module de respiration guidée">
      <PageHeader
        title="Respiration guidée"
        subtitle="Séance 4-7-8 ou cohérence cardiaque avec guidances douces, journalisation automatique et respect du motion-safe."
      />

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de séance</CardTitle>
            <CardDescription>
              Choisis ton protocole et personnalise les guidances. Le raccourci clavier <kbd className="rounded border px-1">Espace</kbd> permet de démarrer ou mettre en pause.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="protocol-select">Protocole respiratoire</Label>
                <select
                  id="protocol-select"
                  className="w-full rounded-md border border-slate-300 bg-white p-2"
                  value={protocol}
                  onChange={event => setProtocol(event.target.value as ProtocolPreset)}
                  disabled={sessionClock.state !== 'idle'}
                >
                  <option value="478">4-7-8 (Sommeil profond)</option>
                  <option value="coherence">Cohérence cardiaque</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes-input">Durée totale (minutes)</Label>
                <Input
                  id="minutes-input"
                  type="number"
                  min={3}
                  max={10}
                  step={1}
                  value={minutes}
                  onChange={handleMinutesChange}
                  disabled={sessionClock.state !== 'idle'}
                />
              </div>
            </div>

            {protocol === 'coherence' && (
              <div className="space-y-2">
                <Label htmlFor="coherence-variant">Variante de cohérence</Label>
                <select
                  id="coherence-variant"
                  className="w-full rounded-md border border-slate-300 bg-white p-2"
                  value={coherenceVariant}
                  onChange={event => setCoherenceVariant(event.target.value as CoherenceVariantId)}
                  disabled={sessionClock.state !== 'idle'}
                >
                  {COHERENCE_VARIANTS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <Label htmlFor="audio-toggle">Guidance audio douce</Label>
                  <p className="text-xs text-muted-foreground">Cue discret à chaque transition (désactivé par défaut).</p>
                </div>
                <Switch
                  id="audio-toggle"
                  checked={audioCues}
                  onCheckedChange={setAudioCues}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <Label htmlFor="visual-toggle">Guidance visuelle</Label>
                  <p className="text-xs text-muted-foreground">Cercle pulsé si l’animation est permise.</p>
                </div>
                <Switch
                  id="visual-toggle"
                  checked={visualGuide}
                  onCheckedChange={setVisualGuide}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Auto-évaluation avant séance</Label>
              <Slider
                value={[moodBefore ?? 50]}
                min={0}
                max={100}
                step={5}
                onValueChange={values => setMoodBefore(values[0])}
                aria-label="Niveau d’apaisement avant séance"
              />
              <p className="text-xs text-muted-foreground">Glisse pour indiquer ton niveau d’apaisement (0 = tendu, 100 = très serein).</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Session en cours</CardTitle>
            <CardDescription>
              {sessionClock.state === 'idle'
                ? 'Prêt·e à démarrer. Installe-toi confortablement.'
                : sessionClock.state === 'running'
                  ? 'Respire au rythme indiqué. Tu peux mettre en pause à tout moment.'
                  : sessionClock.state === 'paused'
                    ? 'Séance en pause. Reprends quand tu es prêt·e.'
                    : 'Séance terminée. Tu peux relancer une session ou consulter les recommandations.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500">Phase actuelle</p>
                <h2 className="text-3xl font-semibold text-slate-900">{phaseLabel}</h2>
                <p className="text-sm text-muted-foreground">{phaseHint}</p>
              </div>

              {showCircle && (
                <BreathCircle phase={phase} phaseProgress={phaseProgress} />
              )}

              {showProgress && (
                <BreathProgress
                  stepLabel={phaseLabel}
                  stepProgress={phaseProgress}
                  sessionProgress={sessionProgress}
                />
              )}

              <div className="grid gap-4 text-center sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Écoulé</p>
                  <p className="text-lg font-semibold text-slate-900">{formatMs(sessionClock.elapsedMs)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Restant</p>
                  <p className="text-lg font-semibold text-slate-900">{formatMs(sessionRemaining)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Progression</p>
                  <p className="text-lg font-semibold text-slate-900">{Math.round(sessionProgress * 100)}%</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {sessionClock.state === 'idle' && (
                <Button type="button" onClick={startSession}>
                  Démarrer la séance
                </Button>
              )}
              {sessionClock.state === 'running' && (
                <>
                  <Button type="button" variant="secondary" onClick={pauseSession}>
                    Pause
                  </Button>
                  <Button type="button" variant="outline" onClick={completeSession}>
                    Terminer
                  </Button>
                </>
              )}
              {sessionClock.state === 'paused' && (
                <>
                  <Button type="button" onClick={resumeSession}>
                    Reprendre
                  </Button>
                  <Button type="button" variant="outline" onClick={completeSession}>
                    Terminer
                  </Button>
                </>
              )}
              {sessionClock.state === 'completed' && (
                <Button type="button" onClick={resetSession}>
                  Relancer une séance
                </Button>
              )}
            </div>

            {completionMessage && (
              <p className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700" role="status">
                {completionMessage}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Notes post-séance</CardTitle>
            <CardDescription>
              Ajoute librement des détails. Elles seront incluses dans le journal automatique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Ce que tu souhaites retenir</Label>
              <Textarea
                id="notes"
                placeholder="Respiration très apaisante avant de dormir…"
                value={notes}
                onChange={event => setNotes(event.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Auto-évaluation après séance</Label>
              <Slider
                value={[moodAfter ?? (moodBefore ?? 50)]}
                min={0}
                max={100}
                step={5}
                onValueChange={values => setMoodAfter(values[0])}
                aria-label="Niveau d’apaisement après séance"
              />
              <p className="text-xs text-muted-foreground">Observe la différence entre avant et après pour suivre ton ressenti.</p>
              {(() => {
                const delta = computeMoodDelta(sanitizeMoodScore(moodBefore), sanitizeMoodScore(moodAfter));
                if (delta === null) return null;
                const sign = delta > 0 ? '+' : '';
                return (
                  <p className="text-sm font-medium text-slate-700">Delta ressenti : {sign}{delta}</p>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mesure silencieuse STAI-6</CardTitle>
            <CardDescription>
              Option pour suivre ton niveau d’anxiété état avant/après la séance. Aucun score affiché, uniquement des insights personnalisés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Activer STAI-6</p>
                <p className="text-xs text-muted-foreground">Renseigne des réponses qualitatives avant et après la séance.</p>
              </div>
              <Switch checked={staiOptIn} onCheckedChange={setStaiOptIn} />
            </div>
            {staiOptIn && renderStaiForm('before')}
            {staiOptIn && sessionClock.state === 'completed' && renderStaiForm('after')}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
