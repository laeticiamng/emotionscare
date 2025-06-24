
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Rocket, Zap, TrendingUp, Users, Star } from 'lucide-react';

const InnovationPage: React.FC = () => {
  const innovations = [
    { 
      id: 1, 
      title: 'IA Prédictive pour Bien-être', 
      description: 'Algorithme qui prédit les besoins de bien-être des employés',
      status: 'in_development',
      impact: 'high',
      team: 'AI Team',
      progress: 75
    },
    { 
      id: 2, 
      title: 'VR Thérapeutique Immersive', 
      description: 'Environnements VR personnalisés pour la relaxation',
      status: 'testing',
      impact: 'high',
      team: 'VR Team',
      progress: 90
    },
    { 
      id: 3, 
      title: 'Assistant Vocal Émotionnel', 
      description: 'Assistant IA capable d\'analyser les émotions vocales',
      status: 'concept',
      impact: 'medium',
      team: 'Voice Team',
      progress: 25
    },
  ];

  const metrics = [
    { label: 'Projets Innovation', value: '12', change: '+3', icon: Lightbulb },
    { label: 'En Développement', value: '5', change: '+1', icon: Rocket },
    { label: 'Déployés ce Mois', value: '2', change: '+2', icon: Zap },
    { label: 'Impact Utilisateurs', value: '89%', change: '+12%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Innovation & R&D</h1>
          <p className="text-muted-foreground">
            Laboratoire d'innovation pour le bien-être en entreprise
          </p>
        </div>
        <Button>
          <Lightbulb className="mr-2 h-4 w-4" />
          Nouvelle Idée
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.change} vs mois dernier</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets en Cours</CardTitle>
          <CardDescription>Innovations actuellement en développement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {innovations.map((innovation) => (
              <div key={innovation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{innovation.title}</h3>
                    <p className="text-sm text-muted-foreground">{innovation.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      innovation.status === 'in_development' ? 'default' : 
                      innovation.status === 'testing' ? 'secondary' : 'outline'
                    }>
                      {innovation.status === 'in_development' ? 'En développement' : 
                       innovation.status === 'testing' ? 'En test' : 'Concept'}
                    </Badge>
                    <Badge variant={innovation.impact === 'high' ? 'destructive' : 'secondary'}>
                      Impact {innovation.impact === 'high' ? 'élevé' : 'moyen'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{innovation.team}</span>
                    </div>
                    <span>Progression: {innovation.progress}%</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Voir détails
                  </Button>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${innovation.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Laboratoire d'Idées</CardTitle>
            <CardDescription>Nouvelles propositions d'innovation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-sm">Biométrie Émotionnelle</p>
                    <p className="text-xs text-muted-foreground">Détection d'émotions via capteurs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">8.5</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Rocket className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Coaching IA Personnalisé</p>
                    <p className="text-xs text-muted-foreground">IA adaptée au profil individuel</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">9.2</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Micro-Interventions Intelligentes</p>
                    <p className="text-xs text-muted-foreground">Interventions automatiques contextuelles</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">7.8</span>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              Soumettre une Idée
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies Émergentes</CardTitle>
            <CardDescription>Veille technologique et tendances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Intelligence Artificielle Émotionnelle</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Nouvelles avancées en reconnaissance émotionnelle multimodale
                </p>
                <Badge variant="secondary" size="sm">Priorité haute</Badge>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Réalité Augmentée Thérapeutique</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Applications AR pour la gestion du stress et de l'anxiété
                </p>
                <Badge variant="secondary" size="sm">En exploration</Badge>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Neurofeedback Digital</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Interfaces cerveau-ordinateur pour le bien-être
                </p>
                <Badge variant="outline" size="sm">Recherche</Badge>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">IoT Bien-être Prédictif</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Capteurs environnementaux et prédiction de l'humeur
                </p>
                <Badge variant="secondary" size="sm">Prototype</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InnovationPage;
