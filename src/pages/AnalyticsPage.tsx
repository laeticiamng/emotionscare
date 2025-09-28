import { useState } from 'react';
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const moodData = {
    average: 7.2,
    trend: '+5%',
    sessions: 28,
    streakDays: 12
  };

  const moduleStats = [
    { name: 'Scan Émotionnel', usage: 85, sessions: 15, avgDuration: '3m' },
    { name: 'Musique Thérapeutique', usage: 72, sessions: 12, avgDuration: '15m' },
    { name: 'Coach IA', usage: 68, sessions: 8, avgDuration: '8m' },
    { name: 'Respiration VR', usage: 54, sessions: 6, avgDuration: '12m' },
    { name: 'Journal', usage: 45, sessions: 10, avgDuration: '5m' }
  ];

  const weeklyMoods = [
    { day: 'Lun', mood: 6.5, energy: 7.0 },
    { day: 'Mar', mood: 7.2, energy: 6.8 },
    { day: 'Mer', mood: 8.1, energy: 8.2 },
    { day: 'Jeu', mood: 7.8, energy: 7.5 },
    { day: 'Ven', mood: 6.9, energy: 6.2 },
    { day: 'Sam', mood: 8.5, energy: 8.8 },
    { day: 'Dim', mood: 7.6, energy: 7.9 }
  ];

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
                  <span className="text-green-600">{moodData.trend}</span> cette semaine
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
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Amélioration générale</span>
                        </div>
                        <span className="text-green-600 font-semibold">+18%</span>
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
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900">📈 Progression détectée</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Votre humeur s'améliore de 12% les jours où vous utilisez la musique thérapeutique.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-900">💡 Suggestion</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Essayez la méditation VR le matin - elle semble plus efficace pour vous à ce moment.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900">🎯 Objectif recommandé</h4>
                      <p className="text-sm text-green-700 mt-1">
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