import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Zap, Brain, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const B2BOptimisationPage: React.FC = () => {
  const { toast } = useToast();

  const teamMetrics = {
    wellbeingScore: 87.4,
    productivityGain: 15.2,
    stressReduction: 23.1,
    engagementRate: 92.5,
    retentionRate: 94.8,
    satisfactionScore: 89.1
  };

  const optimizationRecommendations = [
    {
      id: 1,
      category: "Bien-être Équipe",
      title: "Optimiser les sessions de méditation en groupe",
      description: "Planifier des créneaux collectifs pour augmenter l'engagement de 25%",
      impact: "Élevé",
      effort: "Faible",
      estimatedGain: "+25% engagement collectif",
      status: "Recommandé",
      priority: "high",
      targetTeams: ["Marketing", "Développement"]
    },
    {
      id: 2,
      category: "Performance",
      title: "Personnaliser les outils de productivité",
      description: "Adapter les fonctionnalités selon les profils métiers",
      impact: "Moyen",
      effort: "Moyen",
      estimatedGain: "+18% efficacité",
      status: "En cours",
      priority: "medium",
      targetTeams: ["Tous"]
    },
    {
      id: 3,
      category: "Engagement",
      title: "Gamification des objectifs bien-être",
      description: "Système de challenges inter-équipes pour stimuler la participation",
      impact: "Élevé",
      effort: "Élevé",
      estimatedGain: "+35% participation",
      status: "Planifié",
      priority: "high",
      targetTeams: ["Ventes", "Support"]
    }
  ];

  const teamAnalytics = [
    {
      teamName: "Équipe Marketing",
      members: 12,
      wellbeingScore: 89,
      productivity: 94,
      stressLevel: 32,
      engagement: 96,
      trend: "positive"
    },
    {
      teamName: "Équipe Développement",
      members: 18,
      wellbeingScore: 85,
      productivity: 91,
      stressLevel: 45,
      engagement: 88,
      trend: "stable"
    },
    {
      teamName: "Équipe Ventes",
      members: 8,
      wellbeingScore: 82,
      productivity: 87,
      stressLevel: 58,
      engagement: 85,
      trend: "needs-attention"
    }
  ];

  const implementRecommendation = (_id: number) => {
    toast({
      title: "Optimisation planifiée",
      description: "L'équipe RH va mettre en place cette recommandation.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Optimisation B2B</h1>
          <p className="text-gray-600">Amélioration continue du bien-être et de la performance des équipes</p>
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{teamMetrics.wellbeingScore}%</div>
              <p className="text-sm opacity-90">Score Bien-être</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">+{teamMetrics.productivityGain}%</div>
              <p className="text-sm opacity-90">Productivité</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">-{teamMetrics.stressReduction}%</div>
              <p className="text-sm opacity-90">Stress réduit</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{teamMetrics.engagementRate}%</div>
              <p className="text-sm opacity-90">Engagement</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{teamMetrics.retentionRate}%</div>
              <p className="text-sm opacity-90">Rétention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{teamMetrics.satisfactionScore}%</div>
              <p className="text-sm opacity-90">Satisfaction</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="teams">Analyse Équipes</TabsTrigger>
            <TabsTrigger value="strategies">Stratégies</TabsTrigger>
            <TabsTrigger value="roi">ROI & Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommandations d'Optimisation</h2>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Analyse IA Équipes
              </Button>
            </div>

            <div className="space-y-4">
              {optimizationRecommendations.map((rec) => (
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
                          <div className="grid grid-cols-4 gap-4 text-sm mb-3">
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
                            <div>
                              <span className="text-gray-500">Équipes:</span>
                              <span className="ml-1 font-medium">{rec.targetTeams.join(', ')}</span>
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

          <TabsContent value="teams" className="space-y-6">
            <h2 className="text-2xl font-bold">Analyse par Équipe</h2>

            <div className="grid grid-cols-1 gap-6">
              {teamAnalytics.map((team, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-blue-600" />
                        {team.teamName}
                        <Badge variant="outline">{team.members} membres</Badge>
                      </div>
                      <Badge variant={
                        team.trend === 'positive' ? 'default' : 
                        team.trend === 'stable' ? 'secondary' : 'destructive'
                      }>
                        {team.trend === 'positive' ? '↗ Positif' : 
                         team.trend === 'stable' ? '→ Stable' : '⚠ À surveiller'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Bien-être</p>
                        <div className="flex items-center gap-2">
                          <Progress value={team.wellbeingScore} className="flex-1" />
                          <span className="text-sm font-medium">{team.wellbeingScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Productivité</p>
                        <div className="flex items-center gap-2">
                          <Progress value={team.productivity} className="flex-1" />
                          <span className="text-sm font-medium">{team.productivity}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Stress (à réduire)</p>
                        <div className="flex items-center gap-2">
                          <Progress value={100 - team.stressLevel} className="flex-1" />
                          <span className="text-sm font-medium">{team.stressLevel}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Engagement</p>
                        <div className="flex items-center gap-2">
                          <Progress value={team.engagement} className="flex-1" />
                          <span className="text-sm font-medium">{team.engagement}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="space-y-6">
            <h2 className="text-2xl font-bold">Stratégies d'Optimisation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Optimisations Immédiates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">🚀 Sessions Express</h4>
                    <p className="text-sm text-gray-600">Méditations de 5 min entre les réunions</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">📊 Tableaux de Bord</h4>
                    <p className="text-sm text-gray-600">Analytics en temps réel par équipe</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">🎯 Objectifs Personnalisés</h4>
                    <p className="text-sm text-gray-600">KPIs bien-être adaptés au rôle</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Stratégies Long Terme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">🧠 IA Prédictive</h4>
                    <p className="text-sm text-gray-600">Prédiction des risques de burnout</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-medium mb-2">🌟 Culture Bien-être</h4>
                    <p className="text-sm text-gray-600">Transformation culturelle durable</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium mb-2">📈 Évolution Continue</h4>
                    <p className="text-sm text-gray-600">Amélioration continue des processus</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            <h2 className="text-2xl font-bold">ROI & Impact Business</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">Économies Directes</h3>
                  <div className="text-3xl font-bold mb-2">€147K</div>
                  <p className="text-sm opacity-90">Réduction absentéisme + turnover</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">Gains Productivité</h3>
                  <div className="text-3xl font-bold mb-2">€89K</div>
                  <p className="text-sm opacity-90">Amélioration performance équipes</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">ROI Global</h3>
                  <div className="text-3xl font-bold mb-2">340%</div>
                  <p className="text-sm opacity-90">Retour sur investissement annuel</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Projection Impact 12 Mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Réduction du stress moyen</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-32" />
                      <span className="font-medium">-30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Amélioration satisfaction</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-32" />
                      <span className="font-medium">+25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Réduction turnover</span>
                    <div className="flex items-center gap-2">
                      <Progress value={90} className="w-32" />
                      <span className="font-medium">-40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Augmentation engagement</span>
                    <div className="flex items-center gap-2">
                      <Progress value={95} className="w-32" />
                      <span className="font-medium">+35%</span>
                    </div>
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

export default B2BOptimisationPage;