
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const OptimisationPage: React.FC = () => {
  const optimizations = [
    {
      id: 1,
      title: "Améliorer l'engagement des équipes",
      description: "Augmenter la participation aux activités de bien-être",
      priority: "high",
      status: "active",
      impact: "85%",
      recommendation: "Organiser des sessions interactives courtes"
    },
    {
      id: 2,
      title: "Réduire le stress au travail",
      description: "Identifier et réduire les sources de stress",
      priority: "medium",
      status: "in_progress",
      impact: "72%",
      recommendation: "Implémenter des pauses méditatives"
    },
    {
      id: 3,
      title: "Optimiser les horaires de bien-être",
      description: "Trouver les créneaux les plus efficaces",
      priority: "low",
      status: "completed",
      impact: "91%",
      recommendation: "Maintenir les sessions de 14h-15h"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Haute</Badge>;
      case 'medium':
        return <Badge variant="secondary">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline">Basse</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'active':
        return <Target className="h-4 w-4 text-blue-500" />;
      default:
        return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Optimisation</h1>
          <p className="text-muted-foreground">
            Optimisez les performances et le bien-être de vos équipes
          </p>
        </div>
        <Button className="gap-2">
          <Zap className="h-4 w-4" />
          Nouvelle optimisation
        </Button>
      </div>

      {/* Métriques de performance */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score global</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimisations actives</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Améliorations</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Ce trimestre</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact moyen</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79%</div>
            <p className="text-xs text-muted-foreground">D'efficacité</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des optimisations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Optimisations en cours</h2>
        
        {optimizations.map((optimization) => (
          <Card key={optimization.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(optimization.status)}
                    <CardTitle className="text-lg">{optimization.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">{optimization.description}</p>
                </div>
                <div className="flex gap-2">
                  {getPriorityBadge(optimization.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Impact estimé</span>
                  <span className="font-bold text-primary">{optimization.impact}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium">Recommandation</span>
                  <p className="text-sm text-muted-foreground">{optimization.recommendation}</p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                  <Button size="sm">
                    Appliquer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OptimisationPage;
