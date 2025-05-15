
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, Smile, Music, BookOpen, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { TimeBasedBackground } from '@/components/home/TimeBasedBackground';
import { AudioController } from '@/components/home/audio/AudioController';
import { useAuth } from '@/contexts/AuthContext';

const B2CDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    // Clear session
    localStorage.removeItem('auth_session');
    localStorage.removeItem('user_role');
    localStorage.removeItem('userMode');
    
    if (logout) {
      logout();
    }
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    
    navigate('/');
  };
  
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
  
  const currentEmotion = {
    score: 7.8,
    label: "Confiance",
    suggestion: "Une courte séance de respiration guidée vous aiderait à maintenir cette énergie positive tout au long de la journée.",
  };
  
  const inspirationalQuote = {
    text: "La paix intérieure commence au moment où vous choisissez de ne pas permettre à une autre personne ou à un événement de contrôler vos émotions.",
    author: "Anonyme",
  };
  
  return (
    <TimeBasedBackground>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="absolute top-4 right-4 z-10">
          <AudioController autoplay={true} initialVolume={0.2} />
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tableau de bord personnel
          </motion.h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
        
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
                  <Smile className="h-6 w-6 mr-2 text-blue-500" />
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
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
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
                  <Button variant="link" className="p-0 h-auto text-amber-600 dark:text-amber-400 mt-1">
                    Commencer maintenant →
                  </Button>
                </div>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none">
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
                  <Calendar className="h-6 w-6 mr-2 text-green-500" />
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
          
          {/* User Info */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-gray-50/80 to-blue-50/80 dark:from-gray-900/10 dark:to-blue-900/20 border-gray-100 dark:border-gray-800/50">
              <CardHeader>
                <CardTitle>Votre profil</CardTitle>
                <CardDescription>
                  Paramètres et préférences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Connecté en tant que</p>
                    <p className="text-sm text-muted-foreground">utilisateur@exemple.fr</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mode préféré</p>
                    <p className="text-sm text-muted-foreground">Particulier (B2C)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Préférences
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Journal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </TimeBasedBackground>
  );
};

export default B2CDashboard;
