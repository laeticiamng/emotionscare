import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Header, Footer } from "@/components/layout";
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
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      rating: 5,
      text: "EmotionsCare a transformé ma gestion du stress. Le coach IA Nyvée m'aide quotidiennement à maintenir mon équilibre émotionnel.",
      highlight: "Transformation complète",
      company: "Fortune 500"
    },
    {
      name: "Marc D.",
      role: "Entrepreneur",
      avatar: "/images/avatar-marc.jpg", 
      rating: 5,
      text: "L'analyse faciale en temps réel me permet d'adapter mes présentations. Un avantage concurrentiel incroyable.",
      highlight: "Avantage concurrentiel",
      company: "Startup Tech"
    },
    {
      name: "Lisa K.",
      role: "Psychologue",
      avatar: "/images/avatar-lisa.jpg",
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

  return (
    <div className="min-h-screen bg-background" data-testid="page-root">
      <Header />
      
      <main role="main">
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
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
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
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Aucune carte requise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Installation instantanée</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
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
        <section 
          className="py-16 bg-muted/20"
          onViewportEnter={() => setStatsVisible(true)}
        >
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <Badge variant="outline" className="mb-2">Performance en temps réel</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
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
        </section>

        {/* Features Section Enhanced */}
        <section className="py-20 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <Badge variant="secondary" className="mb-2">Intelligence Artificielle</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">
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
                        <feature.icon className="h-8 w-8 text-white" />
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
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-all" asChild>
                        <Link to={feature.demo}>
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
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
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
                  <Card className="h-full p-8 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-background/50 group-hover:from-primary/5 group-hover:to-primary/10">
                    <CardContent className="p-0 space-y-6 text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                        <useCase.icon className="h-10 w-10 text-white" />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                          {useCase.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {useCase.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {useCase.features.map((feature, i) => (
                          <div key={i} className="flex items-center justify-center space-x-2 text-sm">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all" 
                        asChild
                      >
                        <Link to={useCase.link}>
                          {useCase.cta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16"
            >
              <Badge variant="secondary" className="mb-2">Témoignages</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Ils nous font confiance
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment EmotionsCare transforme la vie de nos utilisateurs
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8 border-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-xl">
                <CardContent className="p-0">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6"
                  >
                    <div className="flex justify-center">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed text-foreground">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {testimonials[currentTestimonial].name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="flex justify-center space-x-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-300",
                          index === currentTestimonial 
                            ? "bg-primary scale-125" 
                            : "bg-muted hover:bg-muted-foreground/30"
                        )}
                        aria-label={`Témoignage ${index + 1}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section Enhanced */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/80 text-white relative overflow-hidden">
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-8 max-w-4xl mx-auto"
            >
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
                  Offre limitée
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Transformez votre vie émotionnelle
                  <span className="block text-3xl lg:text-4xl font-normal mt-2 text-white/90">
                    dès aujourd'hui
                  </span>
                </h2>
                <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Rejoignez plus de <strong>25,000 utilisateurs</strong> qui ont déjà transformé leur bien-être émotionnel avec EmotionsCare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold" asChild>
                  <Link to="/login">
                    <Heart className="h-5 w-5 mr-2" />
                    <span>Commencer gratuitement</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4 text-lg" asChild>
                  <Link to="/help">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Découvrir les fonctionnalités
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="flex items-center justify-center space-x-3 text-white/90">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Sécurité garantie</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-white/90">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Support 24/7</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-white/90">
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">RGPD conforme</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}