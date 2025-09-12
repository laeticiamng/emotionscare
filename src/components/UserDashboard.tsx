/**
 * User Dashboard - Espace utilisateur personnalisé
 */
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Music, 
  Camera, 
  MessageCircle, 
  Settings, 
  LogOut,
  User,
  Activity,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const quickActions = [
    {
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel",
      icon: Camera,
      link: "/app/scan",
      color: "bg-blue-500",
      available: true
    },
    {
      title: "Coach IA",
      description: "Parlez avec Nyvée",
      icon: Brain,
      link: "/app/coach",
      color: "bg-purple-500",
      available: true
    },
    {
      title: "Journal",
      description: "Écrivez vos pensées",
      icon: MessageCircle,
      link: "/app/journal",
      color: "bg-green-500",
      available: true
    },
    {
      title: "Musicothérapie",
      description: "Musique adaptée à votre humeur",
      icon: Music,
      link: "/app/music",
      color: "bg-orange-500",
      available: true
    }
  ];

  const stats = [
    { label: "Sessions cette semaine", value: "12", progress: 75 },
    { label: "Score bien-être", value: "8.2/10", progress: 82 },
    { label: "Objectifs atteints", value: "3/5", progress: 60 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-gray-900">EmotionsCare</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connecté
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Link to="/app/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.user_metadata?.full_name || user?.email?.split('@')[0]} ! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Comment vous sentez-vous aujourd'hui ? Explorez vos outils de bien-être.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  <span className="text-2xl font-bold text-primary">{stat.value}</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Actions rapides
            </CardTitle>
            <CardDescription>
              Accédez rapidement à vos outils préférés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Camera className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Scan émotionnel</p>
                    <p className="text-sm text-gray-600">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Session avec Nyvée</p>
                    <p className="text-sm text-gray-600">Hier</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Entrée journal</p>
                    <p className="text-sm text-gray-600">Il y a 3 jours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progrès cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Méditation quotidienne</span>
                    <span className="text-sm text-gray-600">5/7 jours</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Analyse émotionnelle</span>
                    <span className="text-sm text-gray-600">3/5 sessions</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Journal personnel</span>
                    <span className="text-sm text-gray-600">4/7 entrées</span>
                  </div>
                  <Progress value={57} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>💡 Conseil du jour</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Prenez 5 minutes aujourd'hui pour faire une analyse émotionnelle. 
              Cela vous aidera à mieux comprendre votre état d'esprit et à identifier 
              les moments optimaux pour vos activités importantes.
            </p>
            <div className="mt-4">
              <Link to="/app/scan">
                <Button>
                  <Camera className="h-4 w-4 mr-2" />
                  Commencer l'analyse
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;