
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Heart, 
  Brain,
  BarChart3, 
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    teamMoodAverage: 0,
    myMoodAverage: 0,
    teamSize: 0,
    completedSessions: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    const loadTeamData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStats({
          teamMoodAverage: Math.floor(Math.random() * 30) + 70,
          myMoodAverage: Math.floor(Math.random() * 30) + 65,
          teamSize: Math.floor(Math.random() * 15) + 5,
          completedSessions: Math.floor(Math.random() * 20) + 8,
          upcomingEvents: Math.floor(Math.random() * 5) + 1
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamData();
  }, []);

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analyse personnelle quotidienne',
      icon: Brain,
      action: () => navigate('/scan'),
      color: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Mon coach personnel',
      description: 'Session de coaching individuel',
      icon: Heart,
      action: () => navigate('/coach'),
      color: 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20'
    },
    {
      title: 'Humeur de l\'équipe',
      description: 'Voir le moral de mes collègues',
      icon: Users,
      action: () => {}, // TODO: implémenter la vue équipe
      color: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Journal d\'équipe',
      description: 'Partager avec mes collègues',
      icon: Calendar,
      action: () => navigate('/journal'),
      color: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Bonjour, {user?.user_metadata?.name || 'Collaborateur'} ! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Tableau de bord collaborateur - {user?.user_metadata?.company || 'Votre entreprise'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {user?.user_metadata?.department || 'Département'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Statistiques équipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humeur Équipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.teamMoodAverage}/100</div>
                  <p className="text-xs text-muted-foreground">
                    Moyenne de l'équipe
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
              <CardTitle className="text-sm font-medium">Mon Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.myMoodAverage}/100</div>
                  <p className="text-xs text-muted-foreground">
                    Votre moyenne mensuelle
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
              <CardTitle className="text-sm font-medium">Équipe</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.teamSize}</div>
                  <p className="text-xs text-muted-foreground">
                    Membres actifs
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
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.completedSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    Complétées ce mois
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
              Accès rapide à vos outils de bien-être
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

      {/* Suivi équipe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Suivi d'Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Réunion bien-être d'équipe</p>
                  <p className="text-sm text-muted-foreground">Demain à 14h00</p>
                </div>
                <Button variant="outline" size="sm">
                  Rejoindre
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Challenge collectif du mois</p>
                  <p className="text-sm text-muted-foreground">Méditation 5 min/jour</p>
                </div>
                <Button variant="outline" size="sm">
                  Participer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
