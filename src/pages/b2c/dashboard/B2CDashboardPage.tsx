
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Scan, 
  Bot, 
  Music, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    emotionalScore: 78,
    scansThisWeek: 5,
    streakDays: 12,
    journalEntries: 8
  });

  const isDemo = user?.email?.endsWith('@exemple.fr');
  const trialDaysLeft = 3; // À calculer dynamiquement

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analysez votre état émotionnel actuel',
      icon: Scan,
      color: 'bg-blue-500',
      action: () => navigate('/scan')
    },
    {
      title: 'Parler au Coach IA',
      description: 'Obtenez des conseils personnalisés',
      icon: Bot,
      color: 'bg-green-500',
      action: () => navigate('/coach')
    },
    {
      title: 'Écouter de la musique',
      description: 'Musicothérapie adaptée à votre humeur',
      icon: Music,
      color: 'bg-purple-500',
      action: () => navigate('/music')
    },
    {
      title: 'Écrire dans mon journal',
      description: 'Notez vos pensées et réflexions',
      icon: BookOpen,
      color: 'bg-orange-500',
      action: () => navigate('/journal')
    }
  ];

  const insights = [
    {
      title: 'Tendance émotionnelle',
      value: '+12%',
      description: 'Amélioration cette semaine',
      icon: TrendingUp,
      positive: true
    },
    {
      title: 'Jours consécutifs',
      value: stats.streakDays,
      description: 'Série d\'utilisation active',
      icon: Calendar,
      positive: true
    },
    {
      title: 'Objectifs atteints',
      value: '3/5',
      description: 'Cette semaine',
      icon: Target,
      positive: true
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête avec informations utilisateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Bonjour {user?.user_metadata?.name || 'Utilisateur'} ! 👋
                </CardTitle>
                <CardDescription className="text-lg">
                  Comment vous sentez-vous aujourd'hui ?
                </CardDescription>
              </div>
              <div className="text-right">
                {isDemo ? (
                  <Badge variant="secondary" className="mb-2">
                    Compte démo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mb-2">
                    {trialDaysLeft} jours restants
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold">{stats.emotionalScore}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Score émotionnel</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Commencez votre parcours de bien-être dès maintenant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-3 p-6 w-full hover:shadow-md transition-all"
                    onClick={action.action}
                  >
                    <div className={`p-3 rounded-full ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Vos insights de bien-être</CardTitle>
              <CardDescription>
                Suivez vos progrès et tendances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                  <div key={insight.title} className="text-center p-4 border rounded-lg">
                    <div className={`mx-auto p-2 rounded-full w-fit mb-2 ${
                      insight.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <insight.icon className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold">{insight.value}</div>
                    <div className="text-sm font-medium">{insight.title}</div>
                    <div className="text-xs text-muted-foreground">{insight.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Scan className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Scan émotionnel</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Session Coach IA</p>
                  <p className="text-xs text-muted-foreground">Hier</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Music className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Musicothérapie</p>
                  <p className="text-xs text-muted-foreground">Avant-hier</p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                Voir tout l'historique
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Encouragements et objectifs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Continuez comme ça !</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vous avez maintenu une routine de bien-être pendant {stats.streakDays} jours consécutifs. 
              Votre score émotionnel s'améliore régulièrement. Continuez vos efforts !
            </p>
            <Button className="mt-4" onClick={() => navigate('/scan')}>
              Faire un scan d'émotions maintenant
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
