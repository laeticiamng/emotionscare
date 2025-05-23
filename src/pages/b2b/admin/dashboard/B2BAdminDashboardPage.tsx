
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  BarChart3,
  UserCheck,
  Calendar,
  Settings,
  Award,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  averageWellness: number;
  alertsCount: number;
  weeklyEngagement: number;
  topTeam: string;
}

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 156,
    activeUsers: 123,
    averageWellness: 74,
    alertsCount: 3,
    weeklyEngagement: 82,
    topTeam: 'Marketing'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.user_metadata?.firstName || user?.user_metadata?.name?.split(' ')[0] || 'Administrateur';
    
    if (hour < 12) return `Bonjour ${firstName}`;
    if (hour < 18) return `Bon après-midi ${firstName}`;
    return `Bonsoir ${firstName}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              {getGreeting()} !
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Console d'administration - Pilotage du bien-être
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate('/b2b/admin/analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/b2b/admin/users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% ce mois-ci
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% d'engagement
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être Moyen</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageWellness}/100</div>
              <p className="text-xs text-muted-foreground">
                +3 points cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.alertsCount}</div>
              <p className="text-xs text-muted-foreground">
                Nécessitent attention
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Gérez votre organisation en quelques clics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate('/b2b/admin/users')}
                >
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Gérer Utilisateurs</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate('/b2b/admin/analytics')}
                >
                  <BarChart3 className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Analytics</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => toast('Rapports bientôt disponibles')}
                >
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">Rapports</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => toast('Configuration bientôt disponible')}
                >
                  <Settings className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Configuration</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => toast('Campagnes bientôt disponibles')}
                >
                  <Calendar className="h-6 w-6 text-red-600" />
                  <span className="text-sm">Campagnes</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => toast('Invitations bientôt disponibles')}
                >
                  <UserCheck className="h-6 w-6 text-indigo-600" />
                  <span className="text-sm">Invitations</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Alertes & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">3 utilisateurs en détresse</p>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scores faibles détectés
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Rapport hebdomadaire prêt</p>
                    <Badge variant="secondary">Nouveau</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Synthèse semaine 47
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Équipe {stats.topTeam} excelle</p>
                    <Badge variant="secondary">Info</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +15% de bien-être
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Voir toutes les alertes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teams Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Performance des équipes
              </CardTitle>
              <CardDescription>
                Suivi du bien-être par département
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Marketing', score: 87, trend: '+5%', color: 'bg-green-500' },
                  { name: 'Développement', score: 82, trend: '+2%', color: 'bg-blue-500' },
                  { name: 'RH', score: 79, trend: '+7%', color: 'bg-purple-500' },
                  { name: 'Commercial', score: 76, trend: '-1%', color: 'bg-orange-500' },
                  { name: 'Support', score: 74, trend: '+3%', color: 'bg-indigo-500' },
                  { name: 'Finance', score: 71, trend: '+1%', color: 'bg-red-500' }
                ].map((team, index) => (
                  <div key={team.name} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{team.name}</h4>
                      <Badge variant={team.trend.startsWith('+') ? 'default' : 'destructive'}>
                        {team.trend}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${team.color}`}></div>
                      <span className="text-2xl font-bold">{team.score}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
