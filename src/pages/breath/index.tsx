"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
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
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

const FALLBACK_ISI_ITEMS: AssessmentItem[] = [
  { id: 'i1', text: "Difficulté d'endormissement." },
  { id: 'i2', text: 'Réveils nocturnes fréquents.' },
  { id: 'i3', text: 'Réveil précoce non désiré.' },
  { id: 'i4', text: 'Satisfaction globale du sommeil.' },
  { id: 'i5', text: 'Impact sur le quotidien (fatigue, humeur).' },
  { id: 'i6', text: 'Perception du problème de sommeil.' },
  { id: 'i7', text: 'Préoccupation vis-à-vis du sommeil.' },
];

const ISI_SCALE = [
  { value: '0', label: 'Aucun' },
  { value: '1', label: 'Léger' },
  { value: '2', label: 'Modéré' },
  { value: '3', label: 'Important' },
  { value: '4', label: 'Très important' },
] as const;

const SLEEP_REMINDER_STORAGE_KEY = 'breath:isi:status';

type ClinicalLevel = 'low' | 'moderate' | 'high';

type InsightItem = {
  id: string;
  title: string;
  description: string;
  tone?: 'info' | 'warning';
};

const clampMinutes = (value: number): number => {
  if (!Number.isFinite(value)) return 5;
  return Math.min(10, Math.max(1, Math.round(value)));
};

const extractValues = (answers: Record<string, number>): number[] =>
  Object.values(answers).filter(value => Number.isFinite(value));

const computeAverage = (values: number[]): number | null => {
  if (!values.length) return null;
  const total = values.reduce((acc, value) => acc + value, 0);
  return total / values.length;
};

const computeStaiLevel = (answers: Record<string, number>): ClinicalLevel | null => {
  const values = extractValues(answers);
  const average = computeAverage(values);
  if (average === null) return null;
  if (average >= 3) return 'high';
  if (average >= 2.2) return 'moderate';
  return 'low';
};

