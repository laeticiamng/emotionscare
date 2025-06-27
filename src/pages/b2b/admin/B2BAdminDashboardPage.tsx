
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Heart,
  Brain,
  Target,
  Calendar,
  Award,
  Settings,
  BarChart3,
  UserCheck,
  Activity,
  MessageSquare,
  Download,
  Filter
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const globalMetrics = {
    totalUsers: 247,
    activeUsers: 183,
    avgWellnessScore: 74,
    criticalAlerts: 3,
    weeklyEngagement: 89
  };

  const departmentData = [
    { name: "Marketing", users: 45, avgScore: 78, status: "good" },
    { name: "Développement", users: 62, avgScore: 71, status: "warning" },
    { name: "Ventes", users: 38, avgScore: 82, status: "excellent" },
    { name: "RH", users: 25, avgScore: 75, status: "good" },
    { name: "Support", users: 33, avgScore: 69, status: "warning" }
  ];

  const alerts = [
    { type: "high", message: "Niveau de stress élevé détecté en équipe Développement", time: "Il y a 2h" },
    { type: "medium", message: "Baisse d'engagement dans l'équipe Support", time: "Hier" },
    { type: "low", message: "Nouveau record de participation aux sessions VR", time: "Il y a 3h" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                Console Administrateur RH
              </h1>
              <p className="text-muted-foreground mt-1">
                Pilotez le bien-être de vos équipes
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Métriques globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Utilisateurs</p>
                  <p className="text-3xl font-bold">{globalMetrics.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Actifs</p>
                  <p className="text-3xl font-bold">{globalMetrics.activeUsers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Score moyen</p>
                  <p className="text-3xl font-bold">{globalMetrics.avgWellnessScore}/100</p>
                </div>
                <Heart className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Alertes</p>
                  <p className="text-3xl font-bold">{globalMetrics.criticalAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100">Engagement</p>
                  <p className="text-3xl font-bold">{globalMetrics.weeklyEngagement}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Gestion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Départements en un coup d'œil */}
              <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Aperçu départements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData.map((dept, index) => (
                      <motion.div
                        key={dept.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            dept.status === 'excellent' ? 'bg-green-500' :
                            dept.status === 'good' ? 'bg-blue-500' : 'bg-orange-500'
                          }`} />
                          <div>
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-sm text-muted-foreground">{dept.users} utilisateurs</p>
                          </div>
                        </div>
                        <Badge variant={
                          dept.status === 'excellent' ? 'default' :
                          dept.status === 'good' ? 'secondary' : 'destructive'
                        }>
                          {dept.avgScore}/100
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alertes récentes */}
              <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Alertes récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.type === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          alert.type === 'medium' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                          'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments">
            <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Analyse par département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentData.map((dept, index) => (
                    <motion.div
                      key={dept.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">{dept.name}</h3>
                            <Badge variant={
                              dept.status === 'excellent' ? 'default' :
                              dept.status === 'good' ? 'secondary' : 'destructive'
                            }>
                              {dept.status === 'excellent' ? 'Excellent' :
                               dept.status === 'good' ? 'Bon' : 'Attention'}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Utilisateurs</span>
                              <span className="font-medium">{dept.users}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Score moyen</span>
                              <span className="font-medium">{dept.avgScore}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  dept.status === 'excellent' ? 'bg-green-500' :
                                  dept.status === 'good' ? 'bg-blue-500' : 'bg-orange-500'
                                }`}
                                style={{ width: `${dept.avgScore}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Centre d'alertes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Surveillez les signaux faibles et intervenez proactivement pour le bien-être de vos équipes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Alertes critiques</h4>
                        <p className="text-2xl font-bold text-red-600">{globalMetrics.criticalAlerts}</p>
                        <p className="text-sm text-red-600">Nécessitent une action immédiate</p>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Surveillance</h4>
                        <p className="text-2xl font-bold text-orange-600">7</p>
                        <p className="text-sm text-orange-600">Situations à surveiller</p>
                      </CardContent>
                    </Card>
                    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Informations</h4>
                        <p className="text-2xl font-bold text-blue-600">12</p>
                        <p className="text-sm text-blue-600">Notifications d'information</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Analytics avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics détaillés</h3>
                  <p className="text-muted-foreground mb-6">
                    Graphiques interactifs, tendances temporelles et insights IA disponibles prochainement.
                  </p>
                  <Button variant="outline">
                    Demander l'accès bêta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management">
            <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-20 flex-col gap-2">
                      <Users className="w-6 h-6" />
                      Inviter des utilisateurs
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Settings className="w-6 h-6" />
                      Gérer les permissions
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Download className="w-6 h-6" />
                      Exporter les données
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
