import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { Scene3DErrorBoundary } from '@/components/3d/Scene3DErrorBoundary';

const DashboardBackground3D = lazy(() => import('@/components/3d/DashboardBackground3D'));
import { useOptimizedPage } from '@/hooks/useOptimizedPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Award,
  Heart,
  AlertCircle,
  Loader2,
  User,
  Bell,
  Activity,
  Compass,
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, staggerItem, dashboardCard, STAGGER } from '@/lib/motion';
import { orderQuickActions } from '@/features/dashboard/orchestration/weeklyPlanMapper';
import { useDashboardStore } from '@/store/dashboard.store';
import { useFlags } from '@/core/flags';
import { useAdaptivePlayback } from '@/hooks/music/useAdaptivePlayback';
import { PRESET_DETAILS } from '@/services/music/presetMetadata';
import { Skeleton } from '@/components/ui/skeleton';
import { useClinicalHints } from '@/hooks/useClinicalHints';
import { useUserStatsQuery, useUserStatsRealtime } from '@/hooks/useUserStatsQuery';
import { useDynamicRecommendations } from '@/hooks/useDynamicRecommendations';
import { useWellbeingScore } from '@/hooks/useWellbeingScore';
import { useAuth } from '@/contexts/AuthContext';
import { useFirstTimeGuide } from '@/hooks/useFirstTimeGuide';
import { useDashboardOnboarding } from '@/hooks/useDashboardOnboarding';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const WeeklyPlanCard = React.lazy(() => import('@/components/dashboard/widgets/WeeklyPlanCard'));
const RecentEmotionScansWidget = React.lazy(() => import('@/components/dashboard/widgets/RecentEmotionScansWidget'));
const JournalSummaryCard = React.lazy(() => import('@/components/dashboard/widgets/JournalSummaryCard'));
const WeeklyTrendChart = React.lazy(() => import('@/components/dashboard/widgets/WeeklyTrendChart'));
const GoalsProgressWidget = React.lazy(() => import('@/components/dashboard/widgets/GoalsProgressWidget'));
const NotificationsWidget = React.lazy(() => import('@/components/dashboard/widgets/NotificationsWidget'));
const DynamicRecommendationsWidget = React.lazy(() => import('@/components/dashboard/widgets/DynamicRecommendationsWidget'));
const ModulesNavigationGrid = React.lazy(() => import('@/components/dashboard/ModulesNavigationGrid'));
const FirstTimeGuide = React.lazy(() => import('@/components/onboarding/FirstTimeGuide'));
const AIRecommendationsWidget = React.lazy(() => import('@/components/dashboard/AIRecommendationsWidget'));
const DashboardOnboarding = React.lazy(() => import('@/components/onboarding/DashboardOnboarding'));
const MoodQuickLog = React.lazy(() => import('@/components/dashboard/MoodQuickLog'));
const QuickAccessGrid = React.lazy(() => import('@/components/dashboard/QuickAccessGrid'));
const ProgressionWidget = React.lazy(() => import('@/components/dashboard/ProgressionWidget'));

type QuickAction = {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: React.ElementType;
  accent: string;
};

/**
 * 5 actions prioritaires pour le dashboard simplifié.
 * Les modules secondaires sont accessibles via "Explorer tous les modules".
 */
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'scan',
    title: 'Scanner mes émotions',
    description: 'Analyse IA en temps réel',
    to: '/app/scan',
    icon: Brain,
    accent: 'bg-primary/10 text-primary',
  },
  {
    id: 'breath',
    title: 'Respiration guidée',
    description: 'Retrouver le calme en 2 min',
    to: '/app/breath',
    icon: Wind,
    accent: 'bg-sky-500/10 text-sky-600',
  },
  {
    id: 'coach',
    title: 'Parler au Coach IA',
    description: 'Soutien personnalisé immédiat',
    to: '/app/coach',
    icon: MessageCircle,
    accent: 'bg-accent/10 text-accent',
  },
  {
    id: 'music',
    title: 'Musicothérapie',
    description: 'Sons adaptatifs à votre humeur',
    to: '/app/music',
    icon: Music,
    accent: 'bg-info/10 text-info',
  },
  {
    id: 'journal',
    title: 'Mon journal',
    description: 'Consigner mes ressentis',
    to: '/app/journal',
    icon: BookOpen,
    accent: 'bg-success/10 text-success',
  },
];

