
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Building2, Heart, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Scanner d'émotions",
      description: "Analysez vos émotions par texte, audio ou émojis avec l'IA"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Bien-être personnalisé",
      description: "Recommandations adaptées à votre profil émotionnel"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Suivi en temps réel",
      description: "Tableaux de bord interactifs pour suivre votre évolution"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EmotionsCare</span>
          </div>
          <Button onClick={() => navigate('/choose-mode')} className="bg-blue-600 hover:bg-blue-700">
            Commencer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Votre bien-être émotionnel, 
            <span className="text-blue-600"> notre priorité</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            EmotionsCare vous accompagne dans la compréhension et l'amélioration de votre bien-être émotionnel grâce à l'intelligence artificielle.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              onClick={() => navigate('/choose-mode')} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Découvrir EmotionsCare
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/b2b/selection')}
              className="px-8 py-3"
            >
              Espace Entreprise
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 px-4 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={itemVariants}
          >
            Pourquoi choisir EmotionsCare ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Target Audience Section */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={itemVariants}
          >
            Qui peut utiliser EmotionsCare ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/choose-mode')}>
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <CardTitle>Particuliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4">
                    Prenez soin de votre bien-être émotionnel avec des outils personnalisés
                  </CardDescription>
                  <Button variant="outline" className="w-full">
                    Accéder à l'espace personnel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/selection')}>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <CardTitle>Collaborateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4">
                    Améliorez votre bien-être au travail et connectez-vous avec vos équipes
                  </CardDescription>
                  <Button variant="outline" className="w-full">
                    Espace collaborateur
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/selection')}>
                <CardHeader className="text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <CardTitle>Entreprises</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4">
                    Gérez le bien-être de vos équipes avec des outils d'administration avancés
                  </CardDescription>
                  <Button variant="outline" className="w-full">
                    Espace administration
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 bg-blue-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            variants={itemVariants}
          >
            Prêt à commencer votre parcours bien-être ?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            variants={itemVariants}
          >
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button 
              onClick={() => navigate('/choose-mode')} 
              size="lg" 
              variant="secondary"
              className="px-8 py-3"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">EmotionsCare</span>
          </div>
          <p className="text-gray-400">
            © 2024 EmotionsCare. Votre bien-être émotionnel, notre engagement.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
