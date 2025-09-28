/**
 * Page d'accueil immersive - EmotionsCare
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Users, Zap, Star, ArrowRight, Sparkles, Shield } from 'lucide-react';
import './immersive-styles.css';
import '../components/home/immersive-home.css';
import EnhancedHeader from '../components/ui/enhanced-header';
import EnhancedFooter from '../components/ui/enhanced-footer';

const Index: React.FC = () => {
  return (
    <div className="immersive-bg min-h-screen">
      <EnhancedHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 min-h-[90vh] flex items-center particle-field overflow-hidden">
        <div className="container-mobile mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="immersive-title text-4xl md:text-6xl lg:text-7xl">
              EmotionsCare
              <span className="block text-2xl md:text-4xl lg:text-5xl mt-4 text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                ResiMax™
              </span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-responsive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Plateforme de bien-être émotionnel en entreprise
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link to="/auth/login" className="w-full sm:w-auto">
                <button className="premium-button immersive-hover energy-pulse w-full sm:w-auto">
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Commencer maintenant
                </button>
              </Link>
              
              <Link to="/demo" className="w-full sm:w-auto">
                <button className="premium-button accent immersive-hover w-full sm:w-auto">
                  <Star className="w-5 h-5 mr-2 inline" />
                  Découvrir la démo
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 hidden md:block">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 float-animation"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
        
        <div className="absolute top-1/3 right-16 hidden lg:block">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-30 float-animation"
            animate={{ 
              scale: [1, 0.8, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background/50 backdrop-blur-sm">
        <div className="container-mobile mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-glow">
              Modules Premium
            </h2>
            <p className="text-lg text-muted-foreground text-responsive">
              Une suite complète d'outils pour votre bien-être
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Scanner d'Émotions",
                description: "Analyse IA de vos émotions en temps réel",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: Users,
                title: "Musicothérapie Adaptative", 
                description: "Musique personnalisée selon votre humeur",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Coach IA Personnel",
                description: "Accompagnement personnalisé 24/7",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Journal Privé",
                description: "Suivi sécurisé de votre évolution",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Star,
                title: "Réalité Virtuelle",
                description: "Expériences immersives de relaxation",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: Sparkles,
                title: "Gamification",
                description: "Progressez en vous amusant",
                color: "from-pink-500 to-purple-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="glass-effect rounded-3xl p-8 immersive-hover cosmic-glow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-center">{feature.title}</h3>
                <p className="text-muted-foreground text-center text-responsive">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container-mobile mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-shimmer">
              Prêt à transformer votre bien-être ?
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-responsive">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
            </p>
            
            <Link to="/auth/signup">
              <button className="premium-button text-lg px-8 py-4 immersive-hover">
                <ArrowRight className="w-6 h-6 mr-2 inline" />
                Commencer gratuitement
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <EnhancedFooter />
    </div>
  );
};

export default Index;