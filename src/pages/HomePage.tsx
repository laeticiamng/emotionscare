
import React, { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Zap, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MusicDrawer from '@/components/music/player/MusicDrawer';
import MiniPlayer from '@/components/music/player/MiniPlayer';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

const features = [
  {
    icon: Heart,
    title: "Scan Émotionnel IA",
    description: "Analysez vos émotions en temps réel avec notre technologie avancée",
    badge: "IA Premium"
  },
  {
    icon: Users,
    title: "Coaching Personnalisé",
    description: "Accompagnement adaptatif basé sur votre profil émotionnel",
    badge: "Coach IA"
  },
  {
    icon: Shield,
    title: "Sécurité RGPD",
    description: "Protection maximale de vos données personnelles et émotionnelles",
    badge: "Sécurisé"
  },
  {
    icon: Zap,
    title: "Résultats Instantanés",
    description: "Obtenez des insights émotionnels en quelques secondes",
    badge: "Temps réel"
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/choose-mode');
  };

  const handleWatchDemo = () => {
    // Placeholder for demo video
    console.log('Demo video functionality to be implemented');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              🚀 Nouvelle version disponible
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Transformez votre bien-être émotionnel avec l'IA
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              EmotionsCare révolutionne la gestion du bien-être en entreprise avec des analyses émotionnelles précises et des recommandations personnalisées.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleWatchDemo}
                className="px-8 py-4 text-lg border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi choisir EmotionsCare ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Une plateforme complète qui combine intelligence artificielle et expertise humaine pour votre bien-être
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center h-full flex flex-col">
                    <div className="mb-4 p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full w-fit mx-auto">
                      <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {feature.badge}
                    </Badge>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 flex-grow">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
            </p>
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Music Components */}
      <MiniPlayer onExpand={() => {}} />
      <MusicDrawer />
    </div>
  );
};

export default HomePage;
