// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, TrendingDown, Brain, Heart, Target, Award,
  Share2, Download, Calendar, BarChart3, Lightbulb, History,
  Star, ChevronRight, Sparkles, Activity, Clock, Zap, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  category: string;
  deadline?: string;
  streak?: number;
}

interface InsightData {
  emotionalTrend: 'positive' | 'stable' | 'needs-attention';
  wellnessScore: number;
  previousWellnessScore: number;
  improvementAreas: string[];
  strengths: string[];
  weeklyProgress: number;
  sessionsCompleted: number;
  goals: Goal[];
  monthlyTrends: { month: string; score: number }[];
  recommendations: { type: string; message: string; priority: 'high' | 'medium' | 'low' }[];
}

interface HistoryEntry {
  date: string;
  wellnessScore: number;
  sessionsCompleted: number;
  emotionalTrend: string;
}

const STORAGE_KEY = 'coach-insights-history';
const GOALS_KEY = 'coach-insights-goals';

const defaultInsights: InsightData = {
  emotionalTrend: 'stable',
  wellnessScore: 50,
  previousWellnessScore: 50,
  improvementAreas: [],
  strengths: [],
  weeklyProgress: 0,
  sessionsCompleted: 0,
  goals: [],
  monthlyTrends: [],
  recommendations: []
};

