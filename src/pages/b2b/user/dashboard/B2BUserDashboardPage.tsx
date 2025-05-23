
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Activity,
  Coffee,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamStats {
  teamWellness: number;
  personalScore: number;
  teamRank: number;
  weeklyGoals: number;
}

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TeamStats>({
    teamWellness: 78,
    personalScore: 82,
    teamRank: 3,
    weeklyGoals: 75
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
    const firstName = user?.user_metadata?.firstName || user?.user_metadata?.name?.split(' ')[0] || 'collaborateur';
    
    if (hour < 12) return `Bonjour ${firstName}`;
    if (hour < 18) return `Bon après-midi ${firstName}`;
    return `Bonsoir ${firstName}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {getGreeting()} !
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Votre espace bien-être professionnel
          </p>
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
              <CardTitle className="text-sm font-medium">Mon Score Personnel</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.personalScore}/100</div>
              <Progress value={stats.personalScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bien-être Équipe</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamWellness}/100</div>
              <Progress value={stats.teamWellness} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classement Équipe</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.teamRank}</div>
              <p className="text-xs text-muted-foreground">Sur 12 équipes</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs Hebdo</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyGoals}%</div>
              <Progress value={stats.weeklyGoals} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Team Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-blue-600" />
                Ma parenthèse bien-être
              </CardTitle>
              <CardDescription>
                Prenez soin de vous au travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  variant="outline"
                  onClick={() => navigate('/scan')}
                >
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">Scanner</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  variant="outline"
                  onClick={() => navigate('/music')}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Musique</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                  variant="outline"
                  onClick={() => navigate('/coach')}
                >
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Coach</span>
                </Button>
                <Button 
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
                  variant="outline"
                  onClick={() => toast('Team building bientôt disponible')}
                >
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Team Building</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Activité de l'équipe
              </CardTitle>
              <CardDescription>
                L'énergie partagée de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-medium">Marie a terminé sa session</p>
                      <p className="text-xs text-muted-foreground">Il y a 15 min</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+5 pts</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      J
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jean a utilisé le scanner</p>
                      <p className="text-xs text-muted-foreground">Il y a 1h</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+3 pts</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sophie a partagé une réflexion</p>
                      <p className="text-xs text-muted-foreground">Il y a 2h</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+2 pts</Badge>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast('Activité complète bientôt disponible')}
              >
                Voir toute l'activité
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Défi de la semaine : "L'énergie partagée"
              </CardTitle>
              <CardDescription>
                Participez avec votre équipe pour renforcer les liens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5/7</div>
                  <p className="text-sm text-muted-foreground">Sessions complétées</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <p className="text-sm text-muted-foreground">Participantes équipe</p>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">250</div>
                  <p className="text-sm text-muted-foreground">Points équipe</p>
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/scan')}
              >
                Contribuer au défi équipe
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BUserDashboardPage;