const WeeklyPlanSkeleton: React.FC = () => (
  <div aria-hidden className="rounded-2xl border border-dashed border-border/50 p-6 space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32 skeleton-calm" />
      <Skeleton className="h-5 w-56 skeleton-calm" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-full skeleton-calm" />
      <Skeleton className="h-3 w-5/6 skeleton-calm" />
      <Skeleton className="h-3 w-3/4 skeleton-calm" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full skeleton-calm rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const DashboardWidgetSkeleton: React.FC<{ lines?: number }> = ({ lines = 4 }) => (
  <div aria-hidden className="rounded-2xl border border-dashed border-border/50 p-6 space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-40 skeleton-calm" />
      <Skeleton className="h-3 w-1/2 skeleton-calm" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-3 w-full skeleton-calm" />
      ))}
    </div>
  </div>
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
  const clinicalTone = summaryTone;
  const location = useLocation();
  
  // First Time Guide pour nouveaux utilisateurs
  const { shouldShowGuide, markAsCompleted, markAsDismissed } = useFirstTimeGuide();
  
  // Onboarding 3 étapes pour nouveaux utilisateurs
  const { 
    shouldShowOnboarding, 
    completeOnboarding, 
    skipOnboarding 
  } = useDashboardOnboarding();
  
  // Stats réelles depuis Supabase
  const { stats: userStats, loading: statsLoading, refetch: refetchStats, error: statsError } = useUserStatsQuery();
  useUserStatsRealtime();
  
  // Recommandations dynamiques
  const { recommendations, loading: recsLoading, refetch: refetchRecs } = useDynamicRecommendations();
  
  // Score de bien-être calculé depuis les données réelles
  const { score: wellbeingScore, trend: wellbeingTrend, loading: wellbeingLoading } = useWellbeingScore();
  
  // Auto-refresh toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetchStats();
      refetchRecs();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refetchStats, refetchRecs]);

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
    () => orderQuickActions(QUICK_ACTIONS, activeTone ?? undefined).slice(0, 5),
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
    <>
      {/* Onboarding 3 étapes pour nouveaux utilisateurs */}
      {shouldShowOnboarding && (
        <Suspense fallback={null}>
          <DashboardOnboarding 
            onComplete={completeOnboarding} 
            onSkip={skipOnboarding} 
          />
        </Suspense>
      )}
      
      {/* Guide de première visite pour nouveaux utilisateurs */}
      {shouldShowGuide && !shouldShowOnboarding && (
        <Suspense fallback={null}>
          <FirstTimeGuide onComplete={markAsCompleted} onDismiss={markAsDismissed} />
        </Suspense>
      )}
      
      <div data-testid="page-root" className="min-h-screen bg-background relative">
      {/* Arrière-plan 3D subtil */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <Scene3DErrorBoundary>
          <Suspense fallback={null}>
            <DashboardBackground3D className="opacity-30" />
          </Suspense>
        </Scene3DErrorBoundary>
      </div>
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>
      <a 
        href="#quick-actions" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller aux actions rapides
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord" className="bg-card border-b sticky top-0 z-40 safe-area-top">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold truncate">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode utilisateur particulier">
                Particulier
              </Badge>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="Explorer tous les modules">
                      <Link to="/navigation">
                        <Compass className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Explorer tous les modules</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="Notifications">
                      <Link to="/notifications">
                        <Bell className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="Mon profil">
                      <Link to="/dashboard/settings">
                        <User className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mon profil</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="Paramètres">
                      <Link to="/dashboard/settings">
                        <Settings className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Paramètres</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild aria-label="Aide">
                      <Link to="/help">
                        <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal — ACTE 5: ANCRER — Salle de contrôle élégante */}
      <main id="main-content" role="main" className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* En-tête de bienvenue avec date — entrée cinématique */}
        <motion.header
          className="mb-4 sm:mb-8"
          variants={staggerContainer(STAGGER.fast)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate="visible"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <motion.div variants={staggerItem}>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Bonjour{user?.user_metadata?.first_name ? ` ${user.user_metadata.first_name}` : ''} 👋
              </h1>
              <p className="text-muted-foreground text-lg">
                Prends soin de toi aujourd'hui
              </p>
            </motion.div>
            <motion.div variants={staggerItem} className="text-right text-muted-foreground">
              <p className="text-sm capitalize">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</p>
            </motion.div>
          </div>
        </motion.header>

        {/* Section Humeur du jour + Accès rapide */}
        <section className="mb-4 sm:mb-8 grid md:grid-cols-2 gap-4 sm:gap-6">
          <Suspense fallback={<DashboardWidgetSkeleton lines={3} />}>
            <MoodQuickLog />
          </Suspense>
          <Suspense fallback={<DashboardWidgetSkeleton lines={3} />}>
            <ProgressionWidget />
          </Suspense>
        </section>

        {/* Accès rapide - 4 cartes */}
        <section aria-labelledby="quick-access-title" className="mb-8">
          <h2 id="quick-access-title" className="text-xl font-semibold mb-4">
            Accès rapide
          </h2>
          <Suspense fallback={<DashboardWidgetSkeleton lines={2} />}>
            <QuickAccessGrid />
          </Suspense>
        </section>

        {/* Widget IA Recommandations Proactives - Prioritaire */}
        <section aria-labelledby="ai-recommendations" className="mb-8">
          <h2 id="ai-recommendations" className="sr-only">
            Suggestions personnalisées IA
          </h2>
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <DashboardWidgetSkeleton lines={4} />
              </div>
            )}
          >
            <AIRecommendationsWidget />
          </Suspense>
        </section>

        {has('FF_MUSIC') && (
          <section aria-labelledby="music-reminder" className="mb-8">
            <Card3D hoverLift>
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
            </Card3D>
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

        {/* Graphique tendance hebdomadaire */}
        <section aria-labelledby="weekly-trend" className="mb-8">
          <h2 id="weekly-trend" className="sr-only">
            Tendance de la semaine
          </h2>
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <DashboardWidgetSkeleton lines={3} />
              </div>
            )}
          >
            <WeeklyTrendChart />
          </Suspense>
        </section>
        {/* Statistiques rapides - données réelles */}
        <section aria-labelledby="stats-title" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 id="stats-title" className="text-xl font-semibold">
              Votre progression
            </h2>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 stagger-in">
            <Card3D className="p-0" hoverLift animate={false}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sessions
                </CardTitle>
                <CardDescription className="sr-only">
                  Nombre de sessions d'analyse émotionnelle effectuées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12 skeleton-calm" />
                  ) : (
                    <div className="text-2xl font-bold">{userStats.completedSessions}</div>
                  )}
                  <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total de scans réalisés
                </p>
              </CardContent>
            </Card3D>

            <Card3D className="p-0" hoverLift animate={false}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Série en cours
                </CardTitle>
                <CardDescription className="sr-only">
                  Jours consécutifs d'utilisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12 skeleton-calm" />
                  ) : (
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {userStats.currentStreak}
                      <span className="text-sm font-normal text-muted-foreground">jours</span>
                    </div>
                  )}
                  <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Continue ta série !
                </p>
              </CardContent>
            </Card3D>

            <Card3D className="p-0" hoverLift animate={false}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Objectifs semaine
                </CardTitle>
                <CardDescription className="sr-only">
                  Objectifs complétés cette semaine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-12 skeleton-calm" />
                  ) : (
                    <div className="text-2xl font-bold">{userStats.weeklyGoals}</div>
                  )}
                  <Target className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Complétés cette semaine
                </p>
              </CardContent>
            </Card3D>

            <Card3D className="p-0" hoverLift animate={false}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Niveau & Rang
                </CardTitle>
                <CardDescription className="sr-only">
                  Votre niveau et rang actuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 skeleton-calm" />
                  ) : (
                    <div className="text-xl font-bold">Niv. {userStats.level}</div>
                  )}
                  <Sparkles className="h-4 w-4 text-purple-500" aria-hidden="true" />
                </div>
                  {!statsLoading && (
                  <>
                    <Badge variant="outline" className="text-xs mt-2">
                      {userStats.rank}
                    </Badge>
                    <div className="mt-3">
                      {/* Calcul correct du prochain niveau: niveau^2 * 100 */}
                      {(() => {
                        const currentLevelXP = Math.pow(userStats.level, 2) * 100;
                        const nextLevelXP = Math.pow(userStats.level + 1, 2) * 100;
                        const xpInLevel = userStats.totalPoints - currentLevelXP;
                        const xpNeeded = nextLevelXP - currentLevelXP;
                        const progress = Math.max(0, Math.min(100, (xpInLevel / xpNeeded) * 100));

                        return (
                          <>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{userStats.totalPoints} XP</span>
                              <span>{nextLevelXP} XP</span>
                            </div>
                            <Progress
                              value={progress}
                              className="h-2"
                              aria-label={`Progression vers le niveau ${userStats.level + 1}`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.round(progress)}
                            />
                          </>
                        );
                      })()}
                    </div>
                  </>
                )}
              </CardContent>
            </Card3D>

            {/* Carte Score Bien-être - utilisant le hook useWellbeingScore */}
            <Card3D className="p-0 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/5 to-accent/5" hoverLift animate={false}>
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
                      <Progress
                        value={wellbeingScore}
                        className="h-3"
                        aria-label="Score de bien-être"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Basé sur vos données réelles
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card3D>
          </div>
          
          {/* Indicateur mise à jour en temps réel */}
          <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground" aria-live="polite">
            <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
            <span>Données synchronisées en temps réel</span>
          </div>
        </section>

        {/* Conseils cliniques personnalisés */}
        <section aria-labelledby="clinical-hints-title" className="mb-8">
          <h2 id="clinical-hints-title" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
            Conseils personnalisés
          </h2>
          {hintsLoading ? (
            <div className="grid gap-3 stagger-in" aria-busy="true" aria-live="polite">
              {[1, 2, 3].map((i) => (
                <Card3D key={i} className="bg-muted/50" elevation="low" animate={false}>
                  <CardContent className="py-3 px-4">
                    <Skeleton className="h-4 w-full skeleton-calm" />
                  </CardContent>
                </Card3D>
              ))}
            </div>
          ) : hintsError ? (
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
          ) : clinicalHintsList.length === 0 ? (
            <Card3D className="bg-muted/30" elevation="low">
              <CardContent className="py-6 text-center">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Effectuez un scan pour recevoir des conseils personnalisés</p>
              </CardContent>
            </Card3D>
          ) : (
            <div className="grid gap-3 stagger-in" role="list" aria-live="polite">
              {clinicalHintsList.slice(0, 3).map((hint: string, index: number) => (
                <div key={`hint-${index}-${hint.slice(0, 10)}`} role="listitem">
                  <Card3D className="bg-muted/50" elevation="low" hoverLift>
                    <CardContent className="py-3 px-4 flex items-center gap-3">
                      <Heart className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                      <p className="text-sm">{hint}</p>
                    </CardContent>
                  </Card3D>
                </div>
              ))}
            </div>
          )}
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

        {/* Recommandations dynamiques - Widget unique */}
        <section aria-labelledby="recommendations-section" className="mb-8">
          <h2 id="recommendations-section" className="sr-only">Recommandations personnalisées</h2>
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <DashboardWidgetSkeleton lines={4} />
              </div>
            )}
          >
            <DynamicRecommendationsWidget />
          </Suspense>
        </section>

        {/* Widgets: Objectifs et Notifications côte à côte */}
        <section aria-labelledby="widgets-section" className="mb-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense
              fallback={(
                <div aria-busy="true" aria-live="polite">
                  <DashboardWidgetSkeleton lines={4} />
                </div>
              )}
            >
              <GoalsProgressWidget />
            </Suspense>
            <Suspense
              fallback={(
                <div aria-busy="true" aria-live="polite">
                  <DashboardWidgetSkeleton lines={4} />
                </div>
              )}
            >
              <NotificationsWidget />
            </Suspense>
          </div>
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


        {/* Section Achievements & Badges */}
        <section aria-labelledby="achievements-title" className="mb-8">
          <h2 id="achievements-title" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" aria-hidden="true" />
            Vos récompenses
          </h2>
          <Card3D className="bg-gradient-to-r from-warning/5 to-primary/5" hoverLift>
            <CardContent className="py-6">
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge variant="outline" className="px-3 py-1 text-sm border-warning/50">
                  🔥 Série {userStats.currentStreak} jours
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm border-primary/50">
                  ⭐ Niveau {userStats.level}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm border-success/50">
                  ✅ {userStats.weeklyGoals} objectifs
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm border-info/50">
                  🧠 {userStats.completedSessions} scans
                </Badge>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Continuez à utiliser l'application pour débloquer de nouvelles récompenses
              </p>
            </CardContent>
          </Card3D>
        </section>

        {/* Explorer tous les modules - Section enrichie avec navigation complète */}
        <section aria-labelledby="explore-modules" className="mb-8">
          <Suspense
            fallback={(
              <div aria-busy="true" aria-live="polite">
                <DashboardWidgetSkeleton lines={6} />
              </div>
            )}
          >
            <ModulesNavigationGrid />
          </Suspense>
        </section>
      </main>

    </div>
    </>
  );
}