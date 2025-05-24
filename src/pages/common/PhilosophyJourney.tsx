
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, Target, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PhilosophyJourney: React.FC = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Bienveillance",
      description: "Nous croyons en une approche empathique et respectueuse du bien-être émotionnel"
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Innovation IA",
      description: "L'intelligence artificielle au service de la compréhension humaine"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté",
      description: "Ensemble, nous créons un environnement de soutien et de croissance"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: "Personnalisation",
      description: "Chaque parcours émotionnel est unique et mérite une approche sur mesure"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Notre Philosophie
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              EmotionsCare s'appuie sur une vision holistique du bien-être émotionnel, 
              alliant technologie de pointe et approche humaine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {principle.icon}
                      <CardTitle className="text-xl">{principle.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {principle.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Démocratiser l'accès au bien-être émotionnel en proposant des outils 
                  innovants, personnalisés et basés sur la science. Nous accompagnons 
                  chaque individu dans sa quête d'équilibre émotionnel, que ce soit 
                  dans sa vie personnelle ou professionnelle.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyJourney;
