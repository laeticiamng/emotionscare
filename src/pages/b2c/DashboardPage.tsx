
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  Trophy, 
  Users, 
  Headphones, 
  Calendar,
  TrendingUp,
  Smile
} from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading } = useDashboardData();

  const features = [
    { 
      title: 'Scanner Émotionnel', 
      icon: Brain, 
      path: '/scan', 
      color: 'bg-blue-500',
      description: 'Analysez vos émotions en temps réel'
    },
    { 
      title: 'Coach IA', 
      icon: Heart, 
      path: '/coach', 
      color: 'bg-red-500',
      description: 'Votre accompagnateur personnel'
    },
    { 
      title: 'Musicothérapie', 
      icon: Music, 
      path: '/music', 
      color: 'bg-purple-500',
      description: 'Musique adaptée à votre humeur'
    },
    { 
      title: 'Journal', 
      icon: BookOpen, 
      path: '/journal', 
      color: 'bg-green-500',
      description: 'Suivez votre progression quotidienne'
    },
    { 
      title: 'Réalité Virtuelle', 
      icon: Headphones, 
      path: '/vr', 
      color: 'bg-indigo-500',
      description: 'Expériences immersives de bien-être'
    },
    { 
      title: 'Gamification', 
      icon: Trophy, 
      path: '/gamification', 
      color: 'bg-yellow-500',
      description: 'Badges et récompenses'
    },
    { 
      title: 'Social Cocon', 
      icon: Users, 
      path: '/social-cocon', 
      color: 'bg-pink-500',
      description: 'Communauté bienveillante'
    },
    { 
      title: 'Méditation', 
      icon: Calendar, 
      path: '/meditation', 
      color: 'bg-teal-500',
      description: 'Sessions de méditation guidée'
    }
  ];

  return (
    <div data-testid="page-root" className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord personnel</h1>
          <p className="text-gray-600">Bienvenue dans votre espace de bien-être EmotionsCare</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humeur du jour</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.currentMood || '😊'}</div>
            <p className="text-xs text-muted-foreground">
              +2 points depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séance série</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.currentStreak || 7}</div>
            <p className="text-xs text-muted-foreground">
              jours consécutifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalPoints || 1250}</div>
            <p className="text-xs text-muted-foreground">
              +45 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.achievementCount || 12}</div>
            <p className="text-xs text-muted-foreground">
              débloques
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Scan émotionnel complété</p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouvelle entrée de journal</p>
                <p className="text-xs text-gray-500">Hier à 18:30</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Music className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Session de musicothérapie</p>
                <p className="text-xs text-gray-500">Hier à 14:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CDashboardPage;
