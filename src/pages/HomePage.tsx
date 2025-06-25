
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Music, BookOpen, Settings, Users, Play, Zap, Timer, Waves, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string, featureName: string) => {
    try {
      navigate(path);
      toast.success(`Redirection vers ${featureName}`);
    } catch (error) {
      toast.error(`Erreur lors de la navigation vers ${featureName}`);
    }
  };

  const mainFeatures = [
    {
      id: 'scan',
      title: 'Scanner Émotionnel',
      description: 'Analysez votre état émotionnel avec notre IA avancée',
      icon: Brain,
      path: '/scan',
      color: 'bg-blue-500',
      badge: 'IA Powered'
    },
    {
      id: 'music',
      title: 'Musicothérapie',
      description: 'Musique thérapeutique adaptée à vos besoins',
      icon: Music,
      path: '/music',
      color: 'bg-purple-500',
      badge: 'Adaptatif'
    },
    {
      id: 'journal',
      title: 'Journal Personnel',
      description: 'Suivez votre progression et vos réflexions',
      icon: BookOpen,
      path: '/journal',
      color: 'bg-green-500',
      badge: 'Privé'
    },
    {
      id: 'coach',
      title: 'Coach IA',
      description: 'Accompagnement personnalisé par intelligence artificielle',
      icon: Heart,
      path: '/coach',
      color: 'bg-red-500',
      badge: 'Personnalisé'
    },
    {
      id: 'vr',
      title: 'Réalité Virtuelle',
      description: 'Expériences immersives de relaxation',
      icon: Settings,
      path: '/vr',
      color: 'bg-indigo-500',
      badge: 'Immersif'
    }
  ];

  const quickAccess = [
    { id: 'b2c', title: 'Espace Personnel', path: '/b2c', icon: Heart },
    { id: 'b2b-selection', title: 'Entreprise', path: '/b2b-selection', icon: Users },
    { id: 'boss-level-grit', title: 'Boss Level Grit', path: '/boss-level-grit', icon: Zap },
    { id: 'bounce-back-battle', title: 'Bounce Back Battle', path: '/bounce-back-battle', icon: Timer },
    { id: 'story-synth-lab', title: 'Story Synth Lab', path: '/story-synth-lab', icon: Waves },
    { id: 'screen-silk-break', title: 'Screen Silk Break', path: '/screen-silk-break', icon: Mountain },
    { id: 'flash-glow', title: 'Flash Glow', path: '/flash-glow', icon: Play }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          EmotionsCare
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Votre plateforme complète de bien-être émotionnel avec IA, musicothérapie et réalité virtuelle
        </p>
      </motion.div>

      {/* Fonctionnalités principales */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Fonctionnalités Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              data-testid={`feature-${feature.id}`}
            >
              <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${feature.color} text-white`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => handleNavigation(feature.path, feature.title)}
                  >
                    Accéder <Play className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Accès rapide */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Accès Rapide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {quickAccess.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              data-testid={`quick-access-${item.id}`}
            >
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleNavigation(item.path, item.title)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs text-center">{item.title}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistiques */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Votre Progression Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Scans émotionnels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Minutes de musique</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Entrées journal</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-600">Sessions VR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-16 pb-8">
        <p className="text-gray-500 text-sm">
          EmotionsCare - Votre bien-être émotionnel au quotidien
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
