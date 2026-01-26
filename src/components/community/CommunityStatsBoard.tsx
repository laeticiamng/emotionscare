import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Award,
  Share2,
  Download,
  RefreshCw,
  Calendar,
  Zap,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface CommunityStats {
  totalMembers: number;
  totalPosts: number;
  totalInteractions: number;
  activeToday: number;
  topContributor?: string;
  monthlyGrowth: number;
  weeklyStats?: {
    newMembers: number;
    newPosts: number;
    avgResponseTime: number;
  };
  engagement?: {
    likesThisWeek: number;
    commentsThisWeek: number;
    sharesThisWeek: number;
  };
}

interface CommunityStatsBoardProps {
  stats: CommunityStats;
  onRefresh?: () => void;
}

const STORAGE_KEY = 'community_stats_history';

interface StatsSnapshot {
  date: string;
  stats: CommunityStats;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  bgColor: string;
  animate?: boolean;
}> = ({ icon, label, value, subtext, trend, trendValue, bgColor, animate = true }) => {
  return (
    <motion.div
      whileHover={{ translateY: -2, scale: 1.02 }}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl ${bgColor} border backdrop-blur-sm p-4 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div className="flex-shrink-0 text-3xl opacity-80">
          {icon}
        </div>
      </div>
      {trend && trendValue !== undefined && (
        <div className={`mt-2 text-xs font-semibold flex items-center gap-1 ${
          trend === 'up'
            ? 'text-green-700 dark:text-green-400'
            : trend === 'down'
            ? 'text-red-700 dark:text-red-400'
            : 'text-slate-700 dark:text-slate-400'
        }`}>
          {trend === 'up' && '📈'}
          {trend === 'down' && '📉'}
          {trend === 'neutral' && '→'}
          {trend === 'up' ? '+' : ''}{trendValue}% ce mois
        </div>
      )}
    </motion.div>
  );
};

