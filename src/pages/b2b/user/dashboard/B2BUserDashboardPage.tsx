
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Mic, Music, Brain, Users, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Scanner émotionnel',
      description: 'Analysez votre état émotionnel',
      icon: Brain,
      action: () => navigate('/b2b/user/scan'),
      color: 'bg-blue-500',
    },
    {
      title: 'Assistant vocal',
      description: 'Parlez avec votre coach IA',
      icon: Mic,
      action: () => navigate('/b2b/user/coach'),
      color: 'bg-green-500',
    },
    {
      title: 'Musique thérapeutique',
      description: 'Relaxez-vous avec des sons adaptés',
      icon: Music,
      action: () => navigate('/b2b/user/music'),
      color: 'bg-purple-500',
    },
    {
      title: 'Communauté',
      description: 'Échangez avec vos collègues',
      icon: Users,
      action: () => navigate('/social-cocon'),
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour {user?.user_metadata?.name || 'Collaborateur'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue dans votre espace bien-être professionnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {user?.user_metadata?.company || 'Entreprise'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 par rapport à la semaine dernière</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score bien-être</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">7.2/10</div>
            <p className="text-xs text-muted-foreground">En amélioration</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Objectifs atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temps d'activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45min</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement à vos outils de bien-être
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-muted/50"
                  onClick={action.action}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Vos dernières interactions avec la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Brain className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Scan émotionnel terminé</p>
                <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Music className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Session de relaxation</p>
                <p className="text-xs text-muted-foreground">Hier à 14:30</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Mic className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Conversation avec le coach IA</p>
                <p className="text-xs text-muted-foreground">Hier à 10:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserDashboardPage;
