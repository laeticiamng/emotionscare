
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Brain, Music, BookOpen, Zap, TrendingUp, Calendar, Target } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2CDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    emotionScans: 12,
    journalEntries: 8,
    musicSessions: 15,
    coachingSessions: 5
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analysez votre état émotionnel actuel',
      icon: Brain,
      action: () => navigate('/scan'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Coach IA',
      description: 'Obtenez des conseils personnalisés',
      icon: Heart,
      action: () => navigate('/coach'),
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Musique thérapeutique',
      description: 'Écoutez de la musique adaptée',
      icon: Music,
      action: () => navigate('/music'),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Mon journal',
      description: 'Notez vos pensées et émotions',
      icon: BookOpen,
      action: () => navigate('/journal'),
      color: 'bg-green-100 text-green-600'
    }
  ];

  const recentActivities = [
    { type: 'scan', message: 'Scan émotionnel terminé', time: '2h', mood: 'Calme' },
    { type: 'journal', message: 'Nouvelle entrée journal', time: '1j', title: 'Réflexions du matin' },
    { type: 'music', message: 'Session musique', time: '2j', duration: '15 min' },
    { type: 'coaching', message: 'Session de coaching', time: '3j', topic: 'Gestion du stress' }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre tableau de bord..." />
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');
  const isTrialActive = user?.trial_end && new Date(user.trial_end) > new Date();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour {user?.user_metadata?.firstName || user?.user_metadata?.name || 'Utilisateur'} ! 
            </h1>
            <p className="text-muted-foreground">
              Comment vous sentez-vous aujourd'hui ?
            </p>
          </div>
          {isDemo && (
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              Mode Démo
            </div>
          )}
          {isTrialActive && !isDemo && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Essai gratuit actif
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>
              Commencez votre journée bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Button
                      onClick={action.action}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-3 w-full"
                    >
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Vos statistiques
              </CardTitle>
              <CardDescription>
                Votre activité des 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.emotionScans}</div>
                  <div className="text-xs text-muted-foreground">Scans émotionnels</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.journalEntries}</div>
                  <div className="text-xs text-muted-foreground">Entrées journal</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.musicSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions musique</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.coachingSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions coaching</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activités récentes
              </CardTitle>
              <CardDescription>
                Vos dernières interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.mood || activity.title || activity.topic || `Durée: ${activity.duration}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Objectifs du jour */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs du jour
            </CardTitle>
            <CardDescription>
              Progressez vers votre bien-être quotidien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <input type="checkbox" checked className="rounded" readOnly />
                <span className="text-sm">Effectuer un scan émotionnel matinal</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Écrire dans mon journal (5 min)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Session de musique thérapeutique (10 min)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2CDashboardPage;
