
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Building2, Users, Music, Scan, MessageSquare, Monitor, BookOpen, Trophy, Shield, HelpCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">bien-être émotionnel</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez une approche innovante du bien-être mental avec des outils personnalisés et une intelligence artificielle bienveillante
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/choose-mode">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                  Commencer maintenant
                </Button>
              </Link>
              <Link to="/help-center">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nos outils de bien-être
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos modules conçus pour accompagner votre développement personnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Scan Émotionnel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Scan className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Scan Émotionnel</CardTitle>
                  <CardDescription>
                    Analysez vos émotions en temps réel grâce à notre technologie avancée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/scan">
                    <Button variant="outline" className="w-full">
                      Essayer maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coach IA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Coach IA</CardTitle>
                  <CardDescription>
                    Bénéficiez de conseils personnalisés avec notre intelligence artificielle bienveillante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/coach">
                    <Button variant="outline" className="w-full">
                      Discuter maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Musicothérapie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Music className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Musicothérapie</CardTitle>
                  <CardDescription>
                    Apaisez votre esprit avec des compositions personnalisées selon vos émotions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/music">
                    <Button variant="outline" className="w-full">
                      Écouter maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Journal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle>Journal Personnel</CardTitle>
                  <CardDescription>
                    Exprimez vos pensées et suivez votre évolution émotionnelle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/journal">
                    <Button variant="outline" className="w-full">
                      Commencer à écrire
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Réalité Virtuelle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Monitor className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Expériences VR</CardTitle>
                  <CardDescription>
                    Plongez dans des environnements apaisants en réalité virtuelle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/vr">
                    <Button variant="outline" className="w-full">
                      Explorer maintenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Gamification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-pink-600" />
                  </div>
                  <CardTitle>Défis & Récompenses</CardTitle>
                  <CardDescription>
                    Gamifiez votre parcours bien-être avec des défis motivants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/gamification">
                    <Button variant="outline" className="w-full">
                      Voir les défis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à commencer votre voyage vers le bien-être ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur rapport aux émotions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/choose-mode">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/help-center">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Centre d'aide
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Sécurité & Confidentialité</h3>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vos données personnelles sont protégées par un chiffrement de niveau bancaire. 
            Nous respectons strictement les normes RGPD et ne partageons jamais vos informations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
