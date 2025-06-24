
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Building2, Users, Brain, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Emotions</span>Care
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La plateforme de bien-être émotionnel qui s'adapte à vos besoins, 
              que vous soyez un particulier ou une entreprise
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez votre espace
            </h2>
            <p className="text-lg text-gray-600">
              Deux expériences uniques pour répondre à vos besoins spécifiques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* B2C Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-pink-600" />
                  </div>
                  <CardTitle className="text-2xl text-pink-700">Espace Personnel</CardTitle>
                  <CardDescription className="text-lg">
                    Pour les particuliers qui souhaitent prendre soin de leur bien-être émotionnel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-pink-600" />
                      <span>Coach IA personnalisé</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-pink-600" />
                      <span>Scan émotionnel quotidien</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-pink-600" />
                      <span>Suivi de progression personnel</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/b2c/login')}
                    className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white"
                    size="lg"
                  >
                    Accéder à l'espace personnel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* B2B Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-700">Espace Entreprise</CardTitle>
                  <CardDescription className="text-lg">
                    Pour les organisations qui veulent améliorer le bien-être de leurs équipes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Gestion d'équipes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Analytics avancées</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>Administration sécurisée</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/b2b/selection')}
                    variant="outline"
                    className="w-full mt-6 border-blue-600 text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    Accéder à l'espace entreprise
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Une plateforme complète pour votre bien-être
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos fonctionnalités avancées
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">IA Avancée</h3>
              <p className="text-gray-600">Coach personnel intelligent et analyse émotionnelle en temps réel</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">Outils de bien-être en équipe et social cocon</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="text-center p-6 bg-white rounded-lg shadow-md"
            >
              <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">Tableaux de bord et insights personnalisés</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
