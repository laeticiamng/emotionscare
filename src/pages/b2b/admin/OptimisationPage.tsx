
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap, Settings, ChevronRight } from 'lucide-react';

const OptimisationPage: React.FC = () => {
  const optimizations = [
    { 
      id: 1, 
      title: 'Améliorer Engagement Équipe Marketing', 
      impact: 'high', 
      effort: 'medium',
      status: 'active',
      progress: 75
    },
    { 
      id: 2, 
      title: 'Réduire Stress Équipe Dev', 
      impact: 'medium', 
      effort: 'low',
      status: 'planned',
      progress: 0
    },
    { 
      id: 3, 
      title: 'Optimiser Sessions VR', 
      impact: 'high', 
      effort: 'high',
      status: 'completed',
      progress: 100
    },
  ];

  const recommendations = [
    { title: 'Augmenter fréquence des sessions de méditation', priority: 'high' },
    { title: 'Personnaliser les recommandations musicales', priority: 'medium' },
    { title: 'Optimiser planning des pauses bien-être', priority: 'medium' },
    { title: 'Améliorer interface utilisateur mobile', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Optimisation & Performance</h1>
          <p className="text-muted-foreground">
            Analysez et optimisez l'efficacité des programmes bien-être
          </p>
        </div>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Nouvelle Optimisation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2/10</div>
            <p className="text-xs text-muted-foreground">+0.3 vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimisations Actives</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">En cours d'implémentation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Moyen</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">Amélioration engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340%</div>
            <p className="text-xs text-muted-foreground">Retour sur investissement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Optimisations en Cours</CardTitle>
            <CardDescription>Projets d'amélioration actuels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizations.map((opt) => (
                <div key={opt.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{opt.title}</h4>
                    <Badge variant={
                      opt.status === 'completed' ? 'default' : 
                      opt.status === 'active' ? 'secondary' : 'outline'
                    }>
                      {opt.status === 'completed' ? 'Terminé' : 
                       opt.status === 'active' ? 'En cours' : 'Planifié'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Impact: {opt.impact}</span>
                    <span>•</span>
                    <span>Effort: {opt.effort}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${opt.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations IA</CardTitle>
            <CardDescription>Suggestions d'amélioration automatiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rec.title}</p>
                    <Badge size="sm" variant={
                      rec.priority === 'high' ? 'destructive' : 
                      rec.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {rec.priority === 'high' ? 'Priorité haute' : 
                       rec.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptimisationPage;
