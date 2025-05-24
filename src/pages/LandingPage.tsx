
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Brain, Users, Shield, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Scanner d\'émotions',
      description: 'Analysez votre état émotionnel en temps réel avec nos technologies avancées',
      icon: Brain,
      color: 'bg-blue-500'
    },
    {
      title: 'Coach IA personnalisé',
      description: 'Recevez des conseils adaptés à votre situation émotionnelle',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Musique thérapeutique',
      description: 'Écoutez des mélodies générées spécialement pour votre bien-être',
      icon: Heart,
      color: 'bg-green-500'
    },
    {
      title: 'Solutions entreprise',
      description: 'Accompagnez vos équipes avec des outils dédiés au bien-être au travail',
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const benefits = [
    'Scanner émotionnel avancé avec IA',
    'Coach personnel intelligent',
    'Musique générée sur mesure',
    'Suivi de progression détaillé',
    'Solutions B2B complètes',
    'Sécurité et confidentialité maximales'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/choose-mode')}>
                Accéder à l'application
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/choose-mode')}>
                  Se connecter
                </Button>
                <Button onClick={() => navigate('/choose-mode')}>
                  Commencer gratuitement
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Prenez soin de votre <span className="text-primary">bien-être émotionnel</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            EmotionsCare utilise l'intelligence artificielle pour vous accompagner dans la gestion de vos émotions,
            que vous soyez un particulier ou une entreprise soucieuse du bien-être de ses collaborateurs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => navigate('/choose-mode')}>
              <Zap className="h-5 w-5 mr-2" />
              Commencer gratuitement
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')}>
              <Shield className="h-5 w-5 mr-2" />
              Solutions entreprise
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>3 jours gratuits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Aucune carte requise</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Données sécurisées</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Une plateforme complète pour votre bien-être</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos fonctionnalités innovantes conçues pour vous accompagner au quotidien
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Pourquoi choisir EmotionsCare ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Notre plateforme combine les dernières avancées en intelligence artificielle 
                avec une approche humaine du bien-être émotionnel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl p-8 text-center">
                <Heart className="h-24 w-24 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Commencez votre parcours</h3>
                <p className="text-muted-foreground mb-6">
                  Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur bien-être émotionnel
                </p>
                <Button size="lg" onClick={() => navigate('/choose-mode')}>
                  Essayer gratuitement
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre bien-être émotionnel ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Commencez dès aujourd'hui avec 3 jours d'essai gratuit. 
            Aucune carte de crédit requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/choose-mode')}>
              Commencer gratuitement
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/help')}>
              En savoir plus
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Votre partenaire pour un bien-être émotionnel optimal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Particuliers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/b2c/login" className="hover:text-primary">Se connecter</a></li>
                <li><a href="/b2c/register" className="hover:text-primary">Créer un compte</a></li>
                <li><a href="/choose-mode" className="hover:text-primary">Commencer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprises</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/b2b/selection" className="hover:text-primary">Solutions B2B</a></li>
                <li><a href="/b2b/admin/login" className="hover:text-primary">Espace admin</a></li>
                <li><a href="/b2b/user/login" className="hover:text-primary">Espace collaborateur</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-primary">Centre d'aide</a></li>
                <li><a href="/settings" className="hover:text-primary">Paramètres</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
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
