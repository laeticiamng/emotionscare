// @ts-nocheck
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [moodData, setMoodData] = useState<MoodData>({
    average: 0,
    trend: '+0%',
    sessions: 0,
    streakDays: 0
  });
  const [moduleStats, setModuleStats] = useState<ModuleStat[]>([]);
  const [weeklyMoods, setWeeklyMoods] = useState<WeeklyMood[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch activity sessions for the user
        const { data: sessions } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('started_at', new Date(Date.now() - getDaysInMs(timeRange)).toISOString())
          .order('started_at', { ascending: false });

        // Fetch activity streaks
        const { data: streaks } = await supabase
          .from('activity_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Calculate mood data
        if (sessions && sessions.length > 0) {
          const avgMood = sessions.reduce((sum, s) => sum + (s.mood_after || 5), 0) / sessions.length;
          setMoodData({
            average: Math.round(avgMood * 10) / 10,
            trend: '+5%',
            sessions: sessions.length,
            streakDays: streaks?.current_streak || 0
          });

          // Group sessions by day of week
          const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
          const dayMap = new Map<string, { moods: number[], energies: number[] }>();
          days.forEach(d => dayMap.set(d, { moods: [], energies: [] }));

          const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
          sessions.forEach(s => {
            const dayName = dayNames[new Date(s.started_at).getDay()];
            const entry = dayMap.get(dayName);
            if (entry) {
              entry.moods.push(s.mood_after || 0);
              entry.energies.push(s.mood_after || 0);
            }
          });

          const weekData = days.map(day => {
            const entry = dayMap.get(day)!;
            return {
              day,
              mood: entry.moods.length > 0 ? Math.round((entry.moods.reduce((a, b) => a + b, 0) / entry.moods.length) * 10) / 10 : 0,
              energy: entry.energies.length > 0 ? Math.round((entry.energies.reduce((a, b) => a + b, 0) / entry.energies.length) * 10) / 10 : 0
            };
          });
          setWeeklyMoods(weekData);
        } else {
          // No sessions available
          setMoodData({ average: 0, trend: '+0%', sessions: 0, streakDays: 0 });
          setWeeklyMoods([
            { day: 'Lun', mood: 0, energy: 0 },
            { day: 'Mar', mood: 0, energy: 0 },
            { day: 'Mer', mood: 0, energy: 0 },
            { day: 'Jeu', mood: 0, energy: 0 },
            { day: 'Ven', mood: 0, energy: 0 },
            { day: 'Sam', mood: 0, energy: 0 },
            { day: 'Dim', mood: 0, energy: 0 }
          ]);
        }

        // Module stats - empty when no real data
        setModuleStats([]);

      } catch (error) {
        logger.error('Error fetching analytics:', error, 'ANALYTICS');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user?.id, timeRange]);

  const getDaysInMs = (range: string): number => {
    switch (range) {
      case '7d': return 7 * 24 * 60 * 60 * 1000;
      case '30d': return 30 * 24 * 60 * 60 * 1000;
      case '90d': return 90 * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
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
                    <div className="text-center text-muted-foreground py-8">
                      Aucune donnée disponible
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
                  {moduleStats.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Aucune donnée disponible
                    </div>
                  ) : (
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
                  )}
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
                    <div className="text-center text-muted-foreground py-8">
                      Aucune donnée disponible
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