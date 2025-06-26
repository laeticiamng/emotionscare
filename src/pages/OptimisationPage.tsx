
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Zap, 
  BarChart3, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface OptimizationMetric {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: 'performance' | 'engagement' | 'wellness' | 'productivity';
}

const OptimisationPage: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const metrics: OptimizationMetric[] = [
    {
      id: '1',
      name: 'Taux d\'engagement',
      currentValue: 78,
      targetValue: 85,
      unit: '%',
      trend: 'up',
      status: 'good'
    },
    {
      id: '2',
      name: 'Temps de réponse moyen',
      currentValue: 1.2,
      targetValue: 1.0,
      unit: 's',
      trend: 'down',
      status: 'warning'
    },
    {
      id: '3',
      name: 'Score de bien-être',
      currentValue: 7.3,
      targetValue: 8.0,
      unit: '/10',
      trend: 'up',
      status: 'good'
    },
    {
      id: '4',
      name: 'Rétention utilisateurs',
      currentValue: 85,
      targetValue: 90,
      unit: '%',
      trend: 'stable',
      status: 'warning'
    }
  ];

  const suggestions: OptimizationSuggestion[] = [
    {
      id: '1',
      title: 'Optimiser les notifications push',
      description: 'Personnaliser les horaires d\'envoi selon les préférences utilisateur',
      impact: 'high',
      effort: 'medium',
      category: 'engagement'
    },
    {
      id: '2',
      title: 'Améliorer les temps de chargement',
      description: 'Mise en cache des ressources fréquemment utilisées',
      impact: 'medium',
      effort: 'high',
      category: 'performance'
    },
    {
      id: '3',
      title: 'Programme de fidélisation',
      description: 'Système de points et récompenses pour l\'engagement régulier',
      impact: 'high',
      effort: 'high',
      category: 'engagement'
    },
    {
      id: '4',
      title: 'Sessions de méditation courtes',
      description: 'Proposer des sessions de 5 minutes pour les pauses rapides',
      impact: 'medium',
      effort: 'low',
      category: 'wellness'
    }
  ];

  const runOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Optimisation Système</h1>
            <p className="text-muted-foreground">
              Analysez et optimisez les performances de votre plateforme
            </p>
          </div>
          <Button onClick={runOptimization} disabled={isOptimizing}>
            {isOptimizing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Zap className="mr-2 h-4 w-4" />
            )}
            {isOptimizing ? 'Optimisation...' : 'Lancer l\'optimisation'}
          </Button>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium">
                          {metric.name}
                        </CardTitle>
                        {getStatusIcon(metric.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">
                            {metric.currentValue}{metric.unit}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {metric.targetValue}{metric.unit}
                          </span>
                        </div>
                        
                        <Progress 
                          value={(metric.currentValue / metric.targetValue) * 100}
                          className="h-2"
                        />
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Progression</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">
                              {Math.round((metric.currentValue / metric.targetValue) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                          <CardDescription>{suggestion.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(suggestion.impact)}>
                            Impact {suggestion.impact}
                          </Badge>
                          <Badge variant="outline">
                            Effort {suggestion.effort}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">
                          {suggestion.category}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Plus d'infos
                          </Button>
                          <Button size="sm">
                            Implémenter
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Globale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Score global</span>
                      <span className="font-semibold">87/100</span>
                    </div>
                    <Progress value={87} className="h-3" />
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-sm text-muted-foreground">Disponibilité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">1.2s</div>
                        <div className="text-sm text-muted-foreground">Temps de réponse</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Utilisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Utilisateurs actifs</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sessions moyennes/jour</span>
                      <span className="font-semibold">3.2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Durée moyenne session</span>
                      <span className="font-semibold">12m 34s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres d'Optimisation
                </CardTitle>
                <CardDescription>
                  Configurez les paramètres d'optimisation automatique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Optimisation automatique</h4>
                      <p className="text-sm text-muted-foreground">
                        Lancer l'optimisation automatiquement chaque nuit
                      </p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notifications d'alertes</h4>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des alertes en cas de problème de performance
                      </p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Seuils de performance</h4>
                      <p className="text-sm text-muted-foreground">
                        Définir les seuils d'alerte pour les métriques
                      </p>
                    </div>
                    <Button variant="outline">Modifier</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isOptimizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <Card className="w-96">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto" />
                  <h3 className="text-lg font-semibold">Optimisation en cours...</h3>
                  <p className="text-muted-foreground">
                    Analyse des performances et application des améliorations
                  </p>
                  <Progress value={66} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OptimisationPage;
