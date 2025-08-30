import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "IA Personnalisée",
      description: "Coach virtuel adapté à vos besoins émotionnels",
      color: "text-blue-500"
    },
    {
      icon: Music,
      title: "Musique Thérapeutique",
      description: "Compositions générées selon votre état émotionnel",
      color: "text-purple-500"
    },
    {
      icon: Camera,
      title: "Analyse Faciale",
      description: "Détection d'émotions en temps réel",
      color: "text-green-500"
    },
    {
      icon: MessageCircle,
      title: "Journal Privé",
      description: "Espace sécurisé pour vos pensées",
      color: "text-orange-500"
    }
  ];

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
                <Button size="lg" asChild className="flex items-center space-x-2">
                  <Link to="/b2c">
                    <Users className="h-5 w-5" />
                    <span>Découvrir B2C</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="flex items-center space-x-2">
                  <Link to="/entreprise">
                    <Shield className="h-5 w-5" />
                    <span>Solutions Entreprise</span>
                  </Link>
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
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
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
              {stats.map((stat, index) => (
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
                <Button size="lg" asChild className="flex items-center space-x-2">
                  <Link to="/login">
                    <Heart className="h-5 w-5" />
                    <span>Commencer Gratuitement</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/help">
                    En savoir plus
                  </Link>
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
}