
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Activity,
  Music,
  MessageCircle,
  Sparkles,
  Clock
} from 'lucide-react';
import QuickAccessGrid from '@/components/dashboard/b2c/QuickAccessGrid';
import { toast } from 'sonner';

interface DashboardStats {
  emotionalScore: number;
  weeklyProgress: number;
  sessionsCompleted: number;
  currentStreak: number;
}

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    emotionalScore: 75,
    weeklyProgress: 60,
    sessionsCompleted: 12,
    currentStreak: 5
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboard = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.user_metadata?.firstName || user?.user_metadata?.name?.split(' ')[0] || 'utilisateur';
    
    if (hour < 12) return `Bonjour ${firstName}`;
    if (hour < 18) return `Bon après-midi ${firstName}`;
    return `Bonsoir ${firstName}`;
  };

  const getEmotionalScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan':
        navigate('/scan');
        break;
      case 'music':
        navigate('/music');
        break;
      case 'coach':
        navigate('/coach');
        break;
      default:
        toast(`Fonctionnalité "${action}" bientôt disponible`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {getGreeting()} !
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Votre espace personnel de bien-être émotionnel
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
              <CardTitle className="text-sm font-medium">Score Émotionnel</CardTitle>
              <Heart className={`h-4 w-4 ${getEmotionalScoreColor(stats.emotionalScore)}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emotionalScore}/100</div>
              <Progress value={stats.emotionalScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progrès Hebdomadaire</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyProgress}%</div>
              <Progress value={stats.weeklyProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Complétées</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
              <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série Actuelle</CardTitle>
              <Sparkles className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} jours</div>
              <p className="text-xs text-muted-foreground">Continuez comme ça !</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <QuickAccessGrid />
        </motion.div>

        {/* Today's Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Votre parenthèse du jour
              </CardTitle>
              <CardDescription>
                Prenez un moment pour vous reconnecter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Scanner émotionnel</span>
                  </div>
                  <Badge variant="secondary">5 min</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Musique adaptée</span>
                  </div>
                  <Badge variant="secondary">10 min</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Coach personnel</span>
                  </div>
                  <Badge variant="secondary">15 min</Badge>
                </div>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/scan')}
              >
                Commencer ma parenthèse
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Historique récent
              </CardTitle>
              <CardDescription>
                Vos dernières sessions de bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Scanner émotionnel</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Session musicale</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Hier</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Chat avec le coach</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 2 jours</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast('Historique complet bientôt disponible')}
              >
                Voir l'historique complet
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
