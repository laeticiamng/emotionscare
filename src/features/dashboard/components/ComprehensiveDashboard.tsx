// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Music, Heart, TrendingUp, Calendar, Clock,
  Zap, Target, Users, BookOpen, Activity, Award, Sparkles, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { NavButton } from '@/components/navigation/NavButton';
import { NAV_SCHEMA, findNavNode } from '@/lib/nav-schema';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Sparkline } from '@/ui/Sparkline';
import { LastJournalEntriesCard } from './LastJournalEntriesCard';
import useCurrentMood from '@/hooks/useCurrentMood';
import {
  getEmotionScanHistory,
  deriveScore10,
  type EmotionScanHistoryEntry,
} from '@/services/emotionScan.service';
import { listMyPresets } from '@/services/mixer/moodPresetsApi';
import { buildMoodSummary, computeGradient, presetEmoji } from '@/modules/mood-mixer/utils';
import type { Preset } from '@/modules/mood-mixer/types';

interface DashboardStats {
  totalSessions: number;
  wellbeingScore: number;
  streakDays: number;
  completedGoals: number;
  weeklyProgress: number;
}

interface RecentActivity {
  id: string;
  type: 'scan' | 'music' | 'coach' | 'journal' | 'vr';
  title: string;
  timestamp: Date;
  score?: number;
  duration?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  isPremium?: boolean;
}

interface ScanResult {
  id: string;
  timestamp: Date;
  dominantEmotion: string;
  score: number;
  confidence: number;
  energyLevel: string;
  insight?: string;
  tags?: string[];
}

/**
 * Dashboard complet - Vue d'ensemble de l'activité utilisateur
 * Intégration avec toutes les fonctionnalités via le système de navigation unifié
 */
