
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Users, Shield, Sparkles, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'IA Émotionnelle',
      description: 'Analyse avancée de vos émotions par intelligence artificielle'
    },
    {
      icon: Heart,
      title: 'Coach Personnel',
      description: 'Accompagnement bienveillant 24h/24 pour votre bien-être'
    },
    {
      icon: Users,
      title: 'Solutions B2B',
      description: 'Outils professionnels pour le bien-être en entreprise'
    },
    {
      icon: Shield,
      title: 'Données Sécurisées',
      description: 'Confidentialité et sécurité de vos données personnelles'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Martin',
      role: 'Développeuse',
      content: 'EmotionsCare m\'a aidé à mieux gérer mon stress au travail. L\'IA coach est remarquable !',
      rating: 5
    },
    {
      name: 'Pierre Dubois',
      role: 'Manager RH',
      content: 'Excellent outil pour le bien-être de nos équipes. Les analyses sont très pertinentes.',
      rating: 5
    },
    {
      name: 'Marie Laurent',
      role: 'Consultante',
      content: 'Interface intuitive et conseils personnalisés. Je recommande vivement !',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="flex justify-center"
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <Brain className="h-16 w-16 text-primary" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Votre compagnon IA pour le bien-être émotionnel. Analysez, comprenez et améliorez votre santé mentale avec l'intelligence artificielle.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/choose-mode')}
              className="text-lg px-8 py-6 flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/b2b/selection')}
              className="text-lg px-8 py-6"
            >
              Solutions Entreprise
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Gratuit 3 jours</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Données sécurisées</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir EmotionsCare ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une approche innovante du bien-être émotionnel, alimentée par l'intelligence artificielle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="text-center h-full border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
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
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comment ça fonctionne ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trois étapes simples pour améliorer votre bien-être émotionnel
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Analysez vos émotions',
              description: 'Exprimez-vous par texte ou par voix. Notre IA analyse votre état émotionnel en temps réel.'
            },
            {
              step: '2',
              title: 'Recevez des conseils',
              description: 'Obtenez des recommandations personnalisées et un coaching adapté à vos besoins.'
            },
            {
              step: '3',
              title: 'Suivez vos progrès',
              description: 'Visualisez votre évolution et atteignez vos objectifs de bien-être étape par étape.'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont transformé leur bien-être
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center space-y-8"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Sparkles className="h-16 w-16 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Prêt à transformer votre bien-être ?
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Commencez votre parcours vers un meilleur équilibre émotionnel dès aujourd'hui. 
                  Essai gratuit de 3 jours, sans engagement.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/choose-mode')}
                    className="text-lg px-8 py-6 flex items-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    Commencer gratuitement
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/b2b/selection')}
                    className="text-lg px-8 py-6"
                  >
                    En savoir plus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Votre compagnon IA pour le bien-être émotionnel
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produit</h4>
              <div className="space-y-2 text-sm">
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/choose-mode')}>
                  Espace Personnel
                </Button>
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/b2b/selection')}>
                  Solutions B2B
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm">
                <Button variant="link" className="p-0 h-auto">
                  Centre d'aide
                </Button>
                <Button variant="link" className="p-0 h-auto">
                  Contact
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Légal</h4>
              <div className="space-y-2 text-sm">
                <Button variant="link" className="p-0 h-auto">
                  Confidentialité
                </Button>
                <Button variant="link" className="p-0 h-auto">
                  Conditions
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
