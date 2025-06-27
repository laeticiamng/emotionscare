
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Brain, 
  Music, 
  BookOpen, 
  MessageCircle,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Bell,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BUserDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = {
    emotionalScore: 7.2,
    weeklyGoal: 75,
    streakDays: 5,
    totalSessions: 23
  };

  const quickActions = [
    { name: 'Scanner', icon: Brain, href: '/scan', color: 'blue' },
    { name: 'Musique', icon: Music, href: '/music', color: 'purple' },
    { name: 'Journal', icon: BookOpen, href: '/journal', color: 'green' },
    { name: 'Coach', icon: MessageCircle, href: '/coach', color: 'orange' }
  ];

  const weeklyProgress = [
    { day: 'L', completed: true },
    { day: 'M', completed: true },
    { day: 'M', completed: true },
    { day: 'J', completed: true },
    { day: 'V', completed: true },
    { day: 'S', completed: false },
    { day: 'D', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bonjour, Marie ! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Voici votre tableau de bord bien-être
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Stats principales */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Score émotionnel</p>
                  <p className="text-3xl font-bold">{stats.emotionalScore}/10</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Objectif hebdo</p>
                  <p className="text-3xl font-bold">{stats.weeklyGoal}%</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Série</p>
                  <p className="text-3xl font-bold">{stats.streakDays} jours</p>
                </div>
                <Award className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Sessions</p>
                  <p className="text-3xl font-bold">{stats.totalSessions}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Actions rapides */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <Link key={action.name} to={action.href}>
                        <Button
                          variant="outline"
                          className="h-20 w-full flex flex-col items-center justify-center gap-2 hover:shadow-md"
                        >
                          <IconComponent className={`h-6 w-6 text-${action.color}-600`} />
                          <span className="text-sm">{action.name}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Progression hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Progression de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">5/7 jours complétés</span>
                  <Badge variant="secondary">{Math.round((5/7) * 100)}%</Badge>
                </div>
                <Progress value={(5/7) * 100} className="mb-4" />
                <div className="flex gap-2">
                  {weeklyProgress.map((day, index) => (
                    <div
                      key={index}
                      className={`flex-1 text-center p-2 rounded ${
                        day.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <div className="text-xs font-medium">{day.day}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Scan émotionnel</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Votre dernier scan remonte à hier. Prenez 2 minutes pour vérifier votre état.
                  </p>
                  <Link to="/scan">
                    <Button size="sm" className="mt-2 w-full">
                      Faire un scan
                    </Button>
                  </Link>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Music className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Pause musicale</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    15 minutes de musique relaxante pour votre après-midi.
                  </p>
                  <Link to="/music">
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      Écouter
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Accomplissements */}
            <Card>
              <CardHeader>
                <CardTitle>Accomplissements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Série de 5 jours</p>
                    <p className="text-xs text-gray-500">Débloqué aujourd'hui</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expert Scanner</p>
                    <p className="text-xs text-gray-500">20 scans complétés</p>
                  </div>
                </div>

                <Link to="/gamification">
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Voir tous les succès
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/coach">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Parler au coach
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Contacter RH
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BUserDashboard;