export function ComprehensiveDashboard() {
  const { user, isAuthenticated } = useAuth();
  const currentMood = useCurrentMood();
  const moodSecondaryText = React.useMemo(() => {
    const normalized = currentMood.palette.text.toLowerCase();
    if (normalized === '#f8fafc' || normalized === '#ffffff') {
      return 'rgba(248, 250, 252, 0.78)';
    }
    return 'rgba(15, 23, 42, 0.68)';
  }, [currentMood.palette.text]);

  const moodCardStyle = React.useMemo(
    () => ({
      background: `linear-gradient(135deg, ${currentMood.palette.surface}, ${currentMood.palette.glow})`,
      borderColor: currentMood.palette.border,
      color: currentMood.palette.text,
    }),
    [currentMood.palette.surface, currentMood.palette.glow, currentMood.palette.border, currentMood.palette.text],
  );

  // Requêtes pour les données du dashboard
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: () => fetchDashboardStats(user?.id),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: () => fetchRecentActivity(user?.id),
    enabled: isAuthenticated,
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => fetchRecommendations(user?.id),
    enabled: isAuthenticated,
  });

  const { data: recentScans, isLoading: scansLoading } = useQuery({
    queryKey: ['recent-scans', user?.id],
    queryFn: () => fetchRecentScans(user?.id),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const { data: moodPresets, isLoading: presetsLoading } = useQuery({
    queryKey: ['mood-mixer-presets', user?.id],
    queryFn: () => listMyPresets(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const topPresets = React.useMemo(() => (moodPresets ?? []).slice(0, 3), [moodPresets]);

  const scanTimeline = React.useMemo(
    () => (recentScans ?? []).slice().reverse().map(scan => Math.round(scan.score * 10)),
    [recentScans]
  );

  const scanTrend = React.useMemo(() => {
    if (!recentScans?.length) return null;
    const oldest = recentScans[recentScans.length - 1];
    const latest = recentScans[0];
    return Number((latest.score - oldest.score).toFixed(1));
  }, [recentScans]);

  // Actions rapides définies via le schéma de navigation
  const quickActions: QuickAction[] = [
    {
      id: 'scan',
      title: 'Scan Émotionnel',
      description: 'Analysez votre état actuel',
      icon: 'Brain',
      action: '/scan',
      isPremium: true,
    },
    {
      id: 'music',
      title: 'Musicothérapie',
      description: 'Session adaptée à votre humeur',
      icon: 'Music',
      action: '/music',
      isPremium: true,
    },
    {
      id: 'coach',
      title: 'Coach IA',
      description: 'Conversation personnalisée',
      icon: 'Users',
      action: '/coach',
    },
    {
      id: 'journal',
      title: 'Journal',
      description: 'Écrivez vos pensées',
      icon: 'BookOpen',
      action: '/journal',
    },
    {
      id: 'vr',
      title: 'Expérience VR',
      description: 'Immersion thérapeutique',
      icon: 'Glasses',
      action: '/vr',
      isPremium: true,
    },
    {
      id: 'breathwork',
      title: 'Respiration',
      description: 'Exercices guidés',
      icon: 'Wind',
      action: '/breathwork',
    },
  ];

  if (!isAuthenticated) {
    return <UnauthenticatedDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          Bonjour, {user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre parcours bien-être aujourd'hui.
        </p>
      </motion.div>

      <section aria-label="Ambiance du moment">
        <Card className="border" style={moodCardStyle}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-2">
              <CardTitle style={{ color: currentMood.palette.text }}>Ambiance du moment</CardTitle>
              <p className="text-sm" style={{ color: moodSecondaryText }}>
                {currentMood.summary}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                aria-label={`Vibe ${currentMood.label}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
                style={{ background: currentMood.palette.base, color: currentMood.palette.text }}
              >
                <span aria-hidden="true" className="text-xl">
                  {currentMood.emoji}
                </span>
              </span>
              <Badge
                variant="secondary"
                className="border-0 text-xs font-semibold"
                style={{ background: currentMood.palette.base, color: currentMood.palette.text }}
              >
                {currentMood.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm" style={{ color: moodSecondaryText }}>
            <p>{currentMood.headline}</p>
            <p>
              Micro-geste suggéré&nbsp;:
              <span className="ml-1 font-medium" style={{ color: currentMood.palette.text }}>
                {currentMood.microGesture}
              </span>
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Score Bien-être"
              value={`${stats?.wellbeingScore || 0}/10`}
              icon={<Heart className="w-5 h-5" />}
              trend="+0.5 vs hier"
              color="text-green-600"
            />
            <StatsCard
              title="Sessions"
              value={stats?.totalSessions || 0}
              icon={<Activity className="w-5 h-5" />}
              trend="Cette semaine"
              color="text-blue-600"
            />
            <StatsCard
              title="Série"
              value={`${stats?.streakDays || 0} jours`}
              icon={<Zap className="w-5 h-5" />}
              trend="Record: 12j"
              color="text-orange-600"
            />
            <StatsCard
              title="Objectifs"
              value={`${stats?.completedGoals || 0}/5`}
              icon={<Target className="w-5 h-5" />}
              trend="Ce mois"
              color="text-purple-600"
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Actions rapides */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickActions.map((action, index) => {
                const navNode = findNavNode(action.id);
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {navNode ? (
                      <NavButton
                        node={navNode}
                        variant="outline"
                        className="h-auto p-4 flex-col items-start gap-2 text-left w-full"
                        showBadge={true}
                      />
                    ) : (
                      <QuickActionCard action={action} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Progression hebdomadaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Objectif hebdomadaire</span>
                <span>{stats?.weeklyProgress || 0}%</span>
              </div>
              <Progress value={stats?.weeklyProgress || 0} />
            </div>
            
            <div className="space-y-3">
              <ProgressItem label="Sessions complétées" progress={80} />
              <ProgressItem label="Temps d'activité" progress={65} />
              <ProgressItem label="Régularité" progress={90} />
            </div>

            <Button className="w-full" variant="outline">
              <Award className="h-4 w-4 mr-2" />
              Voir les badges
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity?.length ? (
              <div className="space-y-3">
                {recentActivity.map((activity: RecentActivity, index: number) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                    {activity.score && (
                      <Badge variant="secondary">
                        {activity.score}/10
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune activité récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Derniers scans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Derniers scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scansLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse space-y-3 rounded-lg border p-4"
                  >
                    <div className="h-4 w-1/3 rounded bg-muted"></div>
                    <div className="h-3 w-1/2 rounded bg-muted"></div>
                    <div className="h-2 w-full rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            ) : recentScans?.length ? (
              <div className="space-y-4">
                {scanTimeline.length > 1 && (
                  <div className="space-y-1">
                    <div className="text-primary">
                      <Sparkline values={scanTimeline} width={360} height={48} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tendance émotionnelle {scanTrend !== null ? `${scanTrend >= 0 ? '+' : ''}${scanTrend.toFixed(1)} pts` : ''} sur {recentScans.length} scans
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {recentScans.map((scan: ScanResult, index: number) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-3 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{scan.dominantEmotion}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(scan.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <Heart className="h-4 w-4 text-rose-500" />
                          {scan.score}/10
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{scan.energyLevel}</span>
                        <span>Confiance {scan.confidence}%</span>
                      </div>
                      <Progress value={scan.confidence} className="h-1" />
                      {scan.insight && (
                        <p className="text-sm text-muted-foreground">{scan.insight}</p>
                      )}
                      {scan.tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {scan.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun scan récent</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommandations personnalisées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recommandations IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations?.length ? (
              <div className="space-y-4">
                {recommendations.map((rec: any, index: number) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rec.type}</Badge>
                      {rec.priority === 'high' && (
                        <Badge variant="destructive">Priorité</Badge>
                      )}
                    </div>
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    {rec.actionButton && (
                      <Button size="sm" variant="outline" className="w-full">
                        {rec.actionButton}
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune recommandation pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        <LastJournalEntriesCard />
        {/* Mes presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Mes presets
            </CardTitle>
            <CardDescription>Vos trois ambiances les plus récentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {presetsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`preset-loading-${index}`}
                    className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : topPresets.length ? (
              <ul className="space-y-3">
                {topPresets.map((preset: Preset) => (
                  <li
                    key={preset.id}
                    className="flex items-center gap-3 rounded-xl border bg-background/80 p-3"
                  >
                    <span className="text-2xl" aria-hidden="true">{presetEmoji(preset.name)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{preset.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {buildMoodSummary(preset.sliders)}
                      </p>
                    </div>
                    <span
                      className="h-10 w-10 flex-none rounded-full border"
                      style={{ backgroundImage: computeGradient(preset.sliders) }}
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun preset enregistré pour l’instant. Ouvrez le Mood Mixer pour composer votre première douceur.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full justify-center gap-2">
              <Link to="/app/mood-mixer">
                <Sparkles className="h-4 w-4" />
                Ouvrir le Mood Mixer
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Composants utilitaires
function StatsCard({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">{title}</p>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const IconComponent = (Brain as any); // Fallback icon
  
  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex-col items-start gap-2 text-left w-full"
      onClick={() => window.location.href = action.action}
    >
      <div className="flex items-center gap-2 w-full">
        <IconComponent className="h-4 w-4" />
        <span className="font-medium">{action.title}</span>
        {action.isPremium && (
          <Badge variant="default" className="text-xs ml-auto">PRO</Badge>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{action.description}</p>
    </Button>
  );
}

function ProgressItem({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const icons = {
    scan: Brain,
    music: Music,
    coach: Users,
    journal: BookOpen,
    vr: Activity,
  };
  
  const Icon = (icons as any)[type] || Activity;
  return <Icon className="h-5 w-5 text-muted-foreground" />;
}

function UnauthenticatedDashboard() {
  return (
    <div className="text-center space-y-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <Heart className="h-16 w-16 mx-auto text-primary" />
        <h1 className="text-3xl font-bold">Bienvenue sur EmotionsCare</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Votre plateforme de bien-être émotionnel alimentée par l'IA. 
          Connectez-vous pour commencer votre parcours.
        </p>
      </motion.div>
      
      <div className="flex gap-4 justify-center">
        <Button size="lg">Se connecter</Button>
        <Button variant="outline" size="lg">Découvrir</Button>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `il y a ${days}j`;
  if (hours > 0) return `il y a ${hours}h`;
  if (minutes > 0) return `il y a ${minutes}min`;
  return 'À l\'instant';
}

// Mock API functions
async function fetchDashboardStats(userId?: string): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalSessions: 24,
    wellbeingScore: 8.2,
    streakDays: 5,
    completedGoals: 3,
    weeklyProgress: 75,
  };
}

async function fetchRecentActivity(userId?: string): Promise<RecentActivity[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: '1',
      type: 'scan',
      title: 'Scan émotionnel matinal',
      timestamp: new Date(Date.now() - 3600000),
      score: 8.5,
    },
    {
      id: '2',
      type: 'music',
      title: 'Session relaxation',
      timestamp: new Date(Date.now() - 7200000),
      duration: 1200,
    },
    {
      id: '3',
      type: 'journal',
      title: 'Réflexions du soir',
      timestamp: new Date(Date.now() - 86400000),
    },
  ];
}

async function fetchRecommendations(userId?: string) {
  await new Promise(resolve => setTimeout(resolve, 700));

  return [
    {
      id: '1',
      type: 'Bien-être',
      title: 'Session de respiration recommandée',
      description: 'Votre stress semble élevé. Essayez 5 minutes de respiration.',
      priority: 'high',
      actionButton: 'Commencer maintenant',
    },
    {
      id: '2',
      type: 'Progression',
      title: 'Objectif hebdomadaire proche',
      description: 'Plus que 2 sessions pour atteindre votre objectif.',
      priority: 'medium',
      actionButton: 'Voir mes objectifs',
    },
  ];
}

async function fetchRecentScans(userId?: string): Promise<ScanResult[]> {
  if (!userId) {
    return [];
  }

  try {
    const entries = await getEmotionScanHistory(userId, 12);
    return entries.map(mapHistoryEntryToScan);
  } catch (error) {
    logger.error('Unable to fetch emotion scans', error as Error, 'SCAN');
    return [];
  }
}

function mapHistoryEntryToScan(entry: EmotionScanHistoryEntry): ScanResult {
  const score10 = Number(deriveScore10(entry.normalizedBalance).toFixed(1));
  const energyLevel = score10 >= 7
    ? 'Énergie élevée'
    : score10 >= 4
      ? 'Énergie stable'
      : 'Énergie basse';

  return {
    id: entry.id,
    timestamp: new Date(entry.createdAt),
    dominantEmotion: entry.mood ?? 'Indéterminé',
    score: score10,
    confidence: entry.confidence,
    energyLevel,
    insight: entry.insights[0] ?? entry.summary ?? undefined,
    tags: buildScanTags(entry),
  };
}

function buildScanTags(entry: EmotionScanHistoryEntry): string[] {
  const tags = new Set<string>();

  if (entry.mood) {
    tags.add(capitalize(entry.mood));
  }

  if (entry.scanType) {
    tags.add(scanTypeLabel(entry.scanType));
  }

  if (entry.recommendations.length) {
    tags.add('Conseils IA');
  }

  return Array.from(tags);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function scanTypeLabel(value: string) {
  switch (value) {
    case 'text':
      return 'Analyse texte';
    case 'voice':
      return 'Analyse vocale';
    case 'facial':
      return 'Analyse faciale';
    default:
      return capitalize(value);
  }
}