const CoachInsights: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<InsightData>(defaultInsights);

  // Load insights from Supabase
  useEffect(() => {
    const loadInsights = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get recent emotion scans for wellness score
        const { data: scansData } = await supabase
          .from('emotion_scans')
          .select('valence, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(30);

        // Get user goals
        const { data: goalsData } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id);

        // Get sessions count
        const { count: sessionsCount } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('activity_type', 'coach_session');

        // Calculate wellness score from recent scans
        let wellnessScore = 50;
        let previousWellnessScore = 50;
        if (scansData && scansData.length > 0) {
          const recentScans = scansData.slice(0, 7);
          const olderScans = scansData.slice(7, 14);
          wellnessScore = Math.round(recentScans.reduce((sum, s) => sum + (s.valence || 50), 0) / recentScans.length);
          if (olderScans.length > 0) {
            previousWellnessScore = Math.round(olderScans.reduce((sum, s) => sum + (s.valence || 50), 0) / olderScans.length);
          }
        }

        // Determine emotional trend
        let emotionalTrend: 'positive' | 'stable' | 'needs-attention' = 'stable';
        if (wellnessScore > previousWellnessScore + 5) emotionalTrend = 'positive';
        else if (wellnessScore < previousWellnessScore - 5) emotionalTrend = 'needs-attention';

        // Build monthly trends from scans
        const monthlyTrends: { month: string; score: number }[] = [];
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        if (scansData) {
          const byMonth: Record<string, number[]> = {};
          scansData.forEach(scan => {
            const month = monthNames[new Date(scan.created_at).getMonth()];
            if (!byMonth[month]) byMonth[month] = [];
            byMonth[month].push(scan.valence || 50);
          });
          Object.entries(byMonth).slice(-4).forEach(([month, scores]) => {
            monthlyTrends.push({
              month,
              score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            });
          });
        }

        // Transform goals
        const goals: Goal[] = (goalsData || []).map(g => ({
          id: g.id,
          title: g.title || 'Objectif',
          progress: g.progress || 0,
          target: g.target || 100,
          category: g.category || 'wellness',
          deadline: g.deadline,
          streak: g.streak
        }));

        // Get personalized recommendations
        const { data: recData } = await supabase.functions.invoke('ai-coach', {
          body: { action: 'get-recommendations', wellnessScore }
        });

        setInsights({
          emotionalTrend,
          wellnessScore,
          previousWellnessScore,
          improvementAreas: recData?.improvementAreas || ['Gestion du stress', 'Qualité du sommeil'],
          strengths: recData?.strengths || ['Résilience', 'Empathie'],
          weeklyProgress: Math.min(100, (sessionsCount || 0) * 10),
          sessionsCompleted: sessionsCount || 0,
          goals,
          monthlyTrends: monthlyTrends.length > 0 ? monthlyTrends : [{ month: 'Ce mois', score: wellnessScore }],
          recommendations: recData?.recommendations || [
            { type: 'breathing', message: 'Essayez une session de respiration de 5 minutes.', priority: 'medium' }
          ]
        });
      } catch (error) {
        console.error('Error loading coach insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, [timeRange]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }

    // Save current insights to history
    if (!isLoading && insights.wellnessScore > 0) {
      const newEntry: HistoryEntry = {
        date: new Date().toISOString(),
        wellnessScore: insights.wellnessScore,
        sessionsCompleted: insights.sessionsCompleted,
        emotionalTrend: insights.emotionalTrend
      };

      const existingHistory = stored ? JSON.parse(stored) : [];
      const today = new Date().toDateString();
      const todayExists = existingHistory.some((h: HistoryEntry) =>
        new Date(h.date).toDateString() === today
      );

      if (!todayExists) {
        const updatedHistory = [...existingHistory, newEntry].slice(-90);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      }
    }
  }, [insights, isLoading]);

  // Computed values
  const scoreChange = insights.wellnessScore - insights.previousWellnessScore;
  const scoreChangePercent = ((scoreChange / insights.previousWellnessScore) * 100).toFixed(1);

  const completedGoals = insights.goals.filter(g => g.progress >= g.target).length;
  const averageGoalProgress = Math.round(
    insights.goals.reduce((sum, g) => sum + (g.progress / g.target) * 100, 0) / insights.goals.length
  );

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive': return 'text-emerald-600';
      case 'stable': return 'text-blue-600';
      case 'needs-attention': return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case 'stable': return <Heart className="h-4 w-4 text-blue-600" />;
      case 'needs-attention': return <Brain className="h-4 w-4 text-amber-600" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mindfulness': return <Brain className="h-4 w-4" />;
      case 'wellness': return <Heart className="h-4 w-4" />;
      case 'health': return <Activity className="h-4 w-4" />;
      case 'fitness': return <Zap className="h-4 w-4" />;
      case 'emotions': return <Sparkles className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareText = `Mon score de bien-être: ${insights.wellnessScore}/100 (+${scoreChange} ce mois) - EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mes Insights Coach', text: shareText });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !', description: 'Vos insights ont été copiés' });
    }
  };

  // Export functionality
  const handleExport = () => {
    const data = {
      insights,
      history,
      exportDate: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coach-insights-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exporté !', description: 'Vos données ont été téléchargées' });
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Insights Coach</h2>
          <p className="text-muted-foreground">Analyse personnalisée de votre bien-être</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 jours</SelectItem>
              <SelectItem value="month">30 jours</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Objectifs</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Conseils</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Wellness Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Score de bien-être global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-primary">{insights.wellnessScore}/100</div>
                  <div className={cn('flex items-center gap-1 text-sm', scoreChange > 0 ? 'text-emerald-600' : 'text-red-600')}>
                    {scoreChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {scoreChange > 0 ? '+' : ''}{scoreChange} points ({scoreChangePercent}%)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(insights.emotionalTrend)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.emotionalTrend)}`}>
                    Tendance {insights.emotionalTrend === 'stable' ? 'stable' : insights.emotionalTrend === 'positive' ? 'positive' : 'à surveiller'}
                  </span>
                </div>
              </div>
              <Progress value={insights.wellnessScore} className="h-3" />
              
              {/* Monthly trend mini chart */}
              <div className="mt-4 flex items-end gap-2 h-16">
                {insights.monthlyTrends.map((trend, i) => (
                  <div key={trend.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className={cn(
                        'w-full rounded-t transition-all',
                        i === insights.monthlyTrends.length - 1 ? 'bg-primary' : 'bg-primary/30'
                      )}
                      style={{ height: `${(trend.score / 100) * 48}px` }}
                    />
                    <span className="text-xs text-muted-foreground mt-1">{trend.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{insights.sessionsCompleted}</div>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">{insights.weeklyProgress}%</div>
                <p className="text-sm text-muted-foreground">Progression</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-500">{completedGoals}/{insights.goals.length}</div>
                <p className="text-sm text-muted-foreground">Objectifs atteints</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-500">{averageGoalProgress}%</div>
                <p className="text-sm text-muted-foreground">Moy. objectifs</p>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-emerald-600 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Points forts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base text-amber-600 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Axes d'amélioration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.improvementAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                      {area}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Objectifs en cours
                </span>
                <Badge variant="outline">{completedGoals}/{insights.goals.length} atteints</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.goals.map(goal => (
                <div key={goal.id} className="space-y-2 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(goal.category)}
                      <span className="font-medium">{goal.title}</span>
                      {goal.streak && goal.streak > 0 && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          🔥 {goal.streak}j
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {goal.progress}% / {goal.target}%
                      </span>
                      {goal.progress >= goal.target && (
                        <Badge className="bg-emerald-100 text-emerald-700">✓</Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  {goal.deadline && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      'p-4 rounded-lg border transition-colors hover:shadow-sm cursor-pointer',
                      rec.priority === 'high' && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                      rec.priority === 'medium' && 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
                      rec.priority === 'low' && 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority === 'high' ? 'Prioritaire' : rec.priority === 'medium' ? 'Suggéré' : 'Optionnel'}
                          </Badge>
                          <Badge variant="outline">{rec.type}</Badge>
                        </div>
                        <p className="text-sm">{rec.message}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Historique des insights
                </span>
                <Badge variant="outline">{history.length} entrées</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun historique disponible. Vos données seront enregistrées quotidiennement.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.slice().reverse().map((entry, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(entry.date).toLocaleDateString('fr-FR', { 
                            weekday: 'short', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{entry.wellnessScore}/100</div>
                          <div className="text-xs text-muted-foreground">{entry.sessionsCompleted} sessions</div>
                        </div>
                        <Badge variant="outline" className={cn(
                          entry.emotionalTrend === 'positive' && 'border-emerald-500 text-emerald-600',
                          entry.emotionalTrend === 'stable' && 'border-blue-500 text-blue-600',
                          entry.emotionalTrend === 'needs-attention' && 'border-amber-500 text-amber-600'
                        )}>
                          {entry.emotionalTrend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoachInsights;
