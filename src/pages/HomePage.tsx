import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Heart, Sparkles, Users, Lock, Brain, Shield, Zap, Star, Play, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Routes } from '@/routerV2';

const HomePage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const springY = useSpring(y, springConfig);

  // Floating animation
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // Interactive features data
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA Émotionnelle Avancée",
      description: "Reconnaissance faciale et vocale pour une analyse précise de vos émotions en temps réel",
      gradient: "from-blue-500 to-cyan-500",
      stats: "94% de précision"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Thérapies Personnalisées",
      description: "Programmes adaptatifs basés sur votre profil émotionnel unique et vos préférences",
      gradient: "from-pink-500 to-rose-500",
      stats: "1000+ programmes"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Confidentialité Totale",
      description: "Chiffrement end-to-end et conformité RGPD pour protéger vos données les plus sensibles",
      gradient: "from-green-500 to-emerald-500",
      stats: "100% sécurisé"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Résultats Immédiats",
      description: "Techniques d'intervention rapide pour un soulagement immédiat du stress et de l'anxiété",
      gradient: "from-purple-500 to-violet-500",
      stats: "< 5 minutes"
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      role: "Directrice Marketing",
      content: "EmotionsCare a transformé ma gestion du stress au travail. L'IA comprend vraiment mes émotions.",
      rating: 5,
      avatar: "🌟"
    },
    {
      name: "Thomas K.",
      role: "Développeur",
      content: "Incroyable ! Les techniques de respiration guidées m'ont aidé lors des périodes intenses.",
      rating: 5,
      avatar: "💪"
    },
    {
      name: "Sophie R.",
      role: "RH Manager",
      content: "Notre équipe est plus épanouie depuis l'utilisation d'EmotionsCare. Les résultats parlent d'eux-mêmes.",
      rating: 5,
      avatar: "🚀"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Hero Section avec parallax */}
      <motion.section 
        ref={heroRef}
        style={{ y: springY, opacity, scale }}
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        
        {/* Floating Elements */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 blur-xl"
          style={{ animationDelay: '2s' }}
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-20 blur-xl"
          style={{ animationDelay: '4s' }}
        />

        <div className="container mx-auto px-4 z-10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Logo animé */}
            <motion.div
              variants={fadeInUp}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-12 h-12 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-30 blur-lg"
                />
              </div>
            </motion.div>
            
            {/* Titre principal */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Emotions
              </span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Care
              </span>
            </motion.h1>
            
            {/* Sous-titre */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-3xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              L'intelligence artificielle au service de votre 
              <span className="text-blue-600 font-semibold"> bien-être émotionnel</span>
            </motion.p>

            {/* Stats impressionnantes */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {[
                { number: "50K+", label: "Utilisateurs" },
                { number: "94%", label: "Satisfaction" },
                { number: "2M+", label: "Sessions" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg"
                >
                  <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Boutons d'action */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-xl">
                  <Link to={Routes.b2cLanding()}>
                    <Users className="w-6 h-6 mr-3" />
                    Commencer Gratuitement
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-slate-300 hover:border-blue-400 rounded-2xl bg-white/80 backdrop-blur-sm">
                  <Link to="/demo">
                    <Play className="w-6 h-6 mr-3" />
                    Voir la Démo
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Indication de scroll */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-slate-400"
            >
              <span className="text-sm mb-2">Découvrez plus</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section avec animations avancées */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
              ✨ Technologie Avancée
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Une expérience unique et personnalisée
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez comment notre IA révolutionne l'accompagnement émotionnel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{feature.description}</p>
                    
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Découvrez comment EmotionsCare transforme la vie de nos utilisateurs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-slate-700 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà commencé leur parcours vers un mieux-être émotionnel
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-2xl shadow-xl">
                  <Link to={Routes.login()}>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Commencer Maintenant
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-2xl">
                  <Link to={Routes.b2bLanding()}>
                    <Lock className="w-6 h-6 mr-3" />
                    Solutions Entreprise
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;