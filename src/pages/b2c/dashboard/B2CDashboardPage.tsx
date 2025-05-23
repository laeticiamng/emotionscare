
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Users, Calendar, TrendingUp, MessageCircle, Target, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName] = useState('Sarah');
  const [emotionalScore] = useState(82);
  const [weeklyGoal] = useState(75);
  
  const recentActivities = [
    { id: 1, type: 'emotion', description: 'Analyse émotionnelle terminée', time: 'Il y a 1h', score: 85 },
    { id: 2, type: 'journal', description: 'Entrée de journal ajoutée', time: 'Il y a 3h', mood: 'positive' },
    { id: 3, type: 'social', description: 'Message partagé dans la communauté', time: 'Hier', likes: 12 },
    { id: 4, type: 'milestone', description: 'Objectif de la semaine atteint!', time: 'Hier', achievement: true }
  ];

  const wellnessMetrics = [
    { label: 'Humeur', value: 85, color: 'bg-green-500', icon: Smile },
    { label: 'Stress', value: 30, color: 'bg-red-500', icon: Brain, inverted: true },
    { label: 'Énergie', value: 78, color: 'bg-blue-500', icon: TrendingUp },
    { label: 'Social', value: 72, color: 'bg-purple-500', icon: Users }
  ];

  const quickActions = [
    {
      title: 'Analyser mes émotions',
      description: 'Scanner votre état émotionnel actuel',
      icon: Brain,
      action: () => navigate('/b2c/scan'),
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Communauté',
      description: 'Partager et échanger avec la communauté',
      icon: MessageCircle,
      action: () => navigate('/b2c/social'),
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Journal personnel',
      description: 'Écrire dans votre journal de bord',
      icon: Calendar,
      action: () => console.log('Journal'),
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  const challenges = [
    { title: '7 jours de gratitude', progress: 4, total: 7, reward: 'Badge Reconnaissance' },
    { title: 'Méditation quotidienne', progress: 12, total: 21, reward: 'Badge Sérénité' },
    { title: 'Partage communautaire', progress: 8, total: 10, reward: 'Badge Social' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {userName} ! 🌟</h1>
          <p className="text-muted-foreground">
            Comment vous sentez-vous aujourd'hui ?
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            Niveau: Débutant
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Objectif: {weeklyGoal}%
          </Badge>
        </div>
      </motion.div>

      {/* Main Emotional Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900">Score de Bien-être</h2>
                  <p className="text-blue-700">Votre état émotionnel actuel</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl font-bold text-blue-600">{emotionalScore}%</div>
                  <div className="space-y-2">
                    <Progress value={emotionalScore} className="w-48 h-3" />
                    <p className="text-sm text-blue-600">
                      {emotionalScore >= 80 ? 'Excellente forme!' : 
                       emotionalScore >= 60 ? 'Bonne journée' : 'Prenez soin de vous'}
                    </p>
                  </div>
                </div>
                <Button onClick={() => navigate('/b2c/scan')} className="bg-blue-600 hover:bg-blue-700">
                  Nouvelle analyse
                </Button>
              </div>
              <div className="text-6xl opacity-20">🎯</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wellness Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Métriques de Bien-être
              </CardTitle>
              <CardDescription>Vue d'ensemble de vos indicateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wellnessMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{metric.label}</span>
                    </div>
                    <span className="text-sm font-bold">{metric.value}%</span>
                  </div>
                  <Progress 
                    value={metric.inverted ? 100 - metric.value : metric.value} 
                    className="h-2" 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 ${action.color}`}
                  onClick={action.action}
                >
                  <div className="flex items-center">
                    <action.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Activités Récentes
              </CardTitle>
              <CardDescription>Vos dernières interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    {activity.score && (
                      <Badge variant="secondary">{activity.score}%</Badge>
                    )}
                    {activity.mood && (
                      <Badge variant="default">😊</Badge>
                    )}
                    {activity.likes && (
                      <Badge variant="outline">{activity.likes} ❤️</Badge>
                    )}
                    {activity.achievement && (
                      <Badge variant="default">🏆</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Challenges & Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-orange-600" />
              Défis et Objectifs
            </CardTitle>
            <CardDescription>Suivez vos progrès et débloquez de nouveaux badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {challenge.progress}/{challenge.total}
                    </Badge>
                  </div>
                  <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Progression: {Math.round((challenge.progress / challenge.total) * 100)}%</span>
                    <span>🎁 {challenge.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Inspiration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <h3 className="text-xl font-semibold text-green-900">💡 Inspiration du Jour</h3>
              <p className="text-green-800 italic">
                "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions." - Dalaï Lama
              </p>
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                Partager cette inspiration
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
