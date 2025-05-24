
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Brain, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PhilosophyJourney: React.FC = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Empathie",
      description: "Nous croyons que l'empathie est la clé d'une meilleure compréhension de soi et des autres."
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Innovation",
      description: "L'IA au service du bien-être émotionnel pour des solutions personnalisées et efficaces."
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Inclusivité",
      description: "Le bien-être émotionnel doit être accessible à tous, sans exception."
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: "Authenticité",
      description: "Nous encourageons l'authenticité dans l'expression et la gestion des émotions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Notre Philosophie
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chez EmotionsCare, nous croyons que chaque émotion a sa place et son importance. 
              Notre mission est de vous accompagner dans votre voyage vers un bien-être émotionnel durable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
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
                    <CardDescription className="text-base leading-relaxed">
                      {principle.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Notre Vision</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Nous imaginons un monde où chaque personne a accès aux outils et au soutien 
                  nécessaires pour comprendre, accepter et gérer ses émotions de manière saine et constructive.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Grâce à l'intelligence artificielle et aux avancées en psychologie positive, 
                  nous créons des expériences personnalisées qui respectent l'unicité de chaque individu.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Notre approche combine science, technologie et humanité pour offrir un accompagnement 
                  authentique et efficace dans votre parcours de bien-être émotionnel.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PhilosophyJourney;
