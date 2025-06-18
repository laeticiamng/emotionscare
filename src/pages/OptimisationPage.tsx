
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Zap, Target, BarChart3, Lightbulb, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';

const OptimisationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const optimizationAreas = [
    {
      id: 1,
      title: 'Engagement des Employés',
      current: 72,
      target: 85,
      improvement: '+8%',
      status: 'good',
      recommendations: [
        'Augmenter la fréquence des feedbacks',
        'Créer plus d\'opportunités de développement',
        'Améliorer la communication interne'
      ]
    },
    {
      id: 2,
      title: 'Gestion du Stress',
      current: 58,
      target: 75,
      improvement: '+12%',
      status: 'warning',
      recommendations: [
        'Implémenter des pauses mindfulness',
        'Former les managers à la détection du stress',
        'Créer des espaces de décompression'
      ]
    },
    {
      id: 3,
      title: 'Cohésion d\'Équipe',
      current: 79,
      target: 85,
      improvement: '+4%',
      status: 'good',
      recommendations: [
        'Organiser plus d\'activités team building',
        'Faciliter les interactions inter-équipes',
        'Créer des projets collaboratifs'
      ]
    },
    {
      id: 4,
      title: 'Équilibre Vie Pro/Perso',
      current: 64,
      target: 80,
      improvement: '+6%',
      status: 'warning',
      recommendations: [
        'Promouvoir le télétravail',
        'Respecter les horaires de déconnexion',
        'Offrir plus de flexibilité'
      ]
    }
  ];

  const quickWins = [
    {
      title: 'Sessions de respiration guidée',
      impact: 'Élevé',
      effort: 'Faible',
      timeframe: '1 semaine',
      description: 'Implémenter des sessions de 5 minutes de respiration guidée'
    },
    {
      title: 'Feedback régulier',
      impact: 'Moyen',
      effort: 'Faible',
      timeframe: '2 semaines',
      description: 'Mettre en place des check-ins hebdomadaires avec les équipes'
    },
    {
      title: 'Espace de détente',
      impact: 'Moyen',
      effort: 'Moyen',
      timeframe: '1 mois',
      description: 'Aménager un espace dédié à la relaxation'
    }
  ];

  const longTermInitiatives = [
    {
      title: 'Programme de mentorat',
      duration: '6 mois',
      roi: '+15% engagement',
      status: 'planned',
      description: 'Développer un programme de mentorat interne'
    },
    {
      title: 'Formation management bien-être',
      duration: '3 mois',
      roi: '+20% satisfaction managériale',
      status: 'in-progress',
      description: 'Former tous les managers aux techniques de bien-être'
    },
    {
      title: 'Réorganisation des espaces',
      duration: '4 mois',
      roi: '+10% productivité',
      status: 'planned',
      description: 'Repenser l\'aménagement pour favoriser le bien-être'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'great': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'alert': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Élevé': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Optimisation du Bien-être</h1>
        <p className="text-muted-foreground">
          Identifiez les opportunités d'amélioration et optimisez la performance organisationnelle
        </p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Global</p>
                <p className="text-2xl font-bold">68/100</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+7% ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI Bien-être</p>
                <p className="text-2xl font-bold">€245k</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+15% vs année précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Initiatives Actives</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-blue-600 mt-2">3 complétées ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potentiel Gain</p>
                <p className="text-2xl font-bold">+18%</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Performance estimée</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Optimization Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Domaines d'Optimisation</CardTitle>
              <CardDescription>
                Axes d'amélioration prioritaires identifiés par l'IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {optimizationAreas.map((area) => (
                  <div key={area.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{area.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getStatusColor(area.status)}`}>
                          {area.improvement}
                        </span>
                        <Badge variant="outline">{area.current}/{area.target}</Badge>
                      </div>
                    </div>
                    
                    <Progress value={(area.current / area.target) * 100} className="h-2" />
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Recommandations IA
                      </h5>
                      <ul className="space-y-1">
                        {area.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Long-term Initiatives */}
          <Card>
            <CardHeader>
              <CardTitle>Initiatives Long Terme</CardTitle>
              <CardDescription>
                Projets stratégiques pour une amélioration durable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {longTermInitiatives.map((initiative, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{initiative.title}</h4>
                        <p className="text-sm text-muted-foreground">{initiative.description}</p>
                      </div>
                      <Badge variant={initiative.status === 'in-progress' ? 'default' : 'secondary'}>
                        {initiative.status === 'in-progress' ? 'En cours' : 'Planifié'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {initiative.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {initiative.roi}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Wins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Quick Wins
              </CardTitle>
              <CardDescription>
                Actions à impact rapide et faible effort
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickWins.map((win, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{win.title}</h4>
                    <Badge className={getImpactColor(win.impact)}>
                      {win.impact}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{win.description}</p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{win.timeframe}</span>
                    <Button size="sm" variant="outline">
                      Implémenter
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optimization Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Détaillé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Culture', score: 75, color: 'bg-blue-500' },
                { name: 'Leadership', score: 68, color: 'bg-purple-500' },
                { name: 'Communication', score: 72, color: 'bg-green-500' },
                { name: 'Innovation', score: 61, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm">{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Prioritaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { task: 'Réunion équipe Ventes', priority: 'high', due: '2 jours' },
                { task: 'Formation stress managers', priority: 'medium', due: '1 semaine' },
                { task: 'Audit espace bureau', priority: 'low', due: '2 semaines' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <p className="text-xs text-muted-foreground">Dans {item.due}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    {item.priority === 'medium' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {item.priority === 'low' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OptimisationPage;
