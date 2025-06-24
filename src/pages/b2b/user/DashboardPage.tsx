
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Users, 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  Trophy, 
  Calendar,
  TrendingUp,
  Building,
  UserCheck,
  Target,
  Activity
} from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading } = useDashboardData();

  const features = [
    { 
      title: 'Scanner Émotionnel', 
      icon: Brain, 
      path: '/scan', 
      color: 'bg-blue-500',
      description: 'Analysez vos émotions'
    },
    { 
      title: 'Coach IA', 
      icon: Heart, 
      path: '/coach', 
      color: 'bg-red-500',
      description: 'Votre coach personnel'
    },
    { 
      title: 'Musicothérapie', 
      icon: Music, 
      path: '/music', 
      color: 'bg-purple-500',
      description: 'Musique adaptée'
    },
    { 
      title: 'Journal', 
      icon: BookOpen, 
      path: '/journal', 
      color: 'bg-green-500',
      description: 'Votre journal personnel'
    },
    { 
      title: 'Gamification', 
      icon: Trophy, 
      path: '/gamification', 
      color: 'bg-yellow-500',
      description: 'Défis et récompenses'
    },
    { 
      title: 'Social Cocon', 
      icon: Users, 
      path: '/social-cocon', 
      color: 'bg-pink-500',
      description: 'Équipe et communauté'
    }
  ];

  return (
    <div data-testid="page-root" className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord collaborateur</h1>
          <p className="text-gray-600">Votre espace bien-être en entreprise</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Building className="h-4 w-4" />
          <span>Entreprise Demo</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bien-être personnel</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2/10</div>
            <p className="text-xs text-muted-foreground">
              +0.5 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Équipe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              collègues actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objectifs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">
              complétés ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              ce trimestre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Status */}
      <Card>
        <CardHeader>
          <CardTitle>État de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <p className="text-sm text-green-700">Moral général</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-sm text-blue-700">Sessions cette semaine</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <p className="text-sm text-purple-700">Défis en cours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.path} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="text-center pb-2">
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <Brain className="h-5 w-5" />
              <span>Scan rapide</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <BookOpen className="h-5 w-5" />
              <span>Note journal</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span>Voir l'équipe</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserDashboardPage;
