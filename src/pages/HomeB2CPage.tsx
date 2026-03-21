import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Card3D from '@/components/ui/Card3D';
import { Badge } from '@/components/ui/badge';
import '@/styles/premium-3d-player.css';
import {
  Brain,
  Heart,
  Sparkles,
  Camera,
  Headphones,
  TrendingUp,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Zap,
  Music,
  BarChart3,
  MessageCircle,
  Award,
  Trees,
  Star
} from 'lucide-react';
import { routes } from '@/routerV2';
import { usePageSEO } from '@/hooks/usePageSEO';

const HeroScene3D = lazy(() => import('@/components/3d/HeroScene3D'));

const HomeB2CPage: React.FC = () => {
  usePageSEO({
    title: 'EmotionsCare - Votre Compagnon de Bien-Être Émotionnel IA',
    description: 'Transformez votre bien-être mental avec EmotionsCare. Scan émotionnel IA, musicothérapie personnalisée, coach virtuel 24/7. Outils scientifiques pour une vie plus équilibrée.',
    keywords: 'bien-être mental, intelligence artificielle, scan émotionnel, musicothérapie, coach virtuel, santé mentale, développement personnel'
  });

  const features = [
    {
      icon: Camera,
      title: 'Scan Émotionnel IA',
      description: 'Analysez vos émotions en temps réel grâce à notre reconnaissance faciale et vocale avancée',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Headphones,
      title: 'Musicothérapie Personnalisée',
      description: 'Des playlists thérapeutiques adaptées à votre humeur avec fréquences binaurales',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
    },
    {
      icon: Brain,
      title: 'Coach IA Empathique',
      description: 'Accompagnement personnalisé 24/7 par notre intelligence artificielle bienveillante',
      color: 'from-emerald-500 to-teal-500',
      gradient: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
    },
    {
      icon: BarChart3,
      title: 'Suivi & Analytics',
      description: 'Visualisez votre progression avec des insights personnalisés et des recommandations IA',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-r from-orange-500/10 to-red-500/10'
    }
  ];

  const stats = [
    { icon: Users, value: '7', label: 'Modules disponibles' },
    { icon: Star, value: '6', label: 'Protocoles scientifiques' },
    { icon: Award, value: '100%', label: 'Conforme RGPD' },
    { icon: TrendingUp, value: '3 min', label: 'Intervention rapide' }
  ];

  const benefits = [
    'Scan émotionnel en temps réel',
    'Playlists thérapeutiques personnalisées',
    'Coach IA disponible 24/7',
    'Journal émotionnel chiffré',
    'Suivi de progression détaillé',
    'Exercices de respiration guidés',
    'Recommandations personnalisées',
    'Conformité RGPD & sécurité maximale'
  ];

  const moduleHighlights = [
    {
      icon: Brain,
      title: 'Scan émotionnel IA',
      content: 'Évaluez votre état émotionnel en quelques questions. Score sur 5 dimensions : humeur, énergie, stress, sommeil et charge mentale.',
    },
    {
      icon: Music,
      title: 'Musicothérapie personnalisée',
      content: 'Fréquences binaurales, ambiances apaisantes et compositions adaptées à votre état émotionnel du moment.',
    },
    {
      icon: MessageCircle,
      title: 'Coach IA',
      content: 'Un accompagnement bienveillant disponible 24/7, adapté aux professionnels de santé et étudiants.',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section — ACTE 1: CAPTER — Ouverture cinématique */}
      <section className="relative overflow-hidden min-h-[70vh] md:min-h-[90vh] flex items-center">
        {/* 3D background — the opening shot */}
        <Suspense fallback={null}>
          <HeroScene3D />
        </Suspense>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1.5 inline" />
                  Intelligence Artificielle & Bien-Être
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                Votre Compagnon de{' '}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Bien-Être Émotionnel
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl text-muted-foreground leading-relaxed"
              >
                Transformez votre santé mentale avec EmotionsCare.
                Notre IA analyse vos émotions, vous accompagne et vous guide vers
                une vie plus équilibrée et épanouie.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <Link to={routes.auth.signup()}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Commencer gratuitement
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 backdrop-blur-sm">
                  <Link to="/features">
                    <Camera className="w-5 h-5 mr-2" />
                    Découvrir les fonctionnalités
                  </Link>
                </Button>
              </motion.div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4 text-primary" />
                  <span>Créé par une médecin</span>
                  <span className="text-border">•</span>
                  <span>Gratuit pour commencer</span>
                  <span className="text-border">•</span>
                  <span>Conforme RGPD</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-sm border border-primary/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`${feature.gradient} p-4 rounded-2xl border border-white/20 backdrop-blur`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section — ACTE 2: RASSURER — Respiration informative */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parc Émotionnel Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link to="/app/emotional-park" className="block">
              <div className="group relative rounded-3xl p-6 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 text-white shadow-xl backdrop-blur-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Trees className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-1">Parc Émotionnel</h3>
                    <p className="text-sm opacity-90">
                      Explorez votre monde intérieur dans un espace interactif et apaisant
                    </p>
                  </div>
                  
                  <Button 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-xl group-hover:bg-white group-hover:text-green-600 transition-all duration-300"
                  >
                    Explorer
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Fonctionnalités</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d'outils IA pour prendre soin de votre santé mentale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card3D className="h-full p-6" animate={false}>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4">Avantages</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pourquoi choisir EmotionsCare ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Une plateforme complète qui combine intelligence artificielle,
                neurosciences et design centré sur l'humain pour votre bien-être.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <Card3D className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 !border-blue-500/20 p-6 text-center" animate={false}>
                    <Music className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                    <div className="text-2xl font-bold mb-1">10+</div>
                    <div className="text-sm text-muted-foreground">Modules intégrés</div>
                </Card3D>
                <Card3D className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 !border-purple-500/20 p-6 text-center" animate={false}>
                    <MessageCircle className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                    <div className="text-2xl font-bold mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Coach IA disponible</div>
                </Card3D>
                <Card3D className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 !border-emerald-500/20 p-6 text-center" animate={false}>
                    <Shield className="w-8 h-8 mx-auto mb-3 text-emerald-500" />
                    <div className="text-2xl font-bold mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">Données sécurisées</div>
                </Card3D>
                <Card3D className="bg-gradient-to-br from-orange-500/10 to-red-500/10 !border-orange-500/20 p-6 text-center" animate={false}>
                    <TrendingUp className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                    <div className="text-2xl font-bold mb-1">3 min</div>
                    <div className="text-sm text-muted-foreground">Par exercice</div>
                </Card3D>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Highlights Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Modules</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Des outils concrets pour votre bien-être
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos modules conçus pour les professionnels de santé
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {moduleHighlights.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card3D className="h-full p-6" animate={false}>
                      <Icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                      <p className="text-muted-foreground">{module.content}</p>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section — ACTE 3: FAIRE ENTRER — Tension narrative vers l'action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(255,255,255,0.05)_0%,transparent_40%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-white"
          >
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Prêt à prendre soin de votre bien-être ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              Découvrez des outils concrets pour prendre soin de votre bien-être émotionnel
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" variant="secondary" className="text-lg h-14 px-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <Link to={routes.auth.signup()}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm transition-all duration-300">
                <Link to="/about">
                  En savoir plus
                </Link>
              </Button>
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                100% gratuit pour commencer
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Aucune carte requise
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Annulation simple
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer médical */}
      <section className="py-6 border-t border-border/30">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
            EmotionsCare est un outil de prévention et de bien-être émotionnel. Il ne constitue pas un dispositif médical
            et ne remplace pas un suivi médical, psychologique ou psychiatrique.{' '}
            <Link to="/security" className="underline hover:text-foreground">En savoir plus</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomeB2CPage;
