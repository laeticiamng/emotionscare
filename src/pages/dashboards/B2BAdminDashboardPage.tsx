
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  FileText,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const adminStats = [
    { title: 'Collaborateurs actifs', value: '127', change: '+8%', icon: Users },
    { title: 'Taux d\'engagement', value: '82%', change: '+12%', icon: TrendingUp },
    { title: 'Sessions cette semaine', value: '340', change: '+15%', icon: Calendar },
    { title: 'Score bien-être moyen', value: '76%', change: '+3%', icon: Target }
  ];

  const adminActions = [
    { title: 'Gestion Équipes', description: 'Organiser les groupes', icon: Users, path: '/teams', color: 'bg-blue-500' },
    { title: 'Rapports', description: 'Analytics détaillées', icon: BarChart3, path: '/reports', color: 'bg-green-500' },
    { title: 'Événements', description: 'Planifier activités', icon: Calendar, path: '/events', color: 'bg-purple-500' },
    { title: 'Paramètres', description: 'Configuration', icon: Settings, path: '/settings', color: 'bg-gray-500' }
  ];

  const alerts = [
    { type: 'warning', message: '3 collaborateurs ont un score de bien-être faible', time: '2h' },
    { type: 'success', message: 'Nouveau record d\'engagement cette semaine', time: '4h' },
    { type: 'info', message: 'Rapport mensuel prêt à être téléchargé', time: '1j' }
  ];

  const teamMetrics = [
    { department: 'IT', members: 28, engagement: 85, wellbeing: 78 },
    { department: 'RH', members: 15, engagement: 92, wellbeing: 88 },
    { department: 'Marketing', members: 22, engagement: 76, wellbeing: 72 },
    { department: 'Ventes', members: 35, engagement: 80, wellbeing: 75 }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Dashboard Administrateur
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Pilotez le bien-être de votre organisation
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Panel */}
          <div className="lg:col-span-2">
            <Card data-testid="admin-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Panneau d'Administration
                </CardTitle>
                <CardDescription>
                  Outils de gestion et de supervision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {adminActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                      onClick={() => navigate(action.path)}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                          <div className={`inline-flex p-3 rounded-full ${action.color} text-white mb-3`}>
                            <action.icon className="h-6 w-6" />
                          </div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Alertes & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'warning' ? 'bg-orange-50 border-orange-400' :
                      alert.type === 'success' ? 'bg-green-50 border-green-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />}
                      {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                      {alert.type === 'info' && <Clock className="h-4 w-4 text-blue-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">il y a {alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card data-testid="team-management">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Gestion des Équipes
              </CardTitle>
              <CardDescription>
                Métriques par département
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMetrics.map((team, index) => (
                <motion.div
                  key={team.department}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">{team.department}</h3>
                    <Badge variant="secondary">{team.members} membres</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Engagement</span>
                        <span>{team.engagement}%</span>
                      </div>
                      <Progress value={team.engagement} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bien-être</span>
                        <span>{team.wellbeing}%</span>
                      </div>
                      <Progress value={team.wellbeing} className="h-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
              <Button className="w-full" variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter une équipe
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="reports-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Rapports & Analytics
              </CardTitle>
              <CardDescription>
                Insights et données clés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Rapport mensuel</span>
                  </div>
                  <Button size="sm" variant="outline">Télécharger</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Analyse tendances</span>
                  </div>
                  <Button size="sm" variant="outline">Voir</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Objectifs équipe</span>
                  </div>
                  <Button size="sm" variant="outline">Configurer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
