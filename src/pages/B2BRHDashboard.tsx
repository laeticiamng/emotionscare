import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Download,
  Filter,
  Calendar,
  BarChart3,
  Activity,
  Heart
} from 'lucide-react';

const B2BRHDashboard: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec contrôles */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau de Bord RH</h1>
            <p className="text-muted-foreground">
              Vision anonymisée du bien-être des équipes
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Données anonymisées</span>
            </div>
            
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes équipes</SelectItem>
                <SelectItem value="dev">Développement</SelectItem>
                <SelectItem value="sales">Commercial</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="rh">Ressources Humaines</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques clés */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Global</p>
                  <p className="text-2xl font-bold text-green-600">Élevé</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                +12% vs semaine précédente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stress Collectif</p>
                  <p className="text-2xl font-bold text-orange-600">Modéré</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Stable par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Participation</p>
                  <p className="text-2xl font-bold text-blue-600">Active</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                73% des collaborateurs actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tendance Globale</p>
                  <p className="text-2xl font-bold text-primary">Positive</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Amélioration continue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="heatmap" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Heatmap des Humeurs d'Équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simulation d'une heatmap */}
                  <div className="grid grid-cols-7 gap-2 text-sm">
                    <div className="font-medium">Équipe</div>
                    <div className="font-medium text-center">Lun</div>
                    <div className="font-medium text-center">Mar</div>
                    <div className="font-medium text-center">Mer</div>
                    <div className="font-medium text-center">Jeu</div>
                    <div className="font-medium text-center">Ven</div>
                    <div className="font-medium text-center">Moyenne</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-sm">
                    <div>Développement</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center">Très bien</div>
                    <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center">Neutre</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center">Très bien</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center font-medium">Positif</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-sm">
                    <div>Commercial</div>
                    <div className="h-8 bg-orange-200 dark:bg-orange-800 rounded flex items-center justify-center">Stress</div>
                    <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center">Neutre</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center">Très bien</div>
                    <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center font-medium">Stable</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-sm">
                    <div>Support</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center">Très bien</div>
                    <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center">Neutre</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center">Bien</div>
                    <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center font-medium">Positif</div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-300 rounded"></div>
                    <span>Très bien</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span>Bien</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span>Neutre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-200 rounded"></div>
                    <span>Stress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Indicateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Utilisation des modules bien-être</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Flash Glow</span>
                        <span className="text-sm font-medium">287 sessions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Musicothérapie</span>
                        <span className="text-sm font-medium">193 sessions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Journal Vocal</span>
                        <span className="text-sm font-medium">156 sessions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Scan Émotionnel</span>
                        <span className="text-sm font-medium">128 sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Session Flash Glow collective</p>
                      <p className="text-xs text-muted-foreground">Équipe Développement - 15 participants</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Il y a 2h</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pic d'utilisation Musicothérapie</p>
                      <p className="text-xs text-muted-foreground">+40% vs moyenne hebdomadaire</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Hier</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recommandations Préventives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                      ⚠️ Attention - Équipe Commercial
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Niveau de stress légèrement élevé détecté cette semaine. 
                      Considérer l'organisation d'une session de groupe Flash Glow.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      💡 Suggestion
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      L'équipe Support montre un excellent engagement. 
                      Partager leurs bonnes pratiques avec les autres équipes.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      ✅ Bonne nouvelle
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Amélioration générale du bien-être sur le dernier mois. 
                      Les initiatives mises en place portent leurs fruits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BRHDashboard;