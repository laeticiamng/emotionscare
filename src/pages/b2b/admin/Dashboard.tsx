
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, AlertCircle, Calendar, BarChart3, Download } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

export default function B2BAdminDashboard() {
  const { setUserMode } = useUserMode();
  const [timePeriod, setTimePeriod] = useState('30'); // days
  
  // Set userMode to b2b-admin when component mounts
  React.useEffect(() => {
    setUserMode('b2b-admin');
  }, [setUserMode]);

  // Mock data
  const teamMood = 72;
  const participationRate = 85;
  const alertsCount = 3;
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Tableau de bord RH</h2>
          <p className="text-muted-foreground">
            Visualisez les signaux faibles, émotions collectives et suggestions proactives
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-1">
          <Button 
            variant={timePeriod === '7' ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimePeriod('7')}
          >
            7 jours
          </Button>
          <Button 
            variant={timePeriod === '30' ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimePeriod('30')}
          >
            30 jours
          </Button>
          <Button 
            variant={timePeriod === '90' ? "default" : "ghost"} 
            size="sm"
            onClick={() => setTimePeriod('90')}
          >
            3 mois
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Humeur d'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{teamMood}/100</div>
                <p className="text-xs text-muted-foreground">+5% vs période précédente</p>
              </div>
              <div className="text-green-500">
                <TrendingUp />
              </div>
            </div>
            <Progress value={teamMood} className="h-1 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{participationRate}%</div>
                <p className="text-xs text-muted-foreground">12 collaborateurs actifs</p>
              </div>
              <div>
                <Users className="text-blue-500" />
              </div>
            </div>
            <Progress value={participationRate} className="h-1 mt-3" />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{alertsCount}</div>
                <p className="text-xs text-muted-foreground">Signaux faibles détectés</p>
              </div>
              <div className="text-amber-500">
                <AlertCircle />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Événements planifiés</p>
              </div>
              <div className="text-indigo-500">
                <Calendar />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="departments">Services</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Évolution de l'humeur collective</CardTitle>
                  <CardDescription>Tendance sur {timePeriod} jours</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart3 className="h-8 w-8 text-muted" />
                  <span className="ml-2 text-muted-foreground">Graphique interactif ici</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Signaux faibles</CardTitle>
                <CardDescription>Nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-900/50">
                    <div className="font-medium flex items-center text-amber-800 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Baisse d'engagement
                    </div>
                    <p className="text-sm mt-1 text-amber-700 dark:text-amber-400">
                      Équipe marketing (-18% cette semaine)
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-900/50">
                    <div className="font-medium flex items-center text-amber-800 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Stress élevé détecté
                    </div>
                    <p className="text-sm mt-1 text-amber-700 dark:text-amber-400">
                      3 collaborateurs en développement
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-900/50">
                    <div className="font-medium flex items-center text-amber-800 dark:text-amber-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Anxiété projet
                    </div>
                    <p className="text-sm mt-1 text-amber-700 dark:text-amber-400">
                      Détectée autour du projet Alpha
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Analyse par service</CardTitle>
              <CardDescription>Comparaison du bien-être entre départements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Le contenu d'analyse par service sera disponible prochainement
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendances émotionnelles</CardTitle>
              <CardDescription>Évolution sur {timePeriod} jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Les données de tendances sont en cours d'analyse
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
