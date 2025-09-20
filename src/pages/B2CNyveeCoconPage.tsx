/**
 * Nyvée - Cocon d'urgence
 * Quand tu n'en peux plus : appui long, l'app t'enveloppe 6–10 min et te ramène
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Heart, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logAndJournal } from '@/services/sessions/sessionsApi';
import { clinicalOrchestration } from '@/services/clinicalOrchestration';

type AssessmentItem = { id: string; text: string; scale?: string[] };

type AssessmentStatus = 'idle' | 'loading' | 'ready' | 'error' | 'submitted';

type StaiPhase = 'before' | 'after';

type MoodOutcome = 'better' | 'same' | 'worse';

const FALLBACK_STAI_ITEMS: AssessmentItem[] = [
  { id: 's1', text: 'Je me sens calme.' },
  { id: 's2', text: 'Je me sens en sécurité.' },
  { id: 's3', text: 'Je me sens tendu·e.' },
  { id: 's4', text: 'Je me sens à l’aise.' },
  { id: 's5', text: 'Je me sens inquiet/inquiète.' },
  { id: 's6', text: 'Je me sens détendu·e.' },
];

const STAI_SCALE = [
  { value: '1', label: 'Jamais' },
  { value: '2', label: 'Parfois' },
  { value: '3', label: 'Souvent' },
  { value: '4', label: 'Toujours' },
] as const;

const MOOD_OUTCOMES: {
  id: MoodOutcome;
  label: string;
  helper: string;
  delta: number;
  meta: string;
  journal: string;
}[] = [
  {
    id: 'better',
    label: 'Plus apaisé·e',
    helper: 'Le cocon m’a réellement détendu.',
    delta: 4,
    meta: 'plus_apaisé',
    journal: 'Je me sens nettement plus apaisé·e après le cocon.',
  },
  {
    id: 'same',
    label: 'À peu près pareil',
    helper: 'Le ressenti reste stable pour le moment.',
    delta: 0,
    meta: 'stable',
    journal: 'Je reste sur un ressenti globalement stable après le cocon.',
  },
  {
    id: 'worse',
    label: 'Encore tendu·e',
    helper: 'J’ai besoin de plus de temps ou d’un autre soutien.',
    delta: -4,
    meta: 'tension_persistante',
    journal: 'Je ressens encore de la tension après le cocon et je prendrai un autre temps pour moi.',
  },
];
import { ClinicalOptIn } from '@/components/consent/ClinicalOptIn';
import { useClinicalConsent } from '@/hooks/useClinicalConsent';

const NyveeCocon: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const sessionStartRef = useRef<number | null>(null);

  const [sessionState, setSessionState] = useState<'intro' | 'breathing' | 'silence' | 'anchor' | 'complete'>('intro');
  const [timeRemaining, setTimeRemaining] = useState(360);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [calmMode, setCalmMode] = useState(false);
  const [suggestBreathing, setSuggestBreathing] = useState(false);
  const [maxSignalLevel, setMaxSignalLevel] = useState(0);
  const [hasLoggedSession, setHasLoggedSession] = useState(false);
  const [moodOutcome, setMoodOutcome] = useState<MoodOutcome>('better');
  const [isLogging, setIsLogging] = useState(false);

  const [staiOptIn, setStaiOptIn] = useState(false);
  const [staiItems, setStaiItems] = useState<AssessmentItem[]>(FALLBACK_STAI_ITEMS);
  const [staiStatus, setStaiStatus] = useState<AssessmentStatus>('idle');
  const [staiBeforeResponses, setStaiBeforeResponses] = useState<Record<string, string>>({});
  const [staiAfterResponses, setStaiAfterResponses] = useState<Record<string, string>>({});
  const [staiSubmissionStatus, setStaiSubmissionStatus] = useState<{ before: AssessmentStatus; after: AssessmentStatus }>({
    before: 'idle',
    after: 'idle',
  });

  const anchorSteps = [
    "5 choses que tu vois",
    "4 choses que tu touches",
    "3 choses que tu entends",
    "2 choses que tu sens",
    "1 chose que tu goûtes"
  ];

  const haloConfig = useMemo(
    () => ({
      count: calmMode ? 2 : 3,
      className: calmMode
        ? 'absolute rounded-full bg-gradient-to-r from-indigo-400/5 to-purple-500/5'
        : 'absolute rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
      scale: calmMode ? [1, 1.05, 1] : [1, 1.1, 1],
      opacity: calmMode ? 0.12 : 0.3,
      durationBase: calmMode ? 8 : 6,
    }),
    [calmMode],
  );

  const backgroundClass = calmMode
    ? 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
    : 'min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';

  useEffect(() => {
    let isMounted = true;

    const loadSignals = async () => {
      try {
        const signals = await clinicalOrchestration.getActiveSignals('nyvee');
        if (!isMounted) return;

        if (!signals.length) {
          setCalmMode(false);
          setSuggestBreathing(false);
          setMaxSignalLevel(0);
          return;
        }

        const highestLevel = signals.reduce((acc, signal) => Math.max(acc, signal.level ?? 0), 0);
        const hasReduceIntensity = signals.some(signal => signal.level >= 3);
        const hasSuggest = signals.some(signal => {
          const actions = Array.isArray(signal.metadata?.actions) ? signal.metadata.actions : [];
          return actions.includes('suggest_breathing');
        });

        setCalmMode(hasReduceIntensity);
        setSuggestBreathing(hasReduceIntensity || hasSuggest);
        setMaxSignalLevel(highestLevel);
      } catch (error) {
        console.error('Nyvée cocon adaptation fetch failed', error);
      }
    };

    void loadSignals();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadStaiCatalogue = useCallback(async () => {
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
        data: { instrument: 'STAI6', count: items.length, module: 'nyvee_cocon' },
      });
    } catch (error) {
      console.error('STAI-6 catalogue load failed', error);
      setStaiItems(FALLBACK_STAI_ITEMS);
      setStaiStatus('error');
    }
  }, []);

  useEffect(() => {
    if (staiOptIn) {
      setStaiBeforeResponses({});
      setStaiAfterResponses({});
      setStaiSubmissionStatus({ before: 'idle', after: 'idle' });
      void loadStaiCatalogue();
    } else {
      setStaiStatus('idle');
      setStaiItems(FALLBACK_STAI_ITEMS);
      setStaiBeforeResponses({});
      setStaiAfterResponses({});
      setStaiSubmissionStatus({ before: 'idle', after: 'idle' });
    }
  }, [staiOptIn, loadStaiCatalogue]);

  const submitStai = useCallback(async (phase: StaiPhase) => {
    const responses = phase === 'before' ? staiBeforeResponses : staiAfterResponses;

    if (!staiItems.length) {
      toast({
        title: 'Catalogue indisponible',
        description: 'Les items STAI-6 ne sont pas disponibles pour le moment.',
      });
      return;
    }

    if (Object.keys(responses).length < staiItems.length) {
      toast({
        title: 'Complète les 6 réponses',
        description: 'Merci de répondre à chaque item pour enregistrer ton ressenti.',
      });
      return;
    }

    setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'loading' }));

    try {
      const payloadAnswers = Object.fromEntries(
        Object.entries(responses).map(([key, value]) => [key, Number.parseInt(value, 10)]),
      );

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
        data: { instrument: 'STAI6', phase, module: 'nyvee_cocon' },
      });

      setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'submitted' }));
      toast({
        title: phase === 'before' ? 'Check-in pré-cocon enregistré' : 'Check-in post-cocon enregistré',
        description: 'Merci, ces réponses aident Nyvée à personnaliser ton cocon.',
      });
    } catch (error) {
      console.error('STAI-6 submit failed', error);
      Sentry.captureException(error);
      setStaiSubmissionStatus(prev => ({ ...prev, [phase]: 'error' }));
      toast({
        title: 'Sauvegarde indisponible',
        description: 'Impossible d’enregistrer les réponses STAI pour le moment.',
        variant: 'destructive',
      });
    }
  }, [staiAfterResponses, staiBeforeResponses, staiItems, toast]);

  const StaiForm = ({ phase }: { phase: StaiPhase }) => {
    const responses = phase === 'before' ? staiBeforeResponses : staiAfterResponses;

    const handleChange = (id: string, value: string) => {
      if (phase === 'before') {
        setStaiBeforeResponses(prev => ({ ...prev, [id]: value }));
      } else {
        setStaiAfterResponses(prev => ({ ...prev, [id]: value }));
      }
    };

    const submissionState = staiSubmissionStatus[phase];

    return (
      <div className="space-y-4">
        {staiStatus === 'loading' && (
          <p className="text-sm text-indigo-200">Chargement des items…</p>
        )}
        {staiStatus === 'error' && (
          <p className="text-sm text-amber-200">
            Catalogue indisponible, affichage d’une version simplifiée.
          </p>
        )}
        {staiItems.map(item => {
          const groupId = `${phase}-${item.id}`;
          return (
            <div key={groupId} className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
              <p id={`${groupId}-label`} className="text-sm font-medium text-white/90">
                {item.text}
              </p>
              <RadioGroup
                value={responses[item.id] ?? ''}
                onValueChange={value => handleChange(item.id, value)}
                className="grid gap-2 sm:grid-cols-4"
                aria-labelledby={`${groupId}-label`}
              >
                {STAI_SCALE.map(option => {
                  const optionId = `${groupId}-${option.value}`;
                  return (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 rounded-md bg-slate-900/40 p-2 transition hover:bg-slate-900/60"
                    >
                      <RadioGroupItem
                        id={optionId}
                        value={option.value}
                        className="border-indigo-300 text-indigo-200 focus-visible:ring-indigo-400 focus-visible:ring-offset-slate-900"
                      />
                      <Label htmlFor={optionId} className="text-sm text-indigo-100">
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
            disabled={submissionState === 'loading'}
            onClick={() => submitStai(phase)}
            className="border border-indigo-400/40 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30"
          >
            {submissionState === 'submitted'
              ? 'Réponses enregistrées'
              : submissionState === 'loading'
                ? 'Enregistrement…'
                : 'Enregistrer'}
          </Button>
          {submissionState === 'submitted' && (
            <span className="text-sm text-emerald-200">Merci, c’est pris en compte.</span>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (sessionState === 'breathing' || sessionState === 'silence') {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionState('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionState]);

  useEffect(() => {
    if (sessionState === 'breathing') {
      setBreathingPhase('inhale');
      const breathCycle = setInterval(() => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'inhale':
              return 'hold';
            case 'hold':
              return 'exhale';
            case 'exhale':
              return 'inhale';
            default:
              return 'inhale';
          }
        });
      }, calmMode ? 5000 : 4000);

      return () => clearInterval(breathCycle);
    }
  }, [sessionState, calmMode]);

  const startCocon = useCallback(() => {
    setSessionState('breathing');
    setTimeRemaining(120);
    setBreathingPhase('inhale');
    sessionStartRef.current = Date.now();
    setHasLoggedSession(false);
    setIsLogging(false);
    setMoodOutcome('better');
    if (staiOptIn) {
      setStaiAfterResponses({});
      setStaiSubmissionStatus(prev => ({ ...prev, after: 'idle' }));
    }
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'nyvee_cocon:start',
      data: { mode: calmMode ? 'calm' : 'standard' },
    });
  }, [calmMode, staiOptIn]);

  const moveToSilence = useCallback(() => {
    setSessionState('silence');
    setTimeRemaining(240);
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'nyvee_cocon:segment',
      data: { segment: 'silence' },
    });
  }, []);

  const moveToAnchor = useCallback(() => {
    setSessionState('anchor');
    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'nyvee_cocon:segment',
      data: { segment: 'anchor' },
    });
  }, []);

  const handleExitCocon = useCallback(async () => {
    if (isLogging) {
      return;
    }

    if (hasLoggedSession) {
      navigate('/app/home');
      return;
    }

    const outcomeDetails = MOOD_OUTCOMES.find(option => option.id === moodOutcome) ?? MOOD_OUTCOMES[0];
    const startedAt = sessionStartRef.current;
    const durationSec = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 360;

    const meta: Record<string, unknown> = {
      module: 'nyvee_cocon',
      mood_delta_text: outcomeDetails.meta,
      stai_opt_in: staiOptIn,
      stai_before_submitted: staiSubmissionStatus.before === 'submitted',
      stai_after_submitted: staiSubmissionStatus.after === 'submitted',
      calm_mode: calmMode,
      suggest_breathing_prompted: suggestBreathing,
    };

    if (maxSignalLevel > 0) {
      meta.max_signal_level = maxSignalLevel;
    }

    if (Object.keys(staiBeforeResponses).length > 0) {
      meta.stai_before = staiBeforeResponses;
    }

    if (Object.keys(staiAfterResponses).length > 0) {
      meta.stai_after = staiAfterResponses;
    }

    setIsLogging(true);

    Sentry.addBreadcrumb({
      category: 'session',
      level: 'info',
      message: 'nyvee_cocon:exit',
      data: {
        duration_sec: durationSec,
        mood: outcomeDetails.id,
        calm_mode: calmMode,
      },
    });

    try {
      await logAndJournal({
        type: 'custom',
        duration_sec: durationSec,
        mood_delta: outcomeDetails.delta,
        journalText: `Cocon Nyvée terminé. ${outcomeDetails.journal}`,
        meta,
      });
      setHasLoggedSession(true);
      toast({
        title: 'Cocon enregistré',
        description: 'Ton ressenti est ajouté discrètement à ton journal.',
      });
    } catch (error) {
      console.error('Nyvée cocon logging failed', error);
      Sentry.captureException(error);
      toast({
        title: 'Sauvegarde indisponible',
        description: 'Impossible d’enregistrer la session pour le moment.',
        variant: 'destructive',
      });
    } finally {
      sessionStartRef.current = null;
      setIsLogging(false);
      navigate('/app/home');
    }
  }, [
    calmMode,
    hasLoggedSession,
    isLogging,
    maxSignalLevel,
    moodOutcome,
    navigate,
    staiAfterResponses,
    staiBeforeResponses,
    staiOptIn,
    staiSubmissionStatus.after,
    staiSubmissionStatus.before,
    suggestBreathing,
    toast,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustScale = (value: number) => {
    if (!calmMode) return value;
    if (value > 1) {
      return 1 + (value - 1) * 0.6;
    }
    if (value < 1) {
      return 1 - (1 - value) * 0.6;
    }
    return value;
  };

  const adjustOpacity = (value: number) => {
    if (!calmMode) return value;
    const anchor = 0.55;
    return anchor + (value - anchor) * 0.65;
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return adjustScale(1.2);
      case 'hold':
        return adjustScale(1.2);
      case 'exhale':
        return adjustScale(0.8);
      default:
        return adjustScale(1);
    }
  };

  const getBreathingOpacity = () => {
    switch (breathingPhase) {
      case 'inhale':
        return adjustOpacity(0.8);
      case 'hold':
        return adjustOpacity(0.9);
      case 'exhale':
        return adjustOpacity(0.4);
      default:
        return adjustOpacity(0.6);
    }
  };

  return (
    <div className={`${backgroundClass} relative min-h-screen overflow-hidden p-4 transition-colors duration-700`}>
      {/* Halos respirants d'arrière-plan */}
      <div className="absolute inset-0">
        {Array.from({ length: haloConfig.count }).map((_, i) => (
          <motion.div
            key={i}
            className={haloConfig.className}
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: haloConfig.scale,
              opacity: [haloConfig.opacity, haloConfig.opacity / 2, haloConfig.opacity],
            }}
            transition={{
              duration: haloConfig.durationBase + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        {stai6Consent.shouldPrompt && (
          <ClinicalOptIn
            title="Activer l'évaluation STAI-6"
            description="Ces quelques questions nous aident à déclencher le cocon quand l'anxiété monte. Votre choix est mémorisé et peut être changé plus tard."
            acceptLabel="Oui, personnaliser"
            declineLabel="Non merci"
            onAccept={stai6Consent.grantConsent}
            onDecline={stai6Consent.declineConsent}
            isProcessing={stai6Consent.isSaving}
            error={stai6Consent.error}
            className="bg-white/10 border-white/20 backdrop-blur-md"
          />
        )}
        <AnimatePresence mode="wait">
          {sessionState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-16 text-center"
            >
              <motion.div
                className="mb-8"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="mx-auto h-20 w-20 text-indigo-300" />
              </motion.div>

              <h1 className="mb-4 text-3xl font-light text-white">Cocon d'Urgence</h1>
              <p className="mb-8 text-lg leading-relaxed text-indigo-200">
                Un refuge de 6 minutes pour te ramener
                <br />
                à toi quand tout devient trop lourd
              </p>

              <Button
                onClick={startCocon}
                className="rounded-full bg-indigo-600 px-8 py-4 text-lg text-white hover:bg-indigo-700"
              >
                Entrer dans le cocon
              </Button>

              <div className="mt-8 text-sm text-indigo-300">
                <p>NoMic/NoCam par défaut • Tout reste local</p>
              </div>

              {suggestBreathing && (
                <div className="mt-6 text-left">
                  <div className="rounded-xl border border-indigo-400/40 bg-indigo-900/40 p-4 text-indigo-100 shadow-lg shadow-indigo-900/40">
                    <p className="text-sm font-semibold text-white">
                      Nyvée détecte un niveau de tension élevé.
                    </p>
                    <p className="mt-2 text-sm text-indigo-100/90">
                      {calmMode
                        ? 'Mode apaisé activé : halos adoucis et respiration plus lente pour t’accompagner.'
                        : 'Nyvée te suggère de commencer par 2 minutes de respiration guidée.'}
                    </p>
                    {maxSignalLevel > 0 && (
                      <p className="mt-1 text-xs text-indigo-200/80">
                        Signal intensité niveau {maxSignalLevel}.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!suggestBreathing && calmMode && (
                <p className="mt-6 text-sm text-indigo-200">
                  Mode apaisé activé automatiquement : halos plus doux pour ménager tes sens.
                </p>
              )}

              <div className="mt-12 space-y-4 text-left">
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Check-in STAI-6 optionnel</CardTitle>
                    <CardDescription className="text-indigo-100/80">
                      Mesure ta tension avant/après. Les réponses restent invisibles.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-slate-900/40 p-3">
                      <div>
                        <p className="text-sm font-medium text-indigo-100">Activer la mesure</p>
                        <p className="text-xs text-indigo-200/80">
                          Nyvée adaptera le cocon si tu partages tes ressentis.
                        </p>
                      </div>
                      <Switch checked={staiOptIn} onCheckedChange={setStaiOptIn} aria-label="Activer le suivi STAI-6" />
                    </div>
                    {staiOptIn ? (
                      <StaiForm phase="before" />
                    ) : (
                      <p className="text-sm text-indigo-200">
                        Active le check-in pour partager ton niveau de tension avant de commencer.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {sessionState === 'breathing' && (
            <motion.div
              key="breathing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mb-8">
                <motion.div
                  className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                  animate={{
                    scale: getBreathingScale(),
                    opacity: getBreathingOpacity(),
                  }}
                  transition={{
                    duration: calmMode ? 5 : 4,
                    ease: 'easeInOut',
                  }}
                >
                  <Wind className="h-12 w-12 text-white" />
                </motion.div>
              </div>

              <h2 className="mb-4 text-2xl font-light text-white">Respire avec le halo</h2>

              <div className="mb-6 text-lg text-indigo-200">
                {breathingPhase === 'inhale' && 'Inspire doucement…'}
                {breathingPhase === 'hold' && 'Retiens…'}
                {breathingPhase === 'exhale' && 'Expire lentement…'}
              </div>

              <div className="text-sm text-indigo-300">{formatTime(timeRemaining)}</div>

              <Button onClick={moveToSilence} variant="ghost" className="mt-8 text-indigo-300 hover:text-white">
                Passer au silence
              </Button>
            </motion.div>
          )}

          {sessionState === 'silence' && (
            <motion.div
              key="silence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="mb-8">
                <motion.div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-400/30 to-indigo-400/30"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="h-3 w-3 rounded-full bg-white/50" />
                </motion.div>
              </div>

              <h2 className="mb-6 text-xl font-light text-white/80">Silence sculpté</h2>

              <div className="mb-8 text-sm text-indigo-300">{formatTime(timeRemaining)}</div>

              <div className="space-y-4">
                <Button onClick={moveToAnchor} variant="ghost" className="text-sm text-indigo-300 hover:text-white">
                  Si agitation → Ancrage 5-4-3-2-1
                </Button>
              </div>
            </motion.div>
          )}

          {sessionState === 'anchor' && (
            <motion.div
              key="anchor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16"
            >
              <h2 className="mb-8 text-center text-2l font-light text-white">Ancrage 5-4-3-2-1</h2>

              <div className="space-y-6">
                {anchorSteps.map((step, index) => (
                  <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 font-medium text-white">
                          {5 - index}
                        </div>
                        <span className="text-lg text-white">{step}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => {
                    setSessionState('complete');
                    setBreathingPhase('inhale');
                    Sentry.addBreadcrumb({
                      category: 'session',
                      level: 'info',
                      message: 'nyvee_cocon:segment_complete',
                      data: { segment: 'anchor' },
                    });
                  }}
                  className="rounded-full bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                >
                  Terminer l'ancrage
                </Button>
              </div>
            </motion.div>
          )}

          {sessionState === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center"
            >
              <motion.div
                className="mb-8"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: 3 }}
              >
                <Heart className="mx-auto h-16 w-16 text-pink-400" />
              </motion.div>

              <h2 className="mb-4 text-2xl font-light text-white">Sortie douce</h2>

              <p className="mb-8 text-indigo-200">
                Tu as pris ce temps pour toi.
                <br />
                Comment te sens-tu maintenant ?
              </p>

              <div className="mx-auto mt-6 space-y-6 text-left">
                <div>
                  <Label className="text-sm font-medium text-indigo-100">Comment te sens-tu ?</Label>
                  <RadioGroup
                    value={moodOutcome}
                    onValueChange={value => setMoodOutcome(value as MoodOutcome)}
                    className="mt-3 grid gap-3 sm:grid-cols-3"
                  >
                    {MOOD_OUTCOMES.map(option => {
                      const isActive = moodOutcome === option.id;
                      return (
                        <div
                          key={option.id}
                          className={`rounded-lg border p-3 transition ${
                            isActive
                              ? 'border-emerald-300 bg-emerald-400/10'
                              : 'border-white/10 bg-white/5 hover:border-indigo-300/60'
                          }`}
                        >
                          <RadioGroupItem id={`mood-${option.id}`} value={option.id} className="sr-only" />
                          <Label
                            htmlFor={`mood-${option.id}`}
                            className="flex cursor-pointer flex-col gap-1 text-left text-sm text-indigo-100"
                          >
                            <span className="text-base font-semibold text-white">{option.label}</span>
                            <span className="text-xs text-indigo-200/80">{option.helper}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <p className="text-sm text-indigo-200">
                  {MOOD_OUTCOMES.find(option => option.id === moodOutcome)?.journal}
                </p>

                {staiOptIn && (
                  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Check-in STAI-6 (après cocon)</CardTitle>
                      <CardDescription className="text-indigo-100/80">
                        Quelques réponses pour suivre l’évolution de ta tension.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <StaiForm phase="after" />
                      {staiSubmissionStatus.before !== 'submitted' && (
                        <p className="text-xs text-indigo-200/80">
                          Astuce : pense à enregistrer aussi ton check-in avant séance pour comparer.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  onClick={startCocon}
                  variant="outline"
                  className="border-indigo-400 text-indigo-300 hover:bg-indigo-600/60 hover:text-white"
                >
                  Encore un peu
                </Button>
                <Button
                  onClick={handleExitCocon}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={isLogging}
                >
                  {isLogging ? 'Enregistrement…' : 'C’est mieux'}
                </Button>
              </div>

              <p className="mt-6 text-sm text-indigo-300">Rappel doux dans 45 min ? (optionnel)</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NyveeCocon;
