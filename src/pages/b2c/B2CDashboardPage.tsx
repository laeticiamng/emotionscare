// @ts-nocheck
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scene3DErrorBoundary } from '@/components/3d/Scene3DErrorBoundary';

const DashboardBackground3D = lazy(() => import('@/components/3d/DashboardBackground3D'));
import { useOptimizedPage } from '@/hooks/useOptimizedPage';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Card3D from '@/components/ui/Card3D';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePageSEO } from '@/hooks/usePageSEO';
import {
  Brain,
  Music,
  BookOpen,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Settings,
  HelpCircle,
  ChevronRight,
  Wind,
  Flame,
  RefreshCw,
  Heart,
  AlertCircle,
  Loader2,
  Bell,
  Activity,
  Compass,
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, staggerItem, STAGGER } from '@/lib/motion';
import { orderQuickActions } from '@/features/dashboard/orchestration/weeklyPlanMapper';
import { useDashboardStore } from '@/store/dashboard.store';
import { useFlags } from '@/core/flags';
import { useAdaptivePlayback } from '@/hooks/music/useAdaptivePlayback';
import { PRESET_DETAILS } from '@/services/music/presetMetadata';
import { Skeleton } from '@/components/ui/skeleton';
import { useClinicalHints } from '@/hooks/useClinicalHints';
import { useUserStatsQuery, useUserStatsRealtime } from '@/hooks/useUserStatsQuery';
import { useWellbeingScore } from '@/hooks/useWellbeingScore';
import { useAuth } from '@/contexts/AuthContext';
import { useFirstTimeGuide } from '@/hooks/useFirstTimeGuide';
import { useDashboardOnboarding } from '@/hooks/useDashboardOnboarding';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const WeeklyPlanCard = lazy(() => import('@/components/dashboard/widgets/WeeklyPlanCard'));
const RecentEmotionScansWidget = lazy(() => import('@/components/dashboard/widgets/RecentEmotionScansWidget'));
const JournalSummaryCard = lazy(() => import('@/components/dashboard/widgets/JournalSummaryCard'));
const WeeklyTrendChart = lazy(() => import('@/components/dashboard/widgets/WeeklyTrendChart'));
const GoalsProgressWidget = lazy(() => import('@/components/dashboard/widgets/GoalsProgressWidget'));
const NotificationsWidget = lazy(() => import('@/components/dashboard/widgets/NotificationsWidget'));
const ModulesNavigationGrid = lazy(() => import('@/components/dashboard/ModulesNavigationGrid'));
const FirstTimeGuide = lazy(() => import('@/components/onboarding/FirstTimeGuide'));
const AIRecommendationsWidget = lazy(() => import('@/components/dashboard/AIRecommendationsWidget'));
const DashboardOnboarding = lazy(() => import('@/components/onboarding/DashboardOnboarding'));
const MoodQuickLog = lazy(() => import('@/components/dashboard/MoodQuickLog'));
const QuickAccessGrid = lazy(() => import('@/components/dashboard/QuickAccessGrid'));
const ProgressionWidget = lazy(() => import('@/components/dashboard/ProgressionWidget'));

type QuickAction = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: React.ElementType;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'scan', title: 'Scanner mes émotions', description: 'Analyse IA en temps réel', to: '/app/scan', icon: Brain, accent: 'bg-primary/10 text-primary' },
  { id: 'breath', title: 'Respiration guidée', description: 'Retrouver le calme en 2 min', to: '/app/breath', icon: Wind, accent: 'bg-sky-500/10 text-sky-600' },
  { id: 'coach', title: 'Parler au Coach IA', description: 'Soutien personnalisé immédiat', to: '/app/coach', icon: MessageCircle, accent: 'bg-accent/10 text-accent' },
  { id: 'music', title: 'Musicothérapie', description: 'Sons adaptatifs à votre humeur', to: '/app/music', icon: Music, accent: 'bg-info/10 text-info' },
  { id: 'journal', title: 'Mon journal', description: 'Consigner mes ressentis', to: '/app/journal', icon: BookOpen, accent: 'bg-success/10 text-success' },
];

const NAV_ACTIONS = [
  { to: '/navigation', label: 'Explorer tous les modules', icon: Compass },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/settings', label: 'Paramètres', icon: Settings },
  { to: '/help', label: 'Aide', icon: HelpCircle },
];

