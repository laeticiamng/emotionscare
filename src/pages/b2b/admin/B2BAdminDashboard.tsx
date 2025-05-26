
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, BarChart3, Calendar, Settings, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/choose-mode');
  };

  const adminItems = [
    {
      title: 'Gestion Utilisateurs',
      description: 'Gérer les collaborateurs',
      icon: Users,
      href: '/b2b/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Analytics',
      description: 'Statistiques et rapports',
      icon: BarChart3,
      href: '/b2b/admin/analytics',
      color: 'bg-green-500'
    },
    {
      title: 'Équipes',
      description: 'Gestion des équipes',
      icon: Users,
      href: '/b2b/admin/teams',
      color: 'bg-purple-500'
    },
    {
      title: 'Événements',
      description: 'Planifier des activités',
      icon: Calendar,
      href: '/b2b/admin/events',
      color: 'bg-orange-500'
    },
    {
      title: 'Rapports',
      description: 'Rapports détaillés',
      icon: FileText,
      href: '/b2b/admin/reports',
      color: 'bg-red-500'
    },
    {
      title: 'Optimisation',
      description: 'Outils d\'optimisation',
      icon: Settings,
      href: '/b2b/admin/optimisation',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Dashboard Administrateur RH
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenue, {user?.name || user?.email} - Espace d'administration
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/b2b/admin/settings')}>
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
                Collaborateurs actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-gray-500">+8 ce mois-ci</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bien-être moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">7.2/10</div>
              <p className="text-xs text-gray-500">+0.3 cette semaine</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sessions totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-gray-500">Cette semaine</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taux d'engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <p className="text-xs text-gray-500">+5% ce mois-ci</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminItems.map((item, index) => {
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

export default B2BAdminDashboard;
