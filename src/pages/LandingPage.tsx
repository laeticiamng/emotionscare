
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Heart, 
  Users, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'IA Émotionnelle Avancée',
      description: 'Analysez vos émotions en temps réel avec notre intelligence artificielle'
    },
    {
      icon: Heart,
      title: 'Coach Personnel 24/7',
      description: 'Un accompagnement personnalisé disponible à tout moment'
    },
    {
      icon: Users,
      title: 'Solutions Entreprise',
      description: 'Améliorez le bien-être de vos équipes avec nos outils B2B'
    },
    {
      icon: Shield,
      title: 'Confidentialité Garantie',
      description: 'Vos données émotionnelles sont protégées et sécurisées'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'DRH, TechCorp',
      comment: 'EmotionsCare a transformé le bien-être de nos équipes. -30% de stress reporté !',
      rating: 5
    },
    {
      name: 'Pierre Martin',
      role: 'Utilisateur particulier',
      comment: 'Le coach IA m\'aide tous les jours à mieux gérer mes émotions.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EmotionsCare</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/choose-mode')}>
              Se connecter
            </Button>
            <Button onClick={() => navigate('/choose-mode')}>
              Commencer gratuitement
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Votre bien-être émotionnel
              <span className="text-primary"> réinventé par l'IA</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez, analysez et améliorez vos émotions avec notre plateforme innovante. 
              Pour particuliers et entreprises.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/choose-mode')}
              className="text-lg px-8"
            >
              Essai gratuit 3 jours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/b2b/selection')}
              className="text-lg px-8"
            >
              Solutions Entreprise
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg inline-block">
            <p className="text-blue-800 font-medium">
              🎁 3 jours d'essai gratuit • Sans engagement • Accès complet
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Une approche révolutionnaire</h2>
          <p className="text-muted-foreground text-lg">
            Découvrez comment EmotionsCare transforme votre relation aux émotions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-24 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comment ça fonctionne</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Analysez</h3>
            <p className="text-muted-foreground">
              Exprimez vos émotions par texte, audio ou vidéo. Notre IA les analyse instantanément.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Comprenez</h3>
            <p className="text-muted-foreground">
              Recevez des insights personnalisés et des recommandations adaptées à votre profil.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Progressez</h3>
            <p className="text-muted-foreground">
              Suivez votre évolution et développez votre bien-être avec nos outils thérapeutiques.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container py-24 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Tarification simple et transparente</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Particuliers</CardTitle>
              <div className="text-3xl font-bold">9,99€<span className="text-lg font-normal">/mois</span></div>
              <CardDescription>Après 3 jours d'essai gratuit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  'Scan émotionnel illimité',
                  'Coach IA 24/7',
                  'Musicothérapie personnalisée',
                  'Suivi de progression',
                  'Support prioritaire'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={() => navigate('/b2c/register')}>
                Commencer l'essai gratuit
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Entreprises</CardTitle>
              <div className="text-3xl font-bold">Sur devis</div>
              <CardDescription>Solutions personnalisées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  'Toutes les fonctionnalités particuliers',
                  'Dashboard administrateur',
                  'Analytiques avancées',
                  'Gestion d\'équipes',
                  'Support dédié'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={() => navigate('/b2b/selection')}>
                Demander une démo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container py-24">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold">
            Prêt à transformer votre bien-être émotionnel ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie avec EmotionsCare.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/choose-mode')}
            className="text-lg px-8"
          >
            Commencer maintenant - 3 jours gratuits
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold">EmotionsCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 EmotionsCare. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
