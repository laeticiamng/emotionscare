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
  const [moodData, setMoodData] = useState<MoodData>({
    average: 0,
    trend: '0%',
    sessions: 0,
    streakDays: 0
  });
  const [moduleStats, setModuleStats] = useState<ModuleStat[]>([]);
  const [weeklyMoods, setWeeklyMoods] = useState<WeeklyMood[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Charger les données depuis Supabase via l'API existante
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsLoading(false);
          return;
        }

        // Récupérer les sessions d'activité
        const { data: sessions } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        // Récupérer les scans émotionnels
        const { data: scans } = await supabase
          .from('emotion_scans')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false });

        // Calculer les statistiques
        const totalSessions = sessions?.length || 0;
        const avgMood = scans && scans.length > 0
          ? scans.reduce((sum, s) => sum + (s.mood_score || 5), 0) / scans.length
          : 5;

        // Calculer le streak
        let streak = 0;
        if (sessions && sessions.length > 0) {
          const uniqueDays = new Set(sessions.map(s => s.created_at.split('T')[0]));
          const today = new Date().toISOString().split('T')[0];
          let checkDate = new Date();
          while (uniqueDays.has(checkDate.toISOString().split('T')[0])) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          }
        }

        // Calculer le trend
        const midPoint = Math.floor((scans?.length || 0) / 2);
        const recentAvg = scans && scans.length > midPoint
          ? scans.slice(0, midPoint).reduce((sum, s) => sum + (s.mood_score || 5), 0) / midPoint
          : avgMood;
        const oldAvg = scans && scans.length > midPoint
          ? scans.slice(midPoint).reduce((sum, s) => sum + (s.mood_score || 5), 0) / (scans.length - midPoint)
          : avgMood;
        const trendPercent = oldAvg > 0 ? Math.round(((recentAvg - oldAvg) / oldAvg) * 100) : 0;

        setMoodData({
          average: Math.round(avgMood * 10) / 10,
          trend: `${trendPercent >= 0 ? '+' : ''}${trendPercent}%`,
          sessions: totalSessions,
          streakDays: streak
        });

        // Calculer les stats par module
        const moduleMap = new Map<string, { sessions: number; totalDuration: number }>();
        sessions?.forEach(s => {
          const existing = moduleMap.get(s.module_name) || { sessions: 0, totalDuration: 0 };
          moduleMap.set(s.module_name, {
            sessions: existing.sessions + 1,
            totalDuration: existing.totalDuration + (s.duration_seconds || 0)
          });
        });

        const moduleNames: Record<string, string> = {
          'scan': 'Scan Émotionnel',
          'music': 'Musique Thérapeutique',
          'coach': 'Coach IA',
          'breathing-vr': 'Respiration VR',
          'journal': 'Journal'
        };

        const stats = Array.from(moduleMap.entries())
          .map(([name, data]) => ({
            name: moduleNames[name] || name,
            usage: Math.round((data.sessions / Math.max(totalSessions, 1)) * 100),
            sessions: data.sessions,
            avgDuration: `${Math.round(data.totalDuration / Math.max(data.sessions, 1) / 60)}m`
          }))
          .sort((a, b) => b.sessions - a.sessions)
          .slice(0, 5);

        setModuleStats(stats.length > 0 ? stats : [
          { name: 'Scan Émotionnel', usage: 0, sessions: 0, avgDuration: '0m' }
        ]);

        // Calculer les humeurs hebdomadaires
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const weekData: WeeklyMood[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayStr = date.toISOString().split('T')[0];
          const dayScans = scans?.filter(s => s.created_at.startsWith(dayStr)) || [];
          const avgDayMood = dayScans.length > 0
            ? dayScans.reduce((sum, s) => sum + (s.mood_score || 5), 0) / dayScans.length
            : 5;
          const avgDayEnergy = dayScans.length > 0
            ? dayScans.reduce((sum, s) => sum + (s.energy_level || 5), 0) / dayScans.length
            : 5;
          weekData.push({
            day: dayNames[date.getDay()],
            mood: Math.round(avgDayMood * 10) / 10,
            energy: Math.round(avgDayEnergy * 10) / 10
          });
        }
        setWeeklyMoods(weekData);

      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

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