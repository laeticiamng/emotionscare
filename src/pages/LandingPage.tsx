import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Brain, Music, Users, Activity, Sparkles, ArrowRight, 
  CheckCircle, Zap, Star, Globe, Shield, Play, Mic, 
  BookOpen, Headphones, MessageCircle, Target, TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Scan Émotionnel IA',
    description: 'Analyse en temps réel de votre état émotionnel grâce à l\'IA multimodale',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Music,
    title: 'Thérapie Musicale',
    description: 'Musique thérapeutique générée selon vos besoins émotionnels',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Coach IA Personnel',
    description: 'Accompagnement personnalisé 24/7 par votre coach virtuel',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Activity,
    title: 'Exercices Respiratoires',
    description: 'Techniques de respiration guidées pour la relaxation',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: BookOpen,
    title: 'Journal Émotionnel',
    description: 'Suivi de vos émotions avec analyses et recommandations IA',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Mic,
    title: 'Analyse Vocale',
    description: 'Détection des émotions dans votre voix pour un suivi précis',
    gradient: 'from-teal-500 to-blue-500'
  }
];

const testimonials = [
  {
    name: 'Marie L.',
    role: 'Utilisatrice depuis 6 mois',
    content: 'EmotionsCare a transformé ma gestion du stress. L\'IA comprend vraiment mes besoins.',
    rating: 5
  },
  {
    name: 'Thomas R.',
    role: 'Thérapeute',
    content: 'Un outil révolutionnaire pour accompagner mes patients entre les séances.',
    rating: 5
  },
  {
    name: 'Sophie M.',
    role: 'Étudiante',
    content: 'Le coach IA m\'aide énormément pendant mes périodes d\'examens.',
    rating: 5
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="p-2 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-6 w-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-foreground">EmotionsCare</h1>
              <p className="text-xs text-muted-foreground">Votre bien-être digital</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Fonctionnalités
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              À propos
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Témoignages
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Commencer</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-accent/20 to-transparent rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Nouveau : Coach IA émotionnel
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Prenez soin de votre
              <br />
              <span className="text-primary">bien-être émotionnel</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez la première plateforme d'intelligence artificielle dédiée à votre santé mentale. 
              Analyse émotionnelle, coaching personnalisé et thérapies innovantes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Link to="/signup">
                  <Zap className="w-4 h-4 mr-2" />
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="group">
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Voir la démo
              </Button>
            </div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center justify-center space-x-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background" />
                  ))}
                </div>
                <span>+10,000 utilisateurs</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span>4.9/5 satisfaction</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Une approche révolutionnaire du bien-être
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nos outils d'IA avancée vous accompagnent dans votre parcours vers un équilibre émotionnel optimal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Trois étapes simples pour commencer votre parcours bien-être
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Évaluez votre état', description: 'Analysez vos émotions avec notre scan IA', icon: Brain },
              { step: '2', title: 'Recevez un plan personnalisé', description: 'Notre IA crée un programme adapté à vos besoins', icon: Target },
              { step: '3', title: 'Suivez vos progrès', description: 'Mesurez votre évolution avec des outils avancés', icon: TrendingUp },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                    {item.step}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-muted-foreground">
              Des milliers de personnes ont déjà transformé leur bien-être avec EmotionsCare
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà commencé leur parcours vers un équilibre émotionnel optimal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">
                  <Heart className="w-4 h-4 mr-2" />
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-4 h-4" />
                <span>Gratuit • Sans engagement • Sécurisé</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-muted-foreground">
                La première plateforme IA dédiée à votre bien-être émotionnel.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sécurité</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Shield className="w-4 h-4 text-muted-foreground" />
              <Heart className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;