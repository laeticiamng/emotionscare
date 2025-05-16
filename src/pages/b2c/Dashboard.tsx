
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
            <Card className="overflow-hidden bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/10 dark:to-purple-900/20 border-blue-100 dark:border-blue-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-blue-500" />
                  Météo émotionnelle
                </CardTitle>
                <CardDescription>
                  Votre état émotionnel du jour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-300">{currentEmotion.score}</span>
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-blue-400"
                      initial={{ opacity: 0.5, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-medium text-blue-700 dark:text-blue-300">{currentEmotion.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Niveau positif</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400 mt-2">
                      Scanner maintenant
                    </Button>
                  </div>
                </div>
                <p className="text-sm">{currentEmotion.suggestion}</p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Music Therapy Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/10 dark:to-pink-900/20 border-purple-100 dark:border-purple-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="h-6 w-6 mr-2 text-purple-500" />
                  Musicothérapie
                </CardTitle>
                <CardDescription>
                  Sons adaptés à votre état émotionnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/20 p-4">
                  <h3 className="font-medium text-purple-700 dark:text-purple-300">Playlist recommandée</h3>
                  <p className="text-sm text-muted-foreground mt-1">Calme et Confiance</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm">14 morceaux · 48 min</span>
                    <Button size="sm" variant="secondary" className="bg-white/80 dark:bg-purple-900/50">
                      Écouter
                    </Button>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
                  onClick={() => navigate('/b2c/music')}
                >
                  Explorer la musicothérapie
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Daily Coaching Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/10 dark:to-orange-900/20 border-amber-100 dark:border-amber-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-amber-500" />
                  Coach IA personnel
                </CardTitle>
                <CardDescription>
                  Suggestion personnalisée du jour
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 border border-amber-200 dark:border-amber-800/50 rounded-lg bg-white/60 dark:bg-black/20">
                  <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">Respiration guidée</h4>
                  <p className="text-sm">Une séance de 5 minutes pour vous aider à conserver votre calme et rester concentré.</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-amber-600 dark:text-amber-400 mt-1"
                    onClick={() => navigate('/b2c/coach')}
                  >
                    Commencer maintenant →
                  </Button>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none"
                  onClick={() => navigate('/b2c/coach-chat')}
                >
                  Parler à mon coach
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Inspirational Quote */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <Card className="overflow-hidden bg-gradient-to-br from-green-50/80 to-teal-50/80 dark:from-green-900/10 dark:to-teal-900/20 border-green-100 dark:border-green-900/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookCheck className="h-6 w-6 mr-2 text-green-500" />
                  Citation inspirante
                </CardTitle>
                <CardDescription>
                  Pour vous accompagner aujourd'hui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <blockquote className="p-6 bg-white/60 dark:bg-white/5 rounded-lg border border-green-100 dark:border-green-900/30 relative">
                  <motion.div 
                    className="absolute top-2 left-2 text-5xl text-green-200 dark:text-green-900/30 font-serif"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    "
                  </motion.div>
                  <motion.p 
                    className="italic text-lg relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    {inspirationalQuote.text}
                  </motion.p>
                  <motion.footer 
                    className="mt-4 text-right text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                  >
                    — {inspirationalQuote.author}
                  </motion.footer>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Recent Activities */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/10 dark:to-blue-900/20 border-gray-100 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle>Activités récentes</CardTitle>
                <CardDescription>
                  Vos dernières interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'journal' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' :
                        activity.type === 'music' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300' :
                        'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                        {activity.mood}
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
                    Voir tout l'historique
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickModules.map((module, i) => (
              <motion.div
                key={module.title}
                className="cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(module.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="flex flex-col items-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border hover:shadow-lg transition-all">
                  <div className={`p-3 rounded-full ${module.color} mb-3`}>
                    {module.icon}
                  </div>
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {module.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
