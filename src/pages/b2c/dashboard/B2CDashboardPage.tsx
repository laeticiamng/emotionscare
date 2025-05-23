
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  Users,
  Star,
  Play,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [emotionalScore, setEmotionalScore] = useState(75);
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Lun', score: 70 },
    { day: 'Mar', score: 85 },
    { day: 'Mer', score: 60 },
    { day: 'Jeu', score: 90 },
    { day: 'Ven', score: 75 },
    { day: 'Sam', score: 80 },
    { day: 'Dim', score: 85 }
  ]);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const recentActivities = [
    { id: 1, type: 'emotion', title: 'Analyse émotionnelle', time: 'Il y a 2h', score: 85 },
    { id: 2, type: 'journal', title: 'Entrée journal', time: 'Hier', score: 70 },
    { id: 3, type: 'meditation', title: 'Session méditation', time: 'Il y a 3 jours', score: 90 }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Exercice de respiration',
      description: 'Recommandé pour améliorer votre bien-être',
      duration: '5 min',
      type: 'breathing'
    },
    {
      id: 2,
      title: 'Méditation guidée',
      description: 'Basé sur votre profil émotionnel',
      duration: '10 min',
      type: 'meditation'
    },
    {
      id: 3,
      title: 'Journal de gratitude',
      description: 'Renforcez vos émotions positives',
      duration: '3 min',
      type: 'journal'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-light">
            Bonjour <span className="font-medium text-primary">{user?.name || 'Utilisateur'}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Votre espace personnel pour cultiver votre bien-être
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{emotionalScore}</div>
              <div className="text-sm text-muted-foreground">Score bien-être</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">+12%</div>
              <div className="text-sm text-muted-foreground">Cette semaine</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm text-muted-foreground">Jours actifs</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Badges gagnés</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emotional Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-red-500" />
                    Analyse Émotionnelle
                  </CardTitle>
                  <CardDescription>
                    Effectuez une nouvelle analyse de votre état émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => navigate('/b2c/emotion-scanner')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span>Analyse par texte</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/b2c/emotion-scanner?mode=voice')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <Play className="h-6 w-6" />
                      <span>Analyse vocale</span>
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/b2c/emotion-scanner?mode=emoji')}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                    >
                      <Star className="h-6 w-6" />
                      <span>Sélection d'émojis</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                    Évolution Hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={day.day} className="flex items-center space-x-4">
                        <div className="w-8 text-sm font-medium">{day.day}</div>
                        <Progress value={day.score} className="flex-1" />
                        <div className="w-12 text-sm text-muted-foreground">{day.score}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-green-500" />
                      Activités Récentes
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/b2c/history')}>
                      Voir tout
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.time}</div>
                        </div>
                        <Badge variant="secondary">{activity.score}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Recommandations
                  </CardTitle>
                  <CardDescription>
                    Basées sur votre profil émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant="outline">{rec.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <Button size="sm" className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Commencer
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/b2c/journal')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Écrire dans mon journal
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/b2c/social')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Rejoindre la communauté
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/b2c/coaching')}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Coaching personnalisé
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
