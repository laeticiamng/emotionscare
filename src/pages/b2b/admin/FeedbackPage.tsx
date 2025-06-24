
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, TrendingUp, Search } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const feedbacks = [
    { 
      id: 1, 
      user: 'Marie Dupont', 
      content: 'L\'application de méditation est fantastique ! J\'ai vraiment amélioré ma gestion du stress.',
      rating: 5,
      category: 'meditation',
      date: '2024-01-15',
      status: 'read'
    },
    { 
      id: 2, 
      user: 'Jean Martin', 
      content: 'Il manque des options de personnalisation dans le module musique.',
      rating: 3,
      category: 'music',
      date: '2024-01-14',
      status: 'pending'
    },
    { 
      id: 3, 
      user: 'Sophie Chen', 
      content: 'Le coach IA est très utile, mais parfois ses réponses semblent génériques.',
      rating: 4,
      category: 'coach',
      date: '2024-01-13',
      status: 'in_progress'
    },
    { 
      id: 4, 
      user: 'Pierre Durand', 
      content: 'Excellent outil pour surveiller le bien-être de l\'équipe. Interface intuitive.',
      rating: 5,
      category: 'dashboard',
      date: '2024-01-12',
      status: 'resolved'
    },
  ];

  const feedbackStats = [
    { label: 'Nouveaux Feedbacks', value: '47', change: '+12%', icon: MessageSquare },
    { label: 'Note Moyenne', value: '4.2/5', change: '+0.3', icon: Star },
    { label: 'Taux de Satisfaction', value: '87%', change: '+5%', icon: ThumbsUp },
    { label: 'Résolus ce Mois', value: '34', change: '+8', icon: TrendingUp },
  ];

  const categoryStats = [
    { category: 'meditation', count: 15, satisfaction: 4.6 },
    { category: 'music', count: 12, satisfaction: 4.1 },
    { category: 'coach', count: 10, satisfaction: 4.3 },
    { category: 'dashboard', count: 8, satisfaction: 4.5 },
    { category: 'vr', count: 6, satisfaction: 4.4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback & Amélioration Continue</h1>
          <p className="text-muted-foreground">
            Collecte et analyse des retours utilisateurs
          </p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Demander Feedback
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {feedbackStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change} vs mois dernier</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feedbacks Récents</CardTitle>
                <CardDescription>Derniers retours des utilisateurs</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{feedback.user}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating ? 'text-amber-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" size="sm">
                          {feedback.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feedback.date}</p>
                    </div>
                    <Badge variant={
                      feedback.status === 'resolved' ? 'default' : 
                      feedback.status === 'in_progress' ? 'secondary' : 
                      feedback.status === 'read' ? 'outline' : 'destructive'
                    }>
                      {feedback.status === 'resolved' ? 'Résolu' : 
                       feedback.status === 'in_progress' ? 'En cours' : 
                       feedback.status === 'read' ? 'Lu' : 'Nouveau'}
                    </Badge>
                  </div>
                  <p className="text-sm">{feedback.content}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Répondre
                    </Button>
                    <Button size="sm" variant="outline">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfaction par Module</CardTitle>
            <CardDescription>Notes moyennes par fonctionnalité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{stat.category}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm">{stat.satisfaction}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stat.count} feedbacks</span>
                    <div className="w-16 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(stat.satisfaction / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyse des Tendances</CardTitle>
          <CardDescription>Évolution des retours utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">Points Positifs Fréquents</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Interface intuitive</span>
                  <Badge variant="secondary">23 mentions</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Méditation efficace</span>
                  <Badge variant="secondary">19 mentions</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm">Coach IA utile</span>
                  <Badge variant="secondary">15 mentions</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Points d'Amélioration</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                  <span className="text-sm">Plus d'options de personnalisation</span>
                  <Badge variant="outline">12 mentions</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                  <span className="text-sm">Notifications trop fréquentes</span>
                  <Badge variant="outline">8 mentions</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                  <span className="text-sm">Temps de chargement</span>
                  <Badge variant="outline">6 mentions</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;
