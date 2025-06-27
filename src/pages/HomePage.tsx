
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Music, Users, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Analyse Émotionnelle',
      description: 'Scanner vos émotions en temps réel',
      path: '/scan',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Music,
      title: 'Musique Thérapeutique',
      description: 'Musiques personnalisées selon votre humeur',
      path: '/music',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Journal Émotionnel',
      description: 'Suivez votre bien-être quotidien',
      path: '/journal',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Coach IA',
      description: 'Accompagnement personnalisé 24/7',
      path: '/coach',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              EmotionsCare
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Votre plateforme de bien-être émotionnel alimentée par l'IA. 
              Analysez, comprenez et améliorez votre santé mentale avec nos outils innovants.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button 
              onClick={() => navigate('/choose-mode')} 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Commencer maintenant
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-200 hover:border-purple-400 px-8 py-4 text-lg rounded-xl transition-all duration-300"
            >
              Se connecter
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Nos Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez tous nos outils pour votre bien-être
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card 
                  className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/60 backdrop-blur-sm"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Modes Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Choisissez Votre Mode d'Accès
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    Espace Particulier
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Accès individuel pour votre bien-être personnel
                  </p>
                  <Button 
                    onClick={() => navigate('/b2c/login')}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl"
                  >
                    Accès Particulier
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    Espace Entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Solution complète pour les organisations
                  </p>
                  <Button 
                    onClick={() => navigate('/b2b/selection')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl"
                  >
                    Accès Entreprise
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Footer */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              Sécurité & Confidentialité
            </h3>
          </div>
          <p className="text-gray-600 text-lg">
            Vos données sont protégées par un chiffrement de niveau bancaire. 
            Conformité RGPD garantie.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
