import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Brain, 
  Heart, 
  Music, 
  TrendingUp, 
  Users, 
  Calendar,
  Target,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NavButton } from '@/components/navigation/NavButton';
import { findNavNode } from '@/lib/nav-schema';

/**
 * Dashboard unifié - Point d'entrée principal post-connexion
 * Suit l'architecture déclarative avec actions centralisées
 */
const ComprehensiveDashboard: React.FC = () => {
  const { user } = useAuth();

  // Données mock - à remplacer par React Query
  const userStats = {
    emotionalBalance: 78,
    stressLevel: 32,
    focusScore: 85,
    wellnessStreak: 12,
    totalSessions: 156,
    weeklyProgress: 68,
  };

  const recentActivity = [
    { id: 1, type: 'scan', title: 'Scan émotionnel matinal', date: '2h', score: 8.2 },
    { id: 2, type: 'music', title: 'Session musicothérapie', date: '1j', duration: '25min' },
    { id: 3, type: 'journal', title: 'Entrée journal', date: '2j', mood: 'positive' },
    { id: 4, type: 'vr', title: 'Méditation VR', date: '3j', session: 'Forêt zen' },
  ];

  const quickActions = [
    { nodeId: 'scan', urgent: true },
    { nodeId: 'music', popular: true },
    { nodeId: 'coach' },
    { nodeId: 'journal' },
  ];

  const achievements = [
    { id: 1, title: 'Série de 7 jours', icon: Award, unlocked: true, progress: 100 },
    { id: 2, title: 'Maître du scan', icon: Brain, unlocked: true, progress: 100 },
    { id: 3, title: 'Mélomane thérapeutique', icon: Music, unlocked: false, progress: 73 },
    { id: 4, title: 'Explorateur VR', icon: Target, unlocked: false, progress: 45 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header avec salutation personnalisée */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bonjour {user?.user_metadata?.name || 'Utilisateur'} 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Votre tableau de bord émotionnel vous attend
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Série active: {userStats.wellnessStreak}j
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Métriques principales */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Vue d'ensemble de votre bien-être
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Équilibre émotionnel
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {userStats.emotionalBalance}%
                        </span>
                      </div>
                      <Progress value={userStats.emotionalBalance} className="h-2" />
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5% cette semaine
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Gestion du stress
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {100 - userStats.stressLevel}%
                        </span>
                      </div>
                      <Progress value={100 - userStats.stressLevel} className="h-2" />
                      <div className="flex items-center text-xs text-blue-600">
                        <Heart className="h-3 w-3 mr-1" />
                        Très bon niveau
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Score de focus
                        </span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {userStats.focusScore}%
                        </span>
                      </div>
                      <Progress value={userStats.focusScore} className="h-2" />
                      <div className="flex items-center text-xs text-purple-600">
                        <Brain className="h-3 w-3 mr-1" />
                        Excellent niveau
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                  <CardDescription>
                    Accédez rapidement à vos outils favoris
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map(({ nodeId, urgent, popular }) => {
                      const node = findNavNode(nodeId);
                      if (!node) return null;
                      
                      return (
                        <div key={nodeId} className="relative">
                          {urgent && (
                            <Badge className="absolute -top-2 -right-2 z-10 bg-red-500">
                              Urgent
                            </Badge>
                          )}
                          {popular && (
                            <Badge className="absolute -top-2 -right-2 z-10 bg-green-500">
                              Populaire
                            </Badge>
                          )}
                          <NavButton 
                            node={node} 
                            variant="outline"
                            className="w-full h-24 flex-col gap-2 text-center hover:shadow-md transition-all duration-200"
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activité récente */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="p-2 rounded-full bg-white dark:bg-gray-700">
                          {activity.type === 'scan' && <Brain className="h-4 w-4 text-purple-500" />}
                          {activity.type === 'music' && <Music className="h-4 w-4 text-green-500" />}
                          {activity.type === 'journal' && <Heart className="h-4 w-4 text-pink-500" />}
                          {activity.type === 'vr' && <Target className="h-4 w-4 text-blue-500" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Il y a {activity.date}
                            {activity.score && ` • Score: ${activity.score}/10`}
                            {activity.duration && ` • Durée: ${activity.duration}`}
                            {activity.mood && ` • Humeur: ${activity.mood}`}
                            {activity.session && ` • Session: ${activity.session}`}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne latérale */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Objectifs et achievements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => {
                      const IconComponent = achievement.icon;
                      return (
                        <div key={achievement.id} className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                              {achievement.title}
                            </div>
                            <Progress value={achievement.progress} className="h-1 mt-1" />
                          </div>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progrès hebdomadaire */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Cette semaine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Objectif hebdomadaire</span>
                        <span className="text-sm text-gray-500">{userStats.weeklyProgress}%</span>
                      </div>
                      <Progress value={userStats.weeklyProgress} />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {userStats.totalSessions}
                        </div>
                        <div className="text-xs text-gray-500">Sessions totales</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {userStats.wellnessStreak}
                        </div>
                        <div className="text-xs text-gray-500">Jours consécutifs</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Voir les analytics détaillées
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommandations IA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Recommandations IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                      <div className="font-medium text-purple-900 dark:text-purple-200 text-sm">
                        Session de respiration recommandée
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                        Votre niveau de stress semble élevé aujourd'hui
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="font-medium text-green-900 dark:text-green-200 text-sm">
                        Nouvelle playlist disponible
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Basée sur vos préférences musicales
                      </div>
                    </div>
                    
                    <Button variant="ghost" className="w-full text-xs">
                      Voir toutes les recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;