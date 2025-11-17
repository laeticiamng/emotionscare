/**
 * UNIFIED HOME PAGE - Fusion de HomePage + HomeB2CPage
 * Préserve EXACTEMENT la même fonctionnalité des deux composants
 */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout";
import { 
  ArrowRight, 
  Heart, 
  Brain, 
  Users, 
  Shield, 
  Zap, 
  Music,
  Camera,
  MessageCircle,
  Star,
  CheckCircle,
  Play,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Headphones,
  BookOpen,
  Clock,
  Target,
  Smile,
  Activity,
  LucideIcon
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { withLandingUtm } from "@/lib/utm";
import { useLazyRender } from "@/hooks/useLazyRender";
import { logger } from '@/lib/logger';

const Footer = lazy(() => import("@/components/layout/Footer"));

interface UnifiedHomePageProps {
  variant?: 'full' | 'b2c-simple';
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
  benefits: string[];
  demo: string;
}

interface Testimonial {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
}

interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface UseCase {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export default function UnifiedHomePage({ variant = 'full' }: UnifiedHomePageProps) {
  logger.debug('[UnifiedHomePage] Starting render', { variant }, 'UI');
  
  // Initialiser les hooks et variables en dehors du try-catch
  const [searchParams] = useSearchParams();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsSection = useLazyRender<HTMLElement>({ rootMargin: '200px' });
  const featuresSection = useLazyRender<HTMLElement>({ rootMargin: '200px' });
  const useCasesSection = useLazyRender<HTMLElement>({ rootMargin: '200px' });
  const testimonialsSection = useLazyRender<HTMLElement>({ rootMargin: '200px' });
  const finalCtaSection = useLazyRender<HTMLElement>({ rootMargin: '200px' });
  
  logger.debug('[UnifiedHomePage] Hooks initialized successfully', undefined, 'UI');
  
  // Détection automatique du variant depuis les params
  const detectedVariant = searchParams.get('variant') === 'simple' ? 'b2c-simple' : variant;
  logger.debug('[UnifiedHomePage] Detected variant', { detectedVariant }, 'UI');

  const heroHeadingId = detectedVariant === 'b2c-simple' ? 'b2c-home-hero-title' : 'homepage-hero-title';

  // Définir les données statiques
  const features = [
    {
      icon: Brain,
      title: "IA Personnalisée",
      description: "Coach virtuel Nyvée adapté à vos besoins émotionnels uniques",
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      benefits: ["Analyse comportementale avancée", "Recommandations personnalisées", "Support 24/7"],
      demo: "/app/coach"
    },
    {
      icon: Music,
      title: "Musique Thérapeutique",
      description: "Compositions générées par IA selon votre état émotionnel actuel",
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
      benefits: ["Génération en temps réel", "Binaural beats", "Playlist adaptatives"],
      demo: "/app/music"
    },
    {
      icon: Camera,
      title: "Analyse Faciale Avancée",
      description: "Détection d'émotions en temps réel avec 99% de précision",
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-500",
      benefits: ["Reconnaissance micro-expressions", "Analyse en continu", "Graphiques détaillés"],
      demo: "/app/scan"
    },
    {
      icon: MessageCircle,
      title: "Journal Intelligent",
      description: "Espace sécurisé avec analyse automatique de sentiments",
      color: "text-orange-500",
      gradient: "from-orange-500 to-red-500",
      benefits: ["Chiffrement end-to-end", "Analyse de tendances", "Rappels personnalisés"],
      demo: "/app/journal"
    },
    {
      icon: Headphones,
      title: "VR Thérapie",
      description: "Immersion thérapeutique avec environnements adaptatifs",
      color: "text-indigo-500",
      gradient: "from-indigo-500 to-purple-500",
      benefits: ["Environnements 3D", "Respiration guidée", "Réalité mixte"],
      demo: "/app/vr-breath"
    },
    {
      icon: Activity,
      title: "Analytics Wellness",
      description: "Tableau de bord complet de votre progression émotionnelle",
      color: "text-teal-500",
      gradient: "from-teal-500 to-blue-500",
      benefits: ["Métriques détaillées", "Tendances long-terme", "Rapports exportables"],
      demo: "/app/activity"
    }
  ];

  const stats = [
    { label: "Utilisateurs Actifs", value: "25,000+", description: "Personnes accompagnées quotidiennement", icon: Users, progress: 85 },
    { label: "Sessions Quotidiennes", value: "150K+", description: "Interactions IA par jour", icon: Activity, progress: 92 },
    { label: "Satisfaction Moyenne", value: "98.7%", description: "Taux de satisfaction utilisateur", icon: Star, progress: 98 },
    { label: "Disponibilité", value: "99.9%", description: "Uptime garantie premium", icon: Shield, progress: 99 }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Cadre supérieure",
      avatar: "/images/avatar-sarah.jpg",
      avatarAlt: "Photo de profil de Sarah M., cadre supérieure",
      rating: 5,
      text: "EmotionsCare a transformé ma gestion du stress. Le coach IA Nyvée m'aide quotidiennement à maintenir mon équilibre émotionnel.",
      highlight: "Transformation complète",
      company: "Fortune 500"
    },
    {
      name: "Marc D.",
      role: "Entrepreneur",
      avatar: "/images/avatar-marc.jpg",
      avatarAlt: "Photo de profil de Marc D., entrepreneur",
      rating: 5,
      text: "L'analyse faciale en temps réel me permet d'adapter mes présentations. Un avantage concurrentiel incroyable.",
      highlight: "Avantage concurrentiel",
      company: "Startup Tech"
    },
    {
      name: "Lisa K.",
      role: "Psychologue",
      avatar: "/images/avatar-lisa.jpg",
      avatarAlt: "Photo de profil de Lisa K., psychologue",
      rating: 5,
      text: "J'utilise EmotionsCare avec mes patients. Les insights IA complètent parfaitement mes analyses cliniques.",
      highlight: "Outil professionnel",
      company: "Cabinet privé"
    }
  ];

  const useCases = [
    {
      title: "Développement Personnel",
      description: "Découvrez votre potentiel émotionnel complet",
      icon: Target,
      features: ["Auto-évaluation continue", "Plans de développement", "Suivi des progrès"],
      cta: "Commencer le parcours",
      link: "/b2c"
    },
    {
      title: "Performance Professionnelle", 
      description: "Optimisez vos interactions et leadership",
      icon: TrendingUp,
      features: ["Communication optimisée", "Gestion d'équipe", "Résilience au stress"],
      cta: "Découvrir les solutions",
      link: "/entreprise"
    },
    {
      title: "Bien-être Quotidien",
      description: "Maintenez un équilibre émotionnel optimal",
      icon: Smile,
      features: ["Routines personnalisées", "Alertes préventives", "Techniques de relaxation"],
      cta: "Essayer gratuitement", 
      link: "/login"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (statsSection.isVisible) {
      setStatsVisible(true);
    }
  }, [statsSection.isVisible]);

  // Version B2C Simple (comme HomeB2CPage)
  if (detectedVariant === 'b2c-simple') {
    logger.debug('[UnifiedHomePage] Rendering B2C simple variant', undefined, 'UI');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" data-testid="page-root">
        {/* Header */}
        <header
          className="bg-white shadow-sm"
          role="banner"
          aria-label="En-tête principal EmotionsCare"
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="text-2xl font-bold text-gray-900">EmotionsCare</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost">Se connecter</Button>
              </Link>
              <Link to="/signup">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          aria-labelledby={heroHeadingId}
        >
          {/* Hero Section */}
          <section className="py-20" aria-labelledby={heroHeadingId}>
            <div className="container mx-auto px-4 text-center">
              <h1 id={heroHeadingId} className="text-5xl font-bold text-gray-900 mb-6">
                Prenez soin de votre bien-être émotionnel
              </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez une approche innovante du bien-être mental avec nos outils 
              d'analyse émotionnelle, de méditation guidée et de coaching personnalisé.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/signup">
                <Button size="lg" className="px-8">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/entreprise">
                <Button size="lg" variant="outline" className="px-8">
                  Solutions entreprise
                </Button>
              </Link>
            </div>
          </div>
          </section>

          {/* Features */}
          <section className="py-16 bg-white" aria-labelledby="b2c-features-heading">
            <div className="container mx-auto px-4">
              <h2
                id="b2c-features-heading"
                className="text-3xl font-bold text-center text-gray-900 mb-12"
              >
                Nos fonctionnalités phares
              </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Brain className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-3">Scan émotionnel IA</h3>
                  <p className="text-gray-600">
                    Analysez vos émotions en temps réel grâce à notre intelligence artificielle
                  </p>
                </CardContent>
              </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Smile className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-3">Modules Fun-First</h3>
                  <p className="text-gray-600">
                    Des expériences ludiques et immersives pour améliorer votre humeur
                  </p>
                </CardContent>
              </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-3">Coach personnel IA</h3>
                  <p className="text-gray-600">
                    Un accompagnement personnalisé pour votre développement personnel
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary text-primary-foreground" aria-labelledby="b2c-cta-heading">
            <div className="container mx-auto px-4 text-center">
              <h2 id="b2c-cta-heading" className="text-3xl font-bold mb-6">
                Prêt à transformer votre bien-être ?
              </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Créer mon compte gratuit
              </Button>
            </Link>
          </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-6 w-6" aria-hidden="true" />
                  <span className="text-xl font-bold">EmotionsCare</span>
                </div>
                <p className="text-gray-400">
                  La plateforme de référence pour le bien-être émotionnel
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Produit</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about" className="hover:text-white">À propos</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                  <li><Link to="/help" className="hover:text-white">Aide</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Solutions</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/b2c" className="hover:text-white">Particuliers</Link></li>
                  <li><Link to="/entreprise" className="hover:text-white">Entreprises</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Compte</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/login" className="hover:text-white">Connexion</Link></li>
                  <li><Link to="/signup" className="hover:text-white">Inscription</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Version Full Marketing (comme HomePage original)
  logger.debug('[UnifiedHomePage] Rendering full marketing variant', undefined, 'UI');
  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        aria-labelledby="homepage-hero-title"
        role="main"
      >
        {/* Hero Section Enhanced */}
        <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-background via-background/80 to-primary/5">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8 max-w-5xl mx-auto"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    ✨ Nouveau : Assistant IA Nyvée disponible
                  </Badge>
                </motion.div>
                
                <h1
                  id="homepage-hero-title"
                  className="text-5xl lg:text-7xl font-bold leading-tight"
                >
                  <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                    EmotionsCare
                  </span>
                  <br />
                  <span className="text-3xl lg:text-5xl text-foreground/90 font-medium">
                    L'IA qui comprend vos émotions
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Découvrez la première plateforme d'intelligence émotionnelle pilotée par l'IA. 
                  <strong className="text-foreground"> Transformez votre bien-être</strong> avec des outils scientifiquement validés et une expérience totalement personnalisée.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg" asChild>
                  <Link to="/b2c">
                    <Play className="h-5 w-5 mr-2" />
                    <span>Essai gratuit 30 jours</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-muted/50 px-8 py-4 text-lg" asChild>
                  <Link to="/entreprise">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>Solutions Entreprise</span>
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span>Aucune carte requise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                  <span>Installation instantanée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <span>100% sécurisé RGPD</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background Enhanced Decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
          </div>
        </section>

        {/* Stats Section Enhanced */}
        <motion.section
          ref={statsSection.ref}
          className="py-16 bg-muted/20"
          role="region"
          aria-labelledby="stats-section-heading"
        >
          {statsSection.isVisible ? (
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-4 mb-12"
              >
                <Badge variant="outline" className="mb-2">Performance en temps réel</Badge>
                <h2 id="stats-section-heading" className="text-3xl lg:text-4xl font-bold">
                  Des résultats qui parlent d'eux-mêmes
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Notre communauté grandit chaque jour et obtient des résultats mesurables
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center space-y-4"
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/50">
                      <CardContent className="p-0 space-y-4">
                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <div className="font-semibold">{stat.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {stat.description}
                          </div>
                          <Progress
                            value={statsVisible ? stat.progress : 0}
                            className="h-2 bg-muted"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="container space-y-8" aria-hidden="true">
              <div className="mx-auto flex flex-col items-center space-y-3 text-center">
                <span className="h-4 w-32 rounded-full bg-muted/40 animate-pulse" />
                <span className="h-8 w-64 rounded-full bg-muted/40 animate-pulse md:w-80" />
                <span className="h-4 w-56 rounded-full bg-muted/30 animate-pulse md:w-72" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-48 rounded-3xl bg-muted/40 animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.section>

        {/* Features Section Enhanced */}
        <section
          ref={featuresSection.ref}
          className="py-20 bg-background"
          role="region"
          aria-labelledby="features-section-heading"
        >
          {featuresSection.isVisible ? (
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-4 mb-16"
              >
                <Badge variant="secondary" className="mb-2">Intelligence Artificielle</Badge>
                <h2 id="features-section-heading" className="text-4xl lg:text-5xl font-bold">
                  Fonctionnalités de
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Nouvelle Génération</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Découvrez nos outils révolutionnaires conçus par des experts en psychologie et ingénieurs IA pour maximiser votre potentiel émotionnel.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background via-background to-muted/30 group-hover:from-primary/5 group-hover:to-primary/10">
                      <CardHeader className="pb-4">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl mb-4 flex items-center justify-center",
                          `bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`
                        )}>
                          <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                        </div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>

                        <div className="space-y-2">
                          {feature.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-4" />

                        <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-all" asChild>
                          <Link to={withLandingUtm(feature.demo)}>
                            <span>Essayer maintenant</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="container space-y-10" aria-hidden="true">
              <div className="mx-auto flex flex-col items-center space-y-3 text-center">
                <span className="h-4 w-40 rounded-full bg-muted/40 animate-pulse" />
                <span className="h-10 w-3/4 rounded-full bg-muted/40 animate-pulse md:w-2/3" />
                <span className="h-4 w-2/3 rounded-full bg-muted/30 animate-pulse md:w-1/2" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-64 rounded-3xl bg-muted/40 animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </section>
        {/* Use Cases Section */}
        <section ref={useCasesSection.ref} className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
          {useCasesSection.isVisible ? (
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-4 mb-16"
              >
                <Badge variant="outline" className="mb-2">Cas d'usage</Badge>
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Pour tous vos besoins émotionnels
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Que vous soyez un particulier, un professionnel ou une entreprise,
                  nos solutions s'adaptent parfaitement à votre contexte.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/50 group-hover:from-primary/5">
                      <CardHeader className="text-center pb-4">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                          <useCase.icon className="h-10 w-10 text-primary" aria-hidden="true" />
                        </div>
                        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {useCase.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 text-center">
                        <CardDescription className="text-base leading-relaxed">
                          {useCase.description}
                        </CardDescription>

                        <div className="space-y-3">
                          {useCase.features.map((feature, i) => (
                            <div key={i} className="flex items-center space-x-3 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                              <span className="text-muted-foreground text-left">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-6" />

                        <Button className="w-full group-hover:shadow-lg transition-all" asChild>
                          <Link to={useCase.link}>
                            <span>{useCase.cta}</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="container space-y-10" aria-hidden="true">
              <div className="mx-auto flex flex-col items-center space-y-3 text-center">
                <span className="h-4 w-32 rounded-full bg-muted/40 animate-pulse" />
                <span className="h-10 w-2/3 rounded-full bg-muted/40 animate-pulse md:w-1/2" />
                <span className="h-4 w-1/2 rounded-full bg-muted/30 animate-pulse md:w-1/3" />
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-72 rounded-3xl bg-muted/40 animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}
        </section>
        {/* Testimonials Section */}
        <section
          ref={testimonialsSection.ref}
          className="py-20 bg-background"
          role="region"
          aria-labelledby="testimonials-heading"
        >
          {testimonialsSection.isVisible ? (
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-4 mb-16"
              >
                <Badge variant="secondary" className="mb-2">Témoignages</Badge>
                <h2 id="testimonials-heading" className="text-4xl lg:text-5xl font-bold">
                  Ce que disent nos utilisateurs
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Des milliers de personnes nous font confiance pour leur bien-être émotionnel
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto" role="group" aria-live="polite" aria-atomic="true" aria-label="Carousel de témoignages">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 lg:p-12"
                >
                  <div className="text-center space-y-6">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].avatarAlt}
                        className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback avec placeholder
                          const target = e.currentTarget;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="32"%3E👤%3C/text%3E%3C/svg%3E';
                          target.onerror = null;
                        }}
                      />
                    </div>

                    <div className="flex justify-center space-x-1 mb-6" aria-label={`Note: ${testimonials[currentTestimonial].rating} étoiles sur 5`}>
                      {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                        <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      ))}
                    </div>

                    <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed text-foreground">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>

                    <div className="space-y-2">
                      <div className="font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                      <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                      <Badge variant="outline" className="mt-2">
                        {testimonials[currentTestimonial].company}
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-center space-x-2 mt-8" role="tablist" aria-label="Sélection de témoignage">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      type="button"
                      role="tab"
                      aria-label={`Afficher le témoignage ${index + 1}`}
                      aria-selected={index === currentTestimonial}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        index === currentTestimonial ? "bg-primary" : "bg-muted",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="container space-y-10" aria-hidden="true">
              <div className="mx-auto flex flex-col items-center space-y-3 text-center">
                <span className="h-4 w-32 rounded-full bg-muted/40 animate-pulse" />
                <span className="h-10 w-2/3 rounded-full bg-muted/40 animate-pulse md:w-1/2" />
                <span className="h-4 w-1/2 rounded-full bg-muted/30 animate-pulse md:w-1/3" />
              </div>
              <div className="max-w-4xl mx-auto h-72 rounded-3xl bg-muted/40 animate-pulse" />
              <div className="flex justify-center space-x-2">
                {Array.from({ length: testimonials.length }).map((_, index) => (
                  <div key={index} className="h-3 w-3 rounded-full bg-muted/40" />
                ))}
              </div>
            </div>
          )}
        </section>
        {/* Final CTA Section */}
        <section ref={finalCtaSection.ref} className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          {finalCtaSection.isVisible ? (
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center space-y-8 max-w-4xl mx-auto"
              >
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Prêt à transformer votre vie émotionnelle ?
                </h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  Rejoignez plus de 25 000 utilisateurs qui ont déjà découvert le pouvoir de l'intelligence émotionnelle.
                  Commencez votre parcours dès aujourd'hui avec notre essai gratuit de 30 jours.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" variant="secondary" className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all" asChild>
                    <Link to="/signup">
                      <Play className="h-5 w-5 mr-2" />
                      <span>Commencer maintenant</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg" asChild>
                    <Link to="/demo">
                      <Globe className="h-5 w-5 mr-2" />
                      <span>Voir la démo</span>
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Essai gratuit 30 jours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    <span>Sécurisé & Confidentiel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    <span>Support premium</span>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="container" aria-hidden="true">
              <div className="max-w-4xl mx-auto space-y-6 text-center">
                <div className="h-10 w-3/4 mx-auto rounded-full bg-white/40 animate-pulse" />
                <div className="h-6 w-2/3 mx-auto rounded-full bg-white/30 animate-pulse" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-12 w-44 rounded-full bg-white/30 animate-pulse"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-4 w-24 rounded-full bg-white/20 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Suspense
        fallback={(
          <div className="py-12 text-center text-sm text-muted-foreground" aria-busy="true">
            Chargement du pied de page…
          </div>
        )}
      >
        <Footer />
      </Suspense>
    </div>
  );
}