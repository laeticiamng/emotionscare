
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart2, Calendar, BookOpen, 
  Music, MessageSquare, AlertCircle, CheckCircle,
  Bell, Settings, User, LogOut, Smile, Frown, 
  Meh, TrendingUp, Award, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Mock data
const mockMoodData = [
  { day: 'Lun', value: 75 },
  { day: 'Mar', value: 60 },
  { day: 'Mer', value: 85 },
  { day: 'Jeu', value: 70 },
  { day: 'Ven', value: 90 },
];

const mockTeamMood = {
  overall: 78,
  trend: 'up',
  members: 12,
  active: 8,
  status: 'Bon',
};

const mockNotifications = [
  { 
    id: 1, 
    title: 'Nouvelle méditation disponible', 
    description: 'Découvrez notre nouveau module de méditation guidée.', 
    time: '12 min', 
    read: false 
  },
  { 
    id: 2, 
    title: 'Badge débloqué', 
    description: 'Félicitations ! Vous avez débloqué le badge "Zen Master".', 
    time: '1h', 
    read: false 
  },
  { 
    id: 3, 
    title: 'Rappel journal émotionnel', 
    description: 'Pensez à compléter votre journal émotionnel aujourd\'hui.', 
    time: '3h', 
    read: true 
  },
];

const mockTasks = [
  { id: 1, title: 'Complétez votre profil', completed: true },
  { id: 2, title: 'Renseignez votre journal émotionnel', completed: false },
  { id: 3, title: 'Essayez une session de méditation', completed: false },
  { id: 4, title: 'Participez au questionnaire d\'équipe', completed: false },
];

const mockModules = [
  { 
    id: 'journal', 
    title: 'Journal émotionnel',
    description: 'Suivez vos émotions au quotidien',
    icon: BookOpen,
    color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    new: false 
  },
  { 
    id: 'music', 
    title: 'Musicothérapie',
    description: 'Sons apaisants pour le travail',
    icon: Music,
    color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    new: true 
  },
  { 
    id: 'coach', 
    title: 'Coach IA',
    description: 'Votre assistant personnel',
    icon: MessageSquare,
    color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    new: false 
  },
  { 
    id: 'team', 
    title: 'Équipe',
    description: 'Bien-être collectif',
    icon: Users,
    color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    new: false 
  },
];

const mockUpcomingEvents = [
  { 
    id: 1, 
    title: 'Atelier gestion du stress', 
    date: 'Demain, 14h00', 
    duration: '1h', 
    participants: 8 
  },
  { 
    id: 2, 
    title: 'Séance de méditation guidée', 
    date: 'Jeudi, 12h30', 
    duration: '30min', 
    participants: 5 
  },
];

