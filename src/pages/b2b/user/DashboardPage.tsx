
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  BarChart3, 
  Calendar, 
  Heart, 
  Brain, 
  Music, 
  BookOpen,
  Activity,
  TrendingUp,
  Shield,
  Bell
} from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    { icon: Brain, label: 'Scanner émotionnel', path: '/scan', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Music, label: 'Musicothérapie', path: '/music', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: BookOpen, label: 'Journal', path: '/journal', color: 'bg-green-500 hover:bg-green-600' },
    { icon: Heart, label: 'Coach IA', path: '/coach', color: 'bg-red-500 hover:bg-red-600' },
  ];

  const wellbeingData = {
    moodScore: 7.5,
    weeklyProgress: 65,
    streakDays: 12,
    completedSessions: 8
  };

  const teamStats = {
    teamSize: 15,
    activeMembers: 12,
    averageMood: 7.2,
    alerts: 2
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Collaborateur</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Collaborateur
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bon retour, Jean ! 👋</h2>
          <p className="text-gray-600">Voici un aperçu de votre bien-être et de votre équipe</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score bien-être</p>
                  <p className="text-2xl font-bold text-green-600">{wellbeingData.moodScore}/10</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Séries actuelles</p>
                  <p className="text-2xl font-bold text-blue-600">{wellbeingData.streakDays} jours</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sessions complétées</p>
                  <p className="text-2xl font-bold text-purple-600">{wellbeingData.completedSessions}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Équipe active</p>
                  <p className="text-2xl font-bold text-orange-600">{teamStats.activeMembers}/{teamStats.teamSize}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Votre progression
              </CardTitle>
              <CardDescription>Évolution de votre bien-être cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Objectif hebdomadaire</span>
                    <span>{wellbeingData.weeklyProgress}%</span>
                  </div>
                  <Progress value={wellbeingData.weeklyProgress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Sessions aujourd'hui</p>
                    <p className="text-lg font-semibold text-green-600">3</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Humeur moyenne</p>
                    <p className="text-lg font-semibold text-blue-600">7.5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Aperçu de l'équipe
              </CardTitle>
              <CardDescription>État de bien-être de votre équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Humeur moyenne de l'équipe</span>
                  <Badge variant="secondary">{teamStats.averageMood}/10</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Membres actifs aujourd'hui</span>
                  <Badge variant="secondary">{teamStats.activeMembers}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alertes de bien-être</span>
                  <Badge variant={teamStats.alerts > 0 ? "destructive" : "secondary"}>
                    {teamStats.alerts}
                  </Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Voir les détails de l'équipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Accès rapides</CardTitle>
            <CardDescription>Commencez votre session de bien-être</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`h-24 flex-col gap-2 ${action.color} text-white`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Scan émotionnel complété</p>
                  <p className="text-xs text-gray-500">Score: 8/10 - Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Entrée journal ajoutée</p>
                  <p className="text-xs text-gray-500">Réflexion sur la journée - Hier</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Music className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Session musicothérapie</p>
                  <p className="text-xs text-gray-500">15 min de relaxation - Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
