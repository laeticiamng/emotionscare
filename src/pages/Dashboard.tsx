
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';
import { Link } from 'react-router-dom';
import {
  BarChart2,
  FileText,
  Heart,
  Music,
  Users,
  Calendar,
  Settings,
  Activity,
} from 'lucide-react';
import DashboardHero from '@/components/dashboard/DashboardHero';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for the user's emotional points and level
  const userProfile = {
    name: user?.name || 'Utilisateur',
    avatar: user?.avatar,
    points: 520,
    level: 'Intermediate'
  };

  // Mock data for emotional trends
  const emotionalTrendsData = [
    { date: 'Lun', joy: 60, sadness: 20, anger: 10, fear: 10 },
    { date: 'Mar', joy: 50, sadness: 30, anger: 15, fear: 5 },
    { date: 'Mer', joy: 70, sadness: 10, anger: 10, fear: 10 },
    { date: 'Jeu', joy: 55, sadness: 20, anger: 20, fear: 5 },
    { date: 'Ven', joy: 65, sadness: 15, anger: 5, fear: 15 },
  ];

  // Mock data for recent journal entries
  const recentJournalEntries = [
    { id: '1', title: 'Réflexion matinale', date: '2023-06-15', mood: 'Calme' },
    { id: '2', title: 'Journée productive', date: '2023-06-14', mood: 'Satisfait' },
    { id: '3', title: 'Moments de stress', date: '2023-06-13', mood: 'Anxieux' }
  ];

  // Mock data for upcoming reminders
  const upcomingReminders = [
    { id: '1', title: 'Session de méditation', date: '2025-05-23 09:00', type: 'meditation' },
    { id: '2', title: 'Check-in émotionnel', date: '2025-05-23 14:00', type: 'checkin' },
    { id: '3', title: 'Exercice de respiration', date: '2025-05-24 10:00', type: 'exercise' }
  ];

  const modules = [
    {
      title: "Scan émotionnel",
      description: "Analysez votre état émotionnel actuel",
      icon: <Heart className="h-10 w-10 text-red-500" />,
      path: "/scan",
      color: "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Journal",
      description: "Notez vos pensées et émotions",
      icon: <FileText className="h-10 w-10 text-blue-500" />,
      path: "/journal",
      color: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Musicothérapie",
      description: "Écoutez des playlists adaptées",
      icon: <Music className="h-10 w-10 text-purple-500" />,
      path: "/music",
      color: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Communauté",
      description: "Échangez avec d'autres utilisateurs",
      icon: <Users className="h-10 w-10 text-green-500" />,
      path: "/social",
      color: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Sessions",
      description: "Planifiez vos sessions thérapeutiques",
      icon: <Calendar className="h-10 w-10 text-amber-500" />,
      path: "/sessions",
      color: "bg-amber-100 dark:bg-amber-900/20"
    },
    {
      title: "Paramètres",
      description: "Configurez votre espace personnel",
      icon: <Settings className="h-10 w-10 text-gray-500" />,
      path: "/settings",
      color: "bg-gray-100 dark:bg-gray-800"
    }
  ];

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DashboardHero user={userProfile} points={userProfile.points} level={userProfile.level} />
        </motion.div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="progress">Progrès</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                      État émotionnel
                    </CardTitle>
                    <CardDescription>
                      Résumé de votre bien-être émotionnel récent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center flex-col">
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-primary">75%</span>
                      </div>
                      <p className="text-lg font-medium">Bien-être général</p>
                      <div className="mt-4 text-center">
                        <Link to="/scan" className="text-primary hover:underline flex items-center justify-center">
                          <Heart className="h-4 w-4 mr-1" />
                          Faire un scan émotionnel
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Journal émotionnel
                    </CardTitle>
                    <CardDescription>
                      Vos dernières entrées de journal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentJournalEntries.length > 0 ? (
                        recentJournalEntries.map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{entry.title}</p>
                              <p className="text-sm text-muted-foreground">{entry.date}</p>
                            </div>
                            <div className="text-sm">{entry.mood}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          Aucune entrée de journal récente
                        </p>
                      )}
                      <div className="text-center mt-2">
                        <Link to="/journal" className="text-primary hover:underline">
                          Voir tout le journal
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="md:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                      Modules recommandés
                    </CardTitle>
                    <CardDescription>
                      Modules adaptés à votre état émotionnel actuel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {modules.slice(0, 3).map((module, index) => (
                        <Link to={module.path} key={index} className="block">
                          <div className={`p-4 rounded-lg ${module.color} hover:shadow-md transition-shadow duration-200 h-full`}>
                            <div className="flex items-start mb-2">
                              {module.icon}
                            </div>
                            <h3 className="font-medium mb-1">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={module.path} className="block h-full">
                    <Card className="h-full hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6 flex flex-col items-center text-center h-full">
                        <div className={`rounded-full p-4 mb-4 ${module.color}`}>
                          {module.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                        <p className="text-muted-foreground mb-4 flex-grow">{module.description}</p>
                        <div className="w-full p-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-center">
                          Accéder
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progrès émotionnel</CardTitle>
                  <CardDescription>
                    Suivez l'évolution de vos émotions au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Graphique de progression (disponible après plusieurs enregistrements)
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>
                    Vos dernières activités sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Scan émotionnel effectué</p>
                        <p className="text-xs text-muted-foreground">Aujourd'hui à 09:30</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Entrée de journal ajoutée</p>
                        <p className="text-xs text-muted-foreground">Hier à 15:45</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                        <Music className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Session de musicothérapie</p>
                        <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default Dashboard;
