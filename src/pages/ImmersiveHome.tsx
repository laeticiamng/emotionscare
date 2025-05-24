
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Brain, Music, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Scanner émotionnel",
      description: "Analysez vos émotions en temps réel"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Coach IA",
      description: "Un accompagnement personnalisé"
    },
    {
      icon: <Music className="h-8 w-8 text-purple-500" />,
      title: "Musicothérapie",
      description: "Musique adaptée à votre état émotionnel"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté",
      description: "Partagez avec d'autres utilisateurs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Votre plateforme de bien-être émotionnel alimentée par l'intelligence artificielle. 
            Découvrez un nouveau niveau de conscience émotionnelle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/b2c/login')}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Accès Personnel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="outline" 
              size="lg"
            >
              Accès Entreprise
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/about')}>
              À propos
            </Button>
            <Button variant="ghost" onClick={() => navigate('/philosophy')}>
              Notre philosophie
            </Button>
            <Button variant="ghost" onClick={() => navigate('/contact')}>
              Contact
            </Button>
            <Button variant="ghost" onClick={() => navigate('/faq')}>
              FAQ
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
