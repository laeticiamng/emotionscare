// @ts-nocheck
/**
 * Perfect Dashboard - Tableau de bord intelligent et adaptatif
 * Interface principale qui s'adapte à l'utilisateur et au contexte
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Zap, 
  TrendingUp, 
  Music, 
  MessageSquare, 
  BookOpen,
  Sparkles,
  Target,
  Clock,
  Award,
  Users,
  ChevronRight,
  Smile,
  Calendar,
  Activity
} from 'lucide-react';

interface DashboardData {
  wellnessScore: number;
  todaysSessions: number;
  weekStreak: number;
  emotionalState: string;
  recommendations: Array<{
    title: string;
    description: string;
    action: string;
    path: string;
    priority: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
  }>;
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    score: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    progress: number;
    unlocked: boolean;
  }>;
}

const PerfectDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation de données dashboard intelligentes
  useEffect(() => {
    const generatePersonalizedData = async () => {
      setIsLoading(true);
      
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const hour = currentTime.getHours();
      let recommendations = [];
      
      // Recommandations contextuelles intelligentes
      if (hour < 10) {
        recommendations.push({
          title: 'Routine matinale énergisante',
          description: 'Commencez votre journée avec un scan émotionnel',
          action: 'Démarrer scan',
          path: '/app/scan',
          priority: 'high' as const,
          icon: <Brain className="w-5 h-5" />
        });
      } else if (hour < 14) {
        recommendations.push({
          title: 'Boost de mi-journée',
          description: 'Une session de musique thérapeutique pour maintenir l\'énergie',
          action: 'Écouter maintenant',
          path: '/app/music',
          priority: 'medium' as const,
          icon: <Music className="w-5 h-5" />
        });
      } else if (hour < 18) {
        recommendations.push({
          title: 'Focus afternoon',
          description: 'Session de respiration pour améliorer la concentration',
          action: 'Respirer',
          path: '/app/breath',
          priority: 'medium' as const,
          icon: <Zap className="w-5 h-5" />
        });
      } else {
        recommendations.push({
          title: 'Relaxation du soir',
          description: 'Préparez une nuit paisible avec notre VR galactique',
          action: 'Se relaxer',
          path: '/app/vr-galaxy',
          priority: 'high' as const,
          icon: <Sparkles className="w-5 h-5" />
        });
      }

      // Recommandations toujours disponibles
      recommendations.push(
        {
          title: 'Journal quotidien',
          description: 'Notez vos réflexions et émotions du jour',
          action: 'Écrire',
          path: '/app/journal',
          priority: 'medium' as const,
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          title: 'Coach IA disponible',
          description: 'Votre coach virtuel est prêt à vous accompagner',
          action: 'Discuter',
          path: '/app/coach',
          priority: 'low' as const,
          icon: <MessageSquare className="w-5 h-5" />
        }
      );

      const mockData: DashboardData = {
        wellnessScore: Math.floor(Math.random() * 20) + 75,
        todaysSessions: Math.floor(Math.random() * 5) + 2,
        weekStreak: Math.floor(Math.random() * 7) + 3,
        emotionalState: ['serein', 'énergique', 'créatif', 'focalisé', 'paisible'][Math.floor(Math.random() * 5)],
        recommendations,
        recentActivities: [
          {
            id: '1',
            type: 'scan',
            title: 'Scan émotionnel matinal',
            time: '9:15',
            score: 87
          },
          {
            id: '2',
            type: 'music',
            title: 'Session musique - Calme',
            time: '13:45',
            score: 92
          },
          {
            id: '3',
            type: 'breath',
            title: 'Respiration guidée',
            time: '16:20',
            score: 85
          }
        ],
        achievements: [
          {
            id: '1',
            title: 'Explorateur émotionnel',
            description: 'Complétez 10 scans différents',
            progress: 70,
            unlocked: false
          },
          {
            id: '2',
            title: 'Méditant régulier',
            description: '7 jours consécutifs de pratique',
            progress: 100,
            unlocked: true
          },
          {
            id: '3',
            title: 'Maître du bien-être',
            description: 'Score > 90 pendant 3 jours',
            progress: 45,
            unlocked: false
          }
        ]
      };

      setDashboardData(mockData);
      setIsLoading(false);
    };

    generatePersonalizedData();
  }, [currentTime.getHours()]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = user?.name || 'utilisateur';
    
    if (hour < 12) return `Bonjour ${name} !`;
    if (hour < 18) return `Bel après-midi ${name} !`;
    return `Bonsoir ${name} !`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-primary mx-auto" />
          </motion.div>
          <p className="text-lg text-muted-foreground">Personnalisation de votre expérience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfect-dashboard min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* En-tête personnalisé */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {getGreeting()}
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            {currentTime.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })} • {currentTime.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <Badge variant="outline" className="gap-1">
              <Smile className="w-4 h-4" />
              État: {dashboardData.emotionalState}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Activity className="w-4 h-4" />
              Score: {dashboardData.wellnessScore}/100
            </Badge>
            <Badge variant="default" className="gap-1">
              <Target className="w-4 h-4" />
              Série: {dashboardData.weekStreak} jours
            </Badge>
          </div>
        </motion.div>

        {/* Métriques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-primary" />
                Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{dashboardData.wellnessScore}/100</div>
              <Progress value={dashboardData.wellnessScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {dashboardData.wellnessScore >= 80 ? 'Excellent' : 
                 dashboardData.wellnessScore >= 60 ? 'Bon' : 'À améliorer'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-secondary" />
                Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{dashboardData.todaysSessions}</div>
              <p className="text-sm text-muted-foreground mb-2">Sessions complétées</p>
              <Button size="sm" variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Programmer une session
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-warning" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{dashboardData.weekStreak}</div>
              <p className="text-sm text-muted-foreground mb-2">Jours consécutifs</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < dashboardData.weekStreak ? 'bg-warning' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommandations intelligentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Recommandé pour vous
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
              >
                <Link to={rec.path}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {rec.icon}
                          <Badge variant={getPriorityColor(rec.priority) as any} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{rec.description}</CardDescription>
                      <Button size="sm" className="w-full">
                        {rec.action}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activités récentes et Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activités récentes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline">{activity.score}%</Badge>
                  </div>
                ))}
                
                <Link to="/app/activity">
                  <Button variant="outline" className="w-full mt-4">
                    Voir tout l'historique
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.achievements.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium ${achievement.unlocked ? 'text-primary' : ''}`}>
                          {achievement.unlocked && '🏆 '}{achievement.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && <Badge>Débloqué !</Badge>}
                    </div>
                    <Progress value={achievement.progress} />
                    <p className="text-xs text-muted-foreground">{achievement.progress}% complété</p>
                  </div>
                ))}
                
                <Link to="/app/leaderboard">
                  <Button variant="outline" className="w-full mt-4">
                    Voir tous les achievements
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PerfectDashboard;