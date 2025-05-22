
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const ReportsPage: React.FC = () => {
  return (
    <UnifiedLayout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Rapports analytiques</h1>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
            <TabsTrigger value="emotional">État émotionnel</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs actifs</CardTitle>
                  <CardDescription>Derniers 30 jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">432</div>
                  <p className="text-sm text-green-500">+12% vs mois précédent</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Score moyen de bien-être</CardTitle>
                  <CardDescription>Ensemble de l'organisation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">7.4/10</div>
                  <p className="text-sm text-amber-500">-0.2 vs mois précédent</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Taux d'adoption</CardTitle>
                  <CardDescription>Pourcentage d'employés actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78%</div>
                  <p className="text-sm text-green-500">+5% vs mois précédent</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Activités par module</CardTitle>
                    <CardDescription>Sessions par semaine</CardDescription>
                  </div>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">Graphique d'activités</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Tendance émotionnelle</CardTitle>
                    <CardDescription>Derniers 30 jours</CardDescription>
                  </div>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">Graphique des tendances</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques d'utilisation</CardTitle>
                <CardDescription>Utilisation des modules par département</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Données statistiques d'utilisation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emotional">
            <Card>
              <CardHeader>
                <CardTitle>Carte émotionnelle</CardTitle>
                <CardDescription>État émotionnel par département</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground">Carte émotionnelle interactive</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Taux d'engagement</CardTitle>
                  <CardDescription>Par module et fonctionnalité</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">Données d'engagement</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Distribution des utilisateurs</CardTitle>
                    <CardDescription>Par niveau d'activité</CardDescription>
                  </div>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground">Graphique de distribution</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default ReportsPage;
