import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { sendMessage } from '@/services/coach/coachApi';
import { CoachConsent } from '@/modules/coach/CoachConsent';
import { sha256Hex } from '@/lib/hash';
import { COACH_DISCLAIMERS, CoachMode } from '@/modules/coach/lib/prompts';
import { redactForTelemetry } from '@/modules/coach/lib/redaction';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { logger } from '@/lib/logger';

type AssessmentCatalog = {
  items: Array<{ id: string; prompt: string }>;
};
import { useToast } from '@/hooks/use-toast';
import { useClinicalHints } from '@/hooks/useClinicalHints';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  CoachSessionHistory,
  CoachStatsPanel,
  CoachPersonalitySelector,
  CoachSatisfactionDialog,
  CoachExportButton,
  CoachTypingIndicator,
  CoachSessionTimer,
  CoachSuggestionsPanel,
  CoachEndSessionButton,
  type CoachPersonality,
} from '@/modules/coach/components';

interface CoachResource {
  type: string;
  title: string;
  description: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  streaming?: boolean;
  techniques?: string[];
  resources?: CoachResource[];
  followUpQuestions?: string[];
}

const CONSENT_STORAGE_KEY = 'coach:consent:v1';
const AAQ_SKIP_STORAGE_KEY = 'coach:aaq2:skip-until:v1';
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const AAQ_SCALE_OPTIONS: Array<{ value: string; label: string; helper: string }> = [
  { value: '1', label: 'Jamais vrai', helper: 'Aucune accroche sur cette pensée' },
  { value: '2', label: 'Très rarement vrai', helper: 'Quasi aucune accroche ressentie' },
  { value: '3', label: 'Plutôt rarement vrai', helper: 'Tension légère, vite relâchée' },
  { value: '4', label: 'Parfois vrai', helper: 'Accroche ponctuelle mais gérable' },
  { value: '5', label: 'Souvent vrai', helper: 'Accroche sensible à adoucir' },
  { value: '6', label: 'Très souvent vrai', helper: 'Accroche marquée nécessitant douceur' },
  { value: '7', label: 'Toujours vrai', helper: 'Accroche constante, soutien recommandé' },
];

type FlexHint = 'souple' | 'transition' | 'rigide' | 'unknown';

