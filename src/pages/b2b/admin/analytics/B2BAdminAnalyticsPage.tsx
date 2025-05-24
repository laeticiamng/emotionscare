
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, TrendingUp, Shield, Calendar, Filter } from 'lucide-react';

const B2BAdminAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyses et Statistiques</h1>
          <p className="text-muted-foreground">
            Données agrégées et anonymisées du bien-être collectif
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Participation moyenne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">78%</p>
                <p className="text-sm text-muted-foreground">+5% vs période précédente</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Score bien-être</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">7.2/10</p>
                <p className="text-sm text-muted-foreground">+0.3 vs période précédente</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Sessions actives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">156</p>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Évolution du bien-être
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Graphique d'évolution en développement...</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Répartition des activités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Graphique de répartition en développement...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse émotionnelle collective</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Analyses émotionnelles en développement...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métriques d'engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Métriques d'engagement en développement...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Tendances et prédictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Analyses prédictives en développement...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-500" />
            Protection des données
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Garanties de confidentialité :</h4>
            <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
              <li>• Toutes les données sont anonymisées automatiquement</li>
              <li>• Agrégation minimum de 5 participants pour toute statistique</li>
              <li>• Aucune trace d'identification individuelle</li>
              <li>• Conformité RGPD garantie</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BAdminAnalyticsPage;
