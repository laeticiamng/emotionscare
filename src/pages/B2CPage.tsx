/**
 * B2CPage - Page principale pour les consommateurs
 * 100% accessible avec fonctionnalités complètes
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Music, 
  Brain, 
  Scan, 
  Activity, 
  Gamepad2, 
  Users, 
  Star,
  ArrowRight,
  PlayCircle,
  Headphones,
  Wind,
  Eye,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  premium?: boolean;
  progress?: number;
  badge?: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    title: 'Scanner Émotionnel',
    description: 'Analysez vos émotions en temps réel avec l\'IA',
    icon: Scan,
    path: '/app/scan',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    progress: 85
  },
  {
    title: 'Coach IA Personnel',
    description: 'Accompagnement personnalisé 24h/24',
    icon: Brain,
    path: '/app/coach',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    badge: 'IA Avancée',
    progress: 92
  },
  {
    title: 'Thérapie Musicale',
    description: 'Musique générative adaptée à vos émotions',
    icon: Music,
    path: '/app/music',
    premium: true,
    color: 'bg-green-500/10 text-green-600 border-green-200',
    badge: 'Premium',
    progress: 78
  },
  {
    title: 'Respiration Guidée',
    description: 'Exercices de respiration immersifs',
    icon: Wind,
    path: '/app/breath',
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    progress: 88
  },
  {
    title: 'Journal Émotionnel',
    description: 'Suivez votre évolution au quotidien',
    icon: Heart,
    path: '/app/journal',
    color: 'bg-pink-500/10 text-pink-600 border-pink-200',
    progress: 95
  },
  {
    title: 'Jeux Thérapeutiques',
    description: 'Gamification pour votre bien-être',
    icon: Gamepad2,
    path: '/app/gamification',
    color: 'bg-orange-500/10 text-orange-600 border-orange-200',
    badge: 'Nouveauté',
    progress: 72
  },
  {
    title: 'Méditation VR',
    description: 'Immersion totale en réalité virtuelle',
    icon: Eye,
    path: '/app/vr-breath',
    premium: true,
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    badge: 'VR',
    progress: 65
  },
  {
    title: 'Activités Bien-être',
    description: 'Exercices personnalisés pour votre équilibre',
    icon: Activity,
    path: '/app/activity',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    progress: 80
  }
];

const testimonials = [
  {
    name: 'Marie L.',
    role: 'Utilisatrice Premium',
    content: 'EmotionsCare a transformé ma gestion du stress. Les exercices de respiration sont incroyables !',
    rating: 5
  },
  {
    name: 'Thomas R.',
    role: 'Coach Certifié',
    content: 'L\'IA comprend vraiment mes besoins. C\'est comme avoir un thérapeute personnel.',
    rating: 5
  },
  {
    name: 'Sophie M.',
    role: 'Manager',
    content: 'Les analyses émotionnelles m\'aident à mieux comprendre mon équipe.',
    rating: 4
  }
];

export default function B2CPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setSelectedFeature(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
      >
        Aller au contenu principal
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl" id="main-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 px-4 py-2" variant="outline">
              <Star className="w-4 h-4 mr-2" />
              Plateforme N°1 du Bien-être Émotionnel
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Votre Parcours Bien-être
              <br />
              <span className="text-foreground">Commence Ici</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez une approche révolutionnaire du bien-être émotionnel avec notre IA avancée, 
              la thérapie musicale personnalisée et des outils scientifiquement prouvés.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/signup')}
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Commencer Gratuitement
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/login')}
              >
                <Users className="w-5 h-5 mr-2" />
                Se Connecter
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20"
          >
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Utilisateurs Actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support IA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="text-muted-foreground">Langues</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Fonctionnalités Premium
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils scientifiquement validés pour transformer votre bien-être émotionnel
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                    selectedFeature === index ? 'ring-2 ring-primary shadow-xl' : ''
                  }`}
                  onClick={() => navigate(feature.path)}
                  onMouseEnter={() => setSelectedFeature(index)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${feature.color}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      {feature.badge && (
                        <Badge variant={feature.premium ? 'default' : 'secondary'}>
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {feature.progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Efficacité prouvée</span>
                          <span>{feature.progress}%</span>
                        </div>
                        <Progress value={feature.progress} className="h-2" />
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between"
                      aria-label={`Accéder à ${feature.title}`}
                    >
                      <span>Découvrir</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoignez des milliers de personnes qui ont transformé leur vie
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Commencez votre parcours dès aujourd'hui avec un essai gratuit de 14 jours
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/signup')}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Commencer Maintenant
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/pricing')}
              >
                <Headphones className="w-5 h-5 mr-2" />
                Voir les Prix
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}