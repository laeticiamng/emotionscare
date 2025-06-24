
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  Settings, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  Lightbulb
} from 'lucide-react';

const OptimisationPage: React.FC = () => {
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState([65]);
  const [optimizationLevel, setOptimizationLevel] = useState('medium');

  const performanceMetrics = [
    {
      name: 'Score Global Bien-être',
      current: 74,
      target: 85,
      trend: 'up',
      improvement: '+8%',
      status: 'good'
    },
    {
      name: 'Engagement Utilisateurs',
      current: 68,
      target: 80,
      trend: 'up',
      improvement: '+12%',
      status: 'warning'
    },
    {
      name: 'Rétention 30 jours',
      current: 89,
      target: 90,
      trend: 'stable',
      improvement: '+1%',
      status: 'excellent'
    },
    {
      name: 'Satisfaction Sessions',
      current: 92,
      target: 95,
      trend: 'up',
      improvement: '+3%',
      status: 'excellent'
    }
  ];

  const optimizationSuggestions = [
    {
      id: 1,
      title: 'Ajuster les horaires de rappels',
      description: 'Les notifications sont plus efficaces entre 14h et 16h',
      impact: 'high',
      effort: 'low',
      category: 'notifications',
      estimatedImprovement: '+15% engagement',
      implemented: false
    },
    {
      id: 2,
      title: 'Personnaliser les contenus VR',
      description: 'Adapter les scénarios VR selon les préférences utilisateur',
      impact: 'medium',
      effort: 'medium',
      category: 'content',
      estimatedImprovement: '+8% satisfaction',
      implemented: false
    },
    {
      id: 3,
      title: 'Optimiser la durée des sessions',
      description: 'Réduire les sessions à 12 minutes pour améliorer la completion',
      impact: 'medium',
      effort: 'low',
      category: 'sessions',
      estimatedImprovement: '+20% completion',
      implemented: true
    },
    {
      id: 4,
      title: 'Gamifier les objectifs hebdomadaires',
      description: 'Ajouter des récompenses pour les streaks de 7 jours',
      impact: 'high',
      effort: 'medium',
      category: 'gamification',
      estimatedImprovement: '+25% rétention',
      implemented: false
    }
  ];

  const automationRules = [
    {
      id: 1,
      name: 'Alerte Bien-être Équipe',
      description: 'Notification si le score d\'équipe descend sous 70%',
      enabled: true,
      trigger: 'score < 70%',
      action: 'Email manager + recommandations'
    },
    {
      id: 2,
      name: 'Adaptation Contenu',
      description: 'Ajustement automatique selon les préférences',
      enabled: true,
      trigger: 'Après 3 sessions',
      action: 'Personnalisation IA'
    },
    {
      id: 3,
      name: 'Intervention Préventive',
      description: 'Contact proactif si inactivité > 7 jours',
      enabled: false,
      trigger: 'Inactivité 7 jours',
      action: 'Message coach + ressources'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-100 text-blue-800">Bon</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">À améliorer</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      default:
        return <Badge variant="outline">Non évalué</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Impact Élevé</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Impact Moyen</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Impact Faible</Badge>;
      default:
        return <Badge variant="outline">Non évalué</Badge>;
    }
  };

  const handleImplementSuggestion = (suggestionId: number) => {
    console.log('Implementing suggestion:', suggestionId);
    // Ici on implémenterait la suggestion
  };

  const handleToggleRule = (ruleId: number, enabled: boolean) => {
    console.log('Toggle rule:', ruleId, enabled);
    // Ici on activerait/désactiverait la règle
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Zap className="w-8 h-8 mr-3" />
              Optimisation & Performance
            </h1>
            <p className="text-muted-foreground">Améliorez continuellement l'efficacité de votre plateforme</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Auto-optimisation</span>
              <Switch
                checked={autoOptimization}
                onCheckedChange={setAutoOptimization}
              />
            </div>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres avancés
            </Button>
          </div>
        </div>

        {/* Métriques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{metric.name}</h3>
                    {getStatusBadge(metric.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-bold">{metric.current}%</span>
                      <span className="text-sm text-muted-foreground">Objectif: {metric.target}%</span>
                    </div>
                    <Progress value={metric.current} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {metric.improvement}
                    </span>
                    <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="automation">Automatisation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Recommandations d'Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className={`p-4 border rounded-lg ${suggestion.implemented ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{suggestion.title}</h3>
                            {suggestion.implemented && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                          <div className="flex items-center space-x-4">
                            {getImpactBadge(suggestion.impact)}
                            <Badge variant="outline">
                              Effort: {suggestion.effort === 'low' ? 'Faible' : suggestion.effort === 'medium' ? 'Moyen' : 'Élevé'}
                            </Badge>
                            <span className="text-sm text-green-600 font-medium">{suggestion.estimatedImprovement}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {suggestion.implemented ? (
                            <Badge className="bg-green-100 text-green-800">Implémenté</Badge>
                          ) : (
                            <Button size="sm" onClick={() => handleImplementSuggestion(suggestion.id)}>
                              Implémenter
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Règles d'Automatisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {automationRules.map((rule) => (
                    <div key={rule.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">{rule.name}</h3>
                            <Switch
                              checked={rule.enabled}
                              onCheckedChange={(enabled) => handleToggleRule(rule.id, enabled)}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Déclencheur: </span>
                              <span className="text-muted-foreground">{rule.trigger}</span>
                            </div>
                            <div>
                              <span className="font-medium">Action: </span>
                              <span className="text-muted-foreground">{rule.action}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des métriques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Graphique d'évolution des performances (à implémenter avec Recharts)
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Impact des optimisations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Avant/Après des améliorations (à implémenter avec Recharts)
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres d'Optimisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niveau d'optimisation automatique</label>
                    <Select value={optimizationLevel} onValueChange={setOptimizationLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservateur</SelectItem>
                        <SelectItem value="medium">Modéré</SelectItem>
                        <SelectItem value="aggressive">Agressif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Seuil d'alerte performance</label>
                      <Badge variant="outline">{alertThreshold[0]}%</Badge>
                    </div>
                    <Slider
                      value={alertThreshold}
                      onValueChange={setAlertThreshold}
                      max={100}
                      min={30}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alertes et Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Alertes de performance</label>
                        <p className="text-xs text-muted-foreground">Notifications en cas de baisse</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Rapports automatiques</label>
                        <p className="text-xs text-muted-foreground">Envoi hebdomadaire des métriques</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Suggestions proactives</label>
                        <p className="text-xs text-muted-foreground">Recommandations basées sur l'IA</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OptimisationPage;
