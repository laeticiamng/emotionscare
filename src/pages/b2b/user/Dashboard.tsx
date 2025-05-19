
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Music, MessageCircle, CalendarClock, PieChart, Activity, BookOpen, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/theme';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const moduleList = [
  { 
    title: "Journal émotionnel", 
    description: "Suivez vos émotions au travail",
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    link: "/b2b/user/journal",
    color: "bg-blue-100 dark:bg-blue-900/20",
    badgeText: "Quotidien"
  },
  { 
    title: "Musique thérapeutique", 
    description: "Sons pour votre productivité",
    icon: <Music className="h-8 w-8 text-purple-500" />,
    link: "/b2b/user/music",
    color: "bg-purple-100 dark:bg-purple-900/20",
    badgeText: "Nouveau"
  },
  { 
    title: "Coach IA", 
    description: "Votre compagnon bien-être",
    icon: <MessageCircle className="h-8 w-8 text-green-500" />,
    link: "/b2b/user/coach",
    color: "bg-green-100 dark:bg-green-900/20",
    badgeText: "Conseils"
  },
  { 
    title: "Événements", 
    description: "Activités et challenges équipe",
    icon: <CalendarClock className="h-8 w-8 text-amber-500" />,
    link: "/b2b/user/events",
    color: "bg-amber-100 dark:bg-amber-900/20",
    badgeText: "À venir"
  },
  { 
    title: "Statistiques", 
    description: "Votre progression personnelle",
    icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
    link: "/b2b/user/statistics",
    color: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  { 
    title: "Profil & Préférences", 
    description: "Personnalisez votre expérience",
    icon: <Settings className="h-8 w-8 text-gray-500" />,
    link: "/b2b/user/settings",
    color: "bg-gray-100 dark:bg-gray-800",
  },
];

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('calme');
  const music = useMusic();
  
  // Déterminer le message d'accueil selon l'heure
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }
  }, []);
  
  // Modules avec ordre d'apparition décalé
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  const handleModuleClick = (moduleTitle: string, link: string) => {
    // Feedback tactile sur mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toast({
      title: `Accès au module ${moduleTitle}`,
      description: "Chargement de votre espace personnalisé...",
      duration: 2000
    });
    
    setTimeout(() => navigate(link), 300);
  };
  
  // Jouer de la musique adaptée à l'ambiance
  const handlePlayAmbientMusic = () => {
    music.loadPlaylistForEmotion(currentEmotion)
      .then((success) => {
        if (success) {
          toast({
            title: "Musique d'ambiance activée",
            description: `Playlist adaptée à l'ambiance ${currentEmotion} de l'équipe`,
            duration: 3000
          });
        }
      });
  };
  
  // Animation pour le message d'accueil
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-blue-200 dark:border-blue-800">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user?.name || "Photo de profil"} />
            ) : (
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xl">
                {user?.name?.charAt(0) || "C"}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {greeting}, <span className="text-blue-600 dark:text-blue-400">{user?.name?.split(' ')[0] || 'Collaborateur'}</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Voici l'ambiance <Badge variant="outline" className="ml-1 font-normal">{currentEmotion}</Badge> de votre équipe aujourd'hui
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handlePlayAmbientMusic} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Jouer la musique d'ambiance"
        >
          <Music className="mr-2 h-4 w-4" />
          Musique d'ambiance
        </Button>
      </motion.div>
      
      {/* Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {moduleList.map((module, index) => (
            <motion.div
              key={module.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="border border-gray-200 dark:border-gray-800 h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleModuleClick(module.title, module.link)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${module.color}`}>
                      {module.icon}
                    </div>
                    {module.badgeText && (
                      <Badge variant="secondary" className="ml-auto">
                        {module.badgeText}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-1">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400 -ml-2">
                    Explorer
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      className="ml-2"
                    >
                      →
                    </motion.span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Company updates */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/5 rounded-xl"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-blue-600" />
          Actualités de votre entreprise
        </h2>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Le programme de bien-être au travail a permis d'améliorer la satisfaction des équipes de 23% ce mois-ci.
            Participez à notre prochain atelier collaboratif pour partager vos idées !
          </p>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline">Voir les actualités</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboard;
