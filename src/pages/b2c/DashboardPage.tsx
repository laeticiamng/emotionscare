import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardHero } from '@/hooks/useDashboardHero';
import { Activity, Calendar, Heart } from 'lucide-react';
import { PageTransition } from '@/components/transitions/PageTransition';
import { useToast } from '@/hooks/use-toast';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { kpis, shortcuts, isLoading } = useDashboardHero(user?.id);
  const [moduleVisibility, setModuleVisibility] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Staggered module appearance
  useEffect(() => {
    if (!isLoading) {
      const modules = ['welcome', 'stats', 'journal', 'activities', 'recommend'];
      let delay = 100;
      
      modules.forEach(module => {
        setTimeout(() => {
          setModuleVisibility(prev => ({ ...prev, [module]: true }));
        }, delay);
        delay += 150; // Increment delay for each module
      });
    }
  }, [isLoading]);

  // Welcome toast on first load
  useEffect(() => {
    if (!isLoading && user?.name) {
      const hasSeenWelcome = sessionStorage.getItem('dashboard_welcomed');
      
      if (!hasSeenWelcome) {
        setTimeout(() => {
          toast({
            title: `Bienvenue ${user.name}`,
            description: "Votre espace personnel est prêt",
            duration: 5000,
          });
          sessionStorage.setItem('dashboard_welcomed', 'true');
        }, 800);
      }
    }
  }, [isLoading, user, toast]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Welcome message */}
          <AnimatePresence>
            {moduleVisibility.welcome && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg"
              >
                <h1 className="text-2xl font-bold mb-2">
                  Bonjour {user?.name || 'à vous'}
                </h1>
                <p>Comment vous sentez-vous aujourd'hui ?</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats overview */}
          <AnimatePresence>
            {moduleVisibility.stats && (
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                        <CardTitle className="text-lg">Score émotionnel</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">84%</div>
                      <p className="text-sm text-muted-foreground mt-1">+5% cette semaine</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardHeader className="bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                        <CardTitle className="text-lg">Activités</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">12</div>
                      <p className="text-sm text-muted-foreground mt-1">+2 depuis hier</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden sm:col-span-2 md:col-span-1">
                    <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                        <CardTitle className="text-lg">Jours consécutifs</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold">7</div>
                      <p className="text-sm text-muted-foreground mt-1">Continuez comme ça !</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Journal section */}
          <AnimatePresence>
            {moduleVisibility.journal && (
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Journal émotionnel</CardTitle>
                    <CardDescription>
                      Suivez et analysez vos émotions au quotidien
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Votre dernière entrée remonte à hier. Comment vous sentez-vous aujourd'hui ?</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activities */}
          <AnimatePresence>
            {moduleVisibility.activities && (
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Activités recommandées</CardTitle>
                    <CardDescription>
                      Basées sur votre état émotionnel actuel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <Card className="bg-blue-50 dark:bg-blue-900/20 hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-4">
                          <h3 className="font-medium">Méditation guidée</h3>
                          <p className="text-sm text-muted-foreground">10 minutes</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 dark:bg-green-900/20 hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-4">
                          <h3 className="font-medium">Exercices respiratoires</h3>
                          <p className="text-sm text-muted-foreground">5 minutes</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 dark:bg-purple-900/20 hover:shadow-md transition-shadow duration-300">
                        <CardContent className="p-4">
                          <h3 className="font-medium">Playlist apaisante</h3>
                          <p className="text-sm text-muted-foreground">20 minutes</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Recommendations */}
          <AnimatePresence>
            {moduleVisibility.recommend && (
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Pour votre bien-être</CardTitle>
                    <CardDescription>
                      Découvrez du contenu adapté à vos besoins
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Notre coach IA a préparé des ressources spécialement pour vous
                    </p>
                    {/* Content would be here */}
                    <p className="text-center text-sm text-muted-foreground">
                      Nouveau contenu disponible demain
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default B2CDashboardPage;
