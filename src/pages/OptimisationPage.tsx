
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Zap, Brain, AlertTriangle, CheckCircle, BarChart3, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OptimisationPage: React.FC = () => {
  const { toast } = useToast();

  const optimizationMetrics = {
    aiAccuracy: 94.7,
    responseTime: 0.8,
    userSatisfaction: 89.2,
    systemUptime: 99.9,
    dataProcessing: 12.5,
    costEfficiency: 87.3
  };

  const recommendations = [
    {
      id: 1,
      category: "Performance IA",
      title: "Optimiser l'algorithme de reconnaissance émotionnelle",
      description: "Améliorer la précision de détection de 2.3% en affinant les modèles",
      impact: "Élevé",
      effort: "Moyen",
      estimatedGain: "+2.3% précision",
      status: "En cours",
      priority: "high"
    },
    {
      id: 2,
      category: "Expérience Utilisateur",
      title: "Réduire le temps de chargement des dashboards",
      description: "Optimiser les requêtes et implémenter la mise en cache",
      impact: "Moyen",
      effort: "Faible",
      estimatedGain: "-40% temps de chargement",
      status: "Planifié",
      priority: "medium"
    },
    {
      id: 3,
      category: "Engagement",
      title: "Personnaliser les notifications selon les préférences",
      description: "Utiliser l'ML pour optimiser le timing et le contenu des notifications",
      impact: "Élevé",
      effort: "Élevé",
      estimatedGain: "+15% engagement",
      status: "Recherche",
      priority: "high"
    },
    {
      id: 4,
      category: "Coûts",
      title: "Optimiser l'utilisation des ressources cloud",
      description: "Implémenter l'auto-scaling et optimiser les instances",
      impact: "Moyen",
      effort: "Moyen",
      estimatedGain: "-25% coûts infrastructure",
      status: "Proposé",
      priority: "low"
    }
  ];

  const performanceData = [
    {
      metric: "Précision IA",
      current: 94.7,
      target: 97.0,
      trend: +1.2,
      status: "good"
    },
    {
      metric: "Temps de réponse",
      current: 0.8,
      target: 0.5,
      trend: -0.1,
      status: "improving",
      unit: "s"
    },
    {
      metric: "Satisfaction utilisateur",
      current: 89.2,
      target: 95.0,
      trend: +3.1,
      status: "good",
      unit: "%"
    },
    {
      metric: "Disponibilité système",
      current: 99.9,
      target: 99.95,
      trend: +0.1,
      status: "excellent",
      unit: "%"
    }
  ];

  const experiments = [
    {
      id: 1,
      name: "Test A/B - Interface Scan Émotionnel",
      description: "Comparaison de 2 designs pour améliorer l'engagement",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "Actif",
      participants: 450,
      conversionA: 67.2,
      conversionB: 71.8,
      significance: 0.04
    },
    {
      id: 2,
      name: "Optimisation Algorithme Recommandations",
      description: "Test de 3 approches ML pour les suggestions musicales",
      startDate: "2024-01-20",
      endDate: "2024-02-10",
      status: "Terminé",
      participants: 280,
      currentAccuracy: 84.5,
      newAccuracy: 89.1,
      improvement: 4.6
    }
  ];

  const implementRecommendation = (id: number) => {
    toast({
      title: "Optimisation planifiée",
      description: "La recommandation a été ajoutée à la roadmap d'optimisation.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Optimisation Continue</h1>
          <p className="text-gray-600">Amélioration des performances et de l'expérience utilisateur</p>
        </div>

        {/* Métriques clés */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{optimizationMetrics.aiAccuracy}%</div>
              <p className="text-sm text-gray-600">Précision IA</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{optimizationMetrics.responseTime}s</div>
              <p className="text-sm text-gray-600">Temps réponse</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{optimizationMetrics.userSatisfaction}%</div>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{optimizationMetrics.systemUptime}%</div>
              <p className="text-sm text-gray-600">Disponibilité</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{optimizationMetrics.dataProcessing}ms</div>
              <p className="text-sm text-gray-600">Traitement données</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{optimizationMetrics.costEfficiency}%</div>
              <p className="text-sm text-gray-600">Efficacité coûts</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="experiments">Expérimentations</TabsTrigger>
            <TabsTrigger value="automation">Automatisation</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommandations d'Optimisation</h2>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Analyse IA
              </Button>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className={rec.priority === 'high' ? 'border-orange-200 bg-orange-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          rec.priority === 'high' ? 'bg-red-100' : 
                          rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {rec.priority === 'high' ? (
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          ) : rec.priority === 'medium' ? (
                            <Target className="h-6 w-6 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg">{rec.title}</h3>
                            <Badge variant="outline">{rec.category}</Badge>
                            <Badge variant={rec.status === 'En cours' ? 'default' : 'secondary'}>
                              {rec.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{rec.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Impact:</span>
                              <span className="ml-1 font-medium">{rec.impact}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Effort:</span>
                              <span className="ml-1 font-medium">{rec.effort}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Gain estimé:</span>
                              <span className="ml-1 font-medium text-green-600">{rec.estimatedGain}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                        <Button size="sm" onClick={() => implementRecommendation(rec.id)}>
                          Implémenter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <h2 className="text-2xl font-bold">Métriques de Performance</h2>

            <div className="space-y-6">
              {performanceData.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">{metric.metric}</h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-sm ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend}{metric.unit || '%'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Actuel: {metric.current}{metric.unit || '%'}</span>
                        <span>Objectif: {metric.target}{metric.unit || '%'}</span>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-3" />
                      <div className="flex justify-between items-center">
                        <Badge variant={
                          metric.status === 'excellent' ? 'default' : 
                          metric.status === 'good' ? 'secondary' : 'destructive'
                        }>
                          {metric.status === 'excellent' ? 'Excellent' : 
                           metric.status === 'good' ? 'Bon' : 
                           metric.status === 'improving' ? 'En amélioration' : 'À améliorer'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {Math.round((metric.current / metric.target) * 100)}% de l'objectif
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Expérimentations A/B</h2>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Nouvelle expérimentation
              </Button>
            </div>

            <div className="space-y-4">
              {experiments.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{exp.name}</h3>
                        <p className="text-gray-600 mb-2">{exp.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{exp.startDate} → {exp.endDate}</span>
                          <span>{exp.participants} participants</span>
                        </div>
                      </div>
                      <Badge variant={exp.status === 'Actif' ? 'default' : 'secondary'}>
                        {exp.status}
                      </Badge>
                    </div>

                    {exp.conversionA && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600">Version A</div>
                          <div className="text-2xl font-bold text-blue-600">{exp.conversionA}%</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-gray-600">Version B</div>
                          <div className="text-2xl font-bold text-green-600">{exp.conversionB}%</div>
                          <div className="text-xs text-green-700">+{(exp.conversionB - exp.conversionA).toFixed(1)}%</div>
                        </div>
                      </div>
                    )}

                    {exp.improvement && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600">Amélioration mesurée</div>
                        <div className="text-2xl font-bold text-green-600">+{exp.improvement}%</div>
                        <div className="text-xs text-gray-600">
                          De {exp.currentAccuracy}% à {exp.newAccuracy}%
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <h2 className="text-2xl font-bold">Automatisation des Optimisations</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Règles d'Optimisation Automatique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🔄 Auto-scaling</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Ajustement automatique des ressources selon la charge
                    </p>
                    <Badge variant="secondary">Actif</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🧠 ML Auto-tuning</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Optimisation continue des hyperparamètres IA
                    </p>
                    <Badge variant="secondary">Actif</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📊 Alertes Performance</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Notifications automatiques en cas de dégradation
                    </p>
                    <Badge variant="secondary">Actif</Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🚀 Déploiement Graduel</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Rollout automatique des améliorations validées
                    </p>
                    <Badge variant="outline">En configuration</Badge>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Prochaines Automatisations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Optimisation automatique des recommandations personnalisées</li>
                    <li>• Détection proactive des anomalies de bien-être</li>
                    <li>• Ajustement dynamique des algorithmes selon les feedbacks</li>
                    <li>• Optimisation énergétique des infrastructures</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OptimisationPage;
