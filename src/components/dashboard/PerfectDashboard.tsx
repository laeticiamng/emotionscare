/**
 * Perfect Dashboard - Tableau de bord intelligent et adaptatif
 * Interface principale avec données réelles Supabase
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePerfectDashboardData } from '@/hooks/usePerfectDashboardData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Card3D from '@/components/ui/Card3D';
import PremiumLoader from '@/components/ui/PremiumLoader';
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

interface Recommendation {
  title: string;
  description: string;
  action: string;
  path: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

const PerfectDashboard: React.FC = () => {
  const { user } = useAuth();
  const { metrics, isLoading, refresh } = usePerfectDashboardData();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mise à jour de l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Recommandations contextuelles basées sur l'heure
  const recommendations = useMemo((): Recommendation[] => {
    const hour = currentTime.getHours();
    const recs: Recommendation[] = [];
    
    // Recommandations contextuelles intelligentes
    if (hour < 10) {
      recs.push({
        title: 'Routine matinale énergisante',
        description: 'Commencez votre journée avec un scan émotionnel',
        action: 'Démarrer scan',
        path: '/app/scan',
        priority: 'high',
        icon: <Brain className="w-5 h-5" />
      });
    } else if (hour < 14) {
      recs.push({
        title: 'Boost de mi-journée',
        description: 'Une session de musique thérapeutique pour maintenir l\'énergie',
        action: 'Écouter maintenant',
        path: '/app/music',
        priority: 'medium',
        icon: <Music className="w-5 h-5" />
      });
    } else if (hour < 18) {
      recs.push({
        title: 'Focus afternoon',
        description: 'Session de respiration pour améliorer la concentration',
        action: 'Respirer',
        path: '/app/breath',
        priority: 'medium',
        icon: <Zap className="w-5 h-5" />
      });
    } else {
      recs.push({
        title: 'Relaxation du soir',
        description: 'Préparez une nuit paisible avec notre VR galactique',
        action: 'Se relaxer',
        path: '/app/vr-galaxy',
        priority: 'high',
        icon: <Sparkles className="w-5 h-5" />
      });
    }

    // Recommandations basées sur l'état émotionnel
    if (metrics.emotionalState === 'tendu' || metrics.emotionalState === 'préoccupé') {
      recs.unshift({
        title: 'Respiration anti-stress',
        description: 'Technique de cohérence cardiaque pour vous apaiser',
        action: 'Commencer',
        path: '/app/breath',
        priority: 'high',
        icon: <Heart className="w-5 h-5" />
      });
    }

    // Recommandations toujours disponibles
    recs.push(
      {
        title: 'Journal quotidien',
        description: 'Notez vos réflexions et émotions du jour',
        action: 'Écrire',
        path: '/app/journal',
        priority: 'medium',
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        title: 'Coach IA disponible',
        description: 'Votre coach virtuel est prêt à vous accompagner',
        action: 'Discuter',
        path: '/app/coach',
        priority: 'low',
        icon: <MessageSquare className="w-5 h-5" />
      }
    );

    return recs.slice(0, 4); // Max 4 recommandations
  }, [currentTime.getHours(), metrics.emotionalState]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = (user as any)?.name || user?.email || 'utilisateur';
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <PremiumLoader size="lg" />
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
              État: {metrics.emotionalState}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Activity className="w-4 h-4" />
              Score: {metrics.wellnessScore}/100
            </Badge>
            <Badge variant="default" className="gap-1">
              <Target className="w-4 h-4" />
              Série: {metrics.weekStreak} jours
            </Badge>
          </div>
        </motion.div>

        {/* Métriques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-in"
        >
          <Card3D className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" hoverLift animate={false}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-primary" />
                Bien-être
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{metrics.wellnessScore}/100</div>
              <Progress value={metrics.wellnessScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {metrics.wellnessScore >= 80 ? 'Excellent' :
                 metrics.wellnessScore >= 60 ? 'Bon' : 'À améliorer'}
              </p>
            </CardContent>
          </Card3D>

          <Card3D className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent" hoverLift animate={false}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-secondary" />
                Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{metrics.todaysSessions}</div>
              <p className="text-sm text-muted-foreground mb-2">Sessions complétées</p>
              <Button size="sm" variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Programmer une session
              </Button>
            </CardContent>
          </Card3D>

          <Card3D className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-transparent" hoverLift animate={false}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-warning" />
                Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{metrics.weekStreak}</div>
              <p className="text-sm text-muted-foreground mb-2">Jours consécutifs</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < metrics.weekStreak ? 'bg-warning' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card3D>
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
                  <Card3D className="h-full cursor-pointer" hoverLift animate={false}>
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
                  </Card3D>
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
            <Card3D hoverLift>
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
            </Card3D>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card3D hoverLift>
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
            </Card3D>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PerfectDashboard;