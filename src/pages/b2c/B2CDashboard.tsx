
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Music, MessageSquare, FileText, Settings, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2CDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/choose-mode');
  };

  const dashboardItems = [
    {
      title: 'Scanner Émotions',
      description: 'Analysez votre état émotionnel',
      icon: Brain,
      href: '/scan',
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA',
      description: 'Votre assistant personnel',
      icon: MessageSquare,
      href: '/coach',
      color: 'bg-green-500'
    },
    {
      title: 'Musicothérapie',
      description: 'Musiques personnalisées',
      icon: Music,
      href: '/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Journal Personnel',
      description: 'Votre journal intime',
      icon: FileText,
      href: '/journal',
      color: 'bg-orange-500'
    },
    {
      title: 'Objectifs',
      description: 'Vos objectifs bien-être',
      icon: Target,
      href: '/goals',
      color: 'bg-red-500'
    },
    {
      title: 'Réalité Virtuelle',
      description: 'Expériences immersives',
      icon: Heart,
      href: '/vr',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="h-8 w-8 text-pink-600" />
              Votre Espace Bien-être
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue, {user?.name || user?.email} - Prenez soin de vous
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Humeur du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">😊 Positive</div>
              <p className="text-xs text-gray-500">Amélioration de 15%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Série actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 jours</div>
              <p className="text-xs text-gray-500">Votre meilleur score !</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Temps aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 min</div>
              <p className="text-xs text-gray-500">Objectif: 30 min ✅</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Niveau de stress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Faible</div>
              <p className="text-xs text-gray-500">-20% cette semaine</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(item.href)}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default B2CDashboard;
