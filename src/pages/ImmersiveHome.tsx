
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Building2, Brain, Music, Users, Star, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Scanner d'émotions IA",
      description: "Analysez vos émotions en temps réel avec notre technologie avancée"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Coach personnel",
      description: "Accompagnement personnalisé pour votre bien-être émotionnel"
    },
    {
      icon: <Music className="h-8 w-8 text-purple-500" />,
      title: "Musicothérapie adaptative",
      description: "Musique thérapeutique personnalisée selon votre état émotionnel"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté bienveillante",
      description: "Partagez et échangez dans un environnement sécurisé"
    }
  ];

  const stats = [
    { value: "10K+", label: "Utilisateurs actifs" },
    { value: "95%", label: "Satisfaction" },
    { value: "24/7", label: "Support disponible" },
    { value: "🔒", label: "Données protégées" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EmotionsCare
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                À propos
              </button>
              <button 
                onClick={() => navigate('/philosophy')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Philosophie
              </button>
              <button 
                onClick={() => navigate('/faq')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Votre bien-être émotionnel
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-200">
              reimaginé par l'IA
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Découvrez EmotionsCare, la plateforme qui révolutionne l'accompagnement 
            émotionnel grâce à l'intelligence artificielle. Analysez, comprenez et 
            améliorez votre bien-être mental au quotidien.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate('/b2c/login')}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Heart className="mr-2 h-5 w-5" />
              Espace Personnel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigate('/b2b/selection')}
              variant="outline"
              size="lg"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-4 text-lg rounded-full transition-all duration-300"
            >
              <Building2 className="mr-2 h-5 w-5" />
              Solutions Entreprise
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            Fonctionnalités innovantes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Des outils puissants pour transformer votre relation aux émotions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 rounded-full w-fit group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-0">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 text-blue-500 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Votre confiance, notre priorité
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Conformité RGPD, chiffrement bout-en-bout, et transparence totale 
                sur l'utilisation de vos données émotionnelles.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>4.9/5 - Plus de 1000 avis vérifiés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                EmotionsCare
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <button onClick={() => navigate('/philosophy')}>Philosophie</button>
              <button onClick={() => navigate('/about')}>À propos</button>
              <button onClick={() => navigate('/contact')}>Contact</button>
              <button onClick={() => navigate('/faq')}>FAQ</button>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
            © 2024 EmotionsCare. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
