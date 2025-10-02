import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Users, Calendar, TrendingUp, Brain } from 'lucide-react';
import PredictiveRecommendations from '@/components/predictive/PredictiveRecommendations';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';

const PredictiveAnalyticsDashboard: React.FC = () => {
  const { isEnabled, setEnabled, currentPredictions, generatePredictions } = usePredictiveAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Analyses prédictives</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="gap-2" onClick={() => generatePredictions()}>
            <TrendingUp className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="team">Tendances d'équipe</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Confiance prédictive
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentPredictions ? `${Math.round(currentPredictions.confidence * 100)}%` : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentPredictions?.confidence && currentPredictions.confidence > 0.85 
                    ? '+12% depuis la semaine dernière' 
                    : 'Données insuffisantes'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tendance émotionnelle
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {currentPredictions?.emotion || '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dominante prédite pour la semaine
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs actifs
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +573
                </div>
                <p className="text-xs text-muted-foreground">
                  +201 depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Prochaine tendance
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Focus
                </div>
                <p className="text-xs text-muted-foreground">
                  Prédit pour la semaine prochaine
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recommandations proactives</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PredictiveRecommendations showControls={false} />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Analyse des tendances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  Graphique des tendances prédictives (simulé)
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prédictions par équipe (anonymisées)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                Graphique des prédictions par équipe (simulé)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modèles prédictifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3 md:col-span-1">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Modèle émotionnel</h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        Prédit les états émotionnels futurs basés sur l'historique et les tendances
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span>Précision</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 md:col-span-1">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Modèle d'engagement</h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        Anticipe les niveaux d'engagement futurs des utilisateurs
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span>Précision</span>
                          <span className="font-medium">86%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: '86%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 md:col-span-1">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Modèle de bien-être</h3>
                      <div className="text-sm text-muted-foreground mb-4">
                        Prédit les indicateurs de bien-être à venir dans l'équipe
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span>Précision</span>
                          <span className="font-medium">89%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: '89%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des analyses prédictives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Activation des prédictions</h3>
                    <p className="text-sm text-muted-foreground">
                      Active ou désactive l'ensemble du système prédictif
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isEnabled ? "default" : "outline"}
                      onClick={() => setEnabled(true)}
                    >
                      Activé
                    </Button>
                    <Button
                      variant={!isEnabled ? "default" : "outline"}
                      onClick={() => setEnabled(false)}
                    >
                      Désactivé
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Fréquence d'analyse</h3>
                    <p className="text-sm text-muted-foreground">
                      Définit la fréquence des analyses prédictives
                    </p>
                  </div>
                  <div>
                    <Button variant="outline">
                      Toutes les 24 heures
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mode d'anonymisation</h3>
                    <p className="text-sm text-muted-foreground">
                      Configuration du niveau d'anonymisation des données
                    </p>
                  </div>
                  <div>
                    <Button variant="outline">
                      Complet
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
