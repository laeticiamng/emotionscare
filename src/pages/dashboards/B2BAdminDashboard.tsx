
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Settings, 
  BarChart3,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Shield,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const B2BAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    avgWellnessScore: 0,
    criticalAlerts: 0,
    completionRate: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          totalUsers: Math.floor(Math.random() * 200) + 150,
          activeUsers: Math.floor(Math.random() * 150) + 100,
          avgWellnessScore: Math.floor(Math.random() * 30) + 70,
          criticalAlerts: Math.floor(Math.random() * 5) + 1,
          completionRate: Math.floor(Math.random() * 20) + 80
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du tableau de bord",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [toast]);

  const adminActions = [
    {
      title: "Gestion des utilisateurs",
      description: "Ajouter, modifier ou supprimer des collaborateurs",
      icon: Users,
      color: "bg-blue-500",
      path: "/b2b/admin/users"
    },
    {
      title: "Analytics avancés",
      description: "Rapports détaillés et insights",
      icon: BarChart3,
      color: "bg-green-500",
      path: "/b2b/admin/analytics"
    },
    {
      title: "Gestion des équipes",
      description: "Organiser et suivre les équipes",
      icon: Briefcase,
      color: "bg-purple-500",
      path: "/b2b/admin/teams"
    },
    {
      title: "Configuration",
      description: "Paramètres et personnalisation",
      icon: Settings,
      color: "bg-orange-500",
      path: "/b2b/admin/settings"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Administration - {user?.company || 'Entreprise'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Tableau de bord administrateur • {user?.name || user?.email?.split('@')[0]}
          </p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Shield className="w-4 h-4 mr-1" />
          Administrateur
        </Badge>
      </div>

      {/* Alert Section */}
      {!isLoading && stats.criticalAlerts > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">
                  {stats.criticalAlerts} alerte{stats.criticalAlerts > 1 ? 's' : ''} nécessite{stats.criticalAlerts > 1 ? 'nt' : ''} votre attention
                </p>
                <p className="text-sm text-orange-600">
                  Des collaborateurs signalent un niveau de stress élevé
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Voir les alertes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              Collaborateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} actifs cette semaine
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-green-500" />
              Score Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.avgWellnessScore}/100
                </div>
                <p className="text-xs text-green-600">+5% vs mois dernier</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-purple-500" />
              Taux de Participation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.completionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Aux activités bien-être
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-orange-500" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-orange-600">85%</div>
                <p className="text-xs text-orange-600">+12% ce mois</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.criticalAlerts}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nécessitent attention
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Actions administrateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">5 nouveaux collaborateurs ajoutés</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rapport mensuel généré</p>
                    <p className="text-xs text-muted-foreground">Hier</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alerte de stress détectée</p>
                    <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Configuration mise à jour</p>
                    <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Tendances et Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    📈 Amélioration générale du bien-être
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +15% de participants aux sessions de méditation
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    🎯 Objectifs mensuels atteints
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    85% des équipes ont complété leurs défis
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    💡 Suggestion d'amélioration
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Augmenter les sessions de groupe en fin de semaine
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">
                    🏆 Performance de l'équipe Marketing
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Score de bien-être le plus élevé ce mois
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminDashboard;
