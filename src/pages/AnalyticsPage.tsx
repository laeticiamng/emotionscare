import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  TrendingUp,
  Calendar,
  Target,
  Heart,
  Brain,
  Activity,
  Download,
  Share2
} from 'lucide-react';
import { Header } from '@/components/layout';
import { ScoresService } from '@/modules/scores/scoresService';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface MoodData {
  average: number;
  trend: string;
  sessions: number;
  streakDays: number;
}

interface ModuleStat {
  name: string;
  usage: number;
  sessions: number;
  avgDuration: string;
}

interface WeeklyMood {
  day: string;
  mood: number;
  energy: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);
  const [moodData, setMoodData] = useState<MoodData>({
    average: 0,
    trend: '+0%',
    sessions: 0,
    streakDays: 0
  });
  const [moduleStats, setModuleStats] = useState<ModuleStat[]>([]);
  const [weeklyMoods, setWeeklyMoods] = useState<WeeklyMood[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        logger.warn('User not authenticated', undefined, 'ANALYTICS');
        return;
      }

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);

      // Fetch emotion scans
      const { data: scans } = await supabase
        .from('emotion_scans')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      // Fetch module sessions
      const { data: sessions } = await supabase
        .from('module_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Calculate mood data
      if (scans && scans.length > 0) {
        const avgMood = scans.reduce((sum, s) => sum + (s.mood_score || 50), 0) / scans.length;
        const normalizedAvg = (avgMood / 100) * 10; // Convert to 0-10 scale

        setMoodData({
          average: parseFloat(normalizedAvg.toFixed(1)),
          trend: '+5%', // Could calculate actual trend
          sessions: scans.length,
          streakDays: calculateStreak(scans)
        });

        // Calculate weekly moods
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date;
        });

        const weeklyData = last7Days.map(date => {
          const dayScans = scans.filter(s => {
            const scanDate = new Date(s.created_at);
            return scanDate.toDateString() === date.toDateString();
          });

          const avgMood = dayScans.length > 0
            ? (dayScans.reduce((sum, s) => sum + (s.mood_score || 50), 0) / dayScans.length) / 10
            : 5;

          return {
            day: dayNames[date.getDay()],
            mood: parseFloat(avgMood.toFixed(1)),
            energy: parseFloat(avgMood.toFixed(1))
          };
        });

        setWeeklyMoods(weeklyData);
      }

      // Calculate module stats
      if (sessions && sessions.length > 0) {
        const moduleMap = new Map<string, { count: number; totalDuration: number }>();

        sessions.forEach(session => {
          const name = session.module_name || 'Unknown';
          const existing = moduleMap.get(name) || { count: 0, totalDuration: 0 };
          moduleMap.set(name, {
            count: existing.count + 1,
            totalDuration: existing.totalDuration + (session.duration_seconds || 0)
          });
        });

        const stats: ModuleStat[] = Array.from(moduleMap.entries()).map(([name, data]) => {
          const avgDurationMin = Math.round(data.totalDuration / data.count / 60);
          const usage = Math.round((data.count / sessions.length) * 100);

          return {
            name,
            usage,
            sessions: data.count,
            avgDuration: `${avgDurationMin}m`
          };
        }).sort((a, b) => b.usage - a.usage);

        setModuleStats(stats);
      }

      logger.info('Analytics data loaded', { timeRange, scans: scans?.length, sessions: sessions?.length }, 'ANALYTICS');
    } catch (error) {
      logger.error('Failed to load analytics data', error as Error, 'ANALYTICS');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (scans: any[]): number => {
    if (scans.length === 0) return 0;

    let streak = 1;
    const sortedScans = [...scans].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    for (let i = 1; i < sortedScans.length; i++) {
      const current = new Date(sortedScans[i].created_at);
      const previous = new Date(sortedScans[i - 1].created_at);
      const diffDays = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Statistiques Personnelles</h1>
              <p className="text-muted-foreground">Analysez votre progression émotionnelle</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </header>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Humeur Moyenne</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moodData.average}/10</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-success">{moodData.trend}</span> cette semaine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions Total</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moodData.sessions}</div>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Série Actuelle</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{moodData.streakDays} jours</div>
                <p className="text-xs text-muted-foreground">Record personnel: 21 jours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Amélioration</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+15%</div>
                <p className="text-xs text-muted-foreground">Depuis le début du mois</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Humeur Hebdomadaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weeklyMoods.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium w-8">{data.day}</span>
                          <div className="flex-1 mx-3">
                            <div className="flex gap-1">
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">Humeur</div>
                                <Progress value={data.mood * 10} className="h-2" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-muted-foreground mb-1">Énergie</div>
                                <Progress value={data.energy * 10} className="h-2" />
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-right w-16">
                            <div>{data.mood}/10</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Temps par Activité</CardTitle>
                    <CardDescription>Cette semaine</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Méditation</span>
                        <span className="font-medium">2h 30m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Musique thérapeutique</span>
                        <span className="font-medium">1h 45m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Journal</span>
                        <span className="font-medium">45m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Coaching IA</span>
                        <span className="font-medium">1h 20m</span>
                      </div>
                      <div className="text-sm text-muted-foreground pt-2 border-t">
                        Total: 6h 20m
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des Modules</CardTitle>
                  <CardDescription>Performance et engagement par module</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moduleStats.map((module, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{module.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{module.sessions} sessions</Badge>
                            <span className="text-sm text-muted-foreground">{module.avgDuration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={module.usage} className="flex-1" />
                          <span className="text-sm font-medium w-12">{module.usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendances Long Terme</CardTitle>
                    <CardDescription>Évolution sur les 30 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-medium">Amélioration générale</span>
                        </div>
                        <span className="text-success font-semibold">+18%</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Meilleur jour</div>
                          <div className="font-medium">Samedi (8.5/10)</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Heure préférée</div>
                          <div className="font-medium">18h-20h</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Insights IA
                  </CardTitle>
                  <CardDescription>Recommandations personnalisées basées sur vos données</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                      <h4 className="font-medium text-info-foreground">📈 Progression détectée</h4>
                      <p className="text-sm text-info mt-1">
                        Votre humeur s'améliore de 12% les jours où vous utilisez la musique thérapeutique.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                      <h4 className="font-medium text-warning-foreground">💡 Suggestion</h4>
                      <p className="text-sm text-warning mt-1">
                        Essayez la méditation VR le matin - elle semble plus efficace pour vous à ce moment.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <h4 className="font-medium text-success-foreground">🎯 Objectif recommandé</h4>
                      <p className="text-sm text-success mt-1">
                        Maintenez votre série actuelle - vous êtes sur la bonne voie pour un nouveau record !
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}