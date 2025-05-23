
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Settings,
  Download,
  Eye,
  UserPlus,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingAnimation from '@/components/ui/loading-animation';
import { AbsenteeismChart } from '@/components/dashboard/charts/AbsenteeismChart';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [organizationMetrics, setOrganizationMetrics] = useState({
    totalEmployees: 247,
    activeUsers: 189,
    averageWellbeing: 73,
    weeklyParticipation: 85,
    criticalAlerts: 3,
    departmentCount: 8
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const departmentStats = [
    { name: 'Ressources Humaines', employees: 24, wellbeing: 78, trend: 'up' },
    { name: 'Développement', employees: 45, wellbeing: 71, trend: 'stable' },
    { name: 'Marketing', employees: 32, wellbeing: 85, trend: 'up' },
    { name: 'Ventes', employees: 38, wellbeing: 68, trend: 'down' },
    { name: 'Support Client', employees: 28, wellbeing: 72, trend: 'up' },
    { name: 'Finance', employees: 18, wellbeing: 75, trend: 'stable' }
  ];

  const recentAlerts = [
    { id: 1, department: 'Ventes', type: 'wellbeing_drop', severity: 'medium', time: 'Il y a 2h' },
    { id: 2, department: 'Support', type: 'high_stress', severity: 'high', time: 'Il y a 4h' },
    { id: 3, department: 'Dev', type: 'low_participation', severity: 'low', time: 'Hier' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Formation managers bien-être', date: 'Demain 14:00', attendees: 12 },
    { id: 2, title: 'Session méditation collective', date: 'Jeudi 12:00', attendees: 45 },
    { id: 3, title: 'Webinar gestion du stress', date: 'Vendredi 16:00', attendees: 67 }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre tableau de bord administrateur..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-light">
              Tableau de Bord Administrateur
            </h1>
            <p className="text-muted-foreground">
              Pilotez le bien-être de votre organisation • {user?.company || 'Votre entreprise'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="flex items-center">
              <Shield className="mr-1 h-3 w-3" />
              Administrateur
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter rapport
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collaborateurs</p>
                  <p className="text-2xl font-bold">{organizationMetrics.totalEmployees}</p>
                  <p className="text-xs text-muted-foreground">
                    {organizationMetrics.activeUsers} actifs
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bien-être Moyen</p>
                  <p className="text-2xl font-bold">{organizationMetrics.averageWellbeing}%</p>
                  <p className="text-xs text-green-600">+5% ce mois</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participation</p>
                  <p className="text-2xl font-bold">{organizationMetrics.weeklyParticipation}%</p>
                  <p className="text-xs text-muted-foreground">Cette semaine</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alertes</p>
                  <p className="text-2xl font-bold text-orange-600">{organizationMetrics.criticalAlerts}</p>
                  <p className="text-xs text-muted-foreground">À traiter</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Department Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                      Vue par Département
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Détails
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentStats.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>
                            <div className="font-medium">{dept.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {dept.employees} collaborateurs
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{dept.wellbeing}%</span>
                          <div className={`w-2 h-2 rounded-full ${
                            dept.trend === 'up' ? 'bg-green-500' : 
                            dept.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Absenteeism Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AbsenteeismChart />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions Administrateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <UserPlus className="h-6 w-6" />
                      <span>Inviter utilisateurs</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Calendar className="h-6 w-6" />
                      <span>Planifier événement</span>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Settings className="h-6 w-6" />
                      <span>Paramètres org.</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Alerts & Events */}
          <div className="space-y-6">
            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                    Alertes Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{alert.department}</div>
                        <Badge 
                          variant={alert.severity === 'high' ? 'destructive' : 
                                  alert.severity === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {alert.type.replace('_', ' ')}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {alert.time}
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Examiner
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-green-500" />
                    Événements Planifiés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg space-y-2">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        {event.attendees} inscrits
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Gérer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nouveaux utilisateurs</span>
                    <Badge variant="secondary">+12 cette semaine</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions actives</span>
                    <Badge variant="secondary">34 en cours</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de satisfaction</span>
                    <Badge variant="secondary">94%</Badge>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Rapport détaillé
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