export const CommunityStatsBoard: React.FC<CommunityStatsBoardProps> = ({
  stats,
  onRefresh,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statsHistory, setStatsHistory] = useState<StatsSnapshot[]>([]);

  // Load and save history
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStatsHistory(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Save current stats as snapshot
    const today = new Date().toISOString().split('T')[0];
    setStatsHistory(prev => {
      const existing = prev.find(s => s.date === today);
      if (existing) return prev;
      
      const updated = [...prev, { date: today, stats }].slice(-30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [stats]);

  const weeklyTrend = useMemo(() => {
    if (statsHistory.length < 2) return { members: 0, posts: 0, interactions: 0 };
    
    const weekAgo = statsHistory.find(s => {
      const date = new Date(s.date);
      const now = new Date();
      return now.getTime() - date.getTime() >= 6 * 24 * 60 * 60 * 1000;
    });
    
    if (!weekAgo) return { members: 0, posts: 0, interactions: 0 };
    
    return {
      members: Math.round(((stats.totalMembers - weekAgo.stats.totalMembers) / weekAgo.stats.totalMembers) * 100),
      posts: Math.round(((stats.totalPosts - weekAgo.stats.totalPosts) / weekAgo.stats.totalPosts) * 100),
      interactions: Math.round(((stats.totalInteractions - weekAgo.stats.totalInteractions) / weekAgo.stats.totalInteractions) * 100)
    };
  }, [stats, statsHistory]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleShare = async () => {
    const text = `🌟 Statistiques EmotionsCare Community:\n` +
      `👥 ${stats.totalMembers.toLocaleString()} membres\n` +
      `💬 ${stats.totalPosts.toLocaleString()} messages\n` +
      `❤️ ${stats.totalInteractions.toLocaleString()} interactions\n` +
      `📈 Croissance: +${stats.monthlyGrowth}% ce mois`;
    
    if (navigator.share) {
      await navigator.share({ title: 'Stats Communauté', text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', duration: 2000 });
    }
  };

  const handleExport = () => {
    const data = {
      currentStats: stats,
      history: statsHistory,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-stats-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export réussi' });
  };

  const healthScore = useMemo(() => {
    let score = 50;
    if (stats.monthlyGrowth > 5) score += 15;
    if (stats.activeToday > stats.totalMembers * 0.1) score += 15;
    if (stats.totalInteractions > stats.totalPosts * 2) score += 10;
    if (stats.weeklyStats?.avgResponseTime && stats.weeklyStats.avgResponseTime < 60) score += 10;
    return Math.min(100, score);
  }, [stats]);

  return (
    <section aria-label="Statistiques de la communauté" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            Santé de la communauté
          </h2>
          <Badge variant="outline" className={healthScore >= 70 ? 'text-green-600' : healthScore >= 50 ? 'text-amber-600' : 'text-red-600'}>
            Score: {healthScore}/100
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard
              icon="👥"
              label="Membres"
              value={stats.totalMembers}
              subtext="Personnes engagées"
              trend={weeklyTrend.members > 0 ? 'up' : weeklyTrend.members < 0 ? 'down' : 'neutral'}
              trendValue={Math.abs(weeklyTrend.members)}
              bgColor="bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
            />

            <StatCard
              icon="💬"
              label="Messages"
              value={stats.totalPosts}
              subtext="Partages de cœur"
              trend={weeklyTrend.posts > 0 ? 'up' : weeklyTrend.posts < 0 ? 'down' : 'neutral'}
              trendValue={Math.abs(weeklyTrend.posts)}
              bgColor="bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            />

            <StatCard
              icon="❤️"
              label="Interactions"
              value={stats.totalInteractions}
              subtext="Soutiens et réactions"
              trend={weeklyTrend.interactions > 0 ? 'up' : weeklyTrend.interactions < 0 ? 'down' : 'neutral'}
              trendValue={Math.abs(weeklyTrend.interactions)}
              bgColor="bg-pink-50/80 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800"
            />

            <StatCard
              icon="🔥"
              label="Actifs aujourd'hui"
              value={stats.activeToday}
              subtext="Connectés maintenant"
              trend="neutral"
              trendValue={Math.round((stats.activeToday / stats.totalMembers) * 100)}
              bgColor="bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            />

            <StatCard
              icon="🏆"
              label="Top contributeur"
              value={stats.topContributor || 'Anonyme'}
              subtext="Cette semaine"
              bgColor="bg-purple-50/80 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
            />
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.engagement && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <div className="text-3xl font-bold">{stats.engagement.likesThisWeek}</div>
                      <p className="text-sm text-muted-foreground">Likes cette semaine</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-3xl font-bold">{stats.engagement.commentsThisWeek}</div>
                      <p className="text-sm text-muted-foreground">Commentaires cette semaine</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Share2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <div className="text-3xl font-bold">{stats.engagement.sharesThisWeek}</div>
                      <p className="text-sm text-muted-foreground">Partages cette semaine</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {stats.weeklyStats && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                      <div className="text-3xl font-bold">+{stats.weeklyStats.newMembers}</div>
                      <p className="text-sm text-muted-foreground">Nouveaux membres</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Zap className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                      <div className="text-3xl font-bold">{stats.weeklyStats.newPosts}</div>
                      <p className="text-sm text-muted-foreground">Nouveaux posts</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <div className="text-3xl font-bold">{stats.weeklyStats.avgResponseTime}min</div>
                      <p className="text-sm text-muted-foreground">Temps de réponse moyen</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Historique des 30 derniers jours
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsHistory.length > 0 ? (
                <div className="space-y-2">
                  {statsHistory.slice(-10).reverse().map((snapshot, idx) => (
                    <motion.div
                      key={snapshot.date}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-2 rounded bg-muted/50"
                    >
                      <span className="text-sm font-medium">
                        {new Date(snapshot.date).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👥 {snapshot.stats.totalMembers}</span>
                        <span>💬 {snapshot.stats.totalPosts}</span>
                        <span>🔥 {snapshot.stats.activeToday}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Pas encore d'historique disponible
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Health Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm">
              Santé communautaire
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
              Notre communauté grandit de {stats.monthlyGrowth}% ce mois. Ensemble, on crée un espace de bienveillance.
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block">
              <Award className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              healthScore >= 70 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
              healthScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
              'bg-gradient-to-r from-red-500 to-orange-500'
            }`}
            aria-hidden="true"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default CommunityStatsBoard;
