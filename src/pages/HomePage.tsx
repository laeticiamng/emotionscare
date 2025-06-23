
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, Users, Brain, Music, Scan, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Scan className="h-8 w-8 text-primary" />,
      title: "Scanner Émotionnel",
      description: "Analysez votre état émotionnel en temps réel grâce à l'IA",
      href: "/scan",
      badge: "Nouveau"
    },
    {
      icon: <Music className="h-8 w-8 text-primary" />,
      title: "Musicothérapie",
      description: "Découvrez des playlists adaptées à votre humeur",
      href: "/music",
      badge: "Populaire"
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Coach IA",
      description: "Bénéficiez d'un accompagnement personnalisé 24/7",
      href: "/coach",
      badge: ""
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Social Cocon",
      description: "Connectez-vous avec une communauté bienveillante",
      href: "/social-cocon",
      badge: ""
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Journal Émotionnel",
      description: "Suivez votre progression au quotidien",
      href: "/journal",
      badge: ""
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Espace VR",
      description: "Immersion totale pour votre bien-être",
      href: "/vr",
      badge: "Bientôt"
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-purple-500/5 to-blue-500/10 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Plateforme certifiée • Plus de 15,000 professionnels
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                EmotionsCare
              </span>
              <br />
              <span className="text-foreground">
                Votre bien-être émotionnel
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              La première plateforme IA dédiée aux professionnels de santé pour 
              gérer le stress, prévenir le burnout et cultiver la résilience émotionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold" asChild>
                <Link to="/choose-mode">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                <Link to="/point20">
                  Découvrir Point 20
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Réduction du stress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">15K+</div>
                <div className="text-sm text-muted-foreground">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">24/7</div>
                <div className="text-sm text-muted-foreground">Support IA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Découvrez nos modules de bien-être
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils conçus par des experts pour votre équilibre émotionnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full font-medium">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6">
                    {feature.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary/10" 
                    asChild
                  >
                    <Link to={feature.href}>
                      Explorer
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre bien-être ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Rejoignez des milliers de professionnels qui ont déjà choisi EmotionsCare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4 text-lg" asChild>
                <Link to="/b2c/register">
                  Inscription Particulier
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
                <Link to="/b2b/selection">
                  Solution Entreprise
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              © 2025 EmotionsCare. Tous droits réservés.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Confidentialité
              </Link>
              <Link to="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">
                Accessibilité
              </Link>
              <Link to="/feedback" className="text-muted-foreground hover:text-primary transition-colors">
                Feedback
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
