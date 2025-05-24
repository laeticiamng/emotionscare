
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Brain, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Bienveillance",
      description: "Nous plaçons l'humain au cœur de nos préoccupations"
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Innovation",
      description: "Nous utilisons les dernières avancées de l'IA pour le bien-être"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Confidentialité",
      description: "Vos données émotionnelles sont protégées et privées"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Accessibilité",
      description: "Le bien-être émotionnel doit être accessible à tous"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              À propos d'EmotionsCare
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Nous sommes une équipe passionnée qui développe des solutions innovantes 
              pour le bien-être émotionnel, en combinant intelligence artificielle 
              et approches thérapeutiques reconnues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">{value.icon}</div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Notre Mission</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  EmotionsCare naît de la conviction que le bien-être émotionnel 
                  est un droit fondamental qui devrait être accessible à tous. 
                  Notre plateforme combine les dernières avancées en intelligence 
                  artificielle avec des approches thérapeutiques éprouvées.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  Que vous soyez un particulier cherchant à mieux comprendre vos 
                  émotions ou une entreprise souhaitant améliorer le bien-être de 
                  vos équipes, nous vous accompagnons avec des outils personnalisés 
                  et respectueux de votre intimité.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Notre approche se base sur la science, l'empathie et l'innovation 
                  pour créer un environnement où chacun peut développer son 
                  intelligence émotionnelle et trouver son équilibre.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