const WeeklyPlanSkeleton: React.FC = () => (
  <div aria-hidden className="rounded-2xl border border-dashed border-border/50 p-6 space-y-4">
    <Skeleton className="h-5 w-56 skeleton-calm" />
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full skeleton-calm rounded-xl" />
      ))}
    </div>
  </div>
);

const DashboardWidgetSkeleton: React.FC<{ lines?: number }> = ({ lines = 4 }) => (
  <div aria-hidden className="rounded-2xl border border-dashed border-border/50 p-6 space-y-4">
    <Skeleton className="h-4 w-40 skeleton-calm" />
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full skeleton-calm" />
      ))}
    </div>
  </div>
);

const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  iconColor: string;
  helper?: string;
  loading?: boolean;
}> = ({ label, value, icon: Icon, iconColor, helper, loading }) => (
  <Card3D className="p-0" hoverLift animate={false}>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        {loading ? <Skeleton className="h-8 w-12 skeleton-calm" /> : <div className="text-2xl font-bold">{value}</div>}
        <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
      </div>
      {helper && <p className="text-xs text-muted-foreground mt-2">{helper}</p>}
    </CardContent>
  </Card3D>
);

export default function B2CDashboardPage() {
  useOptimizedPage('B2CDashboardPage');
  const { user } = useAuth();
  const { runAudit } = useAccessibilityAudit();
  const { has } = useFlags();
  const playback = useAdaptivePlayback();
  const summaryTone = useDashboardStore((state) => state.wellbeingSummary?.tone ?? null);
  const ephemeralSignal = useDashboardStore((state) => state.ephemeralSignal);
  const setEphemeralSignal = useDashboardStore((state) => state.setEphemeralSignal);
  const [activeTone, setActiveTone] = useState(summaryTone);
  const shouldReduceMotion = useReducedMotion();
  const { hints: clinicalHintsList, isLoading: hintsLoading, error: hintsError, refresh: refreshHints } = useClinicalHints('dashboard');

  const { shouldShowGuide, markAsCompleted, markAsDismissed } = useFirstTimeGuide();
  const { shouldShowOnboarding, completeOnboarding, skipOnboarding } = useDashboardOnboarding();

  const { stats: userStats, loading: statsLoading, refetch: refetchStats } = useUserStatsQuery();
  useUserStatsRealtime();
  const { score: wellbeingScore, trend: wellbeingTrend, loading: wellbeingLoading } = useWellbeingScore();

  // Auto-refresh toutes les 5 minutes (uniquement stats)
  useEffect(() => {
    const interval = setInterval(() => refetchStats(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refetchStats]);

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
    if (summaryTone && summaryTone !== activeTone) setActiveTone(summaryTone);
  }, [activeTone, ephemeralSignal, setEphemeralSignal, summaryTone]);

  const orderedQuickActions = useMemo(
    () => orderQuickActions(QUICK_ACTIONS, activeTone ?? undefined).slice(0, 4),
    [activeTone],
  );

  const quickActionTransition = useMemo(
    () => (shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }),
    [shouldReduceMotion],
  );

  usePageSEO({
    title: 'Tableau de bord — EmotionsCare',
    description: 'Suivez vos émotions, accédez à vos modules bien-être et progressez avec EmotionsCare.',
    keywords: 'dashboard, émotions, scan, musicothérapie, coach IA, bien-être'
  });

  useEffect(() => {
    if (import.meta.env.DEV) setTimeout(runAudit, 1000);
  }, [runAudit]);

  return (
    <>
      {shouldShowOnboarding && (
        <Suspense fallback={null}>
          <DashboardOnboarding onComplete={completeOnboarding} onSkip={skipOnboarding} />
        </Suspense>
      )}
      {shouldShowGuide && !shouldShowOnboarding && (
        <Suspense fallback={null}>
          <FirstTimeGuide onComplete={markAsCompleted} onDismiss={markAsDismissed} />
        </Suspense>
      )}

      <div data-testid="page-root" className="min-h-screen bg-background relative">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <Scene3DErrorBoundary>
            <Suspense fallback={null}>
              <DashboardBackground3D className="opacity-30" />
            </Suspense>
          </Scene3DErrorBoundary>
        </div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Aller au contenu principal
        </a>

        {/* Navigation principale — TooltipProvider mutualisé */}
        <nav role="navigation" aria-label="Navigation du tableau de bord" className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40 safe-area-top">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                <h2 className="text-base sm:text-lg font-semibold truncate">EmotionsCare</h2>
                <Badge variant="secondary" aria-label="Mode utilisateur particulier">Particulier</Badge>
              </div>
              <TooltipProvider delayDuration={200}>
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  {NAV_ACTIONS.map(({ to, label, icon: Icon }) => (
                    <Tooltip key={to}>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" asChild aria-label={label}>
                          <Link to={to}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </nav>

        <main id="main-content" role="main" className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
          {/* En-tête de bienvenue */}
          <motion.header
            className="mb-6 sm:mb-8"
            variants={staggerContainer(STAGGER.fast)}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate="visible"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <motion.div variants={staggerItem}>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  Bonjour{user?.user_metadata?.first_name ? ` ${user.user_metadata.first_name}` : ''} 👋
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Prenez soin de vous aujourd'hui
                </p>
              </motion.div>
              <motion.div variants={staggerItem} className="text-right text-muted-foreground">
                <p className="text-sm capitalize">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</p>
              </motion.div>
            </div>
          </motion.header>

          {/* Humeur du jour + Progression */}
          <section className="mb-6 sm:mb-8 grid md:grid-cols-2 gap-4 sm:gap-6">
            <Suspense fallback={<DashboardWidgetSkeleton lines={3} />}>
              <MoodQuickLog />
            </Suspense>
            <Suspense fallback={<DashboardWidgetSkeleton lines={3} />}>
              <ProgressionWidget />
            </Suspense>
          </section>

          {/* Statistiques unifiées (fusion progression + bien-être) */}
          <section aria-labelledby="stats-title" className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 id="stats-title" className="text-xl font-semibold">Votre progression</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchStats()}
                disabled={statsLoading}
                aria-label="Actualiser les statistiques"
              >
                {statsLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
                )}
                Actualiser
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                label="Sessions"
                value={userStats.completedSessions}
                icon={Brain}
                iconColor="text-primary"
                helper="Total de scans"
                loading={statsLoading}
              />
              <StatCard
                label="Série"
                value={
                  <span className="flex items-baseline gap-1">
                    {userStats.currentStreak}
                    <span className="text-sm font-normal text-muted-foreground">jours</span>
                  </span>
                }
                icon={Flame}
                iconColor="text-orange-500"
                helper="Continuez !"
                loading={statsLoading}
              />
              <StatCard
                label="Objectifs"
                value={userStats.weeklyGoals}
                icon={Target}
                iconColor="text-emerald-500"
                helper="Cette semaine"
                loading={statsLoading}
              />
              <StatCard
                label={`Niveau ${userStats.level || ''}`}
                value={userStats.rank}
                icon={Sparkles}
                iconColor="text-purple-500"
                helper={`${userStats.totalPoints} XP`}
                loading={statsLoading}
              />
            </div>

            {/* Score bien-être pleine largeur */}
            <Card3D className="mt-4 bg-gradient-to-br from-primary/5 to-accent/5" hoverLift animate={false}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                  Score bien-être
                  {wellbeingTrend === 'up' && <TrendingUp className="h-3 w-3 text-success" />}
                  {wellbeingTrend === 'down' && <TrendingUp className="h-3 w-3 text-destructive rotate-180" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wellbeingLoading || statsLoading ? (
                  <Skeleton className="h-12 w-full skeleton-calm" />
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-primary">
                      {wellbeingScore}
                      <span className="text-lg font-normal text-muted-foreground">/100</span>
                    </div>
                    <div className="flex-1">
                      <Progress value={wellbeingScore} className="h-3" aria-label="Score de bien-être" />
                      <p className="text-xs text-muted-foreground mt-1">Basé sur vos données réelles</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card3D>
          </section>

          {/* Actions rapides adaptées (4 cartes) */}
          <section id="quick-actions" aria-labelledby="actions-title" className="mb-6 sm:mb-8">
            <h2 id="actions-title" className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {orderedQuickActions.map((action) => {
                const ActionIcon = action.icon as React.ComponentType<{ className?: string }>;
                return (
                  <motion.div key={action.id} layout transition={quickActionTransition} className="h-full">
                    <Card3D className="group cursor-pointer h-full" hoverLift elevation="medium" animate={false}>
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
                    </Card3D>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Recommandations IA (widget unique — suppression du doublon DynamicRecommendations) */}
          <section aria-labelledby="ai-recommendations" className="mb-6 sm:mb-8">
            <h2 id="ai-recommendations" className="sr-only">Suggestions personnalisées IA</h2>
            <Suspense fallback={<DashboardWidgetSkeleton lines={4} />}>
              <AIRecommendationsWidget />
            </Suspense>
          </section>

          {/* Conseils cliniques personnalisés */}
          {!hintsLoading && clinicalHintsList.length > 0 && (
            <section aria-labelledby="clinical-hints-title" className="mb-6 sm:mb-8">
              <h2 id="clinical-hints-title" className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                Conseils personnalisés
              </h2>
              <div className="grid gap-3" role="list">
                {clinicalHintsList.slice(0, 3).map((hint: string, index: number) => (
                  <div key={`hint-${index}`} role="listitem">
                    <Card3D className="bg-muted/50" elevation="low" hoverLift>
                      <CardContent className="py-3 px-4 flex items-center gap-3">
                        <Heart className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                        <p className="text-sm">{hint}</p>
                      </CardContent>
                    </Card3D>
                  </div>
                ))}
              </div>
            </section>
          )}
          {hintsError && (
            <section className="mb-6">
              <Card3D className="bg-destructive/5 border-destructive/20" elevation="low">
                <CardContent className="py-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-destructive">Impossible de charger les conseils</p>
                    <Button variant="ghost" size="sm" onClick={refreshHints} className="mt-1 h-auto p-0 text-xs">
                      Réessayer
                    </Button>
                  </div>
                </CardContent>
              </Card3D>
            </section>
          )}

          {/* Plan hebdomadaire */}
          <section aria-labelledby="weekly-plan" className="mb-6 sm:mb-8">
            <h2 id="weekly-plan" className="sr-only">Plan de la semaine</h2>
            <Suspense fallback={<WeeklyPlanSkeleton />}>
              <WeeklyPlanCard />
            </Suspense>
          </section>

          {/* Tendance + scans récents côte à côte */}
          <section className="mb-6 sm:mb-8 grid gap-6 lg:grid-cols-2">
            <Suspense fallback={<DashboardWidgetSkeleton lines={3} />}>
              <WeeklyTrendChart />
            </Suspense>
            <Suspense fallback={<DashboardWidgetSkeleton lines={6} />}>
              <RecentEmotionScansWidget />
            </Suspense>
          </section>

          {/* Objectifs + Notifications côte à côte */}
          <section aria-labelledby="widgets-section" className="mb-6 sm:mb-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<DashboardWidgetSkeleton lines={4} />}>
                <GoalsProgressWidget />
              </Suspense>
              <Suspense fallback={<DashboardWidgetSkeleton lines={4} />}>
                <NotificationsWidget />
              </Suspense>
            </div>
          </section>

          {/* Journal */}
          <section aria-labelledby="journal-summary-section" className="mb-6 sm:mb-8">
            <h2 id="journal-summary-section" className="sr-only">Synthèse du journal émotionnel</h2>
            <Suspense fallback={<DashboardWidgetSkeleton lines={5} />}>
              <JournalSummaryCard />
            </Suspense>
          </section>

          {/* Rappel musical (conditionnel feature flag) */}
          {has('FF_MUSIC') && musicSnapshot && (
            <section aria-labelledby="music-reminder" className="mb-6 sm:mb-8">
              <Card3D hoverLift>
                <CardHeader>
                  <CardTitle id="music-reminder">Votre piste du moment</CardTitle>
                  <CardDescription>Un rappel de votre dernière bulle sonore.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{musicReminderText}</p>
                  <Button asChild size="sm">
                    <Link to="/app/music" aria-label="Revenir à la musique adaptative">
                      Lancer la lecture
                    </Link>
                  </Button>
                </CardContent>
              </Card3D>
            </section>
          )}

          {/* Explorer tous les modules */}
          <section aria-labelledby="explore-modules" className="mb-6 sm:mb-8">
            <Suspense fallback={<DashboardWidgetSkeleton lines={6} />}>
              <ModulesNavigationGrid />
            </Suspense>
          </section>
        </main>
      </div>
    </>
  );
}
