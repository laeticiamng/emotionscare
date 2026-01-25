import React, { useMemo, useCallback } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Users, Shield, BarChart3, Headphones, Sparkles, Zap, Clock, Award } from 'lucide-react';

const OptimizedFeaturesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Memoized features data
  const features = useMemo(() => [
    {
      icon: Brain,
      title: "IA Coach Personnel",
      description: "Assistant virtuel intelligent qui s'adapte à vos besoins émotionnels et vous guide au quotidien.",
      gradient: "from-primary to-blue-600",
      badge: "IA Avancée"
    },
    {
      icon: Heart,
      title: "Scan Émotionnel",
      description: "Analysez votre état émotionnel en temps réel grâce à notre technologie d'IA avancée.",
      gradient: "from-red-500 to-pink-500",
      badge: "Temps Réel"
    },
    {
      icon: Users,
      title: "Communauté Bienveillante",
      description: "Connectez-vous avec d'autres utilisateurs dans un environnement sécurisé et confidentiel.",
      gradient: "from-green-500 to-emerald-500",
      badge: "Social"
    },
    {
      icon: Shield,
      title: "Sécurité & Confidentialité",
      description: "Vos données sont protégées avec les plus hauts standards de sécurité et de confidentialité.",
      gradient: "from-gray-600 to-slate-600",
      badge: "ISO 27001"
    },
    {
      icon: BarChart3,
      title: "Analytics Avancés",
      description: "Suivez votre progression avec des tableaux de bord détaillés et des insights personnalisés.",
      gradient: "from-purple-500 to-indigo-500",
      badge: "Insights"
    },
    {
      icon: Headphones,
      title: "Thérapie Musicale",
      description: "Découvrez des playlists personnalisées et des sessions audio thérapeutiques.",
      gradient: "from-orange-500 to-amber-500",
      badge: "Personnalisé"
    }
  ], []);

  const additionalFeatures = useMemo(() => [
    { icon: Clock, text: "Disponible 24h/24, 7j/7" },
    { icon: Award, text: "Certifié par des professionnels" },
    { icon: Zap, text: "Résultats rapides et durables" },
    { icon: Sparkles, text: "Expérience utilisateur premium" }
  ], []);

  // Optimized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }), [shouldReduceMotion]);

  // Optimized hover handler
  const handleCardHover = useCallback((_isHovering: boolean) => {
    if (shouldReduceMotion) return;
    // Minimal hover effects for performance
  }, [shouldReduceMotion]);

  return (
    <section ref={ref} className="py-12 sm:py-24 bg-gradient-to-b from-background to-secondary/10 relative overflow-hidden">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary/8 rounded-full blur-xl will-change-transform" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-purple-500/8 rounded-full blur-xl will-change-transform" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optimized Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-20 px-2"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="mb-4 sm:mb-6 px-3 sm:px-4 py-2 glass-effect border-primary/20">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
              <span className="text-xs sm:text-sm">Fonctionnalités innovantes</span>
            </Badge>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-fluid-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gradient will-change-transform"
          >
            Une plateforme complète
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-fluid-base sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4"
          >
            Découvrez nos outils innovants conçus pour transformer votre bien-être émotionnel 
            avec la puissance de l'intelligence artificielle.
          </motion.p>

          {/* Optimized Additional Features */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 sm:gap-6"
          >
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.2, 
                  delay: shouldReduceMotion ? 0 : index * 0.03,
                  ease: "easeOut"
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full glass-effect border border-primary/10 will-change-transform"
              >
                <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Optimized Features Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.04 }}
            >
              <Card 
                className="group h-full border-2 border-transparent hover:border-primary/20 transition-all duration-200 hover:shadow-2xl hover-lift glass-effect touch-manipulation will-change-transform cursor-pointer"
                onMouseEnter={() => handleCardHover(true)}
                onMouseLeave={() => handleCardHover(false)}
              >
                <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6">
                  <div className="relative mb-4 sm:mb-6">
                    <div className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-200 will-change-transform`}>
                      <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 px-1 sm:px-2 py-0.5 sm:py-1 text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 p-4 sm:p-6">
                  <CardDescription className="text-muted-foreground text-center leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OptimizedFeaturesSection;