
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, Music, Headphones, MessageCircle, Glasses, HeartHandshake,
  Activity, Calendar, Users, Award, Puzzle, Settings
} from 'lucide-react';

const FeatureHub: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Définir les cartes de fonctionnalités
  const features = [
    {
      id: 'journal',
      title: 'Journal Émotionnel',
      description: 'Suivez et analysez vos émotions quotidiennes pour mieux vous comprendre',
      icon: <BookOpen className="h-12 w-12 text-blue-500" />,
      path: '/journal',
      color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      iconColor: 'text-blue-500',
      requireAuth: true
    },
    {
      id: 'music',
      title: 'Musique Thérapeutique',
      description: 'Écoutez des sélections musicales adaptées à votre état émotionnel',
      icon: <Music className="h-12 w-12 text-indigo-500" />,
      path: '/music',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
      iconColor: 'text-indigo-500',
      requireAuth: true
    },
    {
      id: 'audio',
      title: 'Audio Guidances',
      description: 'Méditations et exercices de relaxation audio guidés',
      icon: <Headphones className="h-12 w-12 text-purple-500" />,
      path: '/audio',
      color: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      iconColor: 'text-purple-500',
      requireAuth: true
    },
    {
      id: 'coach',
      title: 'Coach Émotionnel',
      description: 'Consultez un coach personnel pour votre bien-être émotionnel',
      icon: <MessageCircle className="h-12 w-12 text-green-500" />,
      path: '/coach',
      color: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
      iconColor: 'text-green-500',
      requireAuth: true
    },
    {
      id: 'vr',
      title: 'Expérience VR',
      description: 'Immergez-vous dans des environnements apaisants en réalité virtuelle',
      icon: <Glasses className="h-12 w-12 text-cyan-500" />,
      path: '/vr',
      color: 'bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
      iconColor: 'text-cyan-500',
      requireAuth: true
    },
    {
      id: 'social',
      title: 'Social Cocoon',
      description: 'Rejoignez une communauté de soutien et partagez vos expériences',
      icon: <HeartHandshake className="h-12 w-12 text-pink-500" />,
      path: '/social',
      color: 'bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30',
      iconColor: 'text-pink-500',
      requireAuth: true
    },
    {
      id: 'dashboard',
      title: 'Tableau de Bord',
      description: 'Visualisez vos progrès et statistiques de bien-être',
      icon: <Activity className="h-12 w-12 text-amber-500" />,
      path: '/dashboard',
      color: 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30',
      iconColor: 'text-amber-500',
      requireAuth: true
    },
    {
      id: 'sessions',
      title: 'Sessions Programmées',
      description: 'Planifiez et gérez vos sessions de bien-être',
      icon: <Calendar className="h-12 w-12 text-orange-500" />,
      path: '/sessions',
      color: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30',
      iconColor: 'text-orange-500',
      requireAuth: true
    },
    {
      id: 'teams',
      title: 'Gestion d\'Équipe',
      description: 'Pour les professionnels et entreprises',
      icon: <Users className="h-12 w-12 text-teal-500" />,
      path: '/teams',
      color: 'bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30',
      iconColor: 'text-teal-500',
      requireAuth: true,
      b2bOnly: true
    },
    {
      id: 'gamification',
      title: 'Défis & Récompenses',
      description: 'Accomplissez des défis pour améliorer votre bien-être',
      icon: <Award className="h-12 w-12 text-yellow-500" />,
      path: '/gamification',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      iconColor: 'text-yellow-500',
      requireAuth: true
    },
    {
      id: 'extensions',
      title: 'Extensions',
      description: 'Découvrez des modules complémentaires pour personnaliser votre expérience',
      icon: <Puzzle className="h-12 w-12 text-violet-500" />,
      path: '/extensions',
      color: 'bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30',
      iconColor: 'text-violet-500',
      requireAuth: true
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Personnalisez votre expérience EmotionsCare',
      icon: <Settings className="h-12 w-12 text-gray-500" />,
      path: '/settings',
      color: 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70',
      iconColor: 'text-gray-500',
      requireAuth: true
    }
  ];
  
  // Filtrer les fonctionnalités en fonction de l'authentification
  const filteredFeatures = features.filter(feature => 
    !feature.requireAuth || (feature.requireAuth && isAuthenticated)
  );
  
  // Gérer la navigation vers les fonctionnalités
  const handleNavigateToFeature = (path: string, requireAuth: boolean) => {
    if (!isAuthenticated && requireAuth) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Centre de Fonctionnalités EmotionsCare
          </motion.h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explorez toutes les fonctionnalités disponibles pour améliorer votre bien-être émotionnel
          </motion.p>
        </div>
        
        {!isAuthenticated && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium">Connectez-vous pour accéder à toutes les fonctionnalités</h3>
                    <p className="text-muted-foreground">
                      Certaines fonctionnalités nécessitent un compte utilisateur
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Button onClick={() => navigate('/login')}>
                      Se connecter
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/register')}>
                      S'inscrire
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`h-full border hover:border-primary/50 transition-all duration-300 hover:shadow-md ${feature.color}`}
              >
                <CardHeader>
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleNavigateToFeature(feature.path, feature.requireAuth)}
                  >
                    Accéder
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mx-auto"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </Shell>
  );
};

export default FeatureHub;
