// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { captureException } from '@/lib/ai-monitoring';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  HeartHandshake,
  MessageCircle,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import PageSEO from '@/components/seo/PageSEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { computeCommunityUIHints, serializeHints } from '@/features/orchestration';
import { createSession } from '@/services/sessions/sessionsApi';

const BANNER_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
const STORAGE_KEYS = {
  UCLA3: 'community_nudge_ucla3_last_seen',
  MSPSS: 'community_nudge_mspss_last_seen',
} as const;

const SENSITIVE_PATTERNS = [
  /suicide/i,
  /me\s+faire\s+mal/i,
  /violence\s+grave/i,
  /danger\s+immédiat/i,
  /harc[eè]lement/i,
];

const EMPATHY_TEMPLATES = [
  {
    id: 'presence',
    label: 'Présence discrète',
    text: 'Je suis là si tu veux poser des mots, sans pression. 🤍',
  },
  {
    id: 'resonance',
    label: 'Résonance douce',
    text: 'Ton message me touche, merci de le partager. On peut respirer ensemble si tu veux.',
  },
  {
    id: 'support',
    label: 'Soutien ouvert',
    text: 'Quand tu en as l’envie, on peut échanger. Je t’écoute avec douceur.',
  },
] as const;

const REPORT_REASONS = [
  { id: 'tone', label: 'Ton à adoucir' },
  { id: 'privacy', label: 'Respect de l’intimité' },
  { id: 'other', label: 'Autre' },
] as const;

type EmpathyTemplateId = (typeof EMPATHY_TEMPLATES)[number]['id'];

interface CommunityReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  autoFlagged?: boolean;
}

interface CommunityPost {
  id: string;
  alias: string;
  avatar: string;
  content: string;
  focus: string;
  timestamp: string;
  replies: CommunityReply[];
  autoFlagged?: boolean;
}

type ReportDraft = {
  postId: string | null;
  reason: (typeof REPORT_REASONS)[number]['id'];
  message: string;
};

const nowTimestamp = () => new Date().toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
});

const initialPosts: CommunityPost[] = [
  {
    id: 'aurora',
    alias: 'Aurore',
    avatar: '🫧',
    content: 'Je traverse un moment flottant et j’essaie de rester douce avec moi-même. Merci d’être là.',
    focus: 'demande d’écoute',
    timestamp: 'il y a 1 h',
    replies: [
      {
        id: 'solstice',
        author: 'Solstice',
        content: 'On reste proches de toi. Respire comme il te semble bon, on t’accompagne.',
        timestamp: 'il y a 35 min',
      },
    ],
  },
  {
    id: 'lumen',
    alias: 'Lumen',
    avatar: '🌿',
    content: 'Petit défi : dire non aujourd’hui sans culpabiliser. Qui veut pratiquer avec moi ? 🙂',
    focus: 'partage d’expérience',
    timestamp: 'il y a 2 h',
    replies: [],
  },
  {
    id: 'safran',
    alias: 'Safran',
    avatar: '🌼',
    content: 'Je cherche une phrase douce pour rassurer une amie. Des idées ?',
    focus: 'entraide',
    timestamp: 'il y a 3 h',
    replies: [
      {
        id: 'iris',
        author: 'Iris',
        content: 'Parfois j’écris “je ne sais pas tout résoudre mais je reste près de toi”. Ça l’aide beaucoup.',
        timestamp: 'il y a 2 h',
      },
    ],
  },
];

const useBannerCooldown = (key: keyof typeof STORAGE_KEYS) => {
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEYS[key]);
    if (stored) {
      const elapsed = Date.now() - Number(stored);
      if (!Number.isNaN(elapsed) && elapsed < BANNER_COOLDOWN_MS) {
        setIsCoolingDown(true);
      }
    }
  }, [key]);

  const markSeen = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS[key], String(Date.now()));
    setIsCoolingDown(true);
  }, [key]);

  return { isCoolingDown, markSeen } as const;
};

const detectSensitiveTerm = (message: string) => {
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(message)) {
      return pattern.source;
    }
  }
  return null;
};

