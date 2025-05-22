
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Calendar, PieChart, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace de bien-être professionnel
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/pricing')}>
            Nos offres
          </Button>
          <Button size="sm" variant="outline">
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Votre score de bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-1 rounded">+5%</div>
              <p className="text-xs text-muted-foreground">cette semaine</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">2 sessions cette semaine</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prochain rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mercredi, 15:30</div>
            <p className="text-xs text-muted-foreground">Session de méditation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" /> Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Activités
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Analyses
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé de votre semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette semaine, vos niveaux de stress ont diminué de 12%. Continuez avec vos sessions quotidiennes de méditation.
              </p>
              <div className="mt-4 h-[200px] bg-muted/20 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Graphique de progression</p>
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Bookmark className="h-4 w-4 text-primary" /> Recommandation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Basé sur votre activité récente, nous vous recommandons d'essayer une session de méditation guidée.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Voir plus
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" /> Sessions récentes
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex justify-between">
                      <span>Méditation matinale</span>
                      <span>10 min</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Musique relaxante</span>
                      <span>25 min</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Exercice de respiration</span>
                      <span>5 min</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Accès rapide</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between w-full"
                    onClick={() => navigate('/b2b/user/journal')}
                  >
                    Journal
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between w-full"
                    onClick={() => navigate('/b2b/user/music')}
                  >
                    Musicothérapie
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between w-full"
                    onClick={() => navigate('/b2b/user/audio')}
                  >
                    Audiothérapie
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Les données d'activité seront disponibles après votre première session.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse détaillée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Les analyses détaillées seront disponibles après plus de sessions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BUserDashboard;
