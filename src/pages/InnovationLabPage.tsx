
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useInnovation } from '@/contexts/InnovationContext';
import { 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  Users, 
  BarChart3, 
  Rocket,
  Brain,
  Target,
  Globe,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Page Innovation Lab - Point 19 : Innovation et Scalabilité
 * Gestion complète de l'innovation technologique et de la scalabilité
 */
const InnovationLabPage: React.FC = () => {
  const {
    experiments,
    techTrends,
    metrics,
    isFeatureEnabled,
    toggleExperiment,
    addFeedback,
    predictScalabilityNeeds
  } = useInnovation();

  const [newFeedback, setNewFeedback] = useState<{ [key: string]: string }>({});

  const handleToggleExperiment = (experimentId: string) => {
    toggleExperiment(experimentId);
    toast.success('Expérimentation mise à jour');
  };

  const handleAddFeedback = (experimentId: string) => {
    const feedback = newFeedback[experimentId];
    if (feedback?.trim()) {
      addFeedback(experimentId, feedback);
      setNewFeedback(prev => ({ ...prev, [experimentId]: '' }));
      toast.success('Feedback ajouté avec succès');
    }
  };

  const scalabilityPredictions = predictScalabilityNeeds();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'ui': return <Zap className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'security': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header avec métriques globales */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Innovation Lab</h1>
          <Badge variant="outline" className="ml-2">
            Score Innovation: {metrics.innovationScore}/100
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Expérimentations</p>
                  <p className="text-2xl font-bold">{metrics.activeExperiments}/{metrics.totalExperiments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Taux de Succès</p>
                  <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Dette Technique</p>
                  <p className="text-2xl font-bold">{(metrics.techDebtRatio * 100).toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Scalabilité</p>
                  <p className="text-2xl font-bold">{metrics.scalabilityIndex}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="experiments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experiments">Expérimentations</TabsTrigger>
          <TabsTrigger value="trends">Veille Tech</TabsTrigger>
          <TabsTrigger value="scalability">Scalabilité</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
        </TabsList>

        {/* Onglet Expérimentations */}
        <TabsContent value="experiments" className="space-y-4">
          <div className="grid gap-4">
            {experiments.map((experiment) => (
              <Card key={experiment.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(experiment.category)}
                      <CardTitle className="text-lg">{experiment.name}</CardTitle>
                      <Badge variant={experiment.enabled ? 'default' : 'secondary'}>
                        {experiment.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                      {isFeatureEnabled(experiment.id) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Vous participez
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant={experiment.enabled ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleExperiment(experiment.id)}
                    >
                      {experiment.enabled ? 'Désactiver' : 'Activer'}
                    </Button>
                  </div>
                  <CardDescription>{experiment.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Adoption</p>
                      <div className="flex items-center gap-2">
                        <Progress value={experiment.metrics.adoption} className="flex-1" />
                        <span className="text-sm font-medium">{experiment.metrics.adoption}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <div className="flex items-center gap-2">
                        <Progress value={experiment.metrics.satisfaction * 20} className="flex-1" />
                        <span className="text-sm font-medium">{experiment.metrics.satisfaction}/5</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <div className="flex items-center gap-2">
                        <Progress value={experiment.metrics.performance * 100} className="flex-1" />
                        <span className="text-sm font-medium">{(experiment.metrics.performance * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rollout</p>
                    <div className="flex items-center gap-2">
                      <Progress value={experiment.rolloutPercentage} className="flex-1" />
                      <span className="text-sm font-medium">{experiment.rolloutPercentage}%</span>
                    </div>
                  </div>
                  
                  {experiment.feedback.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Derniers retours</p>
                      <div className="space-y-1">
                        {experiment.feedback.slice(-2).map((feedback, index) => (
                          <p key={index} className="text-sm bg-muted/50 p-2 rounded">
                            "{feedback}"
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Votre feedback sur cette expérimentation..."
                      value={newFeedback[experiment.id] || ''}
                      onChange={(e) => setNewFeedback(prev => ({
                        ...prev,
                        [experiment.id]: e.target.value
                      }))}
                      className="flex-1"
                      rows={2}
                    />
                    <Button 
                      onClick={() => handleAddFeedback(experiment.id)}
                      disabled={!newFeedback[experiment.id]?.trim()}
                    >
                      Envoyer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Veille Technologique */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4">
            {techTrends.map((trend) => (
              <Card key={trend.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{trend.name}</CardTitle>
                      <CardDescription>{trend.category}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getImpactColor(trend.impact)}>
                        Impact {trend.impact}
                      </Badge>
                      <Badge variant="outline">
                        {trend.maturity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm">{trend.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Score d'adoption</p>
                      <div className="flex items-center gap-2">
                        <Progress value={trend.adoptionScore * 10} className="flex-1" />
                        <span className="text-sm font-medium">{trend.adoptionScore}/10</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Complexité</p>
                      <div className="flex items-center gap-2">
                        <Progress value={trend.implementationComplexity * 10} className="flex-1" />
                        <span className="text-sm font-medium">{trend.implementationComplexity}/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Bénéfices potentiels</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.potentialBenefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Scalabilité */}
        <TabsContent value="scalability" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Prédictions de Scalabilité
                </CardTitle>
                <CardDescription>
                  Projections de croissance et besoins en ressources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Prochain Mois</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Utilisateurs attendus</span>
                        <span className="font-medium">{scalabilityPredictions.nextMonth.expectedUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Ressources requises</span>
                        <span className="font-medium">{scalabilityPredictions.nextMonth.requiredResources}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Goulots d'étranglement</p>
                        {scalabilityPredictions.nextMonth.bottlenecks.map((bottleneck, index) => (
                          <Badge key={index} variant="destructive" className="mr-1 mb-1 text-xs">
                            {bottleneck}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Prochain Trimestre</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Utilisateurs attendus</span>
                        <span className="font-medium">{scalabilityPredictions.nextQuarter.expectedUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Ressources requises</span>
                        <span className="font-medium">{scalabilityPredictions.nextQuarter.requiredResources}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Goulots d'étranglement</p>
                        {scalabilityPredictions.nextQuarter.bottlenecks.map((bottleneck, index) => (
                          <Badge key={index} variant="destructive" className="mr-1 mb-1 text-xs">
                            {bottleneck}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Recommandations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span>Implémenter le cache distribué pour gérer l'augmentation du trafic</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span>Optimiser les requêtes de base de données les plus fréquentes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Mettre en place l'auto-scaling pour les pics de charge</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Métriques */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Tableau de Bord Innovation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{metrics.innovationScore}</div>
                    <div className="text-sm text-muted-foreground">Score Innovation</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{metrics.averageAdoptionTime}j</div>
                    <div className="text-sm text-muted-foreground">Temps d'Adoption</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{metrics.scalabilityIndex}</div>
                    <div className="text-sm text-muted-foreground">Index Scalabilité</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Statut des Expérimentations</h4>
                  {experiments.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(exp.category)}
                        <div>
                          <p className="font-medium">{exp.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Démarré le {new Date(exp.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={exp.enabled ? 'default' : 'secondary'}>
                          {exp.enabled ? 'Actif' : 'Inactif'}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {exp.rolloutPercentage}% rollout
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InnovationLabPage;
