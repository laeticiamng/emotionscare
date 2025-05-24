
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building, Users, Brain, Music, BookOpen, TrendingUp, Calendar, Target } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BUserDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    emotionScans: 8,
    journalEntries: 12,
    musicSessions: 10,
    teamEngagement: 85
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
      title: 'Check-in émotionnel',
      description: 'Comment vous sentez-vous aujourd\'hui ?',
      icon: Brain,
      action: () => navigate('/scan'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Support bien-être',
      description: 'Accédez au coaching personnalisé',
      icon: Target,
      action: () => navigate('/coach'),
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pause musicale',
      description: 'Détendez-vous avec de la musique',
      icon: Music,
      action: () => navigate('/music'),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Journal personnel',
      description: 'Notez vos réflexions',
      icon: BookOpen,
      action: () => navigate('/journal'),
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de votre espace collaborateur..." />
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');

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
              Bonjour {user?.user_metadata?.firstName || user?.user_metadata?.name || 'Collaborateur'} !
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Building className="h-4 w-4" />
              {user?.user_metadata?.company || 'Votre entreprise'} • Espace collaborateur
            </p>
          </div>
          {isDemo && (
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              Mode Démo
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
              <Target className="h-5 w-5" />
              Votre bien-être au travail
            </CardTitle>
            <CardDescription>
              Prenez soin de votre santé mentale au quotidien
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
        {/* Vos statistiques personnelles */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Votre activité
              </CardTitle>
              <CardDescription>
                Vos interactions des 7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.emotionScans}</div>
                  <div className="text-xs text-muted-foreground">Check-ins</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.journalEntries}</div>
                  <div className="text-xs text-muted-foreground">Réflexions</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.musicSessions}</div>
                  <div className="text-xs text-muted-foreground">Pauses musicales</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.teamEngagement}%</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conseils du jour */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conseils bien-être
              </CardTitle>
              <CardDescription>
                Recommandations personnalisées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">💡 Conseil du jour</h4>
                  <p className="text-sm text-muted-foreground">
                    Prenez 5 minutes de pause toutes les heures pour réduire le stress.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">🎯 Objectif de la semaine</h4>
                  <p className="text-sm text-muted-foreground">
                    Essayez une session de musique thérapeutique chaque jour.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">📝 Réflexion</h4>
                  <p className="text-sm text-muted-foreground">
                    Qu'est-ce qui vous a apporté de la joie aujourd'hui ?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Aperçu de l'équipe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ambiance d'équipe
            </CardTitle>
            <CardDescription>
              Aperçu anonymisé du bien-être de votre équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">Positive</div>
                <div className="text-sm text-muted-foreground">Ambiance générale</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">78%</div>
                <div className="text-sm text-muted-foreground">Participation</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">12</div>
                <div className="text-sm text-muted-foreground">Sessions partagées</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
