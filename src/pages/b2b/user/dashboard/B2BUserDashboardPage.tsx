
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Users, Calendar, TrendingUp, MessageCircle, Star, Target, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const B2BUserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName] = useState('Alex Martin');
  const [emotionalScore] = useState(78);
  const [streakDays] = useState(12);
  
  const recentActivities = [
    { id: 1, type: 'emotion', description: 'Analyse émotionnelle terminée', time: 'Il y a 2h', score: 82 },
    { id: 2, type: 'social', description: 'Interaction dans la communauté', time: 'Il y a 4h', comments: 3 },
    { id: 3, type: 'goal', description: 'Objectif de méditation atteint', time: 'Hier', progress: 100 },
    { id: 4, type: 'scan', description: 'Scanner vocal complété', time: 'Hier', score: 75 }
  ];

  const teamStats = [
    { label: 'Équipe active', value: '24/30', icon: Users, color: 'text-green-600' },
    { label: 'Score moyen équipe', value: '72%', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Défis en cours', value: '3', icon: Target, color: 'text-purple-600' },
    { label: 'Sessions cette semaine', value: '18', icon: Calendar, color: 'text-orange-600' }
  ];

  const quickActions = [
    {
      title: 'Analyse Émotionnelle',
      description: 'Évaluez votre état émotionnel actuel',
      icon: Brain,
      action: () => navigate('/b2b/user/scan'),
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Communauté',
      description: 'Participez aux discussions d\'équipe',
      icon: MessageCircle,
      action: () => navigate('/b2b/user/social'),
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Objectifs',
      description: 'Suivez vos objectifs de bien-être',
      icon: Target,
      action: () => console.log('Objectives'),
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
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
          <h1 className="text-3xl font-bold">Bonjour, {userName} 👋</h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre bien-être au travail
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            <Star className="w-4 h-4 mr-1" />
            {streakDays} jours consécutifs
          </Badge>
        </div>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emotional Score */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-blue-600" />
                Score Émotionnel
              </CardTitle>
              <CardDescription>Votre bien-être émotionnel actuel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{emotionalScore}%</div>
                <Progress value={emotionalScore} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-700">Positif</div>
                  <div className="text-green-600">65%</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-700">Neutre</div>
                  <div className="text-blue-600">35%</div>
                </div>
              </div>
              <Button className="w-full" onClick={() => navigate('/b2b/user/scan')}>
                Nouvelle analyse
              </Button>
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
                <Clock className="mr-2 h-5 w-5" />
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
                    {activity.comments && (
                      <Badge variant="outline">{activity.comments} 💬</Badge>
                    )}
                    {activity.progress && (
                      <Badge variant="default">✅</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-purple-600" />
              Défis d'Équipe
            </CardTitle>
            <CardDescription>Participez aux challenges de bien-être de votre équipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Challenge Méditation</h4>
                <p className="text-sm text-muted-foreground mb-3">10 minutes par jour pendant 7 jours</p>
                <Progress value={70} className="mb-2" />
                <p className="text-xs text-muted-foreground">5/7 jours complétés</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Gratitude Quotidienne</h4>
                <p className="text-sm text-muted-foreground mb-3">Partager 3 points positifs par jour</p>
                <Progress value={90} className="mb-2" />
                <p className="text-xs text-muted-foreground">9/10 participants actifs</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Pause Active</h4>
                <p className="text-sm text-muted-foreground mb-3">Prendre 3 pauses conscientes</p>
                <Progress value={40} className="mb-2" />
                <p className="text-xs text-muted-foreground">Commence demain</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
