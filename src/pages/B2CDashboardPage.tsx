import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  Brain,
  Music,
  BookOpen,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle,
  ChevronRight,
  Wind,
  TreePalm,
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { motion, useReducedMotion } from 'framer-motion';
import { orderQuickActions } from '@/features/dashboard/orchestration/weeklyPlanMapper';
import { useDashboardStore } from '@/store/dashboard.store';
import { useFlags } from '@/core/flags';
import { useAdaptivePlayback } from '@/hooks/music/useAdaptivePlayback';
import { PRESET_DETAILS } from '@/services/music/presetMetadata';
import { Skeleton } from '@/components/ui/skeleton';
import { useClinicalHints } from '@/hooks/useClinicalHints';

const WeeklyPlanCard = React.lazy(() => import('@/components/dashboard/widgets/WeeklyPlanCard'));
const RecentEmotionScansWidget = React.lazy(() => import('@/components/dashboard/widgets/RecentEmotionScansWidget'));
const JournalSummaryCard = React.lazy(() => import('@/components/dashboard/widgets/JournalSummaryCard'));

type QuickAction = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: React.ElementType;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'breath',
    title: 'Respiration douce',
    description: 'Un instant pour revenir au calme',
    to: '/app/breath',
    icon: Wind,
    accent: 'bg-sky-500/10 text-sky-600',
  },
  {
    id: 'nyvee',
    title: 'Parler à Nyvée',
    description: 'Support immédiat et bienveillant',
    to: '/app/coach',
    icon: MessageCircle,
    accent: 'bg-accent/10 text-accent',
  },
  {
    id: 'music',
    title: 'Musique thérapeutique',
    description: 'Sons adaptatifs personnalisés',
    to: '/app/music',
    icon: Music,
    accent: 'bg-info/10 text-info',
  },
  {
    id: 'ambition',
    title: 'Ambition Arcade',
    description: 'Gamifier vos objectifs positifs',
    to: '/app/ambition-arcade',
    icon: Sparkles,
    accent: 'bg-warning/10 text-warning',
  },
  {
    id: 'scan',
    title: 'Scanner mes émotions',
    description: 'Analyse faciale temps réel',
    to: '/app/scan',
    icon: Brain,
    accent: 'bg-primary/10 text-primary',
  },
  {
    id: 'journal',
    title: 'Journal émotionnel',
    description: 'Consignez vos ressentis',
    to: '/app/journal',
    icon: BookOpen,
    accent: 'bg-success/10 text-success',
  },
  {
    id: 'exchange',
    title: 'Exchange Hub',
    description: 'Marchés émotions, temps et confiance',
    to: routes.b2c.exchange(),
    icon: TrendingUp,
    accent: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: 'emotional-park',
    title: 'Parc Émotionnel',
    description: 'Voyage immersif dans vos émotions',
    to: '/app/emotional-park',
    icon: TreePalm,
    accent: 'bg-violet-500/10 text-violet-600',
  },
];

const WeeklyPlanSkeleton: React.FC = () => (
  <Card aria-hidden className="border-dashed">
    <CardHeader className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-5 w-56" />
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-3/4" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const DashboardWidgetSkeleton: React.FC<{ lines?: number }> = ({ lines = 4 }) => (
  <Card aria-hidden className="border-dashed">
    <CardHeader className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-3 w-full" />
      ))}
    </CardContent>
  </Card>
);

