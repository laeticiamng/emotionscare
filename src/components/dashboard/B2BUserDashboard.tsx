// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Trophy, ChartLine, Bell, BookOpen, Lightbulb } from 'lucide-react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { UserModeSelector } from '@/components/ui/user-mode-selector';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// Import types from unified auth types
import type { Challenge } from '@/types/badge';

// Type pour simuler les données du reporting
interface ReportingMetric {
  date: string;
  value: number;
  label: string;
}

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // États pour gérer le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [metrics, setMetrics] = useState<ReportingMetric[]>([]);
  const [notifications, setNotifications] = useState<number>(0);
  
  // Effet pour simuler le chargement des données
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Charger les défis (simulé)
        setChallenges([
          {
            id: 'chall-1',
            title: 'Journée Mindfulness',
            description: 'Complétez 3 sessions de méditation aujourd\'hui',
            progress: 66,
            dueDate: new Date(Date.now() + 86400000).toLocaleDateString('fr-FR'),
            type: 'daily'
          },
          {
            id: 'chall-2',
            title: 'Semaine du bien-être',
            description: 'Partagez 5 moments positifs avec votre équipe',
            progress: 40,
            dueDate: new Date(Date.now() + 432000000).toLocaleDateString('fr-FR'),
            type: 'weekly'
          },
          {
            id: 'chall-3',
            title: 'Maître du calme',
            description: 'Maintenez un score de stress bas pendant 3 jours consécutifs',
            progress: 80,
            dueDate: new Date(Date.now() + 259200000).toLocaleDateString('fr-FR'),
            type: 'special'
          }
        ]);
        
        // Charger les métriques de reporting (simulé)
        const today = new Date();
        const metrics = Array.from({length: 7}, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          return {
            date: date.toLocaleDateString('fr-FR'),
            value: Math.floor(Math.random() * 40) + 60, // Score entre 60 et 100
            label: 'Bien-être'
          };
        }).reverse();
        
        setMetrics(metrics);
        
        // Nombre de notifications non lues (simulé)
        setNotifications(3);
        
        setIsLoading(false);
      } catch (error) {
        logger.error('Erreur lors du chargement du tableau de bord :', error);
        setHasError(true);
        setIsLoading(false);
        toast.error('Impossible de charger les données du tableau de bord', {
          description: 'Veuillez réessayer ultérieurement'
        });
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Gestion de l'erreur
  if (hasError) {
    return (
      <DashboardContainer>
        <div className="flex flex-col items-center justify-center p-8">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <ChartLine className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Impossible de charger votre tableau de bord</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Une erreur s'est produite lors du chargement de votre espace collaborateur. Veuillez réessayer.
          </p>
          <Button onClick={() => window.location.reload()} variant="default">
            Actualiser la page
          </Button>
        </div>
      </DashboardContainer>
    );
  }

  const handleJoinChallenge = (challengeId: string) => {
    toast.success('Défi rejoint !', {
      description: 'Vous avez rejoint un nouveau défi',
    });
  };

  const handlePlayFocusMusic = () => {
    navigate('/music');
    toast.success('Lecture de la playlist de focus', {
      description: 'Votre session de concentration commence maintenant'
    });
  };

  const handleViewNotifications = () => {
    navigate('/notifications');
  };

  return (
    <DashboardContainer>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">
              Tableau de bord Collaborateur
            </h1>
            <p className="text-muted-foreground">
              Bienvenue dans votre espace de bien-être professionnel, {user?.name || 'collaborateur'}
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleViewNotifications} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
              {notifications > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-medium">
                  {notifications}
                </span>
              )}
            </Button>
            <UserModeSelector className="hidden md:block" minimal />
          </div>
        </div>

        {isLoading ? (
          // État de chargement
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-7 bg-muted rounded-md w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded-md w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted/50 rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="defis" className="space-y-8">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="defis" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Défis</span>
              </TabsTrigger>
              <TabsTrigger value="reporting" className="flex items-center gap-2">
                <ChartLine className="h-4 w-4" />
                <span className="hidden sm:inline">Reporting</span>
              </TabsTrigger>
              <TabsTrigger value="focus" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Focus</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Onglet Défis */}
            <TabsContent value="defis">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {challenges.length === 0 ? (
                  <Card className="col-span-full">
                    <CardHeader>
                      <CardTitle>Aucun défi disponible</CardTitle>
                      <CardDescription>Aucun défi n'est actuellement disponible pour vous</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center py-8">
                        <Lightbulb className="h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <p className="text-center text-muted-foreground">
                        Les nouveaux défis seront bientôt disponibles
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  challenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{challenge.title}</CardTitle>
                              <CardDescription>Échéance: {challenge.dueDate}</CardDescription>
                            </div>
                            <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                              {challenge.type === 'daily' ? 'Quotidien' : 
                               challenge.type === 'weekly' ? 'Hebdomadaire' : 'Spécial'}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">{challenge.description}</p>
                          <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${challenge.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right text-muted-foreground">
                            {challenge.progress}% complété
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            onClick={() => handleJoinChallenge(challenge.id)}
                            variant="outline" 
                            className="w-full"
                            disabled={challenge.progress >= 100}
                          >
                            {challenge.progress >= 100 ? 'Complété' : 'Participer'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </TabsContent>
            
            {/* Onglet Reporting */}
            <TabsContent value="reporting">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du bien-être</CardTitle>
                  <CardDescription>
                    Votre score personnel sur les 7 derniers jours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics.length === 0 ? (
                    <div className="flex flex-col items-center py-12">
                      <ChartLine className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                      <p className="text-muted-foreground">Aucune donnée disponible pour le moment</p>
                    </div>
                  ) : (
                    <div className="h-[300px] w-full mt-4">
                      <div className="flex h-full items-end gap-2">
                        {metrics.map((metric, index) => (
                          <div key={index} className="relative flex h-full w-full flex-col justify-end">
                            <div
                              className="bg-primary rounded-t w-full animate-in"
                              style={{ 
                                height: `${metric.value}%`,
                                animation: `heightIn 0.8s ease-in-out forwards ${index * 0.1}s`
                              }}
                            ></div>
                            <p className="text-xs text-center mt-2">{metric.date.split('/').slice(0, 2).join('/')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate('/reporting')}>
                    Voir rapport détaillé
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/export')}>
                    Exporter
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Onglet Focus */}
            <TabsContent value="focus">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Musique de concentration</CardTitle>
                    <CardDescription>
                      Des playlists adaptées pour booster votre productivité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Deep Focus', 'Ambiance Nature', 'Productivité'].map((playlist) => (
                        <Button
                          key={playlist}
                          variant="ghost"
                          className="flex w-full justify-between py-6"
                          onClick={handlePlayFocusMusic}
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-md">
                              <Music className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{playlist}</p>
                              <p className="text-xs text-muted-foreground">30-60 min</p>
                            </div>
                          </div>
                          <div className="text-primary hover:text-primary/80">▶</div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Journal du jour</CardTitle>
                    <CardDescription>
                      Notez vos pensées et vos émotions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <BookOpen className="h-10 w-10 text-muted-foreground opacity-70" />
                      <p className="text-center text-muted-foreground">
                        Vous n'avez pas encore créé d'entrée dans votre journal aujourd'hui
                      </p>
                      <Button onClick={() => navigate('/journal')}>
                        Créer une entrée
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Onglet Journal */}
            <TabsContent value="journal">
              <Card>
                <CardHeader>
                  <CardTitle>Votre journal émotionnel</CardTitle>
                  <CardDescription>
                    Suivez l'évolution de votre état émotionnel au travail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <BookOpen className="h-16 w-16 text-muted-foreground opacity-50" />
                    <div className="text-center max-w-sm">
                      <h3 className="text-lg font-medium mb-2">
                        Commencez votre journal émotionnel
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Notez quotidiennement vos émotions, identifiez des tendances et améliorez votre bien-être au travail
                      </p>
                      <Button onClick={() => navigate('/journal')}>
                        Accéder au journal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardContainer>
  );
};

export default B2BUserDashboard;
