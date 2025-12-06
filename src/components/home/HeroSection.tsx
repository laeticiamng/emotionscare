import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const features = [
    { 
      icon: Brain, 
      title: "IA Coach", 
      description: "Assistant intelligent",
      gradient: "from-primary to-blue-600"
    },
    { 
      icon: Music, 
      title: "Musicothérapie", 
      description: "Thérapie personnalisée",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      icon: Users, 
      title: "Communauté", 
      description: "Soutien bienveillant",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      icon: Sparkles, 
      title: "Expérience VR", 
      description: "Innovation immersive",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Utilisateurs actifs" },
    { value: "95%", label: "Satisfaction client" },
    { value: "24/7", label: "Support disponible" },
    { value: "50+", label: "Outils thérapeutiques" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10 safe-area">
      {/* Background Elements - Optimized for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <Badge 
              variant="outline" 
              className="glass-effect px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-primary/20 hover:border-primary/40 transition-colors duration-300"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
              <span className="hidden xs:inline">Plateforme d'intelligence émotionnelle nouvelle génération</span>
              <span className="xs:hidden">Intelligence émotionnelle IA</span>
            </Badge>
          </motion.div>

          {/* Main Title - Responsive typography */}
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-fluid-4xl sm:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 text-gradient leading-tight"
          >
            EmotionsCare
          </motion.h1>

          {/* Subtitle - Responsive typography */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-fluid-lg sm:text-2xl lg:text-3xl text-muted-foreground mb-4 sm:mb-6 font-light max-w-4xl mx-auto px-2"
          >
            Transformez votre bien-être émotionnel avec l'IA
          </motion.p>

          {/* Description - Mobile optimized */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-fluid-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Analysez, comprenez et améliorez votre santé mentale avec nos outils innovants basés sur l'IA, 
            la musicothérapie et les technologies immersives.
          </motion.p>

          {/* Action Buttons - Mobile optimized */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4"
          >
            <Button
              onClick={() => navigate('/login?segment=b2c')}
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift min-h-[52px] touch-manipulation"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-heartbeat" />
              <span className="sm:hidden">Commencer</span>
              <span className="hidden sm:inline">Commencer maintenant</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="group border-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl hover:bg-muted/50 transition-all duration-300 min-h-[52px] touch-manipulation"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Voir la démo
            </Button>
          </motion.div>

          {/* Features Preview - Mobile optimized grid */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16 px-2"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="group text-center p-3 sm:p-6 rounded-xl sm:rounded-2xl glass-effect hover:bg-card/20 transition-all duration-300 hover-lift touch-manipulation"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors text-xs sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats - Mobile optimized */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-border/50 px-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements - Mobile safe positioning */}
      <div className="absolute top-5 sm:top-10 right-5 sm:right-10 opacity-20 hidden sm:block">
        <Star className="w-4 h-4 sm:w-6 sm:h-6 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 opacity-20 hidden sm:block">
        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 animate-bounce-gentle" />
      </div>
      <div className="absolute top-1/3 right-10 sm:right-20 opacity-20 hidden lg:block">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 animate-wiggle" />
      </div>
    </section>
  );
};

export default HeroSection;