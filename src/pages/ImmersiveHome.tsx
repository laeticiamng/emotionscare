
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building, Brain, Music, Scan, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Scan className="h-8 w-8 text-blue-500" />,
      title: "Scanner d'émotions",
      description: "Analysez vos émotions avec l'IA"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-500" />,
      title: "Coach IA",
      description: "Accompagnement personnalisé"
    },
    {
      icon: <Music className="h-8 w-8 text-purple-500" />,
      title: "Musique thérapeutique",
      description: "Sons apaisants personnalisés"
    },
    {
      icon: <Brain className="h-8 w-8 text-indigo-500" />,
      title: "Suivi émotionnel",
      description: "Tableau de bord personnalisé"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            EmotionsCare
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Votre compagnon de bien-être émotionnel powered by AI
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Choisissez votre parcours pour commencer votre voyage vers un meilleur équilibre émotionnel
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
        >
          <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/b2c/login')}>
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-4">Parcours Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Découvrez et gérez vos émotions avec nos outils personnalisés
              </p>
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Commencer mon parcours
              </Button>
            </CardContent>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/b2b/selection')}>
            <CardHeader>
              <Building className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-4">Espace Entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Améliorez le bien-être de vos équipes et collaborateurs
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Accéder à l'espace entreprise
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Nos outils de bien-être
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/about')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              À propos
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/philosophy')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Notre philosophie
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/contact')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Contact
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/faq')}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              FAQ
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
