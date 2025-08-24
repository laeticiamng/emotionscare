
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Building2, Sparkles, Users, Brain, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { EnhancedSkipLinks } from '@/components/ui/enhanced-accessibility';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Animations respectueuses de l'accessibilité
  const fadeInUp = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { 
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      };

  const features = [
    { 
      icon: Brain, 
      title: "Analyse IA avancée", 
      description: "Intelligence émotionnelle de pointe",
      ariaLabel: "Fonctionnalité d'analyse par intelligence artificielle"
    },
    { 
      icon: Music, 
      title: "Musicothérapie personnalisée", 
      description: "Musique adaptée à vos émotions",
      ariaLabel: "Fonctionnalité de thérapie musicale personnalisée"
    },
    { 
      icon: Users, 
      title: "Communauté bienveillante", 
      description: "Entraide et soutien mutuel",
      ariaLabel: "Fonctionnalité de communauté et soutien"
    },
    { 
      icon: Sparkles, 
      title: "Expérience immersive", 
      description: "VR et technologies innovantes",
      ariaLabel: "Fonctionnalités de réalité virtuelle immersive"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <EnhancedSkipLinks />
      
      {/* Hero Section */}
      <section role="banner" className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" aria-hidden="true" />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            {...(shouldReduceMotion ? {} : fadeInUp)}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge 
              variant="outline" 
              className="mb-6 px-6 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm focus-enhanced"
              role="note"
              aria-label="Badge : Plateforme d'intelligence émotionnelle"
            >
              <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
              Plateforme d'intelligence émotionnelle
            </Badge>
            
            <h1 
              id="hero-title"
              className="text-5xl md:text-7xl font-bold text-contrast-enhanced mb-6"
              style={{ 
                background: 'linear-gradient(to right, #9333ea, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                // Fallback pour le contraste élevé
                color: 'var(--foreground)'
              }}
            >
              EmotionsCare
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light text-contrast-enhanced">
              Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto text-contrast-enhanced">
              Analysez, comprenez et améliorez votre bien-être émotionnel avec nos outils innovants
            </p>

            {/* Features Preview */}
            <motion.section
              {...(shouldReduceMotion ? {} : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.3 }
              })}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
              aria-labelledby="features-heading"
            >
              <h2 id="features-heading" className="sr-only">
                Fonctionnalités principales d'EmotionsCare
              </h2>
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  {...(shouldReduceMotion ? {} : {
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.5, delay: 0.1 * index }
                  })}
                  className="text-center focus-enhanced"
                  aria-labelledby={`feature-${index}-title`}
                >
                  <div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
                    aria-hidden="true"
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 
                    id={`feature-${index}-title`}
                    className="font-semibold text-gray-800 mb-1 text-contrast-enhanced"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 text-contrast-enhanced">
                    {feature.description}
                  </p>
                </motion.article>
              ))}
            </motion.section>
          </motion.div>
        </div>
      </section>

      {/* Main Cards Section */}
      <main id="main-content" className="container mx-auto px-4 pb-20">
        <motion.section
          {...(shouldReduceMotion ? {} : {
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.4 }
          })}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          aria-labelledby="main-options-heading"
        >
          <h2 id="main-options-heading" className="sr-only">
            Options d'accès à la plateforme EmotionsCare
          </h2>
          {/* Espace Particulier */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-pink-500"
            role="article"
            aria-labelledby="b2c-title"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
            
            <CardHeader className="relative z-10 text-center pb-6">
              <motion.div
                {...(shouldReduceMotion ? {} : { whileHover: { scale: 1.1, rotate: 5 } })}
                className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                aria-hidden="true"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
              
              <CardTitle 
                id="b2c-title"
                className="text-3xl font-bold text-gray-800 mb-3 text-contrast-enhanced"
              >
                Espace Particulier
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Accédez à votre espace personnel pour analyser vos émotions et améliorer votre bien-être.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3 mb-8">
                {[
                  'Analyse émotionnelle personnelle',
                  'Musique thérapeutique',
                  'Coach IA personnel',
                  'Journal intime'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    {...(shouldReduceMotion ? {} : {
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { duration: 0.5, delay: 0.6 + index * 0.1 }
                    })}
                    className="flex items-center text-gray-700"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mr-3" />
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/b2c/login')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus-enhanced"
                size="lg"
                aria-label="Accéder à l'espace particulier - Connexion ou inscription"
              >
                Accéder à Espace Particulier
                <Heart className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>

          {/* Espace Entreprise */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-500"
            role="article"
            aria-labelledby="b2b-title"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
            
            <CardHeader className="relative z-10 text-center pb-6">
              <motion.div
                {...(shouldReduceMotion ? {} : { whileHover: { scale: 1.1, rotate: -5 } })}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                aria-hidden="true"
              >
                <Building2 className="w-10 h-10 text-white" />
              </motion.div>
              
              <CardTitle 
                id="b2b-title"
                className="text-3xl font-bold text-gray-800 mb-3 text-contrast-enhanced"
              >
                Espace Entreprise
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Solutions complètes pour le bien-être émotionnel de vos équipes et collaborateurs.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3 mb-8">
                {[
                  'Gestion des équipes',
                  'Analytics RH',
                  'Rapports détaillés',
                  'Suivi collaborateurs'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    {...(shouldReduceMotion ? {} : {
                      initial: { opacity: 0, x: -20 },
                      animate: { opacity: 1, x: 0 },
                      transition: { duration: 0.5, delay: 0.6 + index * 0.1 }
                    })}
                    className="flex items-center text-gray-700"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mr-3" />
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <Button
                onClick={() => navigate('/b2b/selection')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus-enhanced"
                size="lg"
                aria-label="Accéder à l'espace entreprise - Solutions professionnelles"
              >
                Accéder à Espace Entreprise
                <Building2 className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Bottom CTA Section */}
        <motion.section
          {...(shouldReduceMotion ? {} : {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.8 }
          })}
          className="text-center mt-20"
          aria-labelledby="cta-heading"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white max-w-4xl mx-auto">
            <h2 
              id="cta-heading"
              className="text-3xl font-bold mb-4"
            >
              Commencez votre parcours de bien-être émotionnel
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Rejoignez des milliers d'utilisateurs qui transforment leur vie avec EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/b2c/login')}
                variant="secondary"
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 focus-enhanced"
                aria-label="Commencer l'essai gratuit pour particuliers"
              >
                Essai gratuit particulier
              </Button>
              <Button
                onClick={() => navigate('/b2b/selection')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 focus-enhanced"
                aria-label="Découvrir les solutions entreprise"
              >
                Solution entreprise
              </Button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default HomePage;
