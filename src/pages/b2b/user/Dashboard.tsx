
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Activity, Music, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';

export default function B2BUserDashboard() {
  // Mock data for demonstration
  const workLifeBalance = 68;
  const stressLevel = 42;
  const focusLevel = 75;

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bonjour';
    if (hour >= 12 && hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">{getTimeBasedGreeting()}, Collaborateur</h2>
          <p className="text-muted-foreground">Bienvenue dans votre espace professionnel</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex gap-2">
            <Activity className="h-4 w-4" /> Scan rapide
          </Button>
          <Button size="sm" variant="outline" className="flex gap-2">
            <MessageSquare className="h-4 w-4" /> Coach pro
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="objectives">Objectifs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Équilibre pro/perso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score d'équilibre</span>
                  <span className="text-sm font-medium">{workLifeBalance}%</span>
                </div>
                <Progress value={workLifeBalance} className="h-2" />
                <p className="text-xs text-muted-foreground pt-2">
                  Meilleur équilibre que 65% des collaborateurs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-rose-500" />
                  Niveau de stress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stress actuel</span>
                  <span className="text-sm font-medium">{stressLevel}%</span>
                </div>
                <Progress value={stressLevel} className="h-2" />
                <p className="text-xs text-muted-foreground pt-2">
                  Plus bas que votre moyenne mensuelle
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Focus professionnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Capacité de focus</span>
                  <span className="text-sm font-medium">{focusLevel}%</span>
                </div>
                <Progress value={focusLevel} className="h-2" />
                <p className="text-xs text-muted-foreground pt-2">
                  En progression depuis 3 jours
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions personnalisées</CardTitle>
              <CardDescription>Optimisez votre journée de travail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-3 px-4">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <Music className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="font-medium">Playlist focus</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">45 min de concentration maximale</span>
                  </div>
                </Button>
                
                <Button variant="outline" className="justify-start h-auto py-3 px-4">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="font-medium">Pause active</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">5 minutes d'étirement</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Insights professionnels</CardTitle>
              <CardDescription>Analyse de votre semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Les insights sont en cours d'analyse et seront disponibles prochainement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="objectives">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs de bien-être</CardTitle>
              <CardDescription>Vos défis professionnels</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Aucun objectif défini. Établissez votre premier défi avec le coach.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Définir un objectif
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
