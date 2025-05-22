
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Music, LineChart, Activity, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import EmotionalWeatherCard from '@/components/dashboard/b2c/EmotionalWeatherCard';
import MusicTherapyCard from '@/components/dashboard/b2c/MusicTherapyCard';
import CoachCard from '@/components/dashboard/b2c/CoachCard';
import QuickAccessGrid from '@/components/dashboard/b2c/QuickAccessGrid';
import InspirationalQuoteCard from '@/components/dashboard/b2c/InspirationalQuoteCard';
import RecentActivitiesCard from '@/components/dashboard/b2c/RecentActivitiesCard';

const B2CDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (action: string) => {
    toast(`Action "${action}" initiée`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mon tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace personnel EmotionsCare</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button 
            size="sm" 
            onClick={() => handleAction('scan')}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Activity className="h-4 w-4 mr-2" />
            Scan émotionnel
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleAction('journal')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Journal
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EmotionalWeatherCard className="md:col-span-2" />
            <MusicTherapyCard />
            <CoachCard />
            <QuickAccessGrid className="md:col-span-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InspirationalQuoteCard />
            <RecentActivitiesCard />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution émotionnelle</CardTitle>
              <CardDescription>Suivi de votre état émotionnel au fil du temps</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <LineChart className="h-8 w-8 mr-2" />
                <span>Graphique d'évolution émotionnelle à venir</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between">
                    <span>Calme</span>
                    <span className="text-green-500">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anxiété</span>
                    <span className="text-red-500">-5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concentration</span>
                    <span className="text-green-500">+8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Énergie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-24">
                  <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <div className="absolute inset-1 rounded-full bg-background"></div>
                    <span className="text-xl font-bold">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bien-être</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-24">
                  <Heart className="h-10 w-10 text-primary mr-3" />
                  <span className="text-2xl font-bold">8.2/10</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal émotionnel</CardTitle>
              <CardDescription>Enregistrez vos pensées et émotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune entrée de journal récente</p>
                <Button onClick={() => handleAction('nouvelle entrée')}>
                  Nouvelle entrée
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes sessions</CardTitle>
              <CardDescription>Sessions de thérapie et activités programmées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucune session programmée</p>
                <Button onClick={() => handleAction('programmer une session')}>
                  Programmer une session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CDashboardPage;
