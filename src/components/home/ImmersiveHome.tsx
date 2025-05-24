
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Music, BookOpen, Users, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ImmersiveHome: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Scan Émotionnel',
      description: 'Analysez vos émotions avec notre IA avancée',
      action: () => navigate('/scan'),
      color: 'bg-blue-500'
    },
    {
      icon: Music,
      title: 'Musicothérapie',
      description: 'Découvrez des playlists adaptées à votre état émotionnel',
      action: () => navigate('/music'),
      color: 'bg-purple-500'
    },
    {
      icon: BookOpen,
      title: 'Journal Personnel',
      description: 'Tenez un journal de vos émotions et progrès',
      action: () => navigate('/journal'),
      color: 'bg-green-500'
    },
    {
      icon: Heart,
      title: 'Coach IA',
      description: 'Obtenez des conseils personnalisés de votre coach virtuel',
      action: () => navigate('/coach'),
      color: 'bg-red-500'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Connectez-vous avec d\'autres utilisateurs',
      action: () => navigate('/community'),
      color: 'bg-orange-500'
    },
    {
      icon: Sparkles,
      title: 'Méditation',
      description: 'Pratiques guidées pour votre bien-être',
      action: () => navigate('/meditation'),
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {greeting} ! Bienvenue sur EmotionsCare
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Votre plateforme de bien-être émotionnel powered by AI. 
            Découvrez des outils personnalisés pour améliorer votre santé mentale.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Se connecter
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/register')}
              >
                S'inscrire gratuitement
              </Button>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="h-full"
            >
              <Card className="h-full cursor-pointer transition-all hover:shadow-lg" onClick={feature.action}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Notre Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">50,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Scans émotionnels</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Satisfaction utilisateur</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
