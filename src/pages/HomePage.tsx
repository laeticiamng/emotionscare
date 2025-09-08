/**
 * 🏠 HOME PAGE PREMIUM
 * Page d'accueil optimisée pour EmotionsCare
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Music, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Shield, 
  Zap, 
  Play,
  CheckCircle,
  Star,
  Globe,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface FeatureCard {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

interface Stat {
  value: string;
  label: string;
  description: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: Brain,
    title: 'Analyse Émotionnelle IA',
    description: 'Technologie avancée pour comprendre vos émotions en temps réel',
    benefits: ['Analyse multi-modale', 'Précision 95%+', 'Insights personnalisés'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    icon: Music,
    title: 'Musicothérapie Adaptative',
    description: 'Musique thérapeutique générée par IA selon votre état émotionnel',
    benefits: ['Génération personnalisée', 'Effets prouvés', 'Bibliothèque infinie'],
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: Users,
    title: 'Bien-être d\'Équipe',
    description: 'Solutions collaboratives pour l\'intelligence émotionnelle collective',
    benefits: ['Analytics équipe', 'Coaching collectif', 'Performance RH'],
    color: 'from-green-500 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Confidentialité Totale',
    description: 'Vos données émotionnelles sont protégées par cryptage avancé',
    benefits: ['Chiffrement E2E', 'RGPD compliant', 'Contrôle total'],
    color: 'from-red-500 to-orange-600'
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marie Dubois',
    role: 'Directrice RH',
    company: 'TechCorp',
    avatar: 'MD',
    content: 'EmotionsCare a transformé notre approche du bien-être au travail. Nos équipes sont plus épanouies et productives.',
    rating: 5
  },
  {
    name: 'Thomas Martin',
    role: 'Coach Personnel',
    company: 'Indépendant',
    avatar: 'TM',
    content: 'Un outil révolutionnaire pour mes clients. L\'IA d\'analyse émotionnelle est d\'une précision remarquable.',
    rating: 5
  },
  {
    name: 'Sarah Johnson',
    role: 'Psychologue',
    company: 'Clinique Wellness',
    avatar: 'SJ',
    content: 'La musicothérapie adaptive aide mes patients à mieux gérer stress et anxiété. Résultats impressionnants.',
    rating: 5
  }
];

const STATS: Stat[] = [
  {
    value: '50K+',
    label: 'Utilisateurs actifs',
    description: 'Professionnels et particuliers nous font confiance'
  },
  {
    value: '95%',
    label: 'Précision IA',
    description: 'Reconnaissance émotionnelle de pointe'
  },
  {
    value: '85%',
    label: 'Amélioration',
    description: 'Du bien-être utilisateur en 30 jours'
  },
  {
    value: '24/7',
    label: 'Disponibilité',
    description: 'Support et coaching permanent'
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Utilisateurs Actifs", value: "10K+", description: "Personnes accompagnées" },
    { label: "Sessions Quotidiennes", value: "50K+", description: "Interactions par jour" },
    { label: "Satisfaction", value: "96%", description: "Taux de satisfaction" },
    { label: "Disponibilité", value: "24/7", description: "Support continu" }
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  Nouveau : Assistant IA Nyvée disponible
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    EmotionsCare
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Votre bien-être émotionnel, notre priorité. 
                  Découvrez une plateforme complète avec IA, coaching personnalisé et outils innovants.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="flex items-center space-x-2" onClick={() => navigate('/login')}>
                  <Heart className="h-5 w-5" />
                  <span>Commencer Gratuitement</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="flex items-center space-x-2" onClick={() => navigate('/help')}>
                  <Shield className="h-5 w-5" />
                  <span>En savoir plus</span>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold">
                Fonctionnalités Innovantes
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des outils de pointe pour votre bien-être émotionnel, 
                accessibles 24h/24 et adaptés à vos besoins.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} w-fit mb-4`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{feature.description}</CardDescription>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ils Nous Font Confiance
              </h2>
              <p className="text-lg text-muted-foreground">
                Des résultats concrets pour notre communauté
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center space-y-2"
                >
                  <div className="text-4xl lg:text-5xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="font-semibold">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Commencez Votre Parcours Aujourd'hui
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Rejoignez des milliers d'utilisateurs qui transforment leur bien-être émotionnel
                  avec EmotionsCare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="flex items-center space-x-2" onClick={() => navigate('/login')}>
                  <Heart className="h-5 w-5" />
                  <span>Commencer Gratuitement</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/help')}>
                  En savoir plus
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>100% sécurisé • Données cryptées • RGPD conforme</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;