export default function B2CDashboardPage() {
  const { runAudit } = useAccessibilityAudit();
  const { has } = useFlags();
  const playback = useAdaptivePlayback();
  const summaryTone = useDashboardStore((state) => state.wellbeingSummary?.tone ?? null);
  const ephemeralSignal = useDashboardStore((state) => state.ephemeralSignal);
  const setEphemeralSignal = useDashboardStore((state) => state.setEphemeralSignal);
  const [activeTone, setActiveTone] = useState(summaryTone);
  const shouldReduceMotion = useReducedMotion();
  const clinicalHints = useClinicalHints('dashboard');
  const clinicalTone = summaryTone;
  const dashboardCta = null;

  const musicSnapshot = playback.snapshot;
  const presetLabel = musicSnapshot?.presetId && musicSnapshot.presetId in PRESET_DETAILS
    ? PRESET_DETAILS[musicSnapshot.presetId as keyof typeof PRESET_DETAILS].label
    : null;
  const musicTitle = musicSnapshot?.title ?? 'Ambiance personnalisée';
  const musicReminderText = musicSnapshot
    ? `${musicTitle} reste à portée, une bulle ${presetLabel ?? 'très douce'} prête à se relancer.`
    : 'Lance une ambiance personnalisée et nous la garderons précieusement ici.';

  useEffect(() => {
    if (ephemeralSignal) {
      setActiveTone(ephemeralSignal.tone);
      setEphemeralSignal(null);
      return;
    }

    if (summaryTone && summaryTone !== activeTone) {
      setActiveTone(summaryTone);
    }
  }, [activeTone, ephemeralSignal, setEphemeralSignal, summaryTone]);

  useEffect(() => {
    if (clinicalTone && clinicalTone !== activeTone) {
      setActiveTone(clinicalTone);
    }
  }, [activeTone, clinicalTone]);

  const orderedQuickActions = useMemo(
    () => orderQuickActions(QUICK_ACTIONS, activeTone ?? undefined).slice(0, 4),
    [activeTone],
  );

  const quickActionTransition = useMemo(
    () => (shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }),
    [shouldReduceMotion],
  );

  usePageSEO({
    title: 'Dashboard Particulier',
    description: 'Suivez vos émotions, accédez à vos modules bien-être et progressez avec EmotionsCare. Scan émotions, musicothérapie, coach IA, journal.',
    keywords: 'dashboard, émotions, scan, musicothérapie, coach IA, bien-être'
  });

  useEffect(() => {
    // Audit d'accessibilité en développement
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={1}
      >
        Aller au contenu principal
      </a>
      <a 
        href="#quick-actions" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller aux actions rapides
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode utilisateur particulier">
                Particulier
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder aux paramètres"
              >
                <Link to="/settings/general">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Paramètres</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder à l'aide"
              >
                <Link to="/help">
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Aide</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        {/* En-tête de bienvenue */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue sur votre espace bien-être
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez vos outils d'intelligence émotionnelle personnalisés
          </p>
        </header>

        {has('FF_MUSIC') && (
          <section aria-labelledby="music-reminder" className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle id="music-reminder">Ta piste du moment</CardTitle>
                <CardDescription>
                  Un rappel tout en mots de ta dernière bulle sonore.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{musicReminderText}</p>
                <Button asChild size="sm">
                  <Link to="/app/music" aria-label="Revenir à la musique adaptative">
                    Lancer la lecture
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Rituel hebdomadaire WHO-5 */}
        <section aria-labelledby="weekly-plan" className="mb-8">
          <h2 id="weekly-plan" className="sr-only">
            Plan de la semaine
          </h2>
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <WeeklyPlanSkeleton />
              </div>
            )}
          >
            <WeeklyPlanCard />
          </Suspense>
        </section>


        {/* Statistiques rapides */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="text-xl font-semibold mb-4">
            Votre progression aujourd'hui
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sessions d'analyse
                </CardTitle>
                <CardDescription className="sr-only">
                  Nombre de sessions d'analyse émotionnelle effectuées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">3</div>
                  <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
                </div>
                <Progress value={60} className="mt-2" aria-label="Progression 60%" />
                <p className="text-xs text-muted-foreground mt-1">
                  +20% par rapport à hier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Temps de méditation
                </CardTitle>
                <CardDescription className="sr-only">
                  Durée totale de méditation aujourd'hui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">25min</div>
                  <Calendar className="h-4 w-4 text-info" aria-hidden="true" />
                </div>
                <Progress value={83} className="mt-2" aria-label="Progression 83%" />
                <p className="text-xs text-muted-foreground mt-1">
                  Objectif: 30min
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Humeur générale
                </CardTitle>
                <CardDescription className="sr-only">
                  Évaluation de votre humeur générale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">😊</div>
                  <Target className="h-4 w-4 text-warning" aria-hidden="true" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Positive
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tendance stable
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Actions rapides */}
        <section id="quick-actions" aria-labelledby="actions-title" className="mb-8">
          <h2 id="actions-title" className="text-xl font-semibold mb-4">
            Actions rapides adaptées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orderedQuickActions.map((action) => {
              const ActionIcon = action.icon as React.ComponentType<{ className?: string }>;
              return (
                <motion.div key={action.id} layout transition={quickActionTransition} className="h-full">
                  <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
                    <Link to={action.to} className="block p-6 h-full" aria-describedby={`${action.id}-desc`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.accent}`}>
                          <ActionIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium">{action.title}</h3>
                          <p id={`${action.id}-desc`} className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight
                          className="h-4 w-4 ml-auto translate-x-0 group-hover:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="recent-scans-section" className="mb-8">
          <h2 id="recent-scans-section" className="sr-only">
            Historique Emotion Scan
          </h2>
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <DashboardWidgetSkeleton lines={6} />
              </div>
            )}
          >
            <RecentEmotionScansWidget />
          </Suspense>
        </section>

        <section aria-labelledby="journal-summary-section" className="mb-8">
          <h2 id="journal-summary-section" className="sr-only">
            Synthèse du journal émotionnel
          </h2>
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <DashboardWidgetSkeleton lines={5} />
              </div>
            )}
          >
            <JournalSummaryCard />
          </Suspense>
        </section>

        {/* Recommandations personnalisées */}
        <section aria-labelledby="recommendations-title">
          <h2 id="recommendations-title" className="text-xl font-semibold mb-4">
            Recommandé pour vous
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500/10 rounded">
                  <Target className="h-4 w-4 text-orange-500" aria-hidden="true" />
                </div>
                <span>Session de respiration guidée</span>
              </CardTitle>
              <CardDescription>
                Basé sur votre niveau de stress détecté ce matin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Une session de 10 minutes pour réduire le stress et améliorer votre concentration.
              </p>
              <Button asChild aria-describedby="breath-session-desc">
                <Link to="/app/breath">
                  Commencer la session
                </Link>
              </Button>
              <p id="breath-session-desc" className="sr-only">
                Démarre une session de respiration guidée de 10 minutes
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Votre bien-être, notre priorité</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions
                </Link>
                <Link to="/help" className="hover:text-foreground">
                  Support
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}