const B2BUserPremiumDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  // Get current time for contextual greeting
  const currentHour = new Date().getHours();
  let greeting = 'Bonjour';
  if (currentHour < 12) greeting = 'Bonjour';
  else if (currentHour < 18) greeting = 'Bon après-midi';
  else greeting = 'Bonsoir';
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    // Hide welcome message after 5 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(welcomeTimer);
    };
  }, []);
  
  // Calculate mood icon based on value
  const getMoodIcon = (value: number) => {
    if (value >= 80) return <Smile className="h-6 w-6 text-green-500" />;
    if (value >= 50) return <Meh className="h-6 w-6 text-amber-500" />;
    return <Frown className="h-6 w-6 text-red-500" />;
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur EmotionsCare !",
        variant: "default",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur de déconnexion",
        description: "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  
  // Render loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
            <div className="space-y-6">
              <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
              <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div 
                className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ repeat: 3, repeatType: "reverse", duration: 0.8 }}
              >
                <Users className="h-10 w-10 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Bienvenue dans votre espace Collaborateur
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Votre bien-être émotionnel au travail nous tient à cœur
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold">{greeting}, {user?.name?.split(' ')[0] || 'Collaborateur'}</h1>
            <p className="text-muted-foreground">Votre espace bien-être professionnel</p>
          </div>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full h-12 w-12 bg-background border-muted-foreground/20"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-64 glass-card rounded-xl border border-border z-10"
                  initial={{ scale: 0.95, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4 border-b border-border">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to profile
                      }}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Mon profil
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to settings
                      }}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Paramètres
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Votre humeur</CardTitle>
                  <CardDescription>Moyenne des 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        {getMoodIcon(85)}
                        <span className="text-2xl font-bold ml-2">85%</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+10% cette semaine</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end h-16 gap-1">
                      {mockMoodData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-6 rounded-sm bg-green-100 dark:bg-green-900/30"
                            style={{ height: `${day.value * 0.16}px` }}
                          ></div>
                          <span className="text-xs text-muted-foreground">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Humeur collective</CardTitle>
                  <CardDescription>Moyenne de l'équipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        {getMoodIcon(mockTeamMood.overall)}
                        <span className="text-2xl font-bold ml-2">{mockTeamMood.overall}%</span>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Statut: <span className="font-medium text-amber-500">{mockTeamMood.status}</span>
                      </div>
                    </div>
                    
                    <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{mockTeamMood.active}/{mockTeamMood.members} actifs</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Concentration</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-1.5" />
                    
                    <div className="flex justify-between text-xs">
                      <span>Motivation</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-1.5" />
                    
                    <div className="flex justify-between text-xs">
                      <span>Satisfaction</span>
                      <span>70%</span>
                    </div>
                    <Progress value={70} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Progression</CardTitle>
                  <CardDescription>Vos objectifs bien-être</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progression globale</span>
                      <span className="text-sm font-medium">2/5</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {mockTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center gap-2 text-sm p-2 rounded-lg ${task.completed ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-muted'}`}
                      >
                        {task.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground"></div>
                        )}
                        <span className={task.completed ? 'line-through' : ''}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Modules bien-être</CardTitle>
                  <CardDescription>
                    Découvrez nos outils pour votre équilibre émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockModules.map((module) => (
                      <div 
                        key={module.id}
                        className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`w-12 h-12 rounded-full ${module.color} flex items-center justify-center`}>
                            <module.icon className="h-6 w-6" />
                          </div>
                          
                          {module.new && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-lg">{module.title}</h3>
                        <p className="text-muted-foreground text-sm">{module.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Notifications</CardTitle>
                    <Badge variant="outline" className="rounded-full">
                      {mockNotifications.filter(n => !n.read).length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="max-h-72 overflow-auto">
                  {mockNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <Bell className="h-10 w-10 mb-3 opacity-50" />
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mockNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'bg-muted/50'} relative`}
                        >
                          {!notification.read && (
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500"></span>
                          )}
                          
                          <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.description}
                          </p>
                          
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Il y a {notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle>Événements à venir</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockUpcomingEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                      <Calendar className="h-10 w-10 mb-3 opacity-50" />
                      <p>Aucun événement prévu</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mockUpcomingEvents.map((event) => (
                        <div 
                          key={event.id}
                          className="p-3 bg-muted/50 rounded-lg"
                        >
                          <p className="text-sm font-medium">
                            {event.title}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{event.date}</span>
                            </div>
                            
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{event.participants}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Recent activity & insights */}
          <motion.div variants={itemVariants}>
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Insights & Recommandations</CardTitle>
                    <CardDescription>
                      Basé sur votre activité récente et vos données
                    </CardDescription>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Tout voir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="insights">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="badges">Badges</TabsTrigger>
                    <TabsTrigger value="achievements">Réussites</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="insights" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="glass-card rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full p-2">
                            <BarChart2 className="h-5 w-5" />
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm">Productivité optimale</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Vos pics de concentration sont entre 10h et 12h. Planifiez vos tâches importantes durant cette période.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-card rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full p-2">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm">Risque de stress</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Nous avons détecté un niveau élevé de stress mardi. Essayez une session de musicothérapie pour vous apaiser.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-card rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full p-2">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm">Progression émotionnelle</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Votre score de résilience a progressé de 12% ce mois-ci. Continuez vos pratiques actuelles !
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="badges" className="mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center text-center p-4 glass-card rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-3">
                          <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="font-medium text-sm">Zen Master</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          5 méditations complétées
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 glass-card rounded-xl opacity-50">
                        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-3">
                          <Smile className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-medium text-sm">Positivité</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          7 jours consécutifs de bonne humeur
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 glass-card rounded-xl opacity-50">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                          <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-medium text-sm">Scribe</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Journal émotionnel complété 10 fois
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 glass-card rounded-xl opacity-50">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-3">
                          <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h4 className="font-medium text-sm">Team Player</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Participé à 3 activités d'équipe
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="mt-0">
                    <div className="space-y-3">
                      <div className="glass-card rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full p-2">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            
                            <div>
                              <h4 className="font-medium">Premier journal</h4>
                              <p className="text-xs text-muted-foreground">
                                Vous avez complété votre premier journal émotionnel
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            il y a 3 jours
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-card rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full p-2">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            
                            <div>
                              <h4 className="font-medium">Profil complété</h4>
                              <p className="text-xs text-muted-foreground">
                                Vous avez complété votre profil à 100%
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            il y a 1 semaine
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BUserPremiumDashboard;
