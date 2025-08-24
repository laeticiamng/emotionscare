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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge 
              variant="outline" 
              className="glass-effect px-6 py-3 text-sm font-medium border-primary/20 hover:border-primary/40 transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Plateforme d'intelligence émotionnelle nouvelle génération
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-8 text-gradient leading-tight"
          >
            EmotionsCare
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl text-muted-foreground mb-6 font-light max-w-4xl mx-auto"
          >
            Transformez votre bien-être émotionnel avec l'intelligence artificielle
          </motion.p>

          {/* Description */}
          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Analysez, comprenez et améliorez votre santé mentale avec nos outils innovants basés sur l'IA, 
            la musicothérapie et les technologies immersives.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              onClick={() => navigate('/b2c/login')}
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:animate-heartbeat" />
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="group border-2 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-muted/50 transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Voir la démo
            </Button>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="group text-center p-6 rounded-2xl glass-effect hover:bg-card/20 transition-all duration-300 hover-lift"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border/50"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 opacity-20">
        <Star className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-20">
        <Heart className="w-8 h-8 text-pink-500 animate-bounce-gentle" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-20">
        <Sparkles className="w-5 h-5 text-purple-500 animate-wiggle" />
      </div>
    </section>
  );
};

export default HeroSection;