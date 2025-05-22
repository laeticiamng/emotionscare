
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Users, Calendar, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2CDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace personnel de bien-être
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
            <CardTitle className="text-sm font-medium">Score de bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">+5% depuis la semaine dernière</p>
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
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Communauté
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
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => navigate('/b2c/journal')} size="sm">Journal émotionnel</Button>
                <Button onClick={() => navigate('/b2c/music')} size="sm">Musicothérapie</Button>
                <Button onClick={() => navigate('/b2c/audio')} size="sm">Audiothérapie</Button>
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
        
        <TabsContent value="community" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités communautaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Rejoignez notre communauté pour participer aux événements collectifs.
              </p>
              <div className="flex justify-center">
                <Button>Explorer la communauté</Button>
              </div>
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

export default B2CDashboard;
