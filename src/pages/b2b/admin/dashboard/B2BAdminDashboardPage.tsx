
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  BarChart3, 
  UserPlus, 
  Settings, 
  Download,
  Activity,
  Building2,
  Target,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    globalWellbeing: 0,
    alertsCount: 0,
    monthlyGrowth: 0
  });

  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAdminStats({
        totalUsers: 150,
        activeUsers: 127,
        globalWellbeing: 84,
        alertsCount: 3,
        monthlyGrowth: 12
      });

      setRecentAlerts([
        { id: 1, user: 'Marie D.', level: 'Stress élevé', timestamp: new Date() },
        { id: 2, user: 'Pierre L.', level: 'Fatigue importante', timestamp: new Date(Date.now() - 3600000) },
        { id: 3, user: 'Julie M.', level: 'Burnout potentiel', timestamp: new Date(Date.now() - 7200000) }
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement des données administrateur');
    } finally {
      setIsLoading(false);
    }
  };

  const adminActions = [
    {
      title: 'Gérer les utilisateurs',
      description: 'Ajouter, modifier ou supprimer des comptes',
      icon: Users,
      action: () => navigate('/b2b/admin/users'),
      color: 'bg-blue-500'
    },
    {
      title: 'Analytics avancées',
      description: 'Rapports détaillés et tendances',
      icon: BarChart3,
      action: () => navigate('/b2b/admin/analytics'),
      color: 'bg-purple-500'
    },
    {
      title: 'Inviter des collaborateurs',
      description: 'Envoyer des invitations par email',
      icon: UserPlus,
      action: () => navigate('/b2b/admin/users?action=invite'),
      color: 'bg-green-500'
    },
    {
      title: 'Configuration',
      description: 'Paramètres de l\'organisation',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-orange-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête administrateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <Badge variant="destructive" className="text-sm">
            Administrateur
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">
          Gérez le bien-être de votre organisation et suivez les performances globales.
        </p>
      </motion.div>

      {/* KPI administrateur */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                <p className="text-2xl font-bold">{adminStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{adminStats.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bien-être global</p>
                <p className="text-2xl font-bold">{adminStats.globalWellbeing}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes</p>
                <p className="text-2xl font-bold text-red-500">{adminStats.alertsCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Croissance</p>
                <p className="text-2xl font-bold text-green-500">+{adminStats.monthlyGrowth}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="actions">Actions rapides</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance globale</CardTitle>
                <CardDescription>Évolution du bien-être organisationnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taux de participation</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[85%]"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-500">2,145</p>
                      <p className="text-xs text-muted-foreground">Analyses totales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-500">892</p>
                      <p className="text-xs text-muted-foreground">Sessions coach</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-500">456</p>
                      <p className="text-xs text-muted-foreground">Entrées journal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Départements les plus engagés</CardTitle>
                <CardDescription>Classement par niveau de participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium">Développement</span>
                    <Badge variant="secondary">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium">Marketing</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="font-medium">Design</span>
                    <Badge variant="secondary">82%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="font-medium">Ventes</span>
                    <Badge variant="secondary">76%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Alertes de bien-être
              </CardTitle>
              <CardDescription>
                Collaborateurs nécessitant une attention particulière
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentAlerts.length > 0 ? (
                <div className="space-y-4">
                  {recentAlerts.map((alert: any) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <p className="font-medium">{alert.user}</p>
                        <p className="text-sm text-muted-foreground">{alert.level}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp.toLocaleString()}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Contacter
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune alerte active</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports et exports</CardTitle>
              <CardDescription>
                Générez des rapports détaillés pour votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Rapport mensuel de bien-être</h4>
                    <p className="text-sm text-muted-foreground">Analyse complète des tendances du mois</p>
                  </div>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Export des données utilisateurs</h4>
                    <p className="text-sm text-muted-foreground">Liste complète avec statistiques</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Rapport de performance par équipe</h4>
                    <p className="text-sm text-muted-foreground">Comparaison inter-départements</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboardPage;
