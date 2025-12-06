/**
 * ABOUT PAGE - EMOTIONSCARE
 * Page À propos accessible WCAG 2.1 AA
 */

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Brain, 
  Users, 
  Shield, 
  Award, 
  Target,
  Lightbulb,
  Globe,
  TrendingUp,
  CheckCircle,
  Star,
  MessageSquare,
  Zap,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  // Focus management pour l'accessibilité
  useEffect(() => {
    document.title = "À Propos | EmotionsCare - Intelligence émotionnelle";
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const values = [
    {
      icon: Heart,
      title: "Empathie",
      description: "Nous comprenons l'importance du bien-être émotionnel et accompagnons chaque utilisateur avec bienveillance."
    },
    {
      icon: Shield,
      title: "Confidentialité",
      description: "Vos données émotionnelles sont sacrées. Nous garantissons leur protection totale et leur confidentialité."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Nous utilisons les dernières avancées en IA et neurosciences pour créer des solutions révolutionnaires."
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Nous croyons en la force du collectif pour créer un environnement de soutien et d'entraide."
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "IA Émotionnelle Avancée",
      description: "Analyse précise de vos émotions en temps réel"
    },
    {
      icon: Target,
      title: "Coaching Personnalisé",
      description: "Accompagnement adapté à votre profil unique"
    },
    {
      icon: TrendingUp,
      title: "Suivi de Progression",
      description: "Visualisation de votre évolution émotionnelle"
    },
    {
      icon: Globe,
      title: "Accessibilité Universelle",
      description: "Disponible partout, pour tous"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Utilisateurs Actifs" },
    { number: "1M+", label: "Analyses Émotionnelles" },
    { number: "95%", label: "Satisfaction Client" },
    { number: "24/7", label: "Support Disponible" }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Directrice Scientifique",
      speciality: "Neurosciences & IA",
      description: "Experte en neurosciences cognitives et intelligence artificielle émotionnelle."
    },
    {
      name: "Marc Dubois",
      role: "CTO",
      speciality: "Architecture Technique",
      description: "15 ans d'expérience dans le développement de solutions de santé numérique."
    },
    {
      name: "Dr. Emma Rodriguez",
      role: "Responsable Bien-être",
      speciality: "Psychologie Positive",
      description: "Psychologue clinicienne spécialisée dans la thérapie cognitivo-comportementale."
    }
  ];

  const certifications = [
    { name: "ISO 27001", description: "Sécurité de l'information" },
    { name: "RGPD", description: "Protection des données" },
    { name: "HDS", description: "Hébergement de données de santé" },
    { name: "CE Médical", description: "Dispositif médical certifié" }
  ];

  return (
    <>
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        tabIndex={0}
      >
        Aller au contenu principal
      </a>

      <div className="container mx-auto px-4 py-8 max-w-7xl" data-testid="page-root">
        <main id="main-content" role="main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <section className="text-center mb-16" aria-labelledby="hero-title">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 
                id="hero-title"
                className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                  À Propos d'EmotionsCare
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Nous révolutionnons le bien-être émotionnel grâce à l'intelligence artificielle, 
                  en créant un monde où chacun peut comprendre, gérer et améliorer sa santé mentale.
                </p>
                <nav aria-label="Actions principales" className="flex flex-wrap justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')}
                    onKeyDown={(e) => handleKeyDown(e, () => navigate('/auth'))}
                    className="bg-gradient-to-r from-primary to-accent focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Commencer gratuitement avec EmotionsCare"
                    tabIndex={0}
                  >
                    Commencer Gratuitement
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/contact')}
                    onKeyDown={(e) => handleKeyDown(e, () => navigate('/contact'))}
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Contacter l'équipe EmotionsCare"
                    tabIndex={0}
                  >
                    Nous Contacter
                  </Button>
                </nav>
              </motion.div>
            </section>

            {/* Stats Section */}
            <section 
              className="mb-16"
              aria-labelledby="stats-title"
            >
              <h2 id="stats-title" className="sr-only">Statistiques de performance</h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
                role="group"
                aria-label="Statistiques d'utilisation EmotionsCare"
              >
                {stats.map((stat, index) => (
                  <article key={index}>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div 
                          className="text-3xl font-bold text-primary mb-2"
                          aria-label={`${stat.number} ${stat.label}`}
                        >
                          {stat.number}
                        </div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </article>
                ))}
              </motion.div>
            </section>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Notre Mission</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Démocratiser l'accès au bien-être émotionnel en rendant les outils de santé mentale 
                    intelligents, accessibles et efficaces pour tous, partout dans le monde.
                  </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span>Technologie de pointe au service de la santé mentale</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span>Approche scientifique et validation clinique</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span>Respect absolu de la vie privée</span>
                      </div>
                    </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-primary-foreground">
                    <h3 className="text-2xl font-bold mb-4">Vision 2030</h3>
                    <p className="mb-4">
                      Devenir la référence mondiale en matière de bien-être émotionnel numérique, 
                      en aidant 100 millions de personnes à mieux comprendre et gérer leurs émotions.
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      <span className="font-medium">Impact Global</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

            {/* Values Section */}
            <section 
              className="mb-16"
              aria-labelledby="values-title"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <header className="text-center mb-12">
                  <h2 id="values-title" className="text-3xl font-bold mb-4">Nos Valeurs</h2>
                  <p className="text-lg text-muted-foreground">
                    Les principes qui guident chacune de nos décisions et innovations
                  </p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {values.map((value, index) => (
                    <motion.article
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="h-full text-center hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div 
                            className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4"
                            role="img"
                            aria-label={`Icône ${value.title}`}
                          >
                            <value.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </CardContent>
                      </Card>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            </section>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Innovations</h2>
            <p className="text-lg text-muted-foreground">
              Des technologies révolutionnaires pour votre bien-être
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
            <p className="text-lg text-muted-foreground">
              Des experts passionnés au service de votre bien-être
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
                  <CardDescription>{member.role}</CardDescription>
                  <Badge variant="secondary">{member.speciality}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Award className="h-6 w-6 text-primary" />
                  Certifications & Conformité
                </h2>
                <CardDescription>
                  Notre engagement envers la sécurité et la qualité
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="text-center">
                    <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-xs text-muted-foreground">{cert.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

            {/* CTA Section */}
            <section aria-labelledby="cta-title">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-center"
              >
                <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
                  <CardContent className="py-12">
                    <h2 id="cta-title" className="text-3xl font-bold mb-4">
                      Prêt à Transformer Votre Bien-être ?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Rejoignez des milliers d'utilisateurs qui ont déjà commencé leur parcours 
                      vers un meilleur équilibre émotionnel avec EmotionsCare.
                    </p>
                    <nav aria-label="Actions finales" className="flex flex-wrap justify-center gap-4">
                      <Button 
                        size="lg"
                        onClick={() => navigate('/auth')}
                        onKeyDown={(e) => handleKeyDown(e, () => navigate('/auth'))}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Commencer maintenant avec EmotionsCare"
                        tabIndex={0}
                      >
                        <Zap className="h-4 w-4 mr-2" aria-hidden="true" />
                        Commencer Maintenant
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/help')}
                        onKeyDown={(e) => handleKeyDown(e, () => navigate('/help'))}
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Poser une question à l'équipe EmotionsCare"
                        tabIndex={0}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                        Poser une Question
                      </Button>
                    </nav>
                  </CardContent>
                </Card>
              </motion.div>
            </section>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AboutPage;
