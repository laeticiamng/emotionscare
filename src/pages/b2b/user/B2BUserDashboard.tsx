
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Brain, Music, MessageSquare, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BUserDashboard: React.FC = () => {
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
      description: 'Votre journal privé',
      icon: FileText,
      href: '/journal',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Home className="h-8 w-8 text-blue-600" />
              Tableau de bord Collaborateur
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue, {user?.name || user?.email} - Espace personnel
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
                Bien-être général
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Bon</div>
              <p className="text-xs text-gray-500">+2% cette semaine</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sessions cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">+3 depuis la semaine dernière</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Temps total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h 45m</div>
              <p className="text-xs text-gray-500">Cette semaine</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Objectifs atteints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">75%</div>
              <p className="text-xs text-gray-500">3/4 objectifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

export default B2BUserDashboard;
