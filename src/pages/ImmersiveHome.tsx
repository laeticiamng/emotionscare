
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  BookOpen, 
  Music, 
  Headphones, 
  MessageSquare, 
  Users, 
  BarChart2, 
  Calendar,
  Settings,
  Glasses,
  PieChart
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const navigateToDashboard = () => {
    navigate(userMode ? getModeDashboardPath(userMode) : '/choose-mode');
  };
  
  const navigateToFeature = (path: string) => {
    navigate(path);
  };

  const features = [
    { title: 'Scanner', icon: <Heart className="h-8 w-8 mb-2" />, path: '/scan', color: 'bg-pink-100 dark:bg-pink-900' },
    { title: 'Journal', icon: <BookOpen className="h-8 w-8 mb-2" />, path: '/journal', color: 'bg-blue-100 dark:bg-blue-900' },
    { title: 'Musique', icon: <Music className="h-8 w-8 mb-2" />, path: '/music', color: 'bg-purple-100 dark:bg-purple-900' },
    { title: 'Audio', icon: <Headphones className="h-8 w-8 mb-2" />, path: '/audio', color: 'bg-green-100 dark:bg-green-900' },
    { title: 'Coach', icon: <MessageSquare className="h-8 w-8 mb-2" />, path: '/coach', color: 'bg-yellow-100 dark:bg-yellow-900' },
    { title: 'VR', icon: <Glasses className="h-8 w-8 mb-2" />, path: '/vr', color: 'bg-indigo-100 dark:bg-indigo-900' },
    { title: 'Teams', icon: <Users className="h-8 w-8 mb-2" />, path: '/teams', color: 'bg-orange-100 dark:bg-orange-900' },
    { title: 'Rapports', icon: <BarChart2 className="h-8 w-8 mb-2" />, path: '/reports', color: 'bg-red-100 dark:bg-red-900' },
    { title: 'Événements', icon: <Calendar className="h-8 w-8 mb-2" />, path: '/events', color: 'bg-teal-100 dark:bg-teal-900' },
    { title: 'Social', icon: <Users className="h-8 w-8 mb-2" />, path: '/social', color: 'bg-violet-100 dark:bg-violet-900' },
    { title: 'Organisation', icon: <PieChart className="h-8 w-8 mb-2" />, path: '/organization', color: 'bg-amber-100 dark:bg-amber-900' },
    { title: 'Paramètres', icon: <Settings className="h-8 w-8 mb-2" />, path: '/settings', color: 'bg-gray-100 dark:bg-gray-900' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <div className="relative w-full min-h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-60" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center max-w-3xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            EmotionsCare
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Prenez soin de votre bien-être émotionnel avec notre plateforme complète
          </motion.p>
          
          <motion.div 
            className="flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <Button 
              onClick={navigateToDashboard} 
              size="lg"
              className="text-lg"
            >
              Tableau de bord
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/choose-mode')} 
              size="lg"
              className="text-lg"
            >
              Changer de mode
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Explorez toutes nos fonctionnalités
        </motion.h2>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
              className={`${feature.color} rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => navigateToFeature(feature.path)}
            >
              {feature.icon}
              <h3 className="font-medium">{feature.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
