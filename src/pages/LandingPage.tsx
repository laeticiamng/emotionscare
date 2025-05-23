
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Shield, TrendingUp, Heart, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Analyse Émotionnelle IA",
      description: "Analysez vos émotions en temps réel grâce à notre IA avancée utilisant texte, voix et émojis."
    },
    {
      icon: Users,
      title: "Communauté Bienveillante",
      description: "Rejoignez une communauté supportive pour partager votre parcours bien-être."
    },
    {
      icon: Shield,
      title: "Confidentialité Totale",
      description: "Vos données sont protégées avec le plus haut niveau de sécurité et de confidentialité."
    },
    {
      icon: TrendingUp,
      title: "Suivi Personnalisé",
      description: "Suivez votre progression avec des insights personnalisés et des recommandations adaptées."
    }
  ];

  const useCases = [
    {
      title: "Pour les Particuliers",
      description: "Prenez soin de votre bien-être mental avec des outils personnalisés.",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      action: () => navigate('/choose-mode')
    },
    {
      title: "Pour les Entreprises",
      description: "Améliorez le bien-être de vos équipes avec notre solution B2B.",
      icon: Zap,
      color: "bg-blue-100 text-blue-600",
      action: () => navigate('/choose-mode')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Votre bien-être mental, notre priorité
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez une plateforme révolutionnaire qui analyse vos émotions en temps réel 
            et vous accompagne vers un meilleur équilibre mental, que vous soyez un particulier ou une entreprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/choose-mode')} className="text-lg px-8 py-3">
              Commencer gratuitement
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/choose-mode')} className="text-lg px-8 py-3">
              Découvrir les fonctionnalités
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi choisir EmotionsCare ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre plateforme combine intelligence artificielle avancée et approche humaine 
            pour vous offrir une expérience unique de gestion du bien-être.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Une solution pour tous
          </h2>
          <p className="text-lg text-muted-foreground">
            Que vous soyez un individu ou une organisation, nous avons la solution adaptée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow cursor-pointer" onClick={useCase.action}>
                <CardContent className="text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${useCase.color}`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-6">{useCase.description}</p>
                  <Button className="w-full">
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-lg text-muted-foreground">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">95%</div>
              <div className="text-lg text-muted-foreground">Satisfaction client</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Entreprises partenaires</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre bien-être ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà amélioré leur qualité de vie 
            grâce à EmotionsCare. Commencez votre parcours dès aujourd'hui.
          </p>
          <Button size="lg" onClick={() => navigate('/choose-mode')} className="text-lg px-8 py-3">
            Commencer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">EmotionsCare</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 EmotionsCare. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
