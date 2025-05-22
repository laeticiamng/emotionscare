
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart2, Calendar, Clock, FileText, Heart, Music, User, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const quickLinks = [
    { 
      name: 'Journal', 
      icon: <FileText className="h-5 w-5" />, 
      path: '/journal',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    { 
      name: 'Musique', 
      icon: <Music className="h-5 w-5" />, 
      path: '/music',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    },
    { 
      name: 'Scan émotionnel', 
      icon: <Heart className="h-5 w-5" />, 
      path: '/emotions',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    },
    { 
      name: 'Communauté', 
      icon: <Users className="h-5 w-5" />, 
      path: '/social',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    { 
      name: 'Sessions', 
      icon: <Calendar className="h-5 w-5" />, 
      path: '/sessions',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    },
    { 
      name: 'Profil', 
      icon: <User className="h-5 w-5" />, 
      path: '/profile',
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  ];

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {user?.name || 'Utilisateur'}
          </h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord personnel. Voici un aperçu de votre santé émotionnelle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Humeur moyenne
              </CardTitle>
              <CardDescription>
                7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">😊 Positive</div>
              <div className="text-xs text-muted-foreground mt-1">
                +5% par rapport à la semaine dernière
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Entrées journal
              </CardTitle>
              <CardDescription>
                Ce mois-ci
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground mt-1">
                3 cette semaine
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Prochaine session
              </CardTitle>
              <CardDescription>
                À venir
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="text-md font-medium">Jeudi, 14:00</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="community">Communauté</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Tendances émotionnelles</CardTitle>
                <CardDescription>
                  Évolution de vos émotions au cours du temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Graphique des tendances émotionnelles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emotions" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des émotions</CardTitle>
                <CardDescription>
                  Répartition de vos émotions récentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Graphique d'analyse des émotions</p>
                    <Button onClick={() => navigate('/scan')} variant="outline" className="mt-4">
                      Faire un scan émotionnel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journal" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Journal émotionnel</CardTitle>
                  <CardDescription>
                    Vos entrées récentes
                  </CardDescription>
                </div>
                <Button onClick={() => navigate('/journal/new')} size="sm">
                  Nouvelle entrée
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Une journée productive</h3>
                      <p className="text-sm text-muted-foreground">Sentiment de satisfaction et d'accomplissement</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Il y a 2 jours</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Stress au travail</h3>
                      <p className="text-sm text-muted-foreground">Sentiment d'anxiété face à une échéance</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">Il y a 5 jours</span>
                    </div>
                  </div>
                  
                  <Button onClick={() => navigate('/journal')} variant="outline" className="w-full">
                    Voir toutes les entrées
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="community" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Communauté</CardTitle>
                <CardDescription>
                  Activités et interactions récentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Rejoignez notre communauté pour échanger</p>
                    <Button onClick={() => navigate('/social')} className="mt-4">
                      Explorer la communauté
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Accès rapide</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                className={`h-auto flex flex-col items-center justify-center p-4 ${link.color}`}
                onClick={() => navigate(link.path)}
              >
                <div className="h-10 w-10 rounded-full flex items-center justify-center mb-2">
                  {link.icon}
                </div>
                <span>{link.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </Shell>
  );
};

export default Dashboard;
