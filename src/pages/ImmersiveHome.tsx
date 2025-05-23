
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Users, Shield, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Analyse IA avancée",
      description: "Intelligence artificielle pour comprendre vos émotions en profondeur"
    },
    {
      icon: Heart,
      title: "Suivi en temps réel",
      description: "Monitoring continu de votre bien-être émotionnel"
    },
    {
      icon: Users,
      title: "Communauté bienveillante",
      description: "Partagez et connectez-vous avec d'autres utilisateurs"
    },
    {
      icon: Shield,
      title: "Confidentialité garantie",
      description: "Vos données sont protégées et chiffrées"
    }
  ];

  const useCases = [
    {
      title: "Pour les particuliers",
      description: "Développez votre intelligence émotionnelle personnelle",
      benefits: ["Gestion du stress", "Amélioration du sommeil", "Équilibre émotionnel"],
      cta: "Commencer gratuitement",
      action: () => navigate('/b2c/register')
    },
    {
      title: "Pour les entreprises",
      description: "Améliorez le bien-être de vos équipes",
      benefits: ["Réduction du burnout", "Productivité accrue", "Rétention des talents"],
      cta: "Découvrir la solution B2B",
      action: () => navigate('/b2b/selection')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-4">
                <Zap className="h-3 w-3 mr-1" />
                Technologie IA avancée
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Prenez soin de votre
                <span className="text-primary block">bien-être émotionnel</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
                EmotionsCare utilise l'intelligence artificielle pour vous aider à comprendre, 
                analyser et améliorer votre santé mentale au quotidien.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" onClick={() => navigate('/choose-mode')} className="text-lg px-8">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')} className="text-lg px-8">
                Solution entreprise
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle className="h-4 w-4 text-green-500" />
              Gratuit pour commencer
              <CheckCircle className="h-4 w-4 text-green-500 ml-4" />
              Données sécurisées
              <CheckCircle className="h-4 w-4 text-green-500 ml-4" />
              Support 24/7
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir EmotionsCare ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une approche innovante du bien-être mental basée sur l'intelligence artificielle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Adapté à vos besoins
            </h2>
            <p className="text-xl text-muted-foreground">
              Que vous soyez un particulier ou une entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {useCase.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button onClick={useCase.action} size="lg" className="w-full">
                      {useCase.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur santé mentale avec EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate('/b2c/register')} className="text-lg px-8">
                Essayer gratuitement
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/choose-mode')} className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Se connecter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">EmotionsCare</span>
            </div>
            <p className="text-muted-foreground">
              Votre partenaire pour un bien-être émotionnel durable
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate('/help')}>Aide</button>
              <button>Confidentialité</button>
              <button>Conditions</button>
              <button>Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
