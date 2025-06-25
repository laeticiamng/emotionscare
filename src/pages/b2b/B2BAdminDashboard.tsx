
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Shield,
  Calendar,
  Settings,
  FileText,
  ArrowRight,
  Plus
} from 'lucide-react';

const B2BAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: 'Utilisateurs actifs', 
      value: '245', 
      subtitle: '+12% par rapport au mois dernier', 
      icon: Users,
      action: () => navigate('/teams')
    },
    { 
      title: 'Bien-être global', 
      value: '7,8/10', 
      subtitle: '+0,3 par rapport au dernier mois', 
      icon: TrendingUp,
      action: () => navigate('/reports')
    },
    { 
      title: 'Alertes RH', 
      value: '3', 
      subtitle: 'Niveau d\'attention requis', 
      icon: AlertTriangle,
      urgent: true
    },
    { 
      title: 'Taux d\'engagement', 
      value: '87%', 
      subtitle: '+5% par rapport au mois dernier', 
      icon: BarChart3,
      action: () => navigate('/reports')
    }
  ];

  const teams = [
    {
      name: 'Équipe Marketing',
      status: 'Stress élevé détecté',
      score: '6,2/10',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: () => navigate('/teams')
    },
    {
      name: 'Équipe Développement',
      status: 'Performances stables',
      score: '8,1/10',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/teams')
    },
    {
      name: 'Équipe Ventes',
      status: 'Motivation en hausse',
      score: '7,5/10',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/teams')
    }
  ];

  const actions = [
    {
      title: 'Intervention urgente',
      description: 'Organisateur d\'une session de debriefing avec l\'équipe Marketing',
      priority: 'urgent',
      action: () => navigate('/events')
    },
    {
      title: 'Prévention',
      description: 'Proposer de séances de méditation collective',
      priority: 'normal',
      action: () => navigate('/events')
    },
    {
      title: 'Optimisation',
      description: 'Étendre les bonnes pratiques de l\'équipe Dev',
      priority: 'low',
      action: () => navigate('/optimisation')
    }
  ];

  const quickActions = [
    {
      title: 'Gérer les équipes',
      icon: Users,
      action: () => navigate('/teams')
    },
    {
      title: 'Voir les rapports',
      icon: FileText,
      action: () => navigate('/reports')
    },
    {
      title: 'Planifier un événement',
      icon: Calendar,
      action: () => navigate('/events')
    },
    {
      title: 'Paramètres',
      icon: Settings,
      action: () => navigate('/settings')
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h1>
            <p className="text-gray-600">Gérez le bien-être de votre organisation</p>
          </div>
          <div className="flex gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${stat.action ? 'hover:scale-105' : ''} ${stat.urgent ? 'border-red-200 bg-red-50' : ''}`}
              onClick={stat.action}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                  {stat.action && <ArrowRight className="h-4 w-4 text-gray-400" />}
                  {stat.urgent && <Badge variant="destructive">Urgent</Badge>}
                </div>
                <div className="space-y-2">
                  <p className={`text-2xl font-bold ${stat.urgent ? 'text-red-700' : ''}`}>{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Équipes à surveiller */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Équipes à surveiller
                </div>
                <Button size="sm" onClick={() => navigate('/teams')}>
                  Voir toutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teams.map((team, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${team.bgColor} cursor-pointer hover:shadow-md transition-all`}
                  onClick={team.action}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{team.name}</h3>
                    <span className={`text-sm font-medium ${team.color}`}>{team.score}</span>
                  </div>
                  <p className={`text-sm ${team.color}`}>{team.status}</p>
                  <div className="mt-3 flex justify-end">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions recommandées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Actions recommandées
                </div>
                <Button size="sm" onClick={() => navigate('/events')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle action
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {actions.map((action, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-all"
                  onClick={action.action}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{action.title}</h3>
                    <Badge 
                      className={
                        action.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        action.priority === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {action.priority === 'urgent' ? 'Urgent' : 
                       action.priority === 'normal' ? 'Normal' : 'Optimisation'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Mettre en place <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
