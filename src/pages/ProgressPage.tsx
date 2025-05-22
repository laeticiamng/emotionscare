
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Shell from '@/Shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart3, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProgressPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const mockChartData = {
    emotions: [
      { date: '01/05', joy: 7, calm: 5, anxiety: 2 },
      { date: '02/05', joy: 6, calm: 6, anxiety: 3 },
      { date: '03/05', joy: 8, calm: 7, anxiety: 1 },
      { date: '04/05', joy: 5, calm: 4, anxiety: 4 },
      { date: '05/05', joy: 7, calm: 6, anxiety: 2 },
    ],
    activities: [
      { name: 'Méditation', completed: 12, goal: 15 },
      { name: 'Journal', completed: 18, goal: 20 },
      { name: 'Musique', completed: 8, goal: 10 },
      { name: 'Exercice', completed: 5, goal: 7 },
    ]
  };

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Votre Progression</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              <span>Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="emotions" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              <span>Émotions</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Activités</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="hidden md:flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendrier</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé de progression</CardTitle>
                <CardDescription>Votre parcours émotionnel récent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Graphique de tendance émotionnelle</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm text-muted-foreground">Jours positifs</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Sessions complétées</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-2xl font-bold">+23%</div>
                    <div className="text-sm text-muted-foreground">Amélioration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activités récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 bg-accent/50 rounded-md">
                      <span>Session de méditation</span>
                      <span className="text-sm text-muted-foreground">Hier</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-accent/50 rounded-md">
                      <span>Journal émotionnel</span>
                      <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-accent/50 rounded-md">
                      <span>Thérapie par la musique</span>
                      <span className="text-sm text-muted-foreground">Il y a 3 jours</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Objectifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-2 bg-accent/50 rounded-md">
                      <span>Méditation quotidienne</span>
                      <span className="text-sm font-medium">8/10 jours</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-accent/50 rounded-md">
                      <span>Journal hebdomadaire</span>
                      <span className="text-sm font-medium">3/3 semaines</span>
                    </li>
                    <li className="flex justify-between items-center p-2 bg-accent/50 rounded-md">
                      <span>Thérapie musicale</span>
                      <span className="text-sm font-medium">5/8 sessions</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-4">Définir un nouvel objectif</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="emotions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des émotions</CardTitle>
                <CardDescription>Évolution de vos émotions au fil du temps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Graphique détaillé des émotions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activités de bien-être</CardTitle>
                <CardDescription>Suivi de vos activités de bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Graphique d'activités</p>
                </div>
                <Button className="mt-4">Ajouter une activité</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier émotionnel</CardTitle>
                <CardDescription>Visualisez votre parcours sur un calendrier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Calendrier avec code couleur émotionnel</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default ProgressPage;
