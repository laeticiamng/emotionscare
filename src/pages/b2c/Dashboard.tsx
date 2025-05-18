
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Music, BookOpen, Heart, BookCheck, 
  ArrowRight, Calendar, Scan, MessagesSquare, 
  Sparkles, Headphones
} from 'lucide-react';
import { TimeOfDay, determineTimeOfDay, DEFAULT_WELCOME_MESSAGES } from '@/constants/defaults';
import { AudioController } from '@/components/home/audio/AudioController';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { EmotionalWeatherCard, MusicTherapyCard, CoachCard, InspirationalQuoteCard, RecentActivitiesCard, QuickAccessGrid } from "@/components/dashboard/b2c";

const B2CDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(determineTimeOfDay());
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Animation variants for staggered children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  useEffect(() => {
    setTimeOfDay(determineTimeOfDay());
    
    const generateWelcomeMessage = async () => {
      setIsLoading(true);
      try {
        // In a production environment, this would call the OpenAI API
        const messages = DEFAULT_WELCOME_MESSAGES[timeOfDay];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setWelcomeMessage(randomMessage);
      } catch (error) {
        console.error('Error generating welcome message:', error);
        setWelcomeMessage("Bienvenue dans votre tableau de bord émotionnel");
      } finally {
        setIsLoading(false);
      }
    };
    
    generateWelcomeMessage();
  }, [timeOfDay]);
  
  const currentEmotion = {
    score: 7.8,
    label: "Confiance",
    suggestion: "Une courte séance de respiration guidée vous aiderait à maintenir cette énergie positive tout au long de la journée.",
  };
  
  const inspirationalQuote = {
    text: "La paix intérieure commence au moment où vous choisissez de ne pas permettre à une autre personne ou à un événement de contrôler vos émotions.",
    author: "Anonyme",
  };

  const quickModules = [
    {
      title: 'Journal',
      description: 'Exprimez vos émotions',
      icon: <BookOpen className="h-5 w-5 text-white" />,
      href: '/b2c/journal',
      color: 'bg-blue-500'
    },
    {
      title: 'Musique',
      description: 'Relaxez-vous en musique',
      icon: <Music className="h-5 w-5 text-white" />,
      href: '/b2c/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Coach',
      description: 'Parlez à votre coach IA',
      icon: <MessagesSquare className="h-5 w-5 text-white" />,
      href: '/b2c/coach',
      color: 'bg-green-500'
    },
    {
      title: 'Scan',
      description: 'Analysez vos émotions',
      icon: <Scan className="h-5 w-5 text-white" />,
      href: '/b2c/scan',
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    {
      type: "journal",
      title: "Journal du matin",
      date: "Aujourd'hui, 09:24",
      mood: "Calme",
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      type: "music",
      title: "Session de relaxation",
      date: "Hier, 19:45",
      mood: "Relaxé",
      icon: <Headphones className="h-4 w-4" />
    },
    {
      type: "coach",
      title: "Conversation avec coach",
      date: "18 mai, 14:30",
      mood: "Optimiste",
      icon: <MessagesSquare className="h-4 w-4" />
    }
  ];
  
  const getBackgroundClass = () => {
    switch(timeOfDay) {
      case TimeOfDay.MORNING:
        return 'bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20';
      case TimeOfDay.AFTERNOON:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20';
      case TimeOfDay.EVENING:
        return 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20';
      case TimeOfDay.NIGHT:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} transition-colors duration-1000`}>
      <div className="container mx-auto p-4 sm:p-6 relative">
        <div className="absolute top-4 right-4 z-10">
          <AudioController autoplay={true} initialVolume={0.2} />
        </div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Votre tableau de bord émotionnel
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLoading ? "Chargement..." : welcomeMessage}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Emotional Weather Card */}
          <motion.div variants={itemVariants}>
            <EmotionalWeatherCard currentEmotion={currentEmotion} />
          </motion.div>

          {/* Music Therapy Card */}
          <motion.div variants={itemVariants}>
            <MusicTherapyCard />
          </motion.div>

          {/* Daily Coaching Card */}
          <motion.div variants={itemVariants}>
            <CoachCard />
          </motion.div>

          {/* Inspirational Quote */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <InspirationalQuoteCard quote={inspirationalQuote} />
          </motion.div>

          {/* Recent Activities */}
          <motion.div variants={itemVariants}>
            <RecentActivitiesCard activities={recentActivities} />
          </motion.div>
        </motion.div>

        {/* Quick access modules */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-lg font-medium mb-4">Accès rapide</h2>
          <QuickAccessGrid modules={quickModules} />
        </motion.div>

        {/* Detailed dashboard with tabs */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="analytics">Analyse</TabsTrigger>
              <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité hebdomadaire</CardTitle>
                    <CardDescription>Votre utilisation par module</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md w-full">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p>Graphique d'activité hebdomadaire</p>
                      <p className="text-xs mt-1">Les données seront disponibles prochainement</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Évolution émotionnelle</CardTitle>
                    <CardDescription>Votre progression sur 30 jours</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md w-full">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p>Graphique d'évolution émotionnelle</p>
                      <p className="text-xs mt-1">Les données seront disponibles prochainement</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse approfondie</CardTitle>
                  <CardDescription>Découvrez vos tendances émotionnelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-6 text-center border rounded-lg">
                      <p className="text-muted-foreground">Analyse détaillée en cours de développement</p>
                      <Button variant="outline" className="mt-4">Explorer tout de même</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations personnalisées</CardTitle>
                  <CardDescription>Basées sur vos habitudes et préférences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Activité recommandée
                      </h4>
                      <p className="text-sm mt-2">Méditation guidée de 10 minutes pour démarrer la journée</p>
                      <Button size="sm" variant="link" className="mt-2">
                        Essayer maintenant <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <Music className="h-4 w-4 mr-2" />
                        Ambiance sonore
                      </h4>
                      <p className="text-sm mt-2">Concentration et productivité - 30 minutes de musique adaptée</p>
                      <Button size="sm" variant="link" className="mt-2">
                        Écouter <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboard;
