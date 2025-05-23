
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Users, Shield, ArrowRight, Sparkles, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "IA Émotionnelle Avancée",
      description: "Analyse en temps réel de vos émotions par text, voix et expressions faciales"
    },
    {
      icon: Heart,
      title: "Bien-être Personnalisé",
      description: "Recommandations adaptées à votre profil émotionnel unique"
    },
    {
      icon: Users,
      title: "Communauté Bienveillante",
      description: "Échangez avec d'autres utilisateurs dans un environnement sécurisé"
    },
    {
      icon: Shield,
      title: "Données Protégées",
      description: "Vos informations personnelles sont chiffrées et sécurisées"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Utilisateurs actifs" },
    { value: "95%", label: "Satisfaction client" },
    { value: "24/7", label: "Support disponible" },
    { value: "3 jours", label: "Essai gratuit" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Heart className="h-6 w-6 text-primary" />
            EmotionsCare
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/choose-mode')}>
              Se connecter
            </Button>
            <Button onClick={() => navigate('/b2c/register')}>
              Essai gratuit 3 jours
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Nouvelle génération d'IA émotionnelle
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            Prenez soin de votre 
            <span className="text-primary"> bien-être émotionnel</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            EmotionsCare utilise l'intelligence artificielle pour analyser vos émotions et vous accompagner vers un meilleur équilibre mental
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" onClick={() => navigate('/b2c/register')} className="gap-2">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/choose-mode')}>
              Découvrir les fonctionnalités
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Une approche complète du bien-être
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nos outils d'IA avancée s'adaptent à vos besoins pour un accompagnement personnalisé
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
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
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à commencer votre parcours ?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel avec EmotionsCare
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" onClick={() => navigate('/b2c/register')} className="gap-2">
                <Award className="h-4 w-4" />
                Essai gratuit 3 jours
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/choose-mode')}>
                Explorer les offres
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Heart className="h-5 w-5 text-primary" />
              EmotionsCare
            </div>
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" onClick={() => navigate('/help')}>
                Aide
              </Button>
              <Button variant="ghost" size="sm">
                Confidentialité
              </Button>
              <Button variant="ghost" size="sm">
                Conditions
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
