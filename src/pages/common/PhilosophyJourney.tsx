
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Users, Target, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const PhilosophyJourney: React.FC = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Bienveillance",
      description: "Nous croyons en une approche empathique et respectueuse du bien-être émotionnel",
      features: ["Écoute active", "Respect des émotions", "Accompagnement personnalisé"]
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Innovation IA",
      description: "L'intelligence artificielle au service de la compréhension humaine",
      features: ["Analyse émotionnelle avancée", "Recommandations personnalisées", "Apprentissage adaptatif"]
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté",
      description: "Ensemble, nous créons un environnement de soutien et de croissance",
      features: ["Partage d'expériences", "Entraide collective", "Événements bien-être"]
    },
    {
      icon: <Target className="h-8 w-8 text-purple-500" />,
      title: "Personnalisation",
      description: "Chaque parcours émotionnel est unique et mérite une approche sur mesure",
      features: ["Profil émotionnel", "Objectifs personnalisés", "Suivi adaptatif"]
    }
  ];

  const values = [
    "Transparence dans nos processus",
    "Protection des données personnelles",
    "Recherche scientifique continue",
    "Accessibilité pour tous",
    "Innovation responsable"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-8 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Notre Philosophie
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              EmotionsCare s'appuie sur une vision holistique du bien-être émotionnel, 
              alliant technologie de pointe et approche humaine pour créer un écosystème 
              de soutien émotionnel accessible et efficace.
            </motion.p>
          </div>

          {/* Principles Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600">
                        {principle.icon}
                      </div>
                      <CardTitle className="text-2xl">{principle.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {principle.description}
                    </p>
                    <ul className="space-y-2">
                      {principle.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Notre Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-6">
                  Démocratiser l'accès au bien-être émotionnel en proposant des outils 
                  innovants, personnalisés et basés sur la science. Nous accompagnons 
                  chaque individu dans sa quête d'équilibre émotionnel, que ce soit 
                  dans sa vie personnelle ou professionnelle.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/b2c/login')}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    Découvrir l'espace personnel
                  </Button>
                  <Button 
                    onClick={() => navigate('/b2b/selection')}
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    Solutions entreprise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="max-w-4xl mx-auto border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">Nos Valeurs</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {values.map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyJourney;
