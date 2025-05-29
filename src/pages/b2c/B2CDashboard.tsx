
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  BookOpen, 
  Music, 
  Scan, 
  MessageCircle, 
  Glasses,
  Settings,
  LogOut,
  TrendingUp,
  Calendar
} from 'lucide-react';

const B2CDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const quickActions = [
    {
      title: 'Journal Émotionnel',
      description: 'Notez vos émotions du jour',
      icon: BookOpen,
      href: '/b2c/journal',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Scanner Émotionnel',
      description: 'Analysez votre état émotionnel',
      icon: Scan,
      href: '/b2c/scan',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Musique Thérapeutique',
      description: 'Écoutez de la musique adaptée',
      icon: Music,
      href: '/b2c/music',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Coach IA',
      description: 'Discutez avec votre coach personnel',
      icon: MessageCircle,
      href: '/b2c/coach',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Sessions VR',
      description: 'Expériences immersives de relaxation',
      icon: Glasses,
      href: '/b2c/vr',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Paramètres',
      description: 'Gérez votre compte et préférences',
      icon: Settings,
      href: '/b2c/settings',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                EmotionsCare - Espace Personnel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Bonjour, {user?.name || user?.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tableau de bord personnel
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez votre bien-être émotionnel avec nos outils personnalisés
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bien-être général</p>
                  <p className="text-2xl font-bold text-gray-900">Bon</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sessions cette semaine</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Humeur moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">😊</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`p-3 rounded-full w-fit ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(action.href)}
                  className="w-full"
                  variant="outline"
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Vos dernières interactions avec la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Entrée journal ajoutée</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Scan className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Scanner émotionnel complété</p>
                  <p className="text-xs text-gray-500">Hier</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Music className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Session de musique thérapeutique</p>
                  <p className="text-xs text-gray-500">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default B2CDashboard;