function readSkipUntil(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  const raw = window.localStorage.getItem(AAQ_SKIP_STORAGE_KEY);
  if (!raw) {
    return 0;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function persistSkipUntil(timestamp: number) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(AAQ_SKIP_STORAGE_KEY, String(timestamp));
}

function resolveFlexHint(summary?: string | null, focus?: string | null): FlexHint {
  const normalizedFocus = focus?.toLowerCase() ?? '';
  if (normalizedFocus.includes('rigid')) {
    return 'rigide';
  }
  if (normalizedFocus.includes('souple')) {
    return 'souple';
  }
  if (normalizedFocus.includes('transition')) {
    return 'transition';
  }

  const normalizedSummary = summary?.toLowerCase() ?? '';
  if (normalizedSummary.includes('rigide')) {
    return 'rigide';
  }
  if (normalizedSummary.includes('souplesse')) {
    return 'souple';
  }
  if (normalizedSummary.includes('transition')) {
    return 'transition';
  }
  return 'unknown';
}

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${crypto.randomUUID()}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function CoachView({ initialMode = 'b2c' }: { initialMode?: CoachMode }) {
  const { toast } = useToast();
  const { flags } = useFlags();
  const aaqAssessment = useAssessment('AAQ2');
  const [mode, setMode] = useState<CoachMode>(initialMode);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [disclaimers, setDisclaimers] = useState<string[]>(COACH_DISCLAIMERS.fr);
  const [isSending, setIsSending] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [userHash, setUserHash] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [locale] = useState<'fr' | 'en'>('fr');
  const [aaqCatalog, setAaqCatalog] = useState<AssessmentCatalog | null>(null);
  const [isAaqDialogOpen, setIsAaqDialogOpen] = useState(false);
  const [aaqAnswers, setAaqAnswers] = useState<Record<string, string>>({});
  const [aaqSummary, setAaqSummary] = useState<string | null>(null);
  const [aaqFlexHint, setAaqFlexHint] = useState<FlexHint>('unknown');
  const [aaqUpdatedAt, setAaqUpdatedAt] = useState<number | null>(null);
  const [skipUntil, setSkipUntil] = useState<number>(() => readSkipUntil());
  const [isAaqStarting, setIsAaqStarting] = useState(false);
  const [isAaqSubmitting, setIsAaqSubmitting] = useState(false);
  const [personality, setPersonality] = useState<CoachPersonality>('empathetic');
  const [showSatisfaction, setShowSatisfaction] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [lastSuggestions, setLastSuggestions] = useState<{
    techniques: string[];
    resources: CoachResource[];
    followUpQuestions: string[];
  }>({ techniques: [], resources: [], followUpQuestions: [] });
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const featureAaqEnabled = flags.FF_ASSESS_AAQ2 !== false;
  const isRigidityHigh = aaqFlexHint === 'rigide';
  const clinicalHints = useClinicalHints('coach');
  const nyveeHints = clinicalHints?.hints || [];

  useEffect(() => {
    const consentFlag = typeof window !== 'undefined' ? window.localStorage.getItem(CONSENT_STORAGE_KEY) : null;
    if (consentFlag === 'true') {
      setHasConsent(true);
      setShowConsent(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function bootstrapUser() {
      try {
        const { data } = await supabase.auth.getUser();
        const authUser = data?.user;
        if (!mounted || !authUser) return;

        if (authUser.user_metadata?.coach_consent_at) {
          setHasConsent(true);
          setShowConsent(false);
        }

        if (typeof authUser.id === 'string') {
          try {
            const hashed = await sha256Hex(authUser.id);
            if (mounted) {
              setUserHash(hashed);
            }
          } catch (error) {
            logger.warn('[coach] unable to hash user id', error, 'SYSTEM');
          }
        }

        const rawRole = authUser.user_metadata?.role ?? authUser.app_metadata?.role;
        if (typeof rawRole === 'string' && rawRole.toLowerCase().includes('b2b')) {
          setMode('b2b');
        }
      } catch (error) {
        logger.warn('[coach] unable to bootstrap user context', error, 'SYSTEM');
      }
    }

    bootstrapUser();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      Sentry.configureScope((scope: any) => {
        scope.setTag('coach_mode', mode);
      });
    }
  }, [mode]);

  const refreshFlexSummary = useCallback(async () => {
    if (!featureAaqEnabled) {
      setAaqSummary(null);
      setAaqFlexHint('unknown');
      setAaqUpdatedAt(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('score_json, submitted_at, ts')
        .eq('instrument', 'AAQ2')
        .order('submitted_at', { ascending: false, nullsFirst: false })
        .order('ts', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.warn('[coach] unable to load AAQ-II summary', error, 'SYSTEM');
        setAaqSummary(null);
        setAaqFlexHint('unknown');
        setAaqUpdatedAt(null);
        return;
      }

      const summaryText = typeof data?.score_json?.summary === 'string' ? data.score_json.summary : null;
      const focusText = typeof data?.score_json?.focus === 'string' ? data.score_json.focus : null;

      setAaqSummary(summaryText);
      setAaqFlexHint(resolveFlexHint(summaryText, focusText));
      const recordedAt = data?.submitted_at ?? data?.ts ?? null;
      setAaqUpdatedAt(recordedAt ? Date.parse(recordedAt) : null);
    } catch (error) {
      logger.warn('[coach] unable to load AAQ-II summary', error, 'SYSTEM');
      setAaqSummary(null);
      setAaqFlexHint('unknown');
      setAaqUpdatedAt(null);
    }
  }, [featureAaqEnabled]);

  useEffect(() => {
    refreshFlexSummary();
  }, [refreshFlexSummary]);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior });
    });
  }, [prefersReducedMotion]);

  const shouldPromptAaq = useMemo(() => {
    if (!featureAaqEnabled) {
      return false;
    }
    const now = Date.now();
    if (skipUntil && skipUntil > now) {
      return false;
    }
    if (aaqUpdatedAt && now - aaqUpdatedAt < WEEK_IN_MS) {
      return false;
    }
    return !isAaqDialogOpen;
  }, [featureAaqEnabled, skipUntil, aaqUpdatedAt, isAaqDialogOpen]);

  const supportCards = useMemo(() => {
    const cards: Array<{ id: string; title: string; description: string; to: string; tone: 'gentle' | 'highlight' }> = [
      {
        id: 'defusion',
        title: 'Défusion courte',
        description: 'Visualiser la pensée comme un nuage et la laisser filer doucement.',
        to: '/app/journal',
        tone: isRigidityHigh ? 'highlight' : 'gentle',
      },
    ];

    if (nyveeHints.includes('grounding') && !cards.some(card => card.id === 'grounding')) {
      cards.unshift({
        id: 'grounding',
        title: 'Ancrage corporel',
        description: 'Prochaine session : repère 5 sensations, 4 éléments à toucher, 3 sons, 2 parfums, 1 mot apaisant.',
        to: '/app/breath',
        tone: 'highlight',
      });
    }

    if (isRigidityHigh || aaqFlexHint === 'transition') {
      cards.push({
        id: 'centrage',
        title: 'Centrage trente secondes',
        description: 'Respiration guidée apaisante pour t’ancrer dans le corps.',
        to: '/app/breath',
        tone: isRigidityHigh ? 'highlight' : 'gentle',
      });
    }

    return cards;
  }, [aaqFlexHint, isRigidityHigh, nyveeHints]);

  const handleAnswerChange = useCallback((itemId: string, value: string) => {
    setAaqAnswers(prev => ({ ...prev, [itemId]: value }));
  }, []);

  const handleOpenAaq = useCallback(async () => {
    if (isAaqDialogOpen) {
      return;
    }
    setIsAaqStarting(true);
    try {
      const catalog = await aaqAssessment.start('fr');
      if (catalog) {
        setAaqCatalog(catalog);
        setAaqAnswers({});
        setIsAaqDialogOpen(true);
      }
    } catch (error) {
      logger.warn('[coach] unable to start AAQ-II', error, 'SYSTEM');
    } finally {
      setIsAaqStarting(false);
    }
  }, [aaqAssessment, isAaqDialogOpen]);

  const handleCloseAaqDialog = useCallback(() => {
    setIsAaqDialogOpen(false);
    setAaqCatalog(null);
  }, []);

  const handleSkipAaq = useCallback(() => {
    const next = Date.now() + WEEK_IN_MS;
    persistSkipUntil(next);
    setSkipUntil(next);
    handleCloseAaqDialog();
    toast({
      title: 'Invitation reportée',
      description: 'Tu pourras réaliser cette auto-évaluation quand tu en ressentiras l’élan.',
    });
  }, [handleCloseAaqDialog, toast]);

  const handleSubmitAaq = useCallback(async () => {
    if (!aaqCatalog) {
      return;
    }

    const missing = aaqCatalog.items.some((item: { id: string }) => !aaqAnswers[item.id]);
    if (missing) {
      toast({
        title: 'Quelques réponses manquent',
        description: 'Prends un instant pour répondre à chaque affirmation avant de valider.',
        variant: 'warning',
      });
      return;
    }

    setIsAaqSubmitting(true);
    try {
      const formatted = Object.fromEntries(
        Object.entries(aaqAnswers).map(([key, value]) => [key, Number(value)]),
      );
      const submitted = await aaqAssessment.submit(formatted);
      if (submitted) {
        toast({
          title: 'Merci pour ton partage',
          description: 'Nous ajustons discrètement le coach selon ta souplesse actuelle.',
        });
        const next = Date.now() + WEEK_IN_MS;
        persistSkipUntil(next);
        setSkipUntil(next);
        handleCloseAaqDialog();
        setAaqAnswers({});
        await refreshFlexSummary();
      } else {
        toast({
          title: 'Envoi interrompu',
          description: 'Tu peux réessayer plus tard, à ton rythme.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      logger.error('[coach] AAQ-II submission failed', error as Error, 'SYSTEM');
      toast({
        title: 'Envoi interrompu',
        description: 'Tu peux réessayer plus tard, à ton rythme.',
        variant: 'destructive',
      });
    } finally {
      setIsAaqSubmitting(false);
    }
  }, [aaqAssessment, aaqAnswers, aaqCatalog, handleCloseAaqDialog, refreshFlexSummary, toast]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const disableSend = useMemo(() => !input.trim() || isSending || !hasConsent, [input, isSending, hasConsent]);

  const handleConsentAccepted = useCallback(async () => {
    setHasConsent(true);
    setShowConsent(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, 'true');
    }
    try {
      await supabase.auth.updateUser({ data: { coach_consent_at: new Date().toISOString() } });
    } catch (error) {
      logger.warn('[coach] unable to persist consent', error, 'SYSTEM');
    }
  }, []);

  const handleSend = useCallback(async (event?: FormEvent) => {
    if (event) event.preventDefault();
    if (disableSend) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    // Initialize session on first message
    if (!sessionStartedAt) {
      setSessionStartedAt(Date.now());
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: newSession } = await supabase
            .from('ai_coach_sessions')
            .insert({
              user_id: user.id,
              coach_personality: personality,
              session_duration: 0,
              messages_count: 0,
            })
            .select('id')
            .single();
          if (newSession?.id) {
            setSessionId(newSession.id);
          }
        }
      } catch (err) {
        logger.warn('[coach] unable to create session', err, 'SYSTEM');
      }
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const hintActive = isRigidityHigh;
    Sentry.configureScope((scope: any) => {
      scope.setTag('aaq2_hint_used', hintActive ? 'true' : 'false');
    });

    const userMessage = createMessage('user', trimmed);
    const assistantId = `assistant-${crypto.randomUUID()}`;
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      streaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsSending(true);

    Sentry.addBreadcrumb({
      category: 'coach',
      message: 'coach:send',
      data: { mode, hasThread: Boolean(threadId), length: trimmed.length },
    });

    try {
      let firstChunk = true;
      // Build conversation history for context
      const conversationHistory = messages
        .filter(m => !m.streaming && m.content)
        .map(m => ({ role: m.role, content: m.content }));

      await sendMessage({
        threadId: threadId ?? undefined,
        message: trimmed,
        mode,
        locale,
        userHash: userHash ?? undefined,
        flexHint: aaqFlexHint === 'unknown' ? undefined : aaqFlexHint,
        personality,
        conversationHistory,
        signal: controller.signal,
        onThread: id => {
          setThreadId(id);
        },
        onDisclaimers: items => {
          setDisclaimers(items);
        },
        onChunk: chunk => {
          setMessages(prev => prev.map(message => {
            if (message.id !== assistantId) return message;
            return { ...message, content: `${message.content}${chunk}` };
          }));
          if (firstChunk) {
            Sentry.addBreadcrumb({ category: 'coach', message: 'coach:reply', data: { mode, aaq2_hint_used: hintActive } });
            firstChunk = false;
          }
        },
        onSuggestions: async (suggestions) => {
          setLastSuggestions({
            techniques: suggestions.techniques,
            resources: suggestions.resources,
            followUpQuestions: suggestions.followUpQuestions,
          });
          
          // Persist techniques, resources and detected emotion to session
          if (sessionId && suggestions) {
            try {
              const updateData: Record<string, unknown> = {
                updated_at: new Date().toISOString(),
              };
              
              if (suggestions.techniques?.length) {
                updateData.techniques_suggested = suggestions.techniques;
              }
              if (suggestions.resources?.length) {
                updateData.resources_provided = suggestions.resources;
              }
              if (suggestions.emotion) {
                // Accumulate emotions detected
                updateData.emotions_detected = { lastEmotion: suggestions.emotion, timestamp: Date.now() };
              }
              
              await supabase
                .from('ai_coach_sessions')
                .update(updateData)
                .eq('id', sessionId);
            } catch (err) {
              logger.warn('[coach] unable to persist suggestions to session', err, 'SYSTEM');
            }
          }
        },
      });

      if (!firstChunk) {
        setMessages(prev => prev.map(message => (message.id === assistantId ? { ...message, streaming: false } : message)));
      } else {
        setMessages(prev => prev.map(message => (message.id === assistantId ? { ...message, streaming: false } : message)));
      }

      setDisclaimers(current => (current.length ? current : COACH_DISCLAIMERS[locale]));
    } catch (error) {
      const sanitized = redactForTelemetry(trimmed);
      Sentry.addBreadcrumb({
        category: 'coach',
        level: 'error',
        message: 'coach:error',
        data: { mode, reason: error instanceof Error ? error.name : 'unknown' },
      });
      Sentry.captureException(error instanceof Error ? error : new Error('coach_send_failed'), {
        extra: { mode, threadId: threadId ?? 'none', sanitizedMessage: sanitized },
      });
      setMessages(prev => prev.map(message => {
        if (message.id !== assistantId) return message;
        return {
          ...message,
          streaming: false,
          content:
            locale === 'fr'
              ? "Le coach est temporairement indisponible. Essaie encore dans quelques instants ou lance une respiration guidée."
              : 'The coach is temporarily unavailable. Try again soon or launch a breathing exercise.',
        };
      }));
    } finally {
      setIsSending(false);
      controllerRef.current = null;
      textareaRef.current?.focus();
    }
  }, [aaqFlexHint, disableSend, input, isRigidityHigh, locale, mode, threadId, userHash, sessionStartedAt, personality]);

  const handleEndSession = useCallback(async () => {
    if (!sessionId || !sessionStartedAt) {
      // No session to end, just show satisfaction if there are messages
      if (messages.length > 0) {
        setShowSatisfaction(true);
      }
      return;
    }

    const duration = Math.floor((Date.now() - sessionStartedAt) / 1000);
    const userMessagesCount = messages.filter(m => m.role === 'user').length;

    try {
      await supabase
        .from('ai_coach_sessions')
        .update({
          session_duration: duration,
          messages_count: userMessagesCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    } catch (err) {
      logger.warn('[coach] unable to update session duration', err, 'SYSTEM');
    }

    setShowSatisfaction(true);
  }, [sessionId, sessionStartedAt, messages]);

  const handleSatisfactionSubmit = useCallback(async (
    satisfaction: number, 
    notes?: string, 
    feedback?: { helpfulness: string | null; wouldRecommend: boolean | null; improvementAreas: string[] }
  ) => {
    if (sessionId) {
      try {
        const updateData: Record<string, unknown> = {
          user_satisfaction: satisfaction,
          session_notes: notes || null,
          updated_at: new Date().toISOString(),
        };
        
        // Store extended feedback in session_notes as JSON if provided
        if (feedback && (feedback.helpfulness || feedback.wouldRecommend !== null || feedback.improvementAreas.length > 0)) {
          const extendedNotes = {
            userComment: notes || '',
            helpfulness: feedback.helpfulness,
            wouldRecommend: feedback.wouldRecommend,
            improvementAreas: feedback.improvementAreas,
          };
          updateData.session_notes = JSON.stringify(extendedNotes);
        }
        
        await supabase
          .from('ai_coach_sessions')
          .update(updateData)
          .eq('id', sessionId);
        toast({
          title: 'Merci pour ton retour !',
          description: 'Ton avis nous aide à améliorer le coach.',
        });
      } catch (err) {
        logger.warn('[coach] unable to save satisfaction', err, 'SYSTEM');
      }
    }
    // Reset session
    setSessionId(null);
    setSessionStartedAt(null);
    setMessages([]);
    setThreadId(null);
    setLastSuggestions({ techniques: [], resources: [], followUpQuestions: [] });
  }, [sessionId, toast]);

  const handleFollowUpQuestion = useCallback((question: string) => {
    setInput(question);
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      handleSend();
    }
  }, [handleSend]);

  const handleModeChange = useCallback((value: CoachMode) => {
    setMode(value);
    Sentry.addBreadcrumb({ category: 'coach', message: 'coach:mode', data: { mode: value } });
  }, []);

  const quickActions = useMemo(() => ([
    { label: 'Respirer une minute', to: '/app/breath' },
    { label: 'Journal rapide', to: '/app/journal' },
    { label: 'Musique apaisante', to: '/app/music' },
  ]), []);

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4">
      {showConsent && <CoachConsent onAccept={handleConsentAccepted} />}

      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Coach IA sécurisé</h1>
            <CoachSessionTimer startedAt={sessionStartedAt} isActive={messages.length > 0} />
          </div>
          <div className="flex items-center gap-2">
            <CoachEndSessionButton 
              hasMessages={messages.length > 0} 
              disabled={isSending} 
              onEnd={handleEndSession} 
            />
            <CoachExportButton messages={messages} disabled={isSending} />
            <CoachSessionHistory />
            {mode === 'b2b' && (
              <Badge variant="secondary">B2B</Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Conversations confidentielles, réponses courtes et bienveillantes.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <CoachPersonalitySelector value={personality} onChange={setPersonality} disabled={isSending || messages.length > 0} />
          {featureAaqEnabled && aaqSummary && (
            <Badge variant="outline" className="bg-blue-50/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100">
              Souplesse : {aaqSummary}
            </Badge>
          )}
        </div>
        <CoachStatsPanel />
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <input type="radio" name="coach-mode" value="b2c" checked={mode === 'b2c'} onChange={() => handleModeChange('b2c')} />
            <span>B2C</span>
          </label>
          <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <input type="radio" name="coach-mode" value="b2b" checked={mode === 'b2b'} onChange={() => handleModeChange('b2b')} />
            <span>B2B</span>
          </label>
        </div>
      </header>
      
      <CoachSatisfactionDialog 
        open={showSatisfaction} 
        onClose={() => setShowSatisfaction(false)}
        onSubmit={handleSatisfactionSubmit}
      />

      {featureAaqEnabled && shouldPromptAaq && (
        <Card className="border border-slate-200 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Prendre un instant AAQ-II
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
              Quelques affirmations pour observer ta flexibilité psychologique. Tes réponses sont anonymisées et tu peux arrêter
              librement.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleOpenAaq} disabled={isAaqStarting}>
              {isAaqStarting ? 'Préparation…' : 'Oui, je participe'}
            </Button>
            <Button type="button" variant="ghost" onClick={handleSkipAaq}>
              Passer
            </Button>
          </CardContent>
        </Card>
      )}

      {featureAaqEnabled && supportCards.length > 0 && (
        <section aria-label="Soutiens sur mesure" className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Soutiens sur mesure</h2>
          <div className="flex flex-col gap-2 md:flex-row">
            {supportCards.map(card => (
              <Link
                key={card.id}
                to={card.to}
                className={`flex-1 rounded-2xl border p-4 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  card.tone === 'highlight'
                    ? 'border-amber-300 bg-amber-50/80 text-amber-900 shadow-sm focus-visible:outline-amber-400 dark:border-amber-500/70 dark:bg-amber-900/30 dark:text-amber-100'
                    : 'border-slate-200 bg-white/70 text-slate-700 shadow-sm focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
                }`}
              >
                <p className="font-semibold">{card.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{card.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        ref={containerRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Partage ce que tu vis en ce moment. Le coach te répondra en moins de 80 mots et pourra proposer une respiration, un journal express ou une musique apaisante.
          </div>
        )}
        <ul className="flex flex-col gap-3">
          {messages.map(message => (
            <li key={message.id} className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                {message.role === 'assistant' ? 'Coach' : 'Toi'} · {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${
                  message.role === 'assistant'
                    ? 'self-start bg-blue-50 text-slate-800 dark:bg-blue-900/40 dark:text-slate-100'
                    : 'self-end bg-emerald-500 text-white'
                } ${message.streaming ? 'border border-dashed border-blue-300 dark:border-blue-600' : ''}`}
              >
                {message.content || (message.streaming ? '…' : '')}
              </div>
            </li>
          ))}
        </ul>
        <CoachTypingIndicator isTyping={isSending} />
      </section>

      {/* Suggestions Panel */}
      <CoachSuggestionsPanel
        techniques={lastSuggestions.techniques}
        resources={lastSuggestions.resources}
        followUpQuestions={lastSuggestions.followUpQuestions}
        onQuestionClick={handleFollowUpQuestion}
      />

      <section aria-label="Actions rapides" className="flex flex-wrap gap-2">
        {quickActions.map(action => (
          <Link
            key={action.to}
            to={action.to}
            className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {action.label}
          </Link>
        ))}
      </section>

      <form onSubmit={handleSend} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <label className="sr-only" htmlFor="coach-message">
          Ton message pour le coach
        </label>
        <textarea
          id="coach-message"
          ref={textareaRef}
          className="h-28 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          placeholder="Décris ton moment présent ou ce dont tu as besoin."
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Astuce : Ctrl + Entrée pour envoyer rapidement.</span>
          <button
            type="submit"
            disabled={disableSend}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            {isSending ? 'Envoi…' : 'Envoyer'}
          </button>
        </div>
      </form>

      <footer className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
        {disclaimers.map(item => (
          <p key={item}>{item}</p>
        ))}
      </footer>

      {featureAaqEnabled && (
        <Dialog open={isAaqDialogOpen} onOpenChange={open => (open ? setIsAaqDialogOpen(true) : handleCloseAaqDialog())}>
          <DialogContent className="max-w-xl border border-slate-200 bg-white/90 text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100">
          <DialogHeader>
            <DialogTitle>Souplesse intérieure du moment</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-300">
              Réponds selon ton ressenti présent. Chaque affirmation nourrit l’adaptation du coach, sans jamais afficher de score.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {aaqCatalog?.items.map((item: { id: string; prompt: string }) => (
              <div key={item.id} className="space-y-2">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.prompt}</p>
                <RadioGroup
                  value={aaqAnswers[item.id] ?? ''}
                  onValueChange={value => handleAnswerChange(item.id, value)}
                  className="space-y-2"
                >
                  {AAQ_SCALE_OPTIONS.map(option => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white/70 p-3 text-sm leading-snug transition dark:border-slate-700 dark:bg-slate-900/40"
                    >
                      <RadioGroupItem value={option.value} className="mt-1" />
                      <span>
                        <span className="font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
                        <span className="block text-xs text-slate-600 dark:text-slate-300">{option.helper}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          <DialogFooter className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-between">
            <Button type="button" variant="ghost" onClick={handleSkipAaq}>
              Passer
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCloseAaqDialog}>
                Fermer
              </Button>
              <Button type="button" onClick={handleSubmitAaq} disabled={isAaqSubmitting}>
                {isAaqSubmitting ? 'Enregistrement…' : 'Valider'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
