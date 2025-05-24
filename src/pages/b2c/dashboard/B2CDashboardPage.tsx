
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Award,
  Target
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    emotionalScore: 0,
    journalEntries: 0,
    sessionsCompleted: 0,
    currentStreak: 0,
    badges: 0
  });

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStats({
          emotionalScore: Math.floor(Math.random() * 30) + 70,
          journalEntries: Math.floor(Math.random() * 15) + 5,
          sessionsCompleted: Math.floor(Math.random() * 25) + 10,
          currentStreak: Math.floor(Math.random() * 10) + 1,
          badges: Math.floor(Math.random() * 5) + 2
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analysez votre état émotionnel actuel',
      icon: Brain,
      action: () => navigate('/scan'),
      color: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
    },
    {
      title: 'Coach IA',
      description: 'Discutez avec votre coach personnel',
      icon: Heart,
      action: () => navigate('/coach'),
      color: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
    },
    {
      title: 'Musique adaptée',
      description: 'Découvrez des sons pour votre humeur',
      icon: Music,
      action: () => navigate('/music'),
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30'
    },
    {
      title: 'Journal émotionnel',
      description: 'Notez vos pensées et ressentis',
      icon: BookOpen,
      action: () => navigate('/journal'),
      color: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">
          Bonjour, {user?.user_metadata?.name || 'Utilisateur'} ! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Comment vous sentez-vous aujourd'hui ? Votre bien-être émotionnel nous tient à cœur.
        </p>
      </motion.div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Émotionnel</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.emotionalScore}/100</div>
                  <p className="text-xs text-muted-foreground">
                    +5% par rapport à la semaine dernière
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Séances Complétées</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    Ce mois-ci
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Série Actuelle</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.currentStreak}</div>
                  <p className="text-xs text-muted-foreground">
                    jours consécutifs
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Obtenus</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.badges}</div>
                  <p className="text-xs text-muted-foreground">
                    Accomplissements
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Accédez rapidement à vos outils favoris
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className={`h-auto p-4 w-full justify-start ${action.color} border-2 hover:border-primary/50 transition-all`}
                      onClick={action.action}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section découverte */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-500" />
              Conseil du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              "Prenez 5 minutes aujourd'hui pour pratiquer la respiration consciente. 
              Cela peut considérablement améliorer votre bien-être émotionnel."
            </p>
            <Button onClick={() => navigate('/scan')}>
              Commencer maintenant
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
