import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Navigation, 
  Smartphone, 
  Heart,
  Target,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Eye,
  MousePointer,
  Zap
} from 'lucide-react';

interface UXMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface UserJourney {
  name: string;
  steps: string[];
  conversionRate: number;
  dropOffPoints: string[];
  averageTime: number;
}

const UXDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<UXMetric[]>([
    { name: 'Taux de conversion onboarding', value: 78, target: 80, unit: '%', status: 'warning', trend: 'up' },
    { name: 'Temps moyen de session', value: 8.5, target: 10, unit: 'min', status: 'good', trend: 'up' },
    { name: 'Taux de rétention J7', value: 65, target: 70, unit: '%', status: 'warning', trend: 'stable' },
    { name: 'Score de satisfaction (NPS)', value: 42, target: 50, unit: '', status: 'warning', trend: 'up' },
    { name: 'Taux d\'abandon panier', value: 23, target: 20, unit: '%', status: 'critical', trend: 'down' },
    { name: 'Vitesse de chargement', value: 1.8, target: 2.0, unit: 's', status: 'good', trend: 'stable' },
  ]);

  const [journeys] = useState<UserJourney[]>([
    {
      name: 'Inscription B2C',
      steps: ['Accueil', 'Sélection mode', 'Formulaire', 'Onboarding', 'Dashboard'],
      conversionRate: 78,
      dropOffPoints: ['Formulaire (15%)', 'Onboarding étape 2 (7%)'],
      averageTime: 12.5
    },
    {
      name: 'Inscription B2B User',
      steps: ['Accueil', 'Sélection B2B', 'Connexion', 'Dashboard', 'Premier module'],
      conversionRate: 85,
      dropOffPoints: ['Connexion (10%)', 'Premier module (5%)'],
      averageTime: 8.2
    },
    {
      name: 'Utilisation quotidienne',
      steps: ['Connexion', 'Dashboard', 'Module principal', 'Action', 'Déconnexion'],
      conversionRate: 92,
      dropOffPoints: ['Module principal (8%)'],
      averageTime: 6.8
    }
  ]);

  const [heatmapData] = useState([
    { page: '/b2c/onboarding', clicks: 1250, interactions: 95, issues: ['Bouton "Suivant" pas assez visible'] },
    { page: '/b2c/dashboard', clicks: 2100, interactions: 88, issues: ['Menu latéral confus sur mobile'] },
    { page: '/b2b/selection', clicks: 890, interactions: 92, issues: [] },
    { page: '/b2b/admin/dashboard', clicks: 650, interactions: 85, issues: ['Graphiques pas responsive'] }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tableau de Bord UX
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Analyse en temps réel de l'expérience utilisateur sur EmotionsCare
          </p>
        </motion.div>

        {/* Métriques principales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {metrics.map((metric, index) => (
            <Card key={metric.name} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {getStatusIcon(metric.status)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {metric.value}{metric.unit}
                  </div>
                  <Badge 
                    variant={metric.status === 'good' ? 'default' : 'secondary'}
                    className={getStatusColor(metric.status)}
                  >
                    {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '→'} 
                    {metric.status}
                  </Badge>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Objectif: {metric.target}{metric.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Tabs defaultValue="journeys" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="journeys" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Parcours
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journeys" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6"
            >
              {journeys.map((journey, index) => (
                <Card key={journey.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {journey.name}
                      </CardTitle>
                      <Badge variant={journey.conversionRate > 80 ? 'default' : 'secondary'}>
                        {journey.conversionRate}% conversion
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Étapes du parcours</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {journey.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Points d'abandon</h4>
                        <ul className="space-y-1 text-sm text-red-600">
                          {journey.dropOffPoints.map((point, i) => (
                            <li key={i}>• {point}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center">
                        <Clock className="w-8 h-8 text-primary mb-2" />
                        <div className="text-2xl font-bold">{journey.averageTime}min</div>
                        <div className="text-sm text-muted-foreground">Temps moyen</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4"
            >
              {heatmapData.map((page, index) => (
                <Card key={page.page}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-mono">{page.page}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{page.clicks} clics</Badge>
                        <Badge variant="outline">{page.interactions}% interaction</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {page.issues.length > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Issues détectées:</h4>
                        <ul className="text-sm text-red-600">
                          {page.issues.map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {page.issues.length === 0 && (
                      <div className="bg-green-50 p-3 rounded-lg text-green-800 text-sm">
                        ✅ Aucun problème UX détecté sur cette page
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Métriques de Performance UX</CardTitle>
                <CardDescription>
                  Web Vitals et indicateurs de performance utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1.2s</div>
                    <div className="text-sm text-green-800">First Contentful Paint</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">2.1s</div>
                    <div className="text-sm text-yellow-800">Largest Contentful Paint</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0.08</div>
                    <div className="text-sm text-green-800">Cumulative Layout Shift</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">95ms</div>
                    <div className="text-sm text-green-800">First Input Delay</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Insights et Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">🎯 Opportunité d'amélioration</h4>
                    <p className="text-sm text-blue-600">
                      L'étape 2 de l'onboarding B2C présente un taux d'abandon de 7%. 
                      Simplifier le formulaire pourrait améliorer la conversion de +5%.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">✅ Point fort</h4>
                    <p className="text-sm text-green-600">
                      Le parcours B2B User a un excellent taux de conversion de 85%. 
                      Cette approche pourrait être appliquée au parcours B2C.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">🔮 Prédiction</h4>
                    <p className="text-sm text-purple-600">
                      En optimisant les 3 premiers points d'abandon, nous pourrions augmenter 
                      la rétention globale de 12% dans les 4 prochaines semaines.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions recommandées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Actions Prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="default" className="justify-start">
                  🚀 Optimiser l'onboarding B2C
                </Button>
                <Button variant="outline" className="justify-start">
                  📱 Améliorer l'UX mobile
                </Button>
                <Button variant="outline" className="justify-start">
                  🎨 Revoir la hiérarchie visuelle
                </Button>
                <Button variant="outline" className="justify-start">
                  ⚡ Accélérer le temps de chargement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UXDashboard;