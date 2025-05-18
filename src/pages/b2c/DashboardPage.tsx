
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Brain, Calendar, FileText, Music, Activity, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MusicPlayer from '@/components/music/MusicPlayer';
import RecommendedPresets from '@/components/music/RecommendedPresets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusic } from '@/contexts/music';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { TrendingUp } from 'lucide-react';

// Composant pour le widget de journal rapide
const QuickJournalWidget = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-500" />
          Journal émotionnel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Comment vous sentez-vous aujourd'hui ? Prenez un moment pour noter vos émotions et réflexions.
        </p>
        <Button 
          onClick={() => navigate('/b2c/journal')}
          className="w-full"
        >
          Ouvrir mon journal
        </Button>
      </CardContent>
    </Card>
  );
};

// Composant pour le widget de météo émotionnelle
const EmotionalWeatherWidget = () => {
  const emotions = {
    main: "Calme",
    secondary: "Concentré",
    intensity: 75,
    trend: "stable"
  };
  
  const getEmotionColor = () => {
    switch(emotions.main.toLowerCase()) {
      case "calme": return "bg-blue-100 text-blue-700";
      case "joyeux": return "bg-yellow-100 text-yellow-700";
      case "énergique": return "bg-green-100 text-green-700";
      case "fatigué": return "bg-purple-100 text-purple-700";
      case "stressé": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };
  
  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <Brain className="h-5 w-5 mr-2 text-blue-500" />
          Météo émotionnelle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <div className={`px-4 py-2 rounded-full mb-2 ${getEmotionColor()}`}>
            {emotions.main}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            avec une touche de {emotions.secondary}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${emotions.intensity}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground">
            Tendance: {emotions.trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant pour le widget musical
const MusicWidget = () => {
  const { currentTrack, isPlaying } = useMusic();
  
  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <Music className="h-5 w-5 mr-2 text-blue-500" />
          Musique adaptative
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {currentTrack ? (
          <div className="mb-4">
            <MusicPlayer />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Découvrez des playlists adaptées à votre humeur du moment.
          </p>
        )}
        <RecommendedPresets />
      </CardContent>
    </Card>
  );
};

// Composant pour le widget SocialCocon
const SocialCoconWidget = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          SocialCocon
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Rejoignez votre communauté bienveillante et partagez vos expériences.
        </p>
        <Button 
          onClick={() => navigate('/b2c/social-cocon')}
          className="w-full"
          variant="outline"
        >
          Accéder au SocialCocon
        </Button>
      </CardContent>
    </Card>
  );
};

// Composant pour le widget de coach IA
const AICoachWidget = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Coach IA
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Obtenez des conseils personnalisés et des exercices adaptés à votre état émotionnel.
        </p>
        <Button 
          onClick={() => navigate('/b2c/coach')}
          className="w-full"
        >
          Discuter avec mon coach
        </Button>
      </CardContent>
    </Card>
  );
};

const OptimizationWidget = () => {
  const navigate = useNavigate();

  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Amélioration continue
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Consultez vos statistiques d'usage et recevez des suggestions personnalisées.
        </p>
        <Button onClick={() => navigate('/optimisation')} className="w-full" variant="outline">
          Voir mon reporting
        </Button>
      </CardContent>
    </Card>
  );
};

// Composant pour le widget timeline
const TimelineWidget = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="premium-card interactive-card">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          Timeline émotionnelle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Visualisez l'évolution de vos émotions et identifiez les tendances.
        </p>
        <Button 
          onClick={() => navigate('/b2c/timeline')}
          className="w-full"
          variant="outline"
        >
          Voir ma timeline
        </Button>
      </CardContent>
    </Card>
  );
};

// Page principale
const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  // Message de bienvenue dynamique
  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    let timeBasedGreeting = "Bonjour";
    
    if (currentHour < 5) timeBasedGreeting = "Bonne nuit";
    else if (currentHour < 12) timeBasedGreeting = "Bonjour";
    else if (currentHour < 18) timeBasedGreeting = "Bon après-midi";
    else timeBasedGreeting = "Bonsoir";
    
    return `${timeBasedGreeting}, ${user?.displayName || preferences.displayName || 'utilisateur'}`;
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-3xl premium-gradient shadow-soft-blue">
        <img
          src="/images/vr-banner-bg.jpg"
          alt="Bienvenue"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative p-8">
          <DashboardHeader user={user} />
          <p className="text-muted-foreground mt-2">
            {getWelcomeMessage()}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList>
          <TabsTrigger value="dashboard">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-4">
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <EmotionalWeatherWidget />
            <QuickJournalWidget />
            <MusicWidget />
            <SocialCoconWidget />
            <AICoachWidget />
            <TimelineWidget />
            <OptimizationWidget />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="emotions" className="mt-4">
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <EmotionalWeatherWidget />
            <TimelineWidget />
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Carte des émotions</CardTitle>
                </CardHeader>
                <CardContent className="h-64 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Button onClick={() => navigate('/b2c/world')}>
                    Explorer la carte des émotions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-4">
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
           <QuickJournalWidget />
           <AICoachWidget />
           <SocialCoconWidget />
            <OptimizationWidget />
           <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Sessions à venir
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vous n'avez pas de sessions planifiées. Organisez votre première session !
                  </p>
                  <Button className="mt-4 w-full" variant="outline">
                    Planifier une session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          "La plus grande découverte de ma génération est que les êtres humains peuvent modifier leur vie en modifiant leur état d'esprit." - William James
        </p>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