const computeIsiLevel = (answers: Record<string, number>): ClinicalLevel | null => {
  const values = extractValues(answers);
  if (!values.length) return null;
  const total = values.reduce((acc, value) => acc + value, 0);
  if (total >= 15) return 'high';
  if (total >= 10) return 'moderate';
  return 'low';
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
  const {
    success: showSuccessToast,
    error: showErrorToast,
    warning: showWarningToast,
  } = useToast();
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
  const [showStaiOptInDialog, setShowStaiOptInDialog] = useState(false);
  const [sleepPresetEnabled, setSleepPresetEnabled] = useState(false);
  const [isiOptIn, setIsiOptIn] = useState(false);
  const [isiItems, setIsiItems] = useState<AssessmentItem[]>([]);
  const [isiStatus, setIsiStatus] = useState<AssessmentStatus>('idle');
  const [isiResponses, setIsiResponses] = useState<Record<string, string>>({});
  const [isiSubmissionStatus, setIsiSubmissionStatus] = useState<AssessmentStatus>('idle');
  const [showIsiOptInDialog, setShowIsiOptInDialog] = useState(false);
  const [clinicalSummaries, setClinicalSummaries] = useState<InsightItem[]>([]);
  const [orchestrationHints, setOrchestrationHints] = useState<InsightItem[]>([]);
  const [sleepPackVisible, setSleepPackVisible] = useState(false);
  const [sleepReminderActive, setSleepReminderActive] = useState(false);

  const staiToggleLabelId = useId();
  const staiToggleHintId = useId();
  const staiDialogDescriptionId = useId();
  const isiToggleLabelId = useId();
  const isiToggleHintId = useId();
  const isiDialogDescriptionId = useId();

  const updateSummary = useCallback((id: string, entry: InsightItem | null) => {
    setClinicalSummaries(prev => {
      const filtered = prev.filter(item => item.id !== id);
      if (!entry) {
        return filtered;
      }
      return [...filtered, entry];
    });
  }, []);

  const updateHint = useCallback((id: string, entry: InsightItem | null) => {
    setOrchestrationHints(prev => {
      const filtered = prev.filter(item => item.id !== id);
      if (!entry) {
        return filtered;
      }
      return [...filtered, entry];
    });
  }, []);

  const persistSleepReminder = useCallback((active: boolean) => {
    if (typeof window === 'undefined') return;
    if (active) {
      const payload = { level: 'high', updatedAt: new Date().toISOString() } as const;
      window.localStorage.setItem(SLEEP_REMINDER_STORAGE_KEY, JSON.stringify(payload));
    } else {
      window.localStorage.removeItem(SLEEP_REMINDER_STORAGE_KEY);
    }
  }, []);

  const handleStaiLevel = useCallback(
    (level: ClinicalLevel | null) => {
      if (level === 'high') {
        updateSummary('stai', {
          id: 'stai',
          title: 'Besoin d’apaisement détecté',
          description: 'Tes réponses STAI indiquent une tension élevée. Nous privilégions une expiration prolongée.',
        });
        updateHint('stai-cadence', {
          id: 'stai-cadence',
          title: 'Cadence expirations longues',
          description: 'Cadence recommandée : inspiration 4 s / expiration 6 s pour ancrer le besoin d’apaisement.',
        });
        setCoherenceVariant('45-55');
        return;
      }

      updateSummary('stai', null);
      updateHint('stai-cadence', null);
    },
    [updateSummary, updateHint],
  );

  const handleIsiLevel = useCallback(
    (level: ClinicalLevel | null) => {
      if (level === 'high') {
        updateSummary('isi', {
          id: 'isi',
          title: 'Sommeil fragile détecté',
          description: 'Les réponses ISI montrent un sommeil fragile. Le preset Endormissement 4-7-8 est activé par défaut.',
        });
        updateHint('isi-sequence', {
          id: 'isi-sequence',
          title: 'Séquence pré-sommeil activée',
          description: 'Séance 4-7-8 proposée automatiquement pour préparer l’endormissement.',
        });
        updateHint('dashboard-reminder', {
          id: 'dashboard-reminder',
          title: 'Rappel hebdo respiratoire',
          description: 'Un rappel “respiration apaisante” est ajouté discrètement sur le tableau de bord.',
        });
        setSleepPackVisible(true);
        setSleepReminderActive(true);
        persistSleepReminder(true);
        setSleepPresetEnabled(true);
        setProtocol('478');
        return;
      }

      if (level === 'moderate') {
        updateSummary('isi', {
          id: 'isi',
          title: 'Sommeil à surveiller',
          description: 'Continue les routines douces, le preset Endormissement reste disponible si besoin.',
        });
        updateHint('isi-sequence', {
          id: 'isi-sequence',
          title: 'Routine sommeil recommandée',
          description: 'Programmer une respiration 4-7-8 en fin de journée aide à stabiliser ton sommeil.',
        });
        updateHint('dashboard-reminder', null);
        setSleepPackVisible(false);
        setSleepReminderActive(false);
        persistSleepReminder(false);
        return;
      }

      updateSummary('isi', null);
      updateHint('isi-sequence', null);
      updateHint('dashboard-reminder', null);
      setSleepPackVisible(false);
      setSleepReminderActive(false);
      persistSleepReminder(false);
    },
    [persistSleepReminder, updateSummary, updateHint],
  );

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const protocolParam = (params.get('protocol') ?? params.get('pattern'))?.toLowerCase();

    if (protocolParam === '478' || protocolParam === 'coherence') {
      setProtocol(protocolParam as ProtocolPreset);
    }

    const presetParam = params.get('preset')?.toLowerCase();
    if (presetParam === 'endormissement') {
      setSleepPresetEnabled(true);
    }

    const minutesParam = params.get('minutes');
    const secondsParam = params.get('seconds');

    if (minutesParam) {
      const parsed = Number.parseInt(minutesParam, 10);
      if (Number.isFinite(parsed)) {
        setMinutes(clampMinutes(parsed));
      }
    } else if (secondsParam) {
      const parsedSeconds = Number.parseInt(secondsParam, 10);
      if (Number.isFinite(parsedSeconds)) {
        setMinutes(clampMinutes(parsedSeconds / 60));
      }
    }
  }, []);

  useEffect(() => {
    if (sleepPresetEnabled) {
      setProtocol('478');
      setMinutes(prev => (prev < 5 ? 5 : prev));
    }
  }, [sleepPresetEnabled]);

  useEffect(() => {
    if (sleepPresetEnabled && protocol !== '478') {
      setSleepPresetEnabled(false);
    }
  }, [protocol, sleepPresetEnabled]);

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

  const loadIsiCatalogue = useCallback(async () => {
    if (!isiOptIn) {
      showWarningToast({
        title: 'Active l’option ISI',
        description: 'Confirme l’opt-in pour accéder au suivi hebdomadaire.',
      });
      return;
    }

    if (!sleepPresetEnabled) {
      showWarningToast({
        title: 'Preset Endormissement requis',
        description: 'Active le preset sommeil pour lancer le suivi ISI.',
      });
      return;
    }

    if (!flags.FF_ASSESS_ISI) {
      setIsiItems(FALLBACK_ISI_ITEMS);
      setIsiStatus('ready');
      return;
    }

    setIsiStatus('loading');
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const response = await fetch('/assess/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ instrument: 'ISI', locale: 'fr' }),
      });

      if (!response.ok) {
        throw new Error(`Assess start failed: ${response.status}`);
      }

      const payload = await response.json();
      const items: AssessmentItem[] = Array.isArray(payload?.items) && payload.items.length
        ? payload.items
        : FALLBACK_ISI_ITEMS;

      setIsiItems(items);
      setIsiStatus('ready');

      Sentry.addBreadcrumb({
        category: 'assess',
        level: 'info',
        message: 'assess:start',
        data: { instrument: 'ISI', count: items.length },
      });
    } catch (error) {
      console.error('ISI catalogue load failed', error);
      setIsiItems(FALLBACK_ISI_ITEMS);
      setIsiStatus('error');
    }
  }, [flags.FF_ASSESS_ISI, isiOptIn, sleepPresetEnabled]);

  const submitAssessment = useCallback(async (phase: StaiPhase) => {
    const answers = phase === 'before' ? staiBeforeResponses : staiAfterResponses;
    const items = staiItems;

    if (!items.length || Object.keys(answers).length < items.length) {
      showWarningToast({
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
      showSuccessToast({
        title: phase === 'before' ? 'Check-in pré-séance enregistré' : 'Check-in post-séance enregistré',
      });
      const level = computeStaiLevel(payloadAnswers);
      handleStaiLevel(level);
    } catch (error) {
      console.error('STAI-6 submit failed', error);
      setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'error' }));
      showErrorToast({ title: 'Impossible d’enregistrer les réponses STAI pour le moment.' });
    }
  }, [
    staiItems,
    staiBeforeResponses,
    staiAfterResponses,
    flags.FF_ASSESS_STAI6,
    handleStaiLevel,
    showWarningToast,
    showSuccessToast,
    showErrorToast,
  ]);

  const submitIsiAssessment = useCallback(async () => {
    if (!isiItems.length) {
      showWarningToast({
        title: 'Prépare la mesure',
        description: 'Appuie sur “Préparer la mesure hebdo” pour charger les items ISI.',
      });
      return;
    }

    if (Object.keys(isiResponses).length < isiItems.length) {
      showWarningToast({
        title: 'Complète les 7 réponses',
        description: 'Merci de partager ton ressenti pour chaque item sommeil.',
      });
      return;
    }

    const payloadAnswers = Object.fromEntries(
      Object.entries(isiResponses).map(([key, value]) => [key, Number.parseInt(value, 10)]),
    );

    setIsiSubmissionStatus('loading');

    try {
      if (flags.FF_ASSESS_ISI) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        const response = await fetch('/assess/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ instrument: 'ISI', answers: payloadAnswers, ts: new Date().toISOString() }),
        });

        if (!response.ok) {
          throw new Error(`Assess submit failed: ${response.status}`);
        }

        Sentry.addBreadcrumb({
          category: 'assess',
          level: 'info',
          message: 'assess:submit',
          data: { instrument: 'ISI' },
        });
      }

      setIsiSubmissionStatus('submitted');
      showSuccessToast({ title: 'Suivi sommeil enregistré' });
      const level = computeIsiLevel(payloadAnswers);
      handleIsiLevel(level);
    } catch (error) {
      console.error('ISI submit failed', error);
      setIsiSubmissionStatus('error');
      showErrorToast({ title: 'Impossible d’enregistrer le suivi sommeil pour le moment.' });
    }
  }, [
    flags.FF_ASSESS_ISI,
    isiItems,
    isiResponses,
    handleIsiLevel,
    showWarningToast,
    showSuccessToast,
    showErrorToast,
  ]);

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
        showSuccessToast({
          title: 'Session enregistrée',
          description: 'Ton historique a été mis à jour et une note a été ajoutée au journal.',
        });
        setCompletionMessage('Session enregistrée dans ton historique et ton journal.');
      } else {
        showWarningToast({
          title: 'Session terminée',
          description: 'Impossible de journaliser côté Supabase. Tes notes locales sont conservées.',
        });
        setCompletionMessage("Session terminée mais la sauvegarde distante a échoué.");
      }

      if (result.errors.journal) {
        showWarningToast({
          title: 'Journal indisponible',
          description: 'La note automatique n’a pas pu être enregistrée localement.',
        });
      }
    } catch (error) {
      console.error('Breath session logging failed', error);
      showErrorToast({ title: 'Impossible de sauvegarder la session pour le moment.' });
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
    showSuccessToast,
    showWarningToast,
    showErrorToast,
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

  useEffect(() => {
    if (!staiOptIn) {
      handleStaiLevel(null);
    }
  }, [staiOptIn, handleStaiLevel]);

  useEffect(() => {
    if (!isiOptIn) {
      setIsiStatus('idle');
      setIsiItems([]);
      setIsiResponses({});
      setIsiSubmissionStatus('idle');
      handleIsiLevel(null);
    }
  }, [isiOptIn, handleIsiLevel]);

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(clampMinutes(Number.parseInt(event.target.value, 10)));
  };

  const handleStaiSwitchChange = (value: boolean) => {
    if (value) {
      setShowStaiOptInDialog(true);
      return;
    }
    setStaiOptIn(false);
  };

  const confirmStaiOptIn = () => {
    setStaiOptIn(true);
    setShowStaiOptInDialog(false);
  };

  const cancelStaiOptIn = () => {
    setShowStaiOptInDialog(false);
    setStaiOptIn(false);
  };

  const confirmIsiOptIn = () => {
    setIsiOptIn(true);
    setShowIsiOptInDialog(false);
    if (!sleepPresetEnabled) {
      setSleepPresetEnabled(true);
    }
  };

  const cancelIsiOptIn = () => {
    setShowIsiOptInDialog(false);
    setIsiOptIn(false);
  };

  const handleIsiAnswerChange = useCallback((id: string, value: string) => {
    setIsiResponses(prev => ({ ...prev, [id]: value }));
  }, []);

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
    <ConsentGate>
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
                  min={1}
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

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <Label htmlFor="sleep-preset-toggle">Preset “Endormissement”</Label>
                <p className="text-xs text-muted-foreground">
                  Active la routine 4-7-8 et le suivi ISI hebdomadaire discret.
                </p>
              </div>
              <Switch
                id="sleep-preset-toggle"
                checked={sleepPresetEnabled}
                onCheckedChange={value => setSleepPresetEnabled(Boolean(value))}
                disabled={sessionClock.state !== 'idle'}
              />
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

        <div className="space-y-6">
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
                  <p id={staiToggleLabelId} className="text-sm font-medium text-slate-900">Activer STAI-6</p>
                  <p id={staiToggleHintId} className="text-xs text-muted-foreground">
                    Renseigne des réponses qualitatives avant et après la séance.
                  </p>
                </div>
                <Switch
                  checked={staiOptIn}
                  onCheckedChange={handleStaiSwitchChange}
                  aria-labelledby={staiToggleLabelId}
                  aria-describedby={staiToggleHintId}
                />
              </div>
              {staiOptIn && renderStaiForm('before')}
              {staiOptIn && sessionClock.state === 'completed' && renderStaiForm('after')}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suivi sommeil ISI (hebdomadaire)</CardTitle>
              <CardDescription>
                Disponible lorsque le preset “Endormissement” est actif. Aucune note affichée, uniquement un résumé sommeil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <p id={isiToggleLabelId} className="text-sm font-medium text-slate-900">Activer ISI hebdo</p>
                  <p id={isiToggleHintId} className="text-xs text-muted-foreground">
                    Une mesure par semaine pour ajuster la préparation au sommeil.
                  </p>
                </div>
                <Switch
                  checked={isiOptIn}
                  onCheckedChange={value => {
                    if (value) {
                      setShowIsiOptInDialog(true);
                    } else {
                      setIsiOptIn(false);
                    }
                  }}
                  aria-labelledby={isiToggleLabelId}
                  aria-describedby={isiToggleHintId}
                />
              </div>

              {!isiOptIn && (
                <p className="text-sm text-muted-foreground">
                  Active le suivi sommeil pour recevoir un check-in hebdomadaire discret.
                </p>
              )}

              {isiOptIn && !sleepPresetEnabled && (
                <p className="rounded-md border border-amber-200 bg-amber-50/70 p-3 text-sm text-amber-800">
                  Active le preset “Endormissement” pour déclencher la mesure ISI.
                </p>
              )}

              {isiOptIn && (
                <>
                  {isiStatus === 'idle' && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => void loadIsiCatalogue()}
                      disabled={!sleepPresetEnabled}
                    >
                      Préparer la mesure hebdo
                    </Button>
                  )}
                  {isiStatus === 'loading' && (
                    <p className="text-sm text-muted-foreground">Préparation de l’échelle sommeil…</p>
                  )}
                  {isiStatus === 'error' && (
                    <p className="text-sm text-amber-600">
                      Catalogue indisponible, affichage d’une version simplifiée.
                    </p>
                  )}
                  {(isiStatus === 'ready' || isiStatus === 'error') &&
                    isiItems.map(item => {
                      const itemId = `isi-${item.id}`;
                      return (
                        <div key={itemId} className="space-y-2 rounded-lg border border-slate-200/70 bg-white/70 p-3">
                          <p id={`${itemId}-label`} className="text-sm font-medium text-slate-800">{item.text}</p>
                          <RadioGroup
                            value={isiResponses[item.id] ?? ''}
                            onValueChange={value => handleIsiAnswerChange(item.id, value)}
                            className="grid gap-2 sm:grid-cols-5"
                            aria-labelledby={`${itemId}-label`}
                          >
                            {ISI_SCALE.map(option => {
                              const optionId = `${itemId}-${option.value}`;
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
                  {isiItems.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isiSubmissionStatus === 'loading'}
                        onClick={() => void submitIsiAssessment()}
                      >
                        {isiSubmissionStatus === 'submitted'
                          ? 'Réponses enregistrées'
                          : isiSubmissionStatus === 'loading'
                            ? 'Enregistrement…'
                            : 'Enregistrer les réponses'}
                      </Button>
                      {isiSubmissionStatus === 'submitted' && (
                        <span className="text-sm text-emerald-600">Merci pour ton suivi hebdo.</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adaptations automatiques</CardTitle>
              <CardDescription>
                Résumés et orchestrations issus de tes évaluations opt-in. Aucun score n’est affiché.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clinicalSummaries.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Active STAI-6 ou ISI pour voir apparaître des résumés personnalisés.
                </p>
              ) : (
                <ul className="space-y-3">
                  {clinicalSummaries.map(item => (
                    <li
                      key={item.id}
                      className="space-y-1 rounded-md border border-slate-200/70 bg-white/70 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-700">{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}

              {orchestrationHints.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Orchestration</p>
                  <ul className="space-y-2">
                    {orchestrationHints.map(item => (
                      <li
                        key={item.id}
                        className="space-y-1 rounded-md border border-indigo-200 bg-indigo-50/70 p-3 text-indigo-900"
                      >
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-sm">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sleepPackVisible && (
                <Button asChild variant="secondary">
                  <a href="https://nyvee.app/pack-sommeil" target="_blank" rel="noreferrer">
                    Explorer le Pack Sommeil Nyvée
                  </a>
                </Button>
              )}

              {sleepReminderActive && orchestrationHints.some(item => item.id === 'dashboard-reminder') && (
                <p className="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
                  Un rappel “respiration apaisante” est désormais présent sur ton tableau de bord.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <Dialog open={showStaiOptInDialog} onOpenChange={setShowStaiOptInDialog}>
        <DialogContent aria-describedby={staiDialogDescriptionId} role="dialog">
          <DialogHeader>
            <DialogTitle>Confirmer l’activation de STAI-6</DialogTitle>
            <DialogDescription id={staiDialogDescriptionId}>
              Les réponses restent invisibles et servent uniquement à ajuster les recommandations de respiration et de suivi.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Six items avant/après, jamais de score affiché.</li>
            <li>• Données stockées de façon chiffrée côté clinique.</li>
            <li>• Retirable à tout moment depuis cette carte.</li>
          </ul>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={cancelStaiOptIn}>
              Annuler
            </Button>
            <Button onClick={confirmStaiOptIn}>
              Activer STAI-6
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showIsiOptInDialog} onOpenChange={setShowIsiOptInDialog}>
        <DialogContent aria-describedby={isiDialogDescriptionId} role="dialog">
          <DialogHeader>
            <DialogTitle>Confirmer le suivi sommeil ISI</DialogTitle>
            <DialogDescription id={isiDialogDescriptionId}>
              Les réponses sont utilisées pour ajuster automatiquement le preset Endormissement et rester invisibles en interface.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>• Sept items hebdomadaires, jamais de score affiché.</li>
            <li>• Les données sont stockées avec chiffrement clinique.</li>
            <li>• Possibilité d’arrêter le suivi à tout moment.</li>
          </ul>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={cancelIsiOptIn}>
              Annuler
            </Button>
            <Button onClick={confirmIsiOptIn}>
              Activer ISI hebdo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
    </ConsentGate>
  );
}
