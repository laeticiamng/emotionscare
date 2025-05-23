
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Analyse émotionnelle",
      description: "Scanner intelligent de vos émotions via texte, audio ou emojis"
    },
    {
      icon: <Brain className="h-8 w-8 text-blue-500" />,
      title: "Coach IA personnalisé",
      description: "Conseils personnalisés basés sur votre profil émotionnel"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Communauté bienveillante",
      description: "Partagez votre parcours avec une communauté soutenante"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Sécurité et confidentialité",
      description: "Vos données sont protégées et restent privées"
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      text: "EmotionsCare m'a aidé à mieux comprendre mes émotions et à gérer mon stress quotidien.",
      rating: 5
    },
    {
      name: "Thomas D.",
      text: "L'analyse émotionnelle est très précise et les conseils du coach IA sont vraiment utiles.",
      rating: 5
    },
    {
      name: "Sophie M.",
      text: "La communauté est formidable, je me sens moins seule dans mon parcours bien-être.",
      rating: 5
    }
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
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/choose-mode')}>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Prenez soin de votre bien-être émotionnel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Découvrez comment notre plateforme utilise l'intelligence artificielle pour analyser vos émotions 
            et vous proposer des solutions personnalisées pour améliorer votre bien-être quotidien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/choose-mode')} className="group">
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')}>
              Solutions entreprise
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités principales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des outils puissants pour comprendre et améliorer votre bien-être émotionnel
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
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
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-6">Pourquoi choisir EmotionsCare ?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Analyse précise</h3>
                    <p className="text-muted-foreground">
                      Notre IA analyse vos émotions avec une précision de 95%
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Conseils personnalisés</h3>
                    <p className="text-muted-foreground">
                      Recevez des recommandations adaptées à votre profil unique
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Suivi continu</h3>
                    <p className="text-muted-foreground">
                      Visualisez votre évolution dans le temps avec des rapports détaillés
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Communauté active</h3>
                    <p className="text-muted-foreground">
                      Rejoignez plus de 10 000 utilisateurs dans leur parcours bien-être
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 text-center">
                <Heart className="h-24 w-24 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Votre bien-être, notre priorité</h3>
                <p className="text-muted-foreground">
                  Rejoignez des milliers d'utilisateurs qui ont amélioré leur qualité de vie 
                  grâce à EmotionsCare
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
          <p className="text-muted-foreground">
            Découvrez les témoignages de personnes qui ont transformé leur bien-être
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold">
                    - {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Prêt(e) à commencer votre parcours ?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez EmotionsCare dès aujourd'hui et découvrez comment prendre soin 
              de votre bien-être émotionnel peut transformer votre vie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/choose-mode')}>
                Commencer gratuitement
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/b2b/selection')}>
                Solutions entreprise
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">EmotionsCare</span>
              </div>
              <p className="text-muted-foreground">
                Votre compagnon pour un bien-être émotionnel optimal.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-primary">Tarifs</a></li>
                <li><a href="#" className="hover:text-primary">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">À propos</a></li>
                <li><a href="#" className="hover:text-primary">Carrières</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Documentation</a></li>
                <li><a href="#" className="hover:text-primary">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-primary">Statut</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
