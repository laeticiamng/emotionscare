
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Briefcase, Building2, Heart, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Analyse émotionnelle",
      description: "IA avancée pour comprendre vos émotions"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Coach personnalisé",
      description: "Accompagnement adapté à vos besoins"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Sécurisé et confidentiel",
      description: "Vos données protégées par les standards les plus élevés"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-semibold">EmotionsCare</span>
          </div>
          <Button onClick={() => navigate('/choose-mode')} variant="outline">
            Se connecter
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Découvrez comment notre plateforme utilise l'intelligence artificielle pour analyser vos émotions et vous proposer des solutions personnalisées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/choose-mode')}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Commencer maintenant
            </Button>
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg"
            >
              Solutions entreprise
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mode Selection */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Choisissez votre mode d'utilisation</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2c/login')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <CardTitle>Particulier</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Accédez à toutes les fonctionnalités personnalisables pour votre bien-être émotionnel
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/selection')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle>Collaborateur</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Utilisez EmotionsCare dans le cadre de votre entreprise ou organisation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/b2b/selection')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4">
                <Building2 className="h-8 w-8" />
              </div>
              <CardTitle>Administration</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                Gérez EmotionsCare pour votre entreprise et accédez aux analyses avancées
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
