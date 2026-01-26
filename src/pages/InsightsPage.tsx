/**
 * INSIGHTS PAGE - EMOTIONSCARE
 * Page des insights IA personnalisés avec données Supabase
 * WCAG 2.1 AA compliant
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, TrendingUp, Lightbulb, Target, Check, Clock, X, 
  ChevronRight, Sparkles, RefreshCw, BarChart3, Award,
  AlertTriangle, Bell, Loader2, Filter, Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInsights } from '@/modules/insights';
import type { Insight, InsightType, InsightPriority } from '@/modules/insights/types';
import { motion, AnimatePresence } from 'framer-motion';
import PageRoot from '@/components/common/PageRoot';
import { useNavigate, useSearchParams } from 'react-router-dom';

const INSIGHT_ICONS: Record<InsightType, typeof TrendingUp> = {
  trend: TrendingUp,
  suggestion: Lightbulb,
  pattern: Brain,
  goal: Target,
  warning: AlertTriangle,
  achievement: Award,
  reminder: Bell
};

const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  trend: 'Tendance',
  suggestion: 'Suggestion',
  pattern: 'Pattern',
  goal: 'Objectif',
  warning: 'Alerte',
  achievement: 'Succès',
  reminder: 'Rappel'
};

const PRIORITY_COLORS: Record<InsightPriority, string> = {
  high: 'border-destructive bg-destructive/5',
  medium: 'border-primary bg-primary/5',
  low: 'border-muted-foreground bg-muted'
};

export default function InsightsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'applied'>('all');
  const [typeFilter, setTypeFilter] = useState<InsightType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<InsightPriority | 'all'>('all');
  const [generating, setGenerating] = useState(false);

  const {
    insights,
    stats,
    loading,
    error,
    applyInsight,
    dismissInsight,
    scheduleReminder,
    markAsRead,
    generateInsights,
    reload
  } = useInsights();

  // Filter insights
  const filteredInsights = insights.filter(insight => {
    // Tab filter
    if (activeTab === 'new' && insight.is_read) return false;
    if (activeTab === 'applied' && !insight.is_read) return false;

    // Type filter
    if (typeFilter !== 'all' && insight.insight_type !== typeFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && insight.priority !== priorityFilter) return false;

    return true;
  });

  // Auto-scroll to highlighted insight
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`insight-${highlightId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId, insights]);

  const handleApply = async (insight: Insight) => {
    try {
      await applyInsight(insight.id);
      
      // Navigate to action if available
      const action = insight.action_items?.find(a => a.type === 'navigate');
      if (action?.target) {
        toast({ 
          title: 'Insight appliqué !', 
          description: 'Redirection vers l\'action recommandée...' 
        });
        setTimeout(() => navigate(action.target!), 500);
      } else {
        toast({ 
          title: 'Insight appliqué !', 
          description: 'Cette recommandation a été ajoutée à vos objectifs.' 
        });
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible d\'appliquer l\'insight', variant: 'destructive' });
    }
  };

  const handleDismiss = async (insightId: string) => {
    try {
      await dismissInsight(insightId);
      toast({ title: 'Insight masqué' });
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleRemind = async (insightId: string) => {
    try {
      await scheduleReminder(insightId);
      toast({ 
        title: 'Rappel programmé', 
        description: 'Vous serez notifié demain.' 
      });
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newInsights = await generateInsights();
      if (newInsights?.length) {
        toast({ 
          title: `${newInsights.length} nouveaux insights générés !`,
          description: 'Basés sur vos données récentes.'
        });
      } else {
        toast({ 
          title: 'Aucun nouvel insight',
          description: 'Continuez vos activités pour générer plus d\'insights.'
        });
      }
    } catch {
      toast({ title: 'Erreur de génération', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const getImpactBadge = (priority: InsightPriority) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Priorité haute</Badge>;
      case 'medium': return <Badge variant="default">Priorité moyenne</Badge>;
      case 'low': return <Badge variant="secondary">Priorité basse</Badge>;
    }
  };

  if (loading && !insights.length) {
    return (
      <PageRoot>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          </div>
        </div>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Brain className="h-10 w-10 text-primary" />
                <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Insights IA</h1>
                <p className="text-muted-foreground">Recommandations personnalisées basées sur vos données</p>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={generating}
              className="gap-2"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Générer des insights
            </Button>
          </motion.header>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.new || 0}</p>
                  <p className="text-xs text-muted-foreground">Nouveaux</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.applied || 0}</p>
                  <p className="text-xs text-muted-foreground">Appliqués</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.averageImpact || 0}%</p>
                  <p className="text-xs text-muted-foreground">Impact moyen</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Taux d'application</span>
                  <span className="font-semibold">{stats?.applicationRate || 0}%</span>
                </div>
                <Progress value={stats?.applicationRate || 0} className="h-2" />
              </div>
            </Card>
          </motion.div>

          {/* Filters and Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList>
                <TabsTrigger value="all">
                  Tous ({stats?.total || 0})
                </TabsTrigger>
                <TabsTrigger value="new">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Nouveaux ({stats?.new || 0})
                </TabsTrigger>
                <TabsTrigger value="applied">
                  <Check className="h-4 w-4 mr-1" />
                  Appliqués ({stats?.applied || 0})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {Object.entries(INSIGHT_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={reload} title="Actualiser">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Insights List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredInsights.map((insight, index) => {
                const Icon = INSIGHT_ICONS[insight.insight_type] || Brain;
                const isHighlighted = highlightId === insight.id;

                return (
                  <motion.div
                    key={insight.id}
                    id={`insight-${insight.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card 
                      className={`${PRIORITY_COLORS[insight.priority]} border-2 transition-all hover:shadow-md ${
                        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      onClick={() => !insight.is_read && markAsRead(insight.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{insight.title}</CardTitle>
                                {!insight.is_read && (
                                  <Badge variant="secondary" className="text-xs">Nouveau</Badge>
                                )}
                              </div>
                              <CardDescription className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {INSIGHT_TYPE_LABELS[insight.insight_type]}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(insight.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          {getImpactBadge(insight.priority)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{insight.description}</p>

                        {/* Impact score if available */}
                        {insight.impact_score && (
                          <div className="flex items-center gap-2 text-sm">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <span>Score d'impact: </span>
                            <Progress value={insight.impact_score} className="w-24 h-2" />
                            <span className="font-medium">{insight.impact_score}%</span>
                          </div>
                        )}

                        {/* Actions */}
                        {!insight.is_read && insight.status !== 'reminded' && (
                          <div className="flex gap-2 flex-wrap">
                            {insight.action_items?.length ? (
                              <Button size="sm" onClick={() => handleApply(insight)}>
                                {insight.action_items[0].label}
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => handleApply(insight)}>
                                Appliquer
                                <Check className="h-4 w-4 ml-1" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleRemind(insight.id)}>
                              <Clock className="h-4 w-4 mr-1" />
                              Rappeler demain
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDismiss(insight.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Ignorer
                            </Button>
                          </div>
                        )}

                        {insight.status === 'reminded' && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            <Clock className="h-3 w-3 mr-1" /> Rappel programmé
                          </Badge>
                        )}

                        {insight.is_read && insight.status !== 'reminded' && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" /> Traité
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State */}
            {filteredInsights.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="p-12 text-center">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {activeTab === 'new' 
                      ? 'Aucun nouvel insight'
                      : activeTab === 'applied'
                        ? 'Aucun insight appliqué'
                        : 'Aucun insight disponible'
                    }
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {insights.length === 0 
                      ? 'Continuez à utiliser l\'application pour générer des insights personnalisés.'
                      : 'Essayez de modifier les filtres pour voir plus d\'insights.'
                    }
                  </p>
                  {insights.length === 0 && (
                    <Button onClick={handleGenerate} disabled={generating}>
                      {generating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Générer mes premiers insights
                    </Button>
                  )}
                </Card>
              </motion.div>
            )}
          </div>

          {/* Insights by Type Chart */}
          {stats && stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Répartition par type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.byType).map(([type, count]) => {
                      if (count === 0) return null;
                      const Icon = INSIGHT_ICONS[type as InsightType] || Brain;
                      return (
                        <div key={type} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{count}</p>
                            <p className="text-xs text-muted-foreground">
                              {INSIGHT_TYPE_LABELS[type as InsightType]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageRoot>
  );
}
