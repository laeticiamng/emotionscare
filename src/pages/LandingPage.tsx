
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, BarChart3, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: 'Bien-être émotionnel',
      description: 'Suivez et analysez vos émotions pour améliorer votre bien-être mental',
      color: 'text-red-500'
    },
    {
      icon: Users,
      title: 'Connexion sociale',
      description: 'Partagez avec votre communauté et créez des liens authentiques',
      color: 'text-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Analyses avancées',
      description: 'Obtenez des insights personnalisés sur votre évolution émotionnelle',
      color: 'text-green-500'
    },
    {
      icon: Shield,
      title: 'Sécurité & confidentialité',
      description: 'Vos données sont protégées avec le plus haut niveau de sécurité',
      color: 'text-purple-500'
    }
  ];

  const benefits = [
    'Intelligence artificielle avancée pour l\'analyse émotionnelle',
    'Interface intuitive et accessible',
    'Communauté bienveillante et supportive',
    'Données chiffrées et sécurisées',
    'Support professionnel disponible 24/7',
    'Intégration avec vos outils existants'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/choose-mode')}>
              Se connecter
            </Button>
            <Button onClick={() => navigate('/choose-mode')}>
              Commencer
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            EmotionsCare vous accompagne dans votre parcours de bien-être mental avec des outils innovants 
            et une communauté bienveillante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/choose-mode')}
              className="text-lg px-8 py-6"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/choose-mode')}
              className="text-lg px-8 py-6"
            >
              Découvrir les fonctionnalités
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tout ce dont vous avez besoin pour votre bien-être
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des outils puissants et simples à utiliser pour prendre soin de votre santé mentale
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
              <Card className="h-full text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`mx-auto mb-4 p-3 rounded-full bg-gray-100 w-fit ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
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

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pourquoi choisir EmotionsCare ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nous combinons la technologie de pointe avec une approche humaine pour vous offrir 
              la meilleure expérience de bien-être émotionnel.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Scan émotionnel quotidien</h3>
                    <p className="text-sm text-muted-foreground">Suivez votre état émotionnel</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Communauté supportive</h3>
                    <p className="text-sm text-muted-foreground">Connectez-vous avec d'autres</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Insights personnalisés</h3>
                    <p className="text-sm text-muted-foreground">Analyses de vos progrès</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="text-center p-12 bg-gradient-to-r from-primary/10 to-purple-600/10">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à commencer votre parcours de bien-être ?
            </CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur bien-être émotionnel 
              avec EmotionsCare.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/choose-mode')}
                className="text-lg px-8 py-6"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/choose-mode')}
                className="text-lg px-8 py-6"
              >
                En savoir plus
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EmotionsCare</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 EmotionsCare. Tous droits réservés. Prenez soin de vous.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