const B2CCommunautePage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();
  const { has } = useFlags();

  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [activeReplyPost, setActiveReplyPost] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { templateId: EmpathyTemplateId; message: string }>>({});
  const [newPost, setNewPost] = useState('');
  const [reportDraft, setReportDraft] = useState<ReportDraft>({ postId: null, reason: REPORT_REASONS[0].id, message: '' });
  const [showSocialConfirm, setShowSocialConfirm] = useState(false);

  const communityEnabled = has('FF_COMMUNITY');
  const orchestratorEnabled = has('FF_ORCH_COMMUNITY');
  const uclaInstrumentEnabled = has('FF_ASSESS_UCLA3');
  const mspssInstrumentEnabled = has('FF_ASSESS_MSPSS');

  const uclaAssessment = useAssessment('UCLA3');
  const mspAssessment = useAssessment('MSPSS');

  const { data: uclaHistory } = useAssessmentHistory('UCLA3', {
    limit: 1,
    enabled: communityEnabled && uclaInstrumentEnabled && uclaAssessment.state.canDisplay,
  });
  const { data: mspssHistory } = useAssessmentHistory('MSPSS', {
    limit: 1,
    enabled: communityEnabled && mspssInstrumentEnabled && mspAssessment.state.canDisplay,
  });

  const latestUCLA = uclaHistory?.[0];
  const latestMSPSS = mspssHistory?.[0];

  const uclaCooldown = useBannerCooldown('UCLA3');

  const resolvedUclaLevel = orchestratorEnabled && uclaInstrumentEnabled
    ? latestUCLA?.level ?? uclaAssessment.state.lastComputation?.level
    : undefined;
  const resolvedMspssLevel = orchestratorEnabled && mspssInstrumentEnabled
    ? latestMSPSS?.level ?? mspAssessment.state.lastComputation?.level
    : undefined;

  const consented = Boolean(uclaAssessment.state.hasConsent && mspAssessment.state.hasConsent);

  const communityLevels = useMemo(
    () => ({
      uclaLevel: typeof resolvedUclaLevel === 'number' ? resolvedUclaLevel : undefined,
      mspssLevel: typeof resolvedMspssLevel === 'number' ? resolvedMspssLevel : undefined,
      consented,
    }),
    [consented, resolvedMspssLevel, resolvedUclaLevel],
  );

  const rawCommunityHints = useMemo(
    () => (orchestratorEnabled ? computeCommunityUIHints(communityLevels) : []),
    [communityLevels, orchestratorEnabled],
  );

  const communityHints = useMemo(() => {
    if (!orchestratorEnabled) return [];
    return rawCommunityHints.filter((hint) => {
      if (hint.action === 'show_banner' && uclaCooldown.isCoolingDown) {
        return false;
      }
      return true;
    });
  }, [orchestratorEnabled, rawCommunityHints, uclaCooldown.isCoolingDown]);

  const shouldShowBanner = communityHints.some(
    (hint) => hint.action === 'show_banner' && hint.key === 'listen_two_minutes',
  );
  const shouldPinSocialCocon = communityHints.some(
    (hint) => hint.action === 'pin_card' && hint.key === 'social_cocon',
  );
  const shouldSuggestReplies = communityHints.some(
    (hint) => hint.action === 'show_empathic_replies',
  );

  const bannerTrapRef = useRef<HTMLDivElement | null>(null);
  const bannerCtaRef = useRef<HTMLButtonElement | null>(null);
  const serializedHints = useMemo(() => serializeHints(communityHints), [communityHints]);
  const hintsSignature = useMemo(() => serializedHints.join('|'), [serializedHints]);
  const lastLoggedSignature = useRef<string | null>(null);

  useEffect(() => {
    Sentry.addBreadcrumb({ category: 'community:view', message: 'open', level: 'info' });
  }, []);

  useEffect(() => {
    if (!shouldShowBanner) {
      return;
    }
    if (bannerCtaRef.current) {
      bannerCtaRef.current.focus();
    }
    uclaCooldown.markSeen();
  }, [shouldShowBanner, uclaCooldown]);

  useEffect(() => {
    if (!shouldShowBanner) return;
    const trapNode = bannerTrapRef.current;
    if (!trapNode) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = trapNode.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          event.preventDefault();
        }
        return;
      }

      if (document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    };

    trapNode.addEventListener('keydown', handleKeyDown);
    return () => {
      trapNode.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldShowBanner]);

  useEffect(() => {
    if (!orchestratorEnabled) return;
    if (hintsSignature === lastLoggedSignature.current) return;
    lastLoggedSignature.current = hintsSignature;

    Sentry.addBreadcrumb({
      category: 'orch:community',
      message: 'apply',
      level: 'info',
      data: { hints: serializedHints },
    });

    if (serializedHints.length === 0) {
      return;
    }

    void createSession({
      type: 'community',
      duration_sec: 0,
      meta: { hints: serializedHints },
    }).catch((error) => {
      Sentry.captureException(error);
    });
  }, [orchestratorEnabled, serializedHints, hintsSignature]);

  const transitionClasses = prefersReducedMotion ? '' : 'transition-colors duration-200';

  const handleCreatePost = useCallback(() => {
    const value = newPost.trim();
    if (!value) {
      toast({ title: 'Message vide', description: 'Écris quelques mots avant de partager.' });
      return;
    }

    const sensitiveTerm = detectSensitiveTerm(value);
    const newEntry: CommunityPost = {
      id: `moi-${Date.now()}`,
      alias: 'Moi',
      avatar: '✨',
      content: value,
      focus: 'partage personnel',
      timestamp: `à ${nowTimestamp()}`,
      replies: [],
      autoFlagged: Boolean(sensitiveTerm),
    };

    setPosts((prev) => [newEntry, ...prev]);
    setNewPost('');
    setActiveReplyPost(null);

    Sentry.addBreadcrumb({ category: 'community:reply', message: 'post:create', level: 'info' });

    if (sensitiveTerm) {
      Sentry.captureMessage('community:auto-flag', {
        level: 'warning',
        tags: { source: 'post' },
        extra: { term: sensitiveTerm, length: value.length },
      });
      toast({
        title: 'Message partagé avec soin',
        description: 'Notre équipe de veille reçoit un signal discret.',
      });
    } else {
      toast({ title: 'Merci pour ce partage', description: 'Ton message rejoint la communauté.' });
    }
  }, [newPost, toast]);

  const handleQuickEmpathyCopy = useCallback(
    (templateId: EmpathyTemplateId) => {
      const template = EMPATHY_TEMPLATES.find((entry) => entry.id === templateId);
      if (!template) return;

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        void navigator.clipboard
          .writeText(template.text)
          .then(() => {
            toast({
              title: 'Texte prêt',
              description: 'Ton message empathique est copié, tu peux le coller où tu veux.',
            });
          })
          .catch(() => {
            toast({ title: 'Copie indisponible', description: template.text });
          });
        return;
      }

      toast({ title: 'Suggestion', description: template.text });
    },
    [toast],
  );

  const handleTemplateSelect = useCallback((postId: string, templateId: EmpathyTemplateId) => {
    const template = EMPATHY_TEMPLATES.find((entry) => entry.id === templateId) ?? EMPATHY_TEMPLATES[0];
    setDrafts((prev) => ({
      ...prev,
      [postId]: {
        templateId: template.id,
        message: template.text,
      },
    }));
  }, []);

  const openReply = useCallback(
    (postId: string) => {
      setActiveReplyPost((current) => (current === postId ? null : postId));
      setDrafts((prev) => {
        if (prev[postId]) return prev;
        const fallback = EMPATHY_TEMPLATES[0];
        return {
          ...prev,
          [postId]: { templateId: fallback.id, message: fallback.text },
        };
      });
    },
    [],
  );

  const handleReplyChange = useCallback((postId: string, value: string) => {
    setDrafts((prev) => {
      const entry = prev[postId];
      if (!entry) return prev;
      return { ...prev, [postId]: { ...entry, message: value } };
    });
  }, []);

  const handleSubmitReply = useCallback(
    (postId: string) => {
      const draft = drafts[postId];
      if (!draft || !draft.message.trim()) {
        toast({ title: 'Message vide', description: 'Écris quelques mots avant de répondre.' });
        return;
      }

      const sensitiveTerm = detectSensitiveTerm(draft.message);
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;
          const reply: CommunityReply = {
            id: `${postId}-reply-${Date.now()}`,
            author: 'Moi',
            content: draft.message.trim(),
            timestamp: `à ${nowTimestamp()}`,
            autoFlagged: Boolean(sensitiveTerm),
          };
          return { ...post, replies: [...post.replies, reply] };
        }),
      );

      Sentry.addBreadcrumb({
        category: 'community:reply',
        message: 'reply:submit',
        level: 'info',
        data: { template: draft.templateId },
      });

      if (sensitiveTerm) {
        Sentry.captureMessage('community:auto-flag', {
          level: 'warning',
          tags: { source: 'reply' },
          extra: { term: sensitiveTerm, length: draft.message.length },
        });
        toast({
          title: 'Réponse envoyée avec veille renforcée',
          description: 'Un signal doux est envoyé à la modération.',
        });
      } else {
        toast({ title: 'Réponse partagée', description: 'Merci pour cette parole attentive.' });
      }

      setActiveReplyPost(null);
    },
    [drafts, toast],
  );

  const openReport = useCallback((postId: string) => {
    setReportDraft({ postId, reason: REPORT_REASONS[0].id, message: '' });
  }, []);

  const closeReport = useCallback(() => {
    setReportDraft({ postId: null, reason: REPORT_REASONS[0].id, message: '' });
  }, []);

  const submitReport = useCallback(() => {
    if (!reportDraft.postId) return;

    Sentry.captureMessage('community:report', {
      level: 'info',
      tags: { source: 'user-report' },
      extra: {
        reason: reportDraft.reason,
        hasMessage: reportDraft.message.trim().length > 0,
      },
    });

    toast({ title: 'Signalement transmis en douceur', description: 'Merci, une personne dédiée va regarder.' });
    closeReport();
  }, [closeReport, reportDraft, toast]);

  const handleSocialConfirm = useCallback(() => {
    setShowSocialConfirm(false);
    Sentry.addBreadcrumb({ category: 'community:view', message: 'open_social_cocon', level: 'info' });
    navigate('/app/social-cocon');
  }, [navigate]);

  if (!communityEnabled) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-6 text-center">
        <PageSEO title="Communauté" description="Espace communautaire" noIndex />
        <Shield className="mb-4 h-8 w-8 text-emerald-500" aria-hidden="true" />
        <h1 className="mb-2 text-2xl font-semibold">Communauté en arrivée prochaine</h1>
        <p className="max-w-md text-muted-foreground">
          L’espace d’entraide est en pause pour certains comptes. Revenez bientôt ou explorez le Social Cocon.
        </p>
        <Button className="mt-6" onClick={() => navigate('/app/social-cocon')}>
          Ouvrir Social Cocon
        </Button>
      </div>
    );
  }

  return (
    <ZeroNumberBoundary as="div" className="mx-auto min-h-screen max-w-4xl bg-gradient-to-b from-emerald-50 via-white to-white">
      <PageSEO title="Communauté" description="Partage et entraide" noIndex />

      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label="Revenir à la page précédente"
          className={transitionClasses}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold">Communauté</h1>
          <p className="text-xs text-muted-foreground">On se répond en douceur, sans performance.</p>
        </div>
        <div aria-hidden="true" className="h-8 w-8" />
      </header>

      <main className="space-y-6 px-4 pb-16 pt-6">
        <section className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="mt-1 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-emerald-700">
                Ici, on pratique la bienveillance active : on lit attentivement, on propose une présence, jamais de jugement.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pour respecter la navigation clavier, tous les éléments sont accessibles sans souris.
              </p>
            </div>
          </div>
        </section>

        {shouldShowBanner && (
          <section
            ref={bannerTrapRef}
            className="rounded-3xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-sm focus:outline-none"
            role="region"
            aria-live="polite"
            aria-label="Invitation Social Cocon"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-emerald-700">
                  <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                  <span>Besoin d’écoute douce</span>
                </div>
                <h2 className="text-lg font-semibold text-emerald-900">Un espace vocal pour souffler</h2>
                <p className="text-sm text-emerald-700">
                  On te propose d’ouvrir Social Cocon pendant quelques minutes, sans partage de chiffres ni de pression.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <Button
                  ref={bannerCtaRef}
                  onClick={() => setShowSocialConfirm(true)}
                  className="bg-emerald-600 text-primary-foreground hover:bg-emerald-600/90"
                >
                  Écoute 2 min ?
                </Button>
                <span className="text-xs text-emerald-700">Invitation optionnelle, tu restes libre.</span>
              </div>
            </div>
          </section>
        )}

        {shouldSuggestReplies && (
          <section className="rounded-3xl border border-sky-100 bg-sky-50/80 p-5 shadow-sm" aria-live="polite">
            <header className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-sky-700">Réponses prêtes à envoyer</h2>
            </header>
            <p className="mt-2 text-sm text-sky-700">
              Sélectionne une suggestion, elle sera copiée pour l’envoyer en un geste.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EMPATHY_TEMPLATES.map((template) => (
                <Button
                  key={template.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickEmpathyCopy(template.id)}
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
          <header className="flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold text-emerald-700">Partager un mot à la communauté</h2>
              <p className="text-xs text-muted-foreground">Pas de compteur, seulement une trace douce de votre présence.</p>
            </div>
          </header>
          <div className="mt-3 space-y-3">
            <Textarea
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              placeholder="Déposer ici un court message ou un audio résumé."
              aria-label="Nouveau message pour la communauté"
              className="min-h-[100px] resize-y"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleCreatePost}>Publier avec douceur</Button>
              <span className="text-xs text-muted-foreground">Avant d’envoyer, prends un instant pour respirer.</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="sr-only">Fil empathique</h2>
          <ul className="space-y-4">
            {shouldPinSocialCocon && (
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-sm">
                <article>
                  <header className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                      <h3 className="text-sm font-semibold text-emerald-800">Social Cocon en accès rapide</h3>
                    </div>
                    <Badge variant="outline" className="text-xs text-emerald-700">
                      Audio + texte confidentiel
                    </Badge>
                  </header>
                  <p className="mt-2 text-sm text-emerald-700">
                    Tu peux ouvrir une room privée instantanément pour une écoute sans chiffre ni historique.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button size="sm" onClick={() => setShowSocialConfirm(true)}>
                      Rejoindre le Social Cocon
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/app/social-cocon')}>
                      Voir les rooms
                    </Button>
                  </div>
                </article>
              </li>
            )}
            {posts.map((post) => (
              <li key={post.id} className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm focus-within:ring-2 focus-within:ring-emerald-200" tabIndex={-1}>
                <article aria-label={`Message de ${post.alias}`}>
                  <header className="flex items-start gap-3">
                    <div aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-emerald-800">{post.alias}</span>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                          {post.focus}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.content}</p>
                      {post.autoFlagged && (
                        <p className="mt-2 text-xs text-amber-600">Notre équipe a reçu un signal discret pour accompagner ce message.</p>
                      )}
                    </div>
                  </header>

                  {post.replies.length > 0 && (
                    <ul className="mt-4 space-y-3 border-l border-emerald-100 pl-4" aria-label={`Réponses à ${post.alias}`}>
                      {post.replies.map((reply) => (
                        <li key={reply.id} className="rounded-xl bg-emerald-50/60 p-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-700">
                            <span className="font-semibold">{reply.author}</span>
                            <span className="text-muted-foreground">{reply.timestamp}</span>
                          </div>
                          <p className="mt-1 text-sm text-emerald-900">{reply.content}</p>
                          {reply.autoFlagged && (
                            <p className="mt-2 text-xs text-amber-600">Veille renforcée activée pour cette réponse.</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  <footer className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => openReply(post.id)}
                      aria-expanded={activeReplyPost === post.id}
                      className={transitionClasses}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Répondre en douceur
                    </Button>
                    <Button variant="ghost" onClick={() => openReport(post.id)} className={transitionClasses}>
                      Signaler doucement
                    </Button>
                  </footer>

                  {activeReplyPost === post.id && (
                    <div className="mt-4 space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4" role="region" aria-label="Rédiger une réponse empathique">
                      <div className="flex flex-wrap items-center gap-2">
                        {EMPATHY_TEMPLATES.map((template) => (
                          <Button
                            key={template.id}
                            variant={drafts[post.id]?.templateId === template.id ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => handleTemplateSelect(post.id, template.id)}
                            aria-pressed={drafts[post.id]?.templateId === template.id}
                          >
                            {template.label}
                          </Button>
                        ))}
                      </div>
                      <Textarea
                        value={drafts[post.id]?.message ?? ''}
                        onChange={(event) => handleReplyChange(post.id, event.target.value)}
                        aria-label="Message de réponse"
                        className="min-h-[120px] resize-y"
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={() => handleSubmitReply(post.id)}>Envoyer la réponse</Button>
                        <Button variant="ghost" onClick={() => setActiveReplyPost(null)}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Dialog
        open={reportDraft.postId !== null}
        onOpenChange={(open) => {
          if (!open) closeReport();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler doucement</DialogTitle>
            <DialogDescription>
              Indique la raison principale et, si tu le souhaites, ajoute un message pour l’équipe de modération.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="report-reason">Raison</Label>
              <Select
                value={reportDraft.reason}
                onValueChange={(value) => setReportDraft((prev) => ({ ...prev, reason: value as ReportDraft['reason'] }))}
              >
                <SelectTrigger id="report-reason" aria-label="Choisir la raison du signalement">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="report-message">Message (optionnel)</Label>
              <Textarea
                id="report-message"
                value={reportDraft.message}
                onChange={(event) => setReportDraft((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="Décris ce qui t’a mis mal à l’aise."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeReport}>
              Annuler
            </Button>
            <Button onClick={submitReport}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSocialConfirm} onOpenChange={setShowSocialConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejoindre le Social Cocon</DialogTitle>
            <DialogDescription>
              Cet espace vocal est modéré en continu. Nous vérifions que tu es prêt·e à y entrer en douceur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Une fois dans le Cocon, garde les règles de confidentialité et préviens si tu entends une situation à risque.</p>
            <p>Besoin d’aide supplémentaire ? L’équipe de veille est joignable depuis le bouton signaler.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowSocialConfirm(false)}>
              Rester ici
            </Button>
            <Button onClick={handleSocialConfirm}>Entrer dans le Cocon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ZeroNumberBoundary>
  );
};

export default B2CCommunautePage;
