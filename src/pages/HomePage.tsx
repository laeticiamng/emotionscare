/**
 * 🏠 PAGE D'ACCUEIL EMOTIONSCARE PREMIUM
 * Landing page optimisée avec sections interactives
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Heart, Music, Camera, Mic, Zap, 
  ArrowRight, Play, CheckCircle, Star,
  Users, Shield, Sparkles, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'scan' | 'music' | 'insights'>('scan');

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Intelligence Émotionnelle Premium
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EmotionsCare
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transformez votre bien-être avec l'IA la plus avancée en analyse émotionnelle 
                et musicothérapie personnalisée
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/app">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="pt-8">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>100% Gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Données sécurisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>IA de pointe</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Trois piliers révolutionnaires
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Notre plateforme combine analyse émotionnelle IA, musicothérapie adaptative 
                et insights comportementaux pour votre transformation personnelle
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Scan Émotionnel */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <div className="space-y-6">
                    <div className="p-4 bg-primary/10 rounded-full w-fit">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Scan Émotionnel IA</h3>
                      <p className="text-muted-foreground">
                        Analyse en temps réel via caméra, microphone et texte. 
                        Technologie Hume AI + OpenAI pour une précision inégalée.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5 text-primary" />
                        <span className="text-sm">Reconnaissance faciale avancée</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mic className="h-5 w-5 text-primary" />
                        <span className="text-sm">Analyse prosodique vocale</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-sm">Multi-modal en temps réel</span>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link to="/app/scan">Essayer le scan</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Musicothérapie */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full hover:shadow-lg transition-shadow border-2 hover:border-secondary/20">
                  <div className="space-y-6">
                    <div className="p-4 bg-secondary/10 rounded-full w-fit">
                      <Music className="h-8 w-8 text-secondary" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Musicothérapie IA</h3>
                      <p className="text-muted-foreground">
                        Musique thérapeutique générée par Suno AI, adaptée à votre 
                        état émotionnel pour un bien-être optimal.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-secondary" />
                        <span className="text-sm">Génération adaptive</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-secondary" />
                        <span className="text-sm">Parcours thérapeutique</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-secondary" />
                        <span className="text-sm">Sessions personnalisées</span>
                      </div>
                    </div>

                    <Button asChild variant="secondary" className="w-full">
                      <Link to="/app/music">Explorer la musique</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Insights */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full hover:shadow-lg transition-shadow border-2 hover:border-accent/20">
                  <div className="space-y-6">
                    <div className="p-4 bg-accent/10 rounded-full w-fit">
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-3">Insights Avancés</h3>
                      <p className="text-muted-foreground">
                        Tableaux de bord intelligents avec analyses prédictives 
                        et recommandations personnalisées.
                      </p>
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link to="/app/analytics">Voir les insights</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Prêt à transformer votre bien-être ?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur intelligence 
                émotionnelle avec EmotionsCare
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link to="/signup">
                  Créer mon compte gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-primary">
                <Link to="/app">
                  Explorer la plateforme
